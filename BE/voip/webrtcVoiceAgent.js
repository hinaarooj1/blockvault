const dgram = require('dgram');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const NetworkManager = require('./networkManager');
const AudioStreamManager = require('./audioStreamManager');
const VoiceInteraction = require('./voiceInteraction');
const ConversationManager = require('./conversationManager');
const DeepgramStreaming = require('./deepgramStreaming');
const logger = require('./logger');
// Load .env file explicitly from CRM config
require('dotenv').config({ path: path.join(__dirname, '../../config/config.env') });

/**
 * SIP/RTP Voice Agent - Uses Standard SIP/RTP Protocol (NOT WebRTC)
 * 
 * NOTE: Despite the filename "webrtcVoiceAgent", this uses:
 * - Standard SIP over UDP (not WebRTC protocol)
 * - RTP for audio transport (not WebRTC media)
 * - Standard SDP for SIP (not WebRTC SDP)
 * 
 * This is the RECOMMENDED implementation for standard SIP/RTP PBX systems.
 */
class WebRTCVoiceAgent {
    constructor() {
        this.networkManager = new NetworkManager();
        this.audioStreamManager = new AudioStreamManager({
            debugMode: true,
            saveReceivedAudio: true
        });
        this.voiceInteraction = new VoiceInteraction();
        this.conversationManager = new ConversationManager();
        this.currentSession = null;
        this.isConversationActive = false;
        this.sipConfig = null;
        this.testMode = false; // PRODUCTION MODE - OpenAI enabled
        this.testModeEndPhrase = 'ENABLE PRODUCTION MODE'; // Say this phrase to end test mode
        
        // Verify OpenAI API key is set
        if (!process.env.OPENAI_API_KEY) {
            console.warn(`\n⚠️ WARNING: OPENAI_API_KEY not found in environment variables!`);
            console.warn(`   OpenAI services will not work. Please set OPENAI_API_KEY in .env file.\n`);
        }
        
        // Check Deepgram configuration
        this.useDeepgramStreaming = process.env.USE_DEEPGRAM_STREAMING === 'true';
        if (this.useDeepgramStreaming && !process.env.DEEPGRAM_API_KEY) {
            console.warn(`\n⚠️ WARNING: DEEPGRAM_API_KEY not found but USE_DEEPGRAM_STREAMING=true!`);
            console.warn(`   Deepgram streaming disabled. Falling back to Whisper.\n`);
            this.useDeepgramStreaming = false;
        } else if (this.useDeepgramStreaming) {
            console.log(`\n✅ Deepgram streaming enabled (Nova-3)`);
        }
        
        // Display mode status
        if (this.testMode) {
            console.log(`\n${'='.repeat(60)}`);
            console.log(`🧪 TEST MODE IS ACTIVE`);
            console.log(`   💰 OpenAI API calls are DISABLED to save costs`);
            console.log(`   📝 To enable production mode, say: "${this.testModeEndPhrase}"`);
            console.log(`${'='.repeat(60)}\n`);
        } else {
            console.log(`\n${'='.repeat(60)}`);
            console.log(`✅ PRODUCTION MODE IS ACTIVE`);
            console.log(`   🤖 OpenAI API calls are ENABLED`);
            console.log(`   💰 Full AI conversation with Whisper + GPT-4 + TTS`);
            console.log(`   📡 Protocol: Standard SIP/RTP (NOT WebRTC protocol)`);
            if (process.env.OPENAI_API_KEY) {
                console.log(`   ✅ OpenAI API key is configured`);
            } else {
                console.log(`   ❌ OpenAI API key is MISSING - please set OPENAI_API_KEY`);
            }
            console.log(`${'='.repeat(60)}\n`);
        }
        
        // SIP / NAT override configuration
        this.forcePublicIP = process.env.SIP_FORCE_PUBLIC_IP || null;
        this.forceContactIP = process.env.SIP_FORCE_CONTACT_IP || null;
        this.forceRtpIP = process.env.SIP_FORCE_RTP_IP || null;
        this.forceRtpPort = process.env.SIP_FORCE_RTP_PORT ? parseInt(process.env.SIP_FORCE_RTP_PORT, 10) : null;
        this.symmetricRTP = (process.env.SIP_SYMMETRIC_RTP || 'true').toLowerCase() === 'true';
        this.keepaliveIntervalMs = Math.max(0, parseInt(process.env.SIP_KEEPALIVE_INTERVAL || '25', 10)) * 1000;
        this.keepaliveTimers = new Map();

        // Prepare SIP logs directory
        this.sipLogsDir = path.join(__dirname, '../logs/voip');
        try {
            if (!fs.existsSync(this.sipLogsDir)) {
                fs.mkdirSync(this.sipLogsDir, { recursive: true });
            }
        } catch (error) {
            console.error(`⚠️ Failed to prepare SIP logs directory: ${error.message}`);
        }

        // Prepare call summaries directory
        this.summariesDir = path.join(__dirname, '../logs/summaries');
        try {
            if (!fs.existsSync(this.summariesDir)) {
                fs.mkdirSync(this.summariesDir, { recursive: true });
            }
        } catch (error) {
            console.error(`⚠️ Failed to prepare summaries directory: ${error.message}`);
        }

        this.init();
    }

    init() {
        try {
            if (!process.env.SIP_SERVER || !process.env.SIP_USERNAME || !process.env.SIP_PASSWORD) {
                console.log('⚠️ SIP credentials not found in environment variables');
                return;
            }

            const sipServer = process.env.SIP_SERVER.replace(/^https?:\/\//, '');
            const sipIP = sipServer === 'reg.g-call.tel' ? '65.109.172.127' : sipServer;
            
            this.sipConfig = {
                server: sipIP,
                domain: sipServer,
                username: process.env.SIP_USERNAME,
                password: process.env.SIP_PASSWORD,
                port: parseInt(process.env.SIP_PORT || '5060'),
                // Direct trunk - no registration needed
                useTrunk: true
            };

            console.log('✅ SIP/RTP Voice Agent initialized (Standard SIP, NOT WebRTC protocol)');
            console.log(`   Server: ${this.sipConfig.server}:${this.sipConfig.port}`);
            console.log(`   Username: ${this.sipConfig.username}`);
            console.log(`   Protocol: SIP/RTP over UDP`);
            console.log(`   Mode: Direct Trunk (no registration)`);

        } catch (error) {
            console.error('❌ Error initializing WebRTC Voice Agent:', error);
        }
        
        // Add global error handlers
        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error.message);
            console.error('Stack:', error.stack);
            // Don't exit, just log and continue
        });
        
        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            // Don't exit, just log and continue
        });
    }

    /**
     * Normalize phone number for SIP
     */
    normalizePhoneNumber(phoneNumber) {
        let normalized = phoneNumber.replace(/[^\d+]/g, '');
        
        if (normalized.startsWith('+')) {
            return normalized;
        }
        
        if (normalized.startsWith('92') && normalized.length >= 12) {
            return '+' + normalized;
        }
        
        return normalized;
    }

    /**
     * Create SDP offer with proper codecs and public IP
     * @param {string} publicIP - Public IP address
     * @param {number} rtpPort - RTP port for audio
     * @returns {string} SDP offer
     */
    createSDPOffer(publicIP, rtpSendPort, rtpReceivePort) {
        const sessionId = Math.floor(Math.random() * 1000000000);
        const sessionVersion = sessionId;
        const username = this.sipConfig.username;

        // IMPORTANT: m=audio port is where we want to RECEIVE audio from the remote party
        // The PBX will send audio TO this port
        const sdp = `v=0\r
o=${username} ${sessionId} ${sessionVersion} IN IP4 ${publicIP}\r
s=AI Voice Call\r
c=IN IP4 ${publicIP}\r
t=0 0\r
m=audio ${rtpReceivePort} RTP/AVP 0 8 101\r
a=rtpmap:0 PCMU/8000\r
a=rtpmap:8 PCMA/8000\r
a=rtpmap:101 telephone-event/8000\r
a=fmtp:101 0-15\r
a=sendrecv\r
a=ptime:20\r
`;

        return sdp;
    }

    /**
     * Parse SDP answer to extract RTP endpoint
     * @param {string} sdpBody - SDP body from 200 OK
     * @returns {Object} {host, port, codec}
     */
    parseSDPAnswer(sdpBody) {
        console.log(`\n🔍 Parsing SDP Answer (${sdpBody.length} chars)`);
        
        const lines = sdpBody.split('\r\n');
        let host = null;
        let port = null;
        let codec = 'PCMU'; // Default

        for (const line of lines) {
            // Parse connection line: c=IN IP4 192.168.1.1
            if (line.startsWith('c=')) {
                const match = line.match(/c=IN IP4 ([0-9.]+)/);
                if (match) {
                    host = match[1];
                    console.log(`   ✅ Found host: ${host}`);
                }
            }

            // Parse media line: m=audio 12345 RTP/AVP 0 8
            if (line.startsWith('m=audio')) {
                const parts = line.split(' ');
                if (parts.length > 1) {
                    port = parseInt(parts[1]);
                    console.log(`   ✅ Found port: ${port}`);
                }
                // Check for codec preference
                if (parts.includes('8')) {
                    codec = 'PCMA'; // A-law preferred
                    console.log(`   ✅ Using PCMA codec`);
                } else if (parts.includes('0')) {
                    codec = 'PCMU'; // μ-law
                    console.log(`   ✅ Using PCMU codec`);
                }
            }
        }

        const result = { host, port, codec };
        console.log(`   🎯 Parsed result:`, result);
        return result;
    }

    /**
     * Make outbound call with two-way audio support
     * @param {string} phoneNumber - Phone number to call
     * @param {string} voice - TTS voice to use
     * @param {string} greeting - Initial greeting text
     * @returns {Promise<Object>} Session object
     */
    async makeCall(phoneNumber, voice = 'shimmer', greeting = null) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📞 INITIATING WEBCALL`);
        console.log(`${'='.repeat(60)}`);

        if (this.currentSession) {
            throw new Error('Another call is already in progress');
        }

        if (!this.sipConfig) {
            throw new Error('SIP configuration not available');
        }

        const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
        console.log(`   Phone: ${normalizedPhone}`);
        console.log(`   Voice: ${voice}`);

        let callId;
        let fromTag;
        let branch;

        try {
            callId = `call_${Date.now()}`;
            fromTag = `tag_${Math.random().toString(36).substr(2, 9)}`;
            branch = `z9hG4bK${Math.random().toString(36).substr(2, 9)}`;
            this.initializeSipLog(callId);
            this.appendSipLog(callId, `Dial request -> phone=${normalizedPhone}, voice=${voice}`);

            // Step 1: Get public IP for NAT traversal
            const detectedIP = await this.networkManager.getPublicIP();
            const signalingIP = this.forcePublicIP || detectedIP;
            const contactIP = this.forceContactIP || signalingIP;
            const rtpAdvertisedIP = this.forceRtpIP || signalingIP;
            console.log(`\n🌐 Network Info:`);
            console.log(`   Detected Public IP: ${detectedIP}`);
            if (this.forcePublicIP) {
                console.log(`   ⚙️  Forcing signaling IP: ${signalingIP}`);
            }
            if (this.forceContactIP) {
                console.log(`   ⚙️  Overriding Contact IP: ${contactIP}`);
            }
            if (this.forceRtpIP) {
                console.log(`   ⚙️  Overriding RTP IP: ${rtpAdvertisedIP}`);
            }
            this.appendSipLog(callId, `Signaling IP=${signalingIP}, Contact IP=${contactIP}, RTP IP=${rtpAdvertisedIP}`);

            // Step 2: Get available ports for SIP and RTP
            // CRITICAL FIX: Use SYMMETRIC RTP - same port for sending and receiving
            // This matches what we advertise in SDP, preventing port mismatch issues
            const sipPort = await this.networkManager.getAvailablePort();
            const rtpReceivePort = this.forceRtpPort || await this.networkManager.getAvailablePort(); // UNIQUE port for this call
            // CRITICAL: Use the SAME port for sending (symmetric RTP)
            // The PBX will send audio TO this port, and we send FROM this port
            const rtpSendPort = rtpReceivePort; // Same port for symmetric RTP

            console.log(`\n🔌 PORT ALLOCATION (Symmetric RTP - FIXED):`);
            console.log(`   SIP Signaling Port: ${sipPort} (Via header - for SIP messages)`);
            console.log(`   RTP Port: ${rtpReceivePort} (SDP m=audio - used for BOTH send and receive)`);
            console.log(`   ✅ SYMMETRIC RTP: Sending FROM and receiving ON the same port (${rtpReceivePort})`);
            console.log(`   ✅ This matches the port advertised in SDP - prevents port mismatch`);
            if (this.forceRtpPort) {
                console.log(`   ⚙️  RTP port forced via env`);
            }
            this.appendSipLog(callId, `Ports -> SIP=${sipPort}, RTP=${rtpReceivePort} (symmetric)`);

            // Step 3: Create SDP offer
            // Note: rtpSendPort and rtpReceivePort are now the same (symmetric RTP)
            const sdpOffer = this.createSDPOffer(rtpAdvertisedIP, rtpSendPort, rtpReceivePort);
            console.log(`\n📋 SDP Offer:`);
            console.log(`   🎯 We will RECEIVE audio on port: ${rtpReceivePort}`);
            console.log(`   🎯 We will SEND audio FROM port: ${rtpSendPort} (same port - symmetric RTP)`);
            console.log(sdpOffer);
            this.appendSipLog(callId, `SDP Offer:\n${sdpOffer}`);

            // Step 4: Create SIP INVITE
            const sipInvite = this.createSIPInvite(
                normalizedPhone,
                sdpOffer,
                signalingIP,
                contactIP,
                sipPort,
                callId,
                fromTag,
                branch
            );

            console.log(`\n📤 SIP INVITE DETAILS:`);
            console.log(`   To: ${this.sipConfig.server}:${this.sipConfig.port}`);
            console.log(`   Via: SIP/2.0/UDP ${signalingIP}:${sipPort};branch=${branch};rport`);
            console.log(`   Contact: <sip:${this.sipConfig.username}@${contactIP}:${sipPort}>`);
            console.log(`   SDP m=audio: ${rtpReceivePort} (RTP port - different from SIP port ${sipPort})`);
            this.appendSipLog(callId, `INVITE built with Via IP=${signalingIP}, Contact IP=${contactIP}, RTP port=${rtpReceivePort}`);

            // Step 5: Send INVITE and handle response
            const session = await this.sendSIPInvite(
                sipInvite,
                sipPort,
                callId,
                fromTag,
                branch,
                {
                    phoneNumber: normalizedPhone,
                    voice,
                    greeting,
                    publicIP: signalingIP,
                    contactIP,
                    rtpAdvertisedIP,
                    rtpSendPort,
                    rtpReceivePort,
                    sipPort
                }
            );

            this.currentSession = session;
            return session;

        } catch (error) {
            console.error(`\n❌ CALL ERROR: ${error.message}`);
            if (callId) {
                this.appendSipLog(callId, `Call error: ${error.message}`);
                this.stopSIPKeepalive(callId);
            }
            throw error;
        }
    }

    /**
     * Create SIP INVITE message
     */
    createSIPInvite(phoneNumber, sdpBody, signalingIP, contactIP, localPort, callId, fromTag, branch) {
        const contentLength = Buffer.byteLength(sdpBody, 'utf8');

        return `INVITE sip:${phoneNumber}@${this.sipConfig.domain} SIP/2.0\r
Via: SIP/2.0/UDP ${signalingIP}:${localPort};branch=${branch};rport\r
From: <sip:${this.sipConfig.username}@${this.sipConfig.domain}>;tag=${fromTag}\r
To: <sip:${phoneNumber}@${this.sipConfig.domain}>\r
Call-ID: ${callId}\r
CSeq: 1 INVITE\r
Contact: <sip:${this.sipConfig.username}@${contactIP}:${localPort}>\r
Max-Forwards: 70\r
Allow: INVITE, ACK, CANCEL, BYE, OPTIONS\r
Supported: replaces, timer\r
User-Agent: WebRTC-Voice-Agent/2.0\r
Content-Type: application/sdp\r
Content-Length: ${contentLength}\r
\r
${sdpBody}`;
    }

    /**
     * Send SIP INVITE and handle response
     */
    async sendSIPInvite(sipInvite, localPort, callId, fromTag, branch, sessionInfo) {
        return new Promise((resolve, reject) => {
            const client = dgram.createSocket('udp4');
            let toTag = '';
            let rtpEndpoint = null;
            let authAttempted = false;
            let callAnswered = false;
            let callProgressing = false; // Track if we received 183 (call is progressing)
            let callTimeout = null; // Store timeout reference so we can clear/extend it

            client.on('message', async (msg, rinfo) => {
                try {
                    const response = msg.toString();
                    console.log(`\n📥 SIP Response from ${rinfo.address}:${rinfo.port}`);
                    console.log(`📋 Raw SIP Response:`);
                    console.log(response);
                    console.log(`📋 End of SIP Response\n`);
                    this.appendSipLog(callId, `RX ${rinfo.address}:${rinfo.port}\n${response}`);
                
                if (response.includes('100 Trying')) {
                    console.log(`   ✅ 100 Trying - PBX processing call`);
                    this.appendSipLog(callId, '100 Trying received');
                } else if (response.includes('180 Ringing')) {
                    console.log(`   📞 180 Ringing - Phone is ringing`);
                    this.appendSipLog(callId, '180 Ringing received');
                } else if (response.includes('183 Session Progress')) {
                    console.log(`   📞 183 Session Progress - Early media (call is progressing)`);
                    this.appendSipLog(callId, '183 Session Progress received');
                    callProgressing = true; // Mark that call is progressing
                    
                    // Extract RTP endpoint from early media SDP
                    const sdpMatch = response.match(/Content-Length: (\d+)\r\n\r\n([\s\S]+)/);
                    if (sdpMatch) {
                        const earlySDP = sdpMatch[2];
                        rtpEndpoint = this.parseSDPAnswer(earlySDP);
                        console.log(`   🎵 Early media RTP: ${rtpEndpoint.host}:${rtpEndpoint.port}`);
                        this.appendSipLog(callId, `Early SDP host=${rtpEndpoint.host} port=${rtpEndpoint.port}`);
                    }
                    
                    // Extend timeout since call is progressing (give more time for 200 OK)
                    if (callTimeout) {
                        clearTimeout(callTimeout);
                        console.log(`   ⏰ Extended timeout - call is progressing, waiting for 200 OK...`);
                        // Reset timeout to 45 seconds from now (15 more seconds)
                        callTimeout = setTimeout(() => {
                            if (!callAnswered) {
                                console.log(`⏰ Call timeout - no 200 OK received (but 183 was received, call may still be connecting)`);
                                this.appendSipLog(callId, 'Call timeout waiting for 200 OK after 183');
                                this.stopSIPKeepalive(callId);
                                client.close();
                                reject(new Error('Call timeout - 200 OK not received'));
                            }
                        }, 45000); // 45 seconds total from INVITE
                    }
                } else if (response.includes('200 OK')) {
                    console.log(`   🎉 200 OK - Call answered!`);
                    
                    // Clear timeout since we got 200 OK
                    if (callTimeout) {
                        clearTimeout(callTimeout);
                        callTimeout = null;
                    }
                    
                    // Only process 200 OK once
                    if (callAnswered) {
                        console.log(`   ⚠️ Duplicate 200 OK received, ignoring`);
                        return;
                    }
                    callAnswered = true;
                    
                    // Extract To tag
                    const toTagMatch = response.match(/To:.*tag=([^;\r\n]+)/);
                    if (toTagMatch) {
                        toTag = toTagMatch[1];
                    }

                    // Extract final RTP endpoint from SDP - try multiple patterns
                    let finalSDP = null;
                    
                    // Pattern 1: Content-Length header
                    let sdpMatch = response.match(/Content-Length: (\d+)\r\n\r\n([\s\S]+)/);
                    if (sdpMatch) {
                        finalSDP = sdpMatch[2];
                        console.log(`\n📋 SDP found via Content-Length pattern`);
                    }
                    
                    // Pattern 2: Look for SDP after double CRLF
                    if (!finalSDP) {
                        sdpMatch = response.match(/\r\n\r\n([\s\S]+)/);
                        if (sdpMatch) {
                            const potentialSDP = sdpMatch[1];
                            // Check if it looks like SDP (starts with v=0)
                            if (potentialSDP.trim().startsWith('v=0')) {
                                finalSDP = potentialSDP;
                                console.log(`\n📋 SDP found via double CRLF pattern`);
                            }
                        }
                    }
                    
                    // Pattern 3: Look for SDP anywhere in response
                    if (!finalSDP) {
                        sdpMatch = response.match(/v=0[\s\S]+?m=audio[\s\S]+?(?=\r\n\r\n|\r\n$|$)/);
                        if (sdpMatch) {
                            finalSDP = sdpMatch[0];
                            console.log(`\n📋 SDP found via v=0 pattern`);
                        }
                    }
                    
                    if (finalSDP) {
                        console.log(`\n📋 SDP Answer from PBX (what PBX is telling us):`);
                        console.log(finalSDP);
                        rtpEndpoint = this.parseSDPAnswer(finalSDP);
                        this.appendSipLog(callId, `Answer SDP host=${rtpEndpoint?.host} port=${rtpEndpoint?.port}`);
                        
                        console.log(`\n🔌 PORT VERIFICATION (Symmetric RTP - FIXED):`);
                        console.log(`   Our SIP Via port: ${sessionInfo.sipPort} (for SIP signaling)`);
                        console.log(`   Our SDP RTP port: ${sessionInfo.rtpReceivePort} (advertised in SDP)`);
                        console.log(`   ✅ SYMMETRIC RTP: We send FROM and receive ON port ${sessionInfo.rtpReceivePort}`);
                        console.log(`   PBX RTP send port: ${rtpEndpoint?.port} (PBX will send audio to our port ${sessionInfo.rtpReceivePort})`);
                        console.log(`   PBX RTP host: ${rtpEndpoint?.host}`);
                        console.log(`   ✅ Port mismatch FIXED: Sending from same port as advertised in SDP`);
                        console.log(`   ✅ rport parameter: enabled in Via header`);
                        
                        if (!rtpEndpoint || !rtpEndpoint.host || !rtpEndpoint.port) {
                            console.error(`   ❌ Failed to parse RTP endpoint from SDP!`);
                            console.error(`   Host: ${rtpEndpoint?.host}, Port: ${rtpEndpoint?.port}`);
                            this.appendSipLog(callId, 'Failed to parse RTP endpoint from SDP');
                        }
                    } else {
                        console.error(`   ❌ No SDP found in 200 OK response!`);
                        console.log(`   🔍 Response analysis:`);
                        console.log(`   - Contains Content-Length: ${response.includes('Content-Length')}`);
                        console.log(`   - Contains v=0: ${response.includes('v=0')}`);
                        console.log(`   - Contains m=audio: ${response.includes('m=audio')}`);
                        console.log(`   - Response length: ${response.length} chars`);
                        
                        // Try to use early media RTP endpoint if available
                        if (rtpEndpoint && rtpEndpoint.host && rtpEndpoint.port) {
                            console.log(`   🔄 Using early media RTP endpoint as fallback`);
                            this.appendSipLog(callId, `Using early media endpoint fallback host=${rtpEndpoint.host} port=${rtpEndpoint.port}`);
                        } else {
                            console.error(`   ❌ No valid RTP endpoint found anywhere!`);
                            
                            // Create a fallback RTP endpoint using PBX IP
                            console.log(`   🔄 Creating fallback RTP endpoint using PBX IP`);
                            rtpEndpoint = {
                                host: this.sipConfig.server, // Use PBX IP
                                port: 10000, // Default RTP port
                                codec: 'PCMU'
                            };
                            console.log(`   🎵 Fallback RTP endpoint: ${rtpEndpoint.host}:${rtpEndpoint.port} (${rtpEndpoint.codec})`);
                            this.appendSipLog(callId, `Fallback RTP endpoint created host=${rtpEndpoint.host} port=${rtpEndpoint.port}`);
                        }
                    }

                    // Extract Contact URI (where ACK should be addressed)
                    let contactUri = null;
                    const contactMatch = response.match(/Contact:\s*(<sip:[^>]+>)/i);
                    if (contactMatch) {
                        contactUri = contactMatch[1];
                        console.log(`   📌 Using Contact URI for ACK: ${contactUri}`);
                    } else {
                        console.log('   ⚠️ No Contact header found in 200 OK, falling back to Request-URI style ACK');
                    }

                    // Extract Record-Route headers (for Route set)
                    const recordRouteMatches = response.match(/^Record-Route:\s*(.*)$/gmi) || [];
                    const routeHeaders = recordRouteMatches.map(h => h.replace(/^Record-Route:\s*/i, '').trim());
                    if (routeHeaders.length > 0) {
                        console.log(`   📌 Using ${routeHeaders.length} Route header(s) for ACK:`, routeHeaders);
                    }

                    // Send ACK
                    const ackMessage = this.createSIPACK(
                        sessionInfo.phoneNumber,
                        toTag,
                        fromTag,
                        callId,
                        branch,
                        sessionInfo.publicIP,
                        localPort,
                        contactUri,
                        routeHeaders
                    );

                    // Determine ACK destination: if Route headers exist, send to first Route header
                    // Otherwise, send to Contact URI or fallback to SIP server
                    let ackHost = this.sipConfig.server;
                    let ackPort = this.sipConfig.port;
                    
                    if (routeHeaders.length > 0) {
                        // Extract address from first Route header (will be reversed in ACK, so use last one)
                        const firstRoute = routeHeaders[routeHeaders.length - 1]; // Last in Record-Route = first in Route set
                        // Parse Route header: <sip:host;params> or sip:host;params or <sip:host:port;params>
                        // Extract hostname (before : or ;) and port (after :, before ;)
                        const routeMatch = firstRoute.match(/<sip:([^:;>]+)(?::(\d+))?/i) || firstRoute.match(/sip:([^:;>]+)(?::(\d+))?/i);
                        if (routeMatch) {
                            ackHost = routeMatch[1].trim(); // Hostname only, no parameters
                            ackPort = routeMatch[2] ? parseInt(routeMatch[2], 10) : 5060;
                            console.log(`   📍 ACK destination: ${ackHost}:${ackPort} (from Route header)`);
                        } else {
                            console.error(`   ⚠️ Failed to parse Route header: ${firstRoute}`);
                        }
                    } else if (contactUri) {
                        // Extract address from Contact URI
                        // Format: <sip:user@host:port;params> or sip:user@host:port;params
                        // Need to extract host (before : or ;) and port (after :, before ;)
                        const contactMatch = contactUri.match(/<sip:[^@]+@([^:;>]+)(?::(\d+))?/i) || contactUri.match(/sip:[^@]+@([^:;>]+)(?::(\d+))?/i);
                        if (contactMatch) {
                            ackHost = contactMatch[1].trim(); // Hostname only, no parameters
                            ackPort = contactMatch[2] ? parseInt(contactMatch[2], 10) : 5060;
                            console.log(`   📍 ACK destination: ${ackHost}:${ackPort} (from Contact URI)`);
                        } else {
                            console.error(`   ⚠️ Failed to parse Contact URI: ${contactUri}`);
                        }
                    }

                    console.log(`   📤 Sending ACK to ${ackHost}:${ackPort}...`);
                    console.log(`   📋 ACK Message:`);
                    console.log(ackMessage);
                    this.appendSipLog(callId, `Sending ACK to ${ackHost}:${ackPort}\n${ackMessage}`);
                    
                    client.send(ackMessage, ackPort, ackHost, (err) => {
                        if (err) {
                            console.error(`   ❌ ACK send error: ${err.message}`);
                            this.appendSipLog(callId, `ACK send error: ${err.message}`);
                        } else {
                            console.log(`   ✅ ACK sent - call established!`);
                            this.appendSipLog(callId, 'ACK sent to PBX');
                            
                            // Session already stored on 200 OK, just ensure RTP endpoint is updated
                            if (this.currentSession) {
                                this.currentSession.rtpEndpoint = rtpEndpoint;
                                console.log(`\n🔌 SESSION UPDATED IN ACK:`);
                                console.log(`   RTP Endpoint: ${rtpEndpoint?.host}:${rtpEndpoint?.port}`);
                            }
                            
                            // Start conversation immediately - SIP and RTP use different ports, so no conflict
                            // SIP socket stays open for receiving BYE messages, RTP uses symmetric port
                            setTimeout(async () => {
                                try {
                                    console.log(`\n🚀 Starting conversation (Symmetric RTP enabled)...`);
                                    if (this.currentSession && this.currentSession.rtpEndpoint) {
                                        console.log(`   ✅ Session ready: ${this.currentSession.id}`);
                                        console.log(`   ✅ RTP Endpoint: ${this.currentSession.rtpEndpoint.host}:${this.currentSession.rtpEndpoint.port}`);
                                        console.log(`   ✅ RTP Port: ${this.currentSession.rtpReceivePort} (symmetric - send FROM and receive ON same port)`);
                                        console.log(`   ✅ SIP Port: ${localPort} (separate from RTP port)`);
                                        await this.startConversation(this.currentSession.rtpEndpoint, this.currentSession);
                                    } else {
                                        console.error('❌ Session not ready:', {
                                            sessionExists: !!this.currentSession,
                                            rtpEndpointExists: !!(this.currentSession?.rtpEndpoint)
                                        });
                                    }
                                } catch (error) {
                                    console.error('❌ Conversation error:', error);
                                    console.error(error.stack);
                                    this.endCall();
                                }
                            }, 500); // Small delay to ensure ACK is processed
                        }
                    });

                } else if (response.includes('401') || response.includes('407')) {
                    if (!authAttempted) {
                        authAttempted = true;
                        console.log(`   🔑 Authentication required`);
                        // Handle authentication if needed
                        // For direct trunk, this might not be needed
                    }
                } else if (response.includes('487')) {
                    console.log(`   ❌ 487 Request Terminated`);
                    this.appendSipLog(callId, '487 Request Terminated received');
                    this.stopSIPKeepalive(callId);
                    client.close();
                    reject(new Error('Call terminated'));
                } else if (response.startsWith('BYE')) {
                    console.log(`   📞 BYE received from PBX`);
                    this.appendSipLog(callId, 'BYE received from PBX');
                    try {
                        // Respond with 200 OK to BYE
                        const byeMatch = response.match(/Call-ID: ([^\r\n]+)/);
                        const byeToTagMatch = response.match(/To:.*tag=([^;\r\n]+)/);
                        
                        if (byeMatch && byeToTagMatch) {
                            const byeCallId = byeMatch[1];
                            const byeToTag = byeToTagMatch[1];
                            
                            const viaMatch = response.match(/Via: ([^\r\n]+)/);
                            const fromMatch = response.match(/From: ([^\r\n]+)/);
                            const toMatch = response.match(/To: ([^\r\n]+)/);
                            const cseqMatch = response.match(/CSeq: ([^\r\n]+)/);
                            
                            const byeResponse = `SIP/2.0 200 OK\r
Via: ${viaMatch ? viaMatch[1] : ''}\r
From: ${fromMatch ? fromMatch[1] : ''}\r
To: ${toMatch ? toMatch[1] : ''}\r
Call-ID: ${byeCallId}\r
CSeq: ${cseqMatch ? cseqMatch[1] : '1 BYE'}\r
Content-Length: 0\r
\r
`;
                            
                            client.send(byeResponse, this.sipConfig.port, this.sipConfig.server, (err) => {
                                if (err) {
                                    console.error(`   ❌ BYE response error: ${err.message}`);
                                } else {
                                    console.log(`   ✅ BYE 200 OK sent`);
                                }
                            });
                            
                            // End the call
                            if (this.currentSession && this.currentSession.id === byeCallId) {
                                this.endCall();
                            }
                        }
                    } catch (byeError) {
                        console.error(`   ❌ Error handling BYE: ${byeError.message}`);
                    }
                }

                // Store session info
                // Extract Contact URI and Record-Route headers for later use in BYE
                let contactUri = null;
                const contactMatch = response.match(/Contact:\s*(<sip:[^>]+>)/i);
                if (contactMatch) {
                    contactUri = contactMatch[1];
                }
                
                const recordRouteMatches = response.match(/^Record-Route:\s*(.*)$/gmi) || [];
                const routeHeaders = recordRouteMatches.map(h => h.replace(/^Record-Route:\s*/i, '').trim());
                
                // Extract CSeq from 200 OK to track for BYE
                let lastCSeq = 1;
                const cseqMatch = response.match(/CSeq:\s*(\d+)/i);
                if (cseqMatch) {
                    lastCSeq = parseInt(cseqMatch[1], 10);
                }

                const session = {
                    id: callId,
                    phoneNumber: sessionInfo.phoneNumber,
                    status: 'connected',
                    startTime: new Date(),
                    udpClient: client,
                    toTag,
                    fromTag,
                    leadId: sessionInfo.leadId || null, // Store leadId from metadata
                    branch,
                    rtpEndpoint,
                    localPort,
                    contactUri, // Store Contact URI for BYE
                    routeHeaders, // Store Route headers for BYE
                    lastCSeq, // Store last CSeq for BYE
                    ...sessionInfo,
                    sipLogPath: path.join(this.sipLogsDir, `${callId}.log`)
                };

                // Only resolve on 200 OK
                    if (response.includes('200 OK')) {
                    // Store session immediately when we get 200 OK
                    this.currentSession = session;
                    console.log(`\n🔌 SESSION CREATED ON 200 OK:`);
                    console.log(`   Session ID: ${session.id}`);
                    console.log(`   RTP Endpoint: ${rtpEndpoint?.host}:${rtpEndpoint?.port}`);
                    console.log(`   RTP Receive Port: ${session.rtpReceivePort}`);
                    console.log(`   SIP Port: ${session.sipPort}`);
                    this.appendSipLog(callId, `Session established. Final RTP endpoint ${rtpEndpoint?.host}:${rtpEndpoint?.port}`);
                    resolve(session);
                }
                } catch (error) {
                    console.error(`❌ Error processing SIP message: ${error.message}`);
                    console.error(`   Stack: ${error.stack}`);
                    // Don't reject here, just log the error and continue
                }
            });

            client.on('error', (err) => {
                console.error(`❌ UDP Error: ${err.message}`);
                this.appendSipLog(callId, `UDP error: ${err.message}`);
                this.stopSIPKeepalive(callId);
                reject(err);
            });

            // Bind and send
            client.bind(localPort, async () => {
                console.log(`\n📤 Sending SIP INVITE...`);
                console.log(`   To: ${this.sipConfig.server}:${this.sipConfig.port}`);
                this.appendSipLog(callId, `Sending INVITE -> ${this.sipConfig.server}:${this.sipConfig.port} (local ${sessionInfo.publicIP}:${localPort})`);
                
                client.send(sipInvite, this.sipConfig.port, this.sipConfig.server, (err) => {
                    if (err) {
                        console.error(`❌ INVITE send error: ${err.message}`);
                        this.appendSipLog(callId, `INVITE send error: ${err.message}`);
                        client.close();
                        reject(err);
                    } else {
                        console.log(`✅ SIP INVITE sent successfully`);
                        this.appendSipLog(callId, 'INVITE sent successfully');
                    }
                });

                this.startSIPKeepalive(callId, client);

                // Timeout after 30 seconds (will be extended if 183 is received)
                // Check for callAnswered (200 OK) instead of rtpEndpoint, since 183 sets rtpEndpoint
                callTimeout = setTimeout(() => {
                    if (!callAnswered) {
                        if (callProgressing) {
                            console.log(`⏰ Call timeout - received 183 but no 200 OK after 30s`);
                            this.appendSipLog(callId, 'Call timeout - 183 received but no 200 OK');
                        } else {
                            console.log(`⏰ Call timeout - no answer (no 183 or 200 OK)`);
                            this.appendSipLog(callId, 'Call timeout - no response from PBX');
                        }
                        this.stopSIPKeepalive(callId);
                        client.close();
                        reject(new Error('Call timeout'));
                    }
                }, 30000);
            });
        });
    }

    /**
     * Create SIP ACK message
     * For 200 OK to INVITE, ACK must target the Contact URI and respect Record-Route/Route set.
     */
    createSIPACK(phoneNumber, toTag, fromTag, callId, branch, publicIP, localPort, contactUri = null, routeHeaders = []) {
        // Remove angle brackets from Contact URI for Request-URI (Request-URI should not have brackets)
        let requestUri = contactUri || `sip:${phoneNumber}@${this.sipConfig.domain}`;
        if (requestUri.startsWith('<') && requestUri.endsWith('>')) {
            requestUri = requestUri.slice(1, -1); // Remove < and >
        }

        // Build Route headers if any (Record-Route should be reversed for Route set)
        // RFC 3261: Route set is Record-Route in reverse order
        const routeSet = (routeHeaders || []).slice().reverse();
        const routeLines = routeSet
            .map(r => `Route: ${r}\r\n`)
            .join('');

        console.log(`   🔧 ACK Request-URI: ${requestUri}`);
        if (routeSet.length > 0) {
            console.log(`   🔧 ACK Route set (${routeSet.length} entries):`, routeSet);
        }

        return `ACK ${requestUri} SIP/2.0\r
Via: SIP/2.0/UDP ${publicIP}:${localPort};branch=${branch};rport\r
From: <sip:${this.sipConfig.username}@${this.sipConfig.domain}>;tag=${fromTag}\r
To: <sip:${phoneNumber}@${this.sipConfig.domain}>;tag=${toTag}\r
${routeLines}Call-ID: ${callId}\r
CSeq: 1 ACK\r
Max-Forwards: 70\r
User-Agent: WebRTC-Voice-Agent/2.0\r
Content-Length: 0\r
\r
`;
    }

    /**
     * Create SIP BYE message
     * BYE must follow the same routing as ACK: use Route headers if present, otherwise Contact URI.
     */
    createSIPBYE(phoneNumber, toTag, fromTag, callId, branch, publicIP, localPort, contactUri = null, routeHeaders = [], cSeq = 2) {
        // Remove angle brackets from Contact URI for Request-URI (Request-URI should not have brackets)
        let requestUri = contactUri || `sip:${phoneNumber}@${this.sipConfig.domain}`;
        if (requestUri.startsWith('<') && requestUri.endsWith('>')) {
            requestUri = requestUri.slice(1, -1); // Remove < and >
        }

        // Build Route headers if any (Record-Route should be reversed for Route set)
        // RFC 3261: Route set is Record-Route in reverse order
        const routeSet = (routeHeaders || []).slice().reverse();
        const routeLines = routeSet
            .map(r => `Route: ${r}\r\n`)
            .join('');

        console.log(`   🔧 BYE Request-URI: ${requestUri}`);
        if (routeSet.length > 0) {
            console.log(`   🔧 BYE Route set (${routeSet.length} entries):`, routeSet);
        }
        console.log(`   🔧 BYE CSeq: ${cSeq} BYE`);

        return `BYE ${requestUri} SIP/2.0\r
Via: SIP/2.0/UDP ${publicIP}:${localPort};branch=${branch};rport\r
From: <sip:${this.sipConfig.username}@${this.sipConfig.domain}>;tag=${fromTag}\r
To: <sip:${phoneNumber}@${this.sipConfig.domain}>;tag=${toTag}\r
${routeLines}Call-ID: ${callId}\r
CSeq: ${cSeq} BYE\r
Max-Forwards: 70\r
User-Agent: WebRTC-Voice-Agent/2.0\r
Content-Length: 0\r
\r
`;
    }

    /**
     * Start two-way conversation with full loop
     */
    async startConversation(rtpEndpoint, sessionInfo) {
        try {
            if (this.isConversationActive) {
                console.log('⚠️ Conversation already active');
                return;
            }
            this.appendSipLog(sessionInfo.id, 'Conversation loop started');

            // Validate RTP endpoint
            if (!rtpEndpoint || !rtpEndpoint.host || !rtpEndpoint.port) {
                console.error(`❌ Invalid RTP endpoint:`, rtpEndpoint);
                throw new Error('Invalid RTP endpoint - cannot start conversation');
            }

            this.isConversationActive = true;
            console.log(`\n${'='.repeat(60)}`);
            console.log(`🎙️ STARTING TWO-WAY CONVERSATION`);
            console.log(`${'='.repeat(60)}`);
            console.log(`🎵 RTP Endpoint: ${rtpEndpoint.host}:${rtpEndpoint.port} (${rtpEndpoint.codec})`);

            // Initialize conversation in manager
            const conversation = this.conversationManager.startConversation(sessionInfo.id, {
                voice: sessionInfo.voice,
                greeting: sessionInfo.greeting,
                maxTurns: 10,
                timeout: 60000
            });
            const greeting = sessionInfo.greeting || `Hello, this is an AI assistant. How can I help you today?`;
            
            // Send initial greeting
            await this.speakAndWait(rtpEndpoint, sessionInfo, greeting);

            // Main conversation loop
            let turnCount = 0;
            const maxTurns = 10;
            
            // Cleanup function (no longer needed since we create new stream per turn)
            const cleanupDeepgram = async () => {
                // Streams are cleaned up per turn, nothing to do here
            };
            
            while (this.isConversationActive && turnCount < maxTurns && this.currentSession) {
                turnCount++;
                logger.log(`\n${'-'.repeat(60)}`);
                logger.log(`🔄 Conversation Turn ${turnCount}/${maxTurns}`);
                logger.log(`${'-'.repeat(60)}`);

                // Step 1: Listen for user response with voice activity detection
                logger.log(`👂 Listening for user...`);
                const listeningDuration = turnCount === 1 ? 5 : 5; // Reduced from 12s - completeThought will stop early (1.5s grace)
                
                // Declare variables for this turn
                let receivedAudio = null;
                let transcript = null;
                const symmetricContext = { applied: false };
                
                // Variables for early GPT processing
                let earlyGPTResult = null;
                let earlyGPTProcessing = false;
                let currentProcessingText = null; // Track which text is being processed
                
                // Create a new Deepgram stream for this turn (each turn gets fresh connection)
                let deepgramStream = null;
                if (this.useDeepgramStreaming && process.env.DEEPGRAM_API_KEY) {
                    try {
                        deepgramStream = new DeepgramStreaming(process.env.DEEPGRAM_API_KEY);
                        
                        // Set up event listeners for debugging
                        deepgramStream.on('partialTranscript', (data) => {
                            logger.log(`🎤 Deepgram partial: "${data.text}"`);
                        });
                        deepgramStream.on('finalTranscript', (data) => {
                            logger.log(`✅ Deepgram final: "${data.text}"`);
                        });
                        // Start GPT processing early when complete thought is detected
                        // This allows GPT to process while audio is still being collected
                        // Note: currentProcessingText is declared in outer scope
                        deepgramStream.on('completeThought', async (data) => {
                            logger.log(`💬 Deepgram complete thought: "${data.text}"`);
                            
                            const thoughtText = data.text && data.text.trim();
                            if (!thoughtText || thoughtText.length === 0) {
                                return; // Skip empty thoughts
                            }
                            
                            // If we're already processing this exact text, skip
                            if (earlyGPTProcessing && currentProcessingText === thoughtText) {
                                logger.log(`⏭️ Already processing this complete thought, skipping duplicate`);
                                return;
                            }
                            
                            // If we're processing a different text, cancel and start new one
                            if (earlyGPTProcessing && currentProcessingText !== thoughtText) {
                                logger.log(`🔄 New complete thought detected, replacing previous: "${currentProcessingText}" -> "${thoughtText}"`);
                                earlyGPTResult = null; // Clear old result
                            }
                            
                            // Start GPT processing immediately (don't wait for utteranceEnd)
                            earlyGPTProcessing = true;
                            currentProcessingText = thoughtText;
                            logger.startTiming('earlyGPT');
                            logger.log(`🚀 Starting early GPT processing with complete thought: "${thoughtText}"`);
                            
                            // Process in background - don't await, let audio collection continue
                            this.processUserInput(null, sessionInfo, rtpEndpoint, thoughtText)
                                .then(result => {
                                    // Only store result if we're still processing the same text
                                    if (currentProcessingText === thoughtText) {
                                        earlyGPTResult = result;
                                        logger.log(`✅ Early GPT processing complete [${logger.endTiming('earlyGPT')}]: "${result.botResponse}"`);
                                        
                                        // Signal to stop audio collection early since GPT is ready
                                        // The audioStreamManager will handle this via completeThought timeout
                                        logger.log(`🚀 GPT ready - audio collection will stop soon (1.5s grace period)`);
                                    } else {
                                        logger.log(`⚠️ Early GPT result discarded - new thought being processed`);
                                    }
                                })
                                .catch(err => {
                                    logger.error(`❌ Early GPT processing error: ${err.message}`);
                                    if (currentProcessingText === thoughtText) {
                                        earlyGPTProcessing = false;
                                        currentProcessingText = null;
                                    }
                                });
                        });
                        deepgramStream.on('error', (error) => {
                            logger.error(`❌ Deepgram error event: ${error.message}`);
                        });
                        deepgramStream.on('closed', () => {
                            logger.log(`🔌 Deepgram closed event`);
                        });
                        
                        await deepgramStream.startStream(`${sessionInfo.id}_turn_${turnCount}`, {
                            model: 'nova-2',
                            language: 'en',
                            smart_format: true,
                            interim_results: true,
                            // utterance_end_ms removed - not a valid parameter in SDK v3
                            sample_rate: 8000,
                            channels: 1,
                            encoding: 'linear16'
                        });
                        logger.log(`✅ Deepgram stream started for this turn`);
                    } catch (error) {
                        logger.error(`❌ Failed to start Deepgram stream, falling back to Whisper: ${error.message}`);
                        deepgramStream = null;
                    }
                }
                
                try {
                    // Listen on our allocated receive port
                    logger.log(`📡 Listening on our RTP receive port: ${sessionInfo.rtpReceivePort}`);
                    
                    const audioResult = await this.audioStreamManager.receiveAudioStream(
                        sessionInfo.rtpReceivePort,
                        { 
                            sessionId: sessionInfo.id,
                            codec: rtpEndpoint.codec || 'PCMU'
                        },
                        listeningDuration,
                        0,
                        {
                            deepgramStream: deepgramStream, // Pass Deepgram stream for real-time transcription
                            onFirstPacket: (rinfo) => {
                                if (!this.symmetricRTP || symmetricContext.applied) {
                                    return;
                                }
                                symmetricContext.applied = true;
                                if (!sessionInfo.rtpEndpoint) {
                                    sessionInfo.rtpEndpoint = { host: rinfo.address, port: rinfo.port, codec: rtpEndpoint.codec || 'PCMU' };
                                } else {
                                    sessionInfo.rtpEndpoint.host = rinfo.address;
                                    sessionInfo.rtpEndpoint.port = rinfo.port;
                                }
                                rtpEndpoint.host = rinfo.address;
                                rtpEndpoint.port = rinfo.port;
                                logger.log(`🔁 Symmetric RTP applied. Using ${rinfo.address}:${rinfo.port} for outbound audio`);
                                this.appendSipLog(sessionInfo.id, `Symmetric RTP: outbound destination updated to ${rinfo.address}:${rinfo.port}`);
                            }
                        }
                    );

                    // Handle new return format: { audioBuffer, transcript }
                    if (audioResult && typeof audioResult === 'object' && audioResult.audioBuffer) {
                        receivedAudio = audioResult.audioBuffer;
                        transcript = audioResult.transcript || null;
                    } else {
                        // Fallback for old format (just Buffer)
                        receivedAudio = audioResult;
                        transcript = null;
                    }

                    if (!receivedAudio || receivedAudio.length < 100) {
                        logger.log(`⚠️ No significant audio received (${receivedAudio?.length || 0} bytes)`);
                        
                        // Try one more time or end conversation
                        if (turnCount > 2) {
                            logger.log(`🛑 Ending conversation - no user response after ${turnCount} attempts`);
                            break;
                        }
                        
                        // Send a prompt to encourage user to speak
                        const promptMsg = "I'm listening, please go ahead and speak.";
                        await this.speakAndWait(rtpEndpoint, sessionInfo, promptMsg, 5);
                        continue;
                    }

                    logger.log(`📥 Received ${receivedAudio.length} bytes from user`);
                    if (transcript && transcript.trim().length > 0) {
                        logger.log(`   ✅ Deepgram transcript: "${transcript}"`);
                    } else if (deepgramStream && deepgramStream.isConnected) {
                        // Deepgram is connected but no transcript - might still be processing
                        const currentTranscript = deepgramStream.getCurrentTranscript();
                        if (currentTranscript && currentTranscript.trim().length > 0) {
                            transcript = currentTranscript;
                            logger.log(`   ✅ Using Deepgram current transcript: "${transcript}"`);
                        } else {
                            logger.log(`   ⚠️ Deepgram connected but no transcript yet - will wait a bit longer before fallback`);
                            // Give Deepgram a bit more time (it might still be processing)
                            await new Promise(resolve => setTimeout(resolve, 500));
                            const delayedTranscript = deepgramStream.getCurrentTranscript();
                            if (delayedTranscript && delayedTranscript.trim().length > 0) {
                                transcript = delayedTranscript;
                                logger.log(`   ✅ Deepgram transcript received after delay: "${transcript}"`);
                            } else {
                                logger.log(`   ⚠️ Still no Deepgram transcript after delay, will use Whisper fallback`);
                            }
                        }
                    } else {
                        logger.log(`   ⚠️ No Deepgram transcript received, will use Whisper fallback`);
                    }
                    logger.log(`   ✅ Audio received successfully! Processing...`);
                    
                    // Cleanup Deepgram stream for this turn
                    if (deepgramStream && deepgramStream.isStreaming) {
                        try {
                            await deepgramStream.stopStream();
                        } catch (err) {
                            logger.error(`❌ Error stopping Deepgram after receiving: ${err.message}`);
                        }
                    }
                } catch (error) {
                    logger.error(`❌ Error receiving audio: ${error.message}`);
                    logger.error(`   Error details: ${error.stack}`);
                    
                    // Try one more time or end conversation
                    if (turnCount > 2) {
                        logger.log(`🛑 Ending conversation - audio reception failed`);
                        break;
                    }
                    continue;
                }

                // Step 2: Process user speech and get bot response
                logger.log(`📝 Processing received audio...`);
                try {
                    // Check if we already have early GPT result from completeThought
                    // IMPORTANT: Only use early result if it matches the final transcript
                    // This prevents using results from previous completeThought events
                    let result = null;
                    
                    // Wait a bit for early result to complete if it's still processing
                    if (earlyGPTProcessing && !earlyGPTResult) {
                        logger.log(`⏳ Early GPT processing in progress, waiting up to 500ms...`);
                        let waitCount = 0;
                        while (earlyGPTProcessing && !earlyGPTResult && waitCount < 10) {
                            await new Promise(resolve => setTimeout(resolve, 50));
                            waitCount++;
                        }
                    }
                    
                    if (earlyGPTResult && transcript) {
                        // Check if the early result matches the current transcript
                        // The early result was processed with a completeThought text
                        // We need to verify it matches the final transcript we received
                        const earlyUserText = earlyGPTResult.userText || '';
                        // More lenient matching - check if transcripts are similar (account for punctuation differences)
                        const normalizeText = (text) => text.trim().toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
                        const normalizedEarly = normalizeText(earlyUserText);
                        const normalizedTranscript = normalizeText(transcript);
                        const transcriptMatch = normalizedEarly === normalizedTranscript ||
                                               normalizedTranscript.includes(normalizedEarly) ||
                                               normalizedEarly.includes(normalizedTranscript) ||
                                               transcript.trim().toLowerCase() === earlyUserText.trim().toLowerCase();
                        
                        if (transcriptMatch) {
                            logger.log(`✅ Using early GPT result (matches transcript: "${transcript}")`);
                            result = earlyGPTResult;
                            earlyGPTResult = null; // Clear for next turn
                            earlyGPTProcessing = false; // Reset flag
                            currentProcessingText = null; // Reset tracking
                        } else {
                            logger.log(`⚠️ Early GPT result doesn't match transcript - ignoring early result`);
                            logger.log(`   Early result was for: "${earlyUserText}"`);
                            logger.log(`   Current transcript is: "${transcript}"`);
                            earlyGPTResult = null; // Clear mismatched result
                            earlyGPTProcessing = false; // Reset flag
                            currentProcessingText = null; // Reset tracking
                        }
                    } else if (earlyGPTResult && !transcript) {
                        // No transcript available, but we have early result - use it
                        logger.log(`✅ Using early GPT result (no transcript available)`);
                        result = earlyGPTResult;
                        earlyGPTResult = null;
                        earlyGPTProcessing = false;
                        currentProcessingText = null; // Reset tracking
                    } else {
                        // Validate receivedAudio only if we don't have early result
                        if (!receivedAudio) {
                            logger.error(`❌ receivedAudio is null or undefined before processing`);
                            throw new Error('receivedAudio is null or undefined');
                        }
                        
                        if (!Buffer.isBuffer(receivedAudio)) {
                            logger.error(`❌ receivedAudio is not a Buffer: ${typeof receivedAudio}`);
                            throw new Error(`receivedAudio is not a Buffer, got ${typeof receivedAudio}`);
                        }
                        
                        // Store in local constant to ensure it's always in scope
                        const audioToProcess = Buffer.from(receivedAudio); // Create a copy to ensure it's a valid Buffer
                        result = await this.processUserInput(audioToProcess, sessionInfo, rtpEndpoint, transcript);
                    }
                    
                    if (result.shouldEnd) {
                        console.log(`🛑 Conversation ending signal detected`);
                        
                        // Step 1: Speak the goodbye message (botResponse) first
                        if (result.botResponse) {
                            await this.speakAndWait(rtpEndpoint, sessionInfo, result.botResponse);
                        } else if (result.finalMessage) {
                            // Fallback to finalMessage if botResponse not available
                            await this.speakAndWait(rtpEndpoint, sessionInfo, result.finalMessage, 3);
                        }
                        
                        // Step 2: Immediately send BYE to PBX to end the call
                        logger.log(`📞 Sending BYE to PBX to end call...`);
                        this.endCall();
                        
                        // Step 3: Break out of conversation loop
                        break;
                    }

                    // Step 3: Speak bot response (for non-ending responses)
                    if (result.botResponse) {
                        await this.speakAndWait(rtpEndpoint, sessionInfo, result.botResponse);
                        // Listening will start immediately in next loop iteration (no delay)
                    }

                } catch (error) {
                    // Safely log error without referencing receivedAudio
                    const errorMessage = error && error.message ? String(error.message) : 'Unknown error';
                    console.error(`❌ Error processing user input: ${errorMessage}`);
                    
                    // Log error details if available
                    if (error && error.stack) {
                        console.error(`   Stack: ${error.stack.substring(0, 200)}`);
                    }
                    
                    // Send error recovery message
                    const errorMsg = "I'm sorry, I didn't catch that. Could you please repeat?";
                    await this.speakAndWait(rtpEndpoint, sessionInfo, errorMsg, 5);
                    
                    // Continue conversation after error
                    continue;
                }

                // No delay between turns - listening starts immediately in next iteration
            }

            console.log(`\n${'='.repeat(60)}`);
            console.log(`✅ CONVERSATION COMPLETED`);
            console.log(`   Turns: ${turnCount}`);
            console.log(`${'='.repeat(60)}\n`);

            // End conversation in manager
            const finalConversation = this.conversationManager.endConversation(sessionInfo.id);
            if (finalConversation) {
                console.log(`📊 Final Conversation Stats:`);
                console.log(`   Messages: ${finalConversation.messages.length}`);
                console.log(`   Duration: ${(finalConversation.duration / 1000).toFixed(2)}s`);
                console.log(`   Context:`, finalConversation.context);
            }

            // Cleanup Deepgram stream
            await cleanupDeepgram();

            // End call if not already ended (fallback - should already be called when shouldEnd was detected)
            // Only call if currentSession still exists (call wasn't ended earlier)
            if (this.currentSession) {
                logger.log(`📞 Ending call (fallback - shouldEnd may not have been detected)`);
                this.endCall();
            } else {
                logger.log(`✅ Call already ended (BYE already sent)`);
            }

            // Generate and save call summary AFTER call ends (non-blocking, doesn't delay call)
            // This runs asynchronously so it doesn't slow down the call ending
            this.generateAndSaveCallSummary(sessionInfo.id, finalConversation).catch(err => {
                logger.error(`⚠️ Failed to generate call summary: ${err.message}`);
            });

        } catch (error) {
            console.error(`\n❌ CONVERSATION ERROR: ${error.message}`);
            console.error(error.stack);
            this.appendSipLog(sessionInfo.id, `Conversation error: ${error.message}`);
            this.isConversationActive = false;
            
            // Cleanup Deepgram on error
            await cleanupDeepgram();
            
            this.endCall();
        }
    }

    /**
     * Speak audio and wait for completion
     */
    async speakAndWait(rtpEndpoint, sessionInfo, text, listenDuration = 0) {
        try {
            logger.startTiming('speakAndWait');
            logger.log(`💬 Bot says: "${text}"`);

            let g711Buffer, duration, usedCodec;
            
            // Debug: Log testMode status for TTS
            if (!this.testMode) {
                logger.log(`🔍 DEBUG: speakAndWait - PRODUCTION MODE (OpenAI TTS enabled)`);
            }
            
            logger.startTiming('ttsGeneration');
            if (this.testMode) {
                // TEST MODE: Use real TTS (so you can hear responses), but skip Whisper/GPT-4
                logger.log(`🧪 TEST MODE: Using real TTS so you can hear the response`);
                logger.log(`   💰 TTS cost: ~$0.01 (but Whisper/GPT-4 are skipped - saves ~$0.05 per turn)`);
                
                // Use real TTS in test mode so user can actually hear responses
                const mp3Audio = await this.voiceInteraction.textToSpeech(text, sessionInfo.voice);
                
                // Convert to G.711 (matching negotiated codec)
                const AudioCodec = require('./audioCodec');
                // Production defaults: no debug temp files to avoid flooding tmp/
                const audioCodec = new AudioCodec({ debugMode: false, saveIntermediateFiles: false });
                const preferredCodec = (rtpEndpoint && rtpEndpoint.codec) ? rtpEndpoint.codec : 'PCMU';
                logger.startTiming('audioConversion');
                const result = await audioCodec.convertMP3ToG711(mp3Audio, preferredCodec);
                logger.log(`✅ Audio converted [${logger.endTiming('audioConversion')}]`);
                g711Buffer = result.g711;
                duration = result.duration;
                usedCodec = result.codec;
                
                logger.log(`✅ Test mode audio generated: ${g711Buffer.length} bytes (${duration.toFixed(2)}s) [${logger.endTiming('ttsGeneration')}]`);
            } else {
                // PRODUCTION MODE: Use real OpenAI TTS
                logger.log(`🎵 Generating TTS (PRODUCTION MODE - OpenAI costs apply)...`);
                const mp3Audio = await this.voiceInteraction.textToSpeech(text, sessionInfo.voice);
                
                // Convert to G.711 (matching negotiated codec)
                const AudioCodec = require('./audioCodec');
                // Production defaults: no debug temp files to avoid flooding tmp/
                const audioCodec = new AudioCodec({ debugMode: false, saveIntermediateFiles: false });
                const preferredCodec = (rtpEndpoint && rtpEndpoint.codec) ? rtpEndpoint.codec : 'PCMU';
                logger.startTiming('audioConversion');
                const result = await audioCodec.convertMP3ToG711(mp3Audio, preferredCodec);
                logger.log(`✅ Audio converted [${logger.endTiming('audioConversion')}]`);
                g711Buffer = result.g711;
                duration = result.duration;
                usedCodec = result.codec;
                logger.log(`✅ TTS generated [${logger.endTiming('ttsGeneration')}]`);
            }

            // Send audio
            // CRITICAL FIX: Use the SAME port for sending that we advertised in SDP (symmetric RTP)
            // This ensures the PBX can route audio correctly - we send FROM the port we receive ON
            const rtpSendPort = sessionInfo.rtpReceivePort; // Use the port advertised in SDP
            const effectiveCodec = (usedCodec || (rtpEndpoint && rtpEndpoint.codec) || 'PCMU').toUpperCase();
            const payloadType = effectiveCodec === 'PCMA' ? 8 : 0;

            logger.log(`📤 Sending audio (${duration.toFixed(2)}s)...`);
            logger.log(`   🎯 Destination: ${rtpEndpoint.host}:${rtpEndpoint.port} (${effectiveCodec})`);
            logger.log(`   🔌 Local RTP send port: ${rtpSendPort} (SAME as receive port - symmetric RTP)`);
            logger.log(`   ✅ Using port ${rtpSendPort} that was advertised in SDP`);
            logger.log(`   🎚 Payload type: ${payloadType} (codec: ${effectiveCodec})`);
            logger.startTiming('sendAudio');
            await this.audioStreamManager.sendAudioStream(g711Buffer, rtpEndpoint, {
                sessionId: sessionInfo.id,
                ssrc: Math.floor(Math.random() * 0xFFFFFFFF),
                rtpSendPort: rtpSendPort,
                localPort: rtpSendPort, // CRITICAL: Bind to the SDP-advertised port
                codec: effectiveCodec,
                payloadType
            });

            logger.log(`✅ Audio sent successfully [${logger.endTiming('sendAudio')}]`);
            logger.log(`✅ speakAndWait complete [${logger.endTiming('speakAndWait')}]`);

            // No delay after speaking - listening will start immediately after this function returns

        } catch (error) {
            logger.error(`❌ Error speaking: ${error.message}`);
            throw error;
        }
    }

    /**
     * Process user audio input and generate bot response
     */
    async processUserInput(receivedAudio, sessionInfo, rtpEndpoint, transcript = null) {
        try {
            logger.startTiming('processUserInput');
            logger.log(`🔄 Processing user input...`);

            // If transcript is provided and no audio needed, skip audio validation
            if (transcript && transcript.trim().length > 0 && (!receivedAudio || receivedAudio === null)) {
                logger.log(`✅ Using transcript directly (no audio processing needed): "${transcript}"`);
                // Skip audio validation - we have transcript
            } else if (!receivedAudio || !Buffer.isBuffer(receivedAudio)) {
                // Only validate if we need audio (no transcript provided)
                if (!transcript || transcript.trim().length === 0) {
                    logger.error(`❌ Invalid receivedAudio: ${typeof receivedAudio}`);
                    throw new Error('receivedAudio is not defined or invalid');
                } else {
                    logger.log(`⚠️ No audio but transcript available, using transcript: "${transcript}"`);
                }
            }

            // Only convert to WAV if we don't have Deepgram transcript (skip to save time)
            // This is the optimized fallback - only prepare Whisper if Deepgram actually failed
            let wavAudio = null;
            if (!transcript || transcript.trim().length === 0) {
                // No transcript available - fallback to Whisper
                // Note: deepgramStream is not in scope here, so we can't check its status
                // If Deepgram was working, the transcript would have been passed as a parameter
                logger.log(`⚠️ No transcript available, falling back to Whisper transcription`);
                
                // No Deepgram transcript - fallback to Whisper (optimized: only convert if needed)
                const negotiatedCodec = (rtpEndpoint && rtpEndpoint.codec) ? rtpEndpoint.codec : 'PCMU';
                logger.log(`⚠️ Falling back to Whisper (codec: ${negotiatedCodec})...`);
                logger.log(`🎵 Converting to WAV for Whisper fallback...`);
                
                // Only convert if we have audio (optimization: skip if no audio received)
                if (receivedAudio && receivedAudio.length > 0) {
                    wavAudio = await this.audioStreamManager.prepareForWhisper(receivedAudio, negotiatedCodec);
                    
                    // Save WAV for debugging (keep only latest per session)
                    const fs = require('fs');
                    const path = require('path');
                    const tmpDir = path.join(__dirname, '../tmp');
                    
                    // Delete old user_speech files for this session (keep only latest)
                    try {
                        if (fs.existsSync(tmpDir)) {
                            const files = fs.readdirSync(tmpDir);
                            files.forEach(file => {
                                // Delete old user_speech files for this session
                                if (file.startsWith(`user_speech_${sessionInfo.id}_`) && file.endsWith('.wav')) {
                                    const oldFilePath = path.join(tmpDir, file);
                                    try {
                                        fs.unlinkSync(oldFilePath);
                                        console.log(`🗑️ Deleted old user speech file: ${file}`);
                                    } catch (err) {
                                        // Ignore errors during cleanup
                                    }
                                }
                            });
                        }
                    } catch (err) {
                        // Ignore cleanup errors
                    }
                    
                    const wavPath = path.join(tmpDir, `user_speech_${sessionInfo.id}.wav`);
                    fs.writeFileSync(wavPath, wavAudio);
                    console.log(`💾 Saved user speech for Whisper fallback: ${wavPath}`);
                } else {
                    logger.log(`⚠️ No audio received - cannot fallback to Whisper`);
                }
            } else {
                logger.log(`✅ Skipping WAV conversion - using Deepgram transcript`);
            }

            let userText;
            
            // Debug: Log testMode status
            console.log(`\n🔍 DEBUG: Processing user input...`);
            console.log(`   testMode: ${this.testMode} (${this.testMode ? 'TEST MODE - OpenAI DISABLED' : 'PRODUCTION MODE - OpenAI ENABLED'})`);
            
            if (this.testMode) {
                // TEST MODE: Skip Whisper transcription (saves costs)
                console.log(`🧪 TEST MODE: Skipping Whisper transcription (NO OpenAI costs)...`);
                console.log(`💰 SAVED: ~$0.006 Whisper costs + GPT-4 costs`);
                console.log(`   💡 Note: Response will use TTS (~$0.01) so you can hear it`);
                
                // In test mode, just acknowledge that we received audio
                userText = "[TEST MODE - Audio received, no transcription]";
                console.log(`\n${'='.repeat(60)}`);
                const audioSize = receivedAudio && Buffer.isBuffer(receivedAudio) ? receivedAudio.length : 0;
                console.log(`📝 TEST MODE - Audio received (${audioSize} bytes)`);
                console.log(`   To end test mode, say: "${this.testModeEndPhrase}"`);
                console.log(`${'='.repeat(60)}\n`);
                
                // Return test mode response (no OpenAI costs)
                return {
                    userText: userText,
                    botResponse: `I received your audio. Test mode is active. Your voice is working! To enable full AI responses with transcription, say "${this.testModeEndPhrase}".`,
                    shouldEnd: false
                };
            } else {
                // PRODUCTION MODE: Use Deepgram transcript if available, otherwise Whisper
                if (transcript && transcript.trim().length > 0) {
                    // Use Deepgram transcript (already transcribed, skip Whisper to save time and cost)
                    console.log(`✅ Using Deepgram transcript (skipping Whisper): "${transcript}"`);
                    userText = transcript;
                } else {
                    // Fallback to Whisper if no Deepgram transcript
                    console.log(`🎤 Transcribing with OpenAI Whisper (PRODUCTION MODE - costs apply)...`);
                    userText = await this.voiceInteraction.speechToText(wavAudio);
                }
                
                if (!userText || userText.trim().length === 0) {
                    console.log(`⚠️ No speech detected in audio`);
                    console.log(`   📝 USER SPEECH: [NO SPEECH DETECTED]`);
                    return {
                        shouldEnd: false,
                        botResponse: "I didn't hear anything. Could you please speak again?"
                    };
                }

                console.log(`\n${'='.repeat(60)}`);
                console.log(`📝 USER SPEECH DETECTED:`);
                console.log(`   "${userText}"`);
                console.log(`${'='.repeat(60)}\n`);
                
                // Check if user wants to enable test mode (or disable it)
                if (userText.toUpperCase().includes(this.testModeEndPhrase.toUpperCase())) {
                    this.testMode = false;
                    console.log(`\n🎉 PRODUCTION MODE ENABLED! OpenAI calls will now work normally.`);
                    return {
                        userText: userText,
                        botResponse: "Production mode enabled! OpenAI services are now active.",
                        shouldEnd: false
                    };
                }

                // Process through conversation manager
                // Pass transcript if available from Deepgram (skip Whisper in conversationManager too)
                // Use wavAudio only if no transcript (for fallback), otherwise pass null to skip conversion
                logger.startTiming('gptProcessing');
                const result = await this.conversationManager.processUserSpeech(
                    sessionInfo.id, 
                    transcript ? null : wavAudio, // Skip audio if we have transcript
                    transcript || userText
                );
                logger.log(`✅ GPT processing complete [${logger.endTiming('gptProcessing')}]`);
                logger.log(`🤖 Bot will respond: "${result.botResponse}"`);

                return {
                    userText: result.userText,
                    botResponse: result.botResponse,
                    botAudio: result.botAudio,
                    shouldEnd: result.shouldEnd || false,
                    conversationState: result.conversationState
                };
            }

        } catch (error) {
            // Better error logging
            const errorMsg = error.message || 'Unknown error';
            const isReferenceError = errorMsg.includes('is not defined') || error instanceof ReferenceError;
            
            console.error(`❌ Error processing user input: ${errorMsg}`);
            if (isReferenceError) {
                console.error(`   ⚠️ ReferenceError detected - variable scope issue`);
                console.error(`   📍 This usually means a variable is being accessed outside its scope`);
            }
            console.error(`   Stack trace:`, error.stack);
            
            // Return error recovery response
            return {
                shouldEnd: false,
                botResponse: "I'm having trouble understanding. Could you please repeat that?"
            };
        }
    }

    /**
     * End current call
     */
    endCall() {
        this.isConversationActive = false;

        if (!this.currentSession) {
            console.log('⚠️ No active call to end');
            return;
        }

        const endingSessionId = this.currentSession.id;
        const endingToTag = this.currentSession.toTag;
        const endingPhoneNumber = this.currentSession.phoneNumber;
        const endingFromTag = this.currentSession.fromTag;
        const endingSipPort = this.currentSession.sipPort;
        const endingBranch = this.currentSession.branch;
        const endingPublicIP = this.currentSession.publicIP || '103.134.3.216';
        const endingUdpClient = this.currentSession.udpClient;
        const endingRtpReceivePort = this.currentSession.rtpReceivePort;
        
        this.stopSIPKeepalive(endingSessionId);
        this.appendSipLog(endingSessionId, 'Call ending requested');

        console.log(`\n${'='.repeat(60)}`);
        console.log(`📞 ENDING CALL: ${endingSessionId}`);
        console.log(`${'='.repeat(60)}`);

        try {
            // Send BYE message (must follow same routing as ACK)
            if (endingUdpClient && endingToTag) {
                // Get Contact URI and Route headers from session (stored during 200 OK)
                const contactUri = this.currentSession?.contactUri || null;
                const routeHeaders = this.currentSession?.routeHeaders || [];
                const lastCSeq = this.currentSession?.lastCSeq || 1;
                const byeCSeq = lastCSeq + 1; // Increment CSeq for BYE

                // Create BYE message with proper routing
                const byeMessage = this.createSIPBYE(
                    endingPhoneNumber,
                    endingToTag,
                    endingFromTag,
                    endingSessionId,
                    endingBranch,
                    endingPublicIP,
                    endingSipPort,
                    contactUri,
                    routeHeaders,
                    byeCSeq
                );

                // Determine BYE destination: if Route headers exist, send to first Route header
                // Otherwise, send to Contact URI or fallback to SIP server
                let byeHost = this.sipConfig.server;
                let byePort = this.sipConfig.port;
                
                if (routeHeaders.length > 0) {
                    // Extract address from first Route header (will be reversed in BYE, so use last one)
                    const firstRoute = routeHeaders[routeHeaders.length - 1]; // Last in Record-Route = first in Route set
                    // Parse Route header: <sip:host;params> or sip:host;params or <sip:host:port;params>
                    // Extract hostname (before : or ;) and port (after :, before ;)
                    const routeMatch = firstRoute.match(/<sip:([^:;>]+)(?::(\d+))?/i) || firstRoute.match(/sip:([^:;>]+)(?::(\d+))?/i);
                    if (routeMatch) {
                        byeHost = routeMatch[1].trim(); // Hostname only, no parameters
                        byePort = routeMatch[2] ? parseInt(routeMatch[2], 10) : 5060;
                        console.log(`   📍 BYE destination: ${byeHost}:${byePort} (from Route header)`);
                    } else {
                        console.error(`   ⚠️ Failed to parse Route header: ${firstRoute}`);
                    }
                } else if (contactUri) {
                    // Extract address from Contact URI
                    // Format: <sip:user@host:port;params> or sip:user@host:port;params
                    // Need to extract host (before : or ;) and port (after :, before ;)
                    const contactMatch = contactUri.match(/<sip:[^@]+@([^:;>]+)(?::(\d+))?/i) || contactUri.match(/sip:[^@]+@([^:;>]+)(?::(\d+))?/i);
                    if (contactMatch) {
                        byeHost = contactMatch[1].trim(); // Hostname only, no parameters
                        byePort = contactMatch[2] ? parseInt(contactMatch[2], 10) : 5060;
                        console.log(`   📍 BYE destination: ${byeHost}:${byePort} (from Contact URI)`);
                    } else {
                        console.error(`   ⚠️ Failed to parse Contact URI: ${contactUri}`);
                    }
                } else {
                    console.log(`   📍 BYE destination: ${byeHost}:${byePort} (fallback to SIP server)`);
                }

                console.log(`   📤 Sending BYE to ${byeHost}:${byePort}...`);
                console.log(`   📋 BYE Message:`);
                console.log(byeMessage);
                this.appendSipLog(endingSessionId, `Sending BYE to ${byeHost}:${byePort}\n${byeMessage}`);

                endingUdpClient.send(byeMessage, byePort, byeHost, (err) => {
                    if (!err) {
                        console.log(`✅ BYE sent to ${byeHost}:${byePort}`);
                        this.appendSipLog(endingSessionId, `BYE sent to ${byeHost}:${byePort}`);
                    } else {
                        console.error(`   ❌ BYE send error: ${err.message}`);
                        this.appendSipLog(endingSessionId, `BYE send error: ${err.message}`);
                    }
                });
            }

            // Release ports
            if (endingSipPort) {
                this.networkManager.releasePort(endingSipPort);
            }
            // Note: rtpSendPort and rtpReceivePort are the same (symmetric RTP), so only release once
            if (endingRtpReceivePort) {
                this.networkManager.releasePort(endingRtpReceivePort);
            }

            // Close UDP client
            if (endingUdpClient) {
                try {
                    // Check if socket is still running before closing
                    if (endingUdpClient.listening) {
                        endingUdpClient.close();
                    }
                } catch (e) {
                    // Ignore socket close errors
                    console.log('Socket already closed or error closing:', e.message);
                }
            }

            // Clear session AFTER all operations complete
            this.currentSession = null;
            console.log(`✅ Call ended successfully (Session: ${endingSessionId})`);
            this.appendSipLog(endingSessionId, 'Call ended and resources released');
            console.log(`${'='.repeat(60)}\n`);

        } catch (error) {
            console.error('❌ Error ending call:', error);
            this.currentSession = null;
            this.isConversationActive = false;
        }
    }

    /**
     * Get conversation debugging info
     */
    getDebugInfo() {
        const session = this.currentSession;
        if (!session) {
            return { active: false };
        }

        const conversation = this.conversationManager.getConversation(session.id);

        return {
            active: true,
            sessionId: session.id,
            phoneNumber: session.phoneNumber,
            status: session.status,
            conversationActive: this.isConversationActive,
            rtpEndpoint: session.rtpEndpoint,
            conversation: conversation ? {
                turnCount: conversation.messages.length,
                stage: conversation.context.stage,
                context: conversation.context
            } : null
        };
    }

    /**
     * Get status
     */
    getStatus() {
        return {
            type: 'sip-rtp', // Standard SIP/RTP protocol (NOT WebRTC)
            protocol: 'SIP/RTP over UDP',
            connected: this.sipConfig ? true : false,
            hasActiveCall: this.currentSession !== null,
            currentSession: this.currentSession ? {
                id: this.currentSession.id,
                phoneNumber: this.currentSession.phoneNumber,
                status: this.currentSession.status
            } : null
        };
    }

    initializeSipLog(callId) {
        if (!callId || !this.sipLogsDir) {
            return;
        }
        try {
            fs.writeFileSync(path.join(this.sipLogsDir, `${callId}.log`), `[${new Date().toISOString()}] Session start\n`, { flag: 'w' });
        } catch (error) {
            console.error(`⚠️ Unable to initialize SIP log for ${callId}: ${error.message}`);
        }
    }

    appendSipLog(callId, message) {
        if (!callId || !this.sipLogsDir) {
            return;
        }
        const logLine = `[${new Date().toISOString()}] ${message}`;
        fs.appendFile(path.join(this.sipLogsDir, `${callId}.log`), `${logLine}\n`, () => {});
    }

    startSIPKeepalive(callId, client) {
        if (!client || this.keepaliveIntervalMs <= 0 || !callId) {
            return;
        }
        this.stopSIPKeepalive(callId);
        const timer = setInterval(() => {
            try {
                client.send('\r\n', this.sipConfig.port, this.sipConfig.server);
            } catch (error) {
                console.error(`⚠️ SIP keepalive send failed: ${error.message}`);
            }
        }, this.keepaliveIntervalMs);
        this.keepaliveTimers.set(callId, timer);
    }

    stopSIPKeepalive(callId) {
        const timer = this.keepaliveTimers.get(callId);
        if (timer) {
            clearInterval(timer);
            this.keepaliveTimers.delete(callId);
        }
    }

    /**
     * Generate and save call summary (called AFTER call ends to avoid delay)
     * @param {string} sessionId - Session ID
     * @param {Object} conversation - Conversation object
     */
    async generateAndSaveCallSummary(sessionId, conversation) {
        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
            logger.warn(`⚠️ No conversation data for summary: ${sessionId}`);
            return;
        }

        try {
            logger.log(`📝 Generating call summary for: ${sessionId}`);
            
            // Generate summary using GPT
            const summary = await this.conversationManager.generateCallSummary(sessionId);
            
            if (!summary) {
                logger.warn(`⚠️ Summary generation returned null for: ${sessionId}`);
                return;
            }

            // Prepare summary data
            const summaryData = {
                sessionId: sessionId,
                timestamp: new Date().toISOString(),
                duration: conversation.duration ? (conversation.duration / 1000).toFixed(2) + 's' : 'N/A',
                turns: conversation.messages.length,
                context: conversation.context,
                summary: summary,
                transcript: conversation.messages.map((msg, index) => {
                    if (msg.user) return `User: ${msg.user}`;
                    if (msg.bot) return `Bot: ${msg.bot}`;
                    return `Turn ${index + 1}: ${JSON.stringify(msg)}`;
                }).filter(line => line && line.trim().length > 0).join('\n')
            };

            // Save summary to file (JSON format)
            const summaryPath = path.join(this.summariesDir, `${sessionId}_summary.json`);
            fs.writeFileSync(summaryPath, JSON.stringify(summaryData, null, 2), 'utf8');
            logger.log(`✅ Call summary saved: ${summaryPath}`);

            // Also save as readable text file
            const textSummaryPath = path.join(this.summariesDir, `${sessionId}_summary.txt`);
            const textSummary = `Call Summary - ${sessionId}
Generated: ${summaryData.timestamp}
Duration: ${summaryData.duration}
Turns: ${summaryData.turns}

${'='.repeat(60)}
SUMMARY
${'='.repeat(60)}

${summary}

${'='.repeat(60)}
FULL TRANSCRIPT
${'='.repeat(60)}

${summaryData.transcript}

${'='.repeat(60)}
CONTEXT
${'='.repeat(60)}

${JSON.stringify(summaryData.context, null, 2)}
`;
            fs.writeFileSync(textSummaryPath, textSummary, 'utf8');
            logger.log(`✅ Text summary saved: ${textSummaryPath}`);

            // Send summary to CRM API if leadId is available
            const leadId = this.currentSession?.leadId || null;
            if (leadId) {
                try {
                    const axios = require('axios');
                    const crmApiUrl = process.env.CRM_API_URL || 'http://localhost:4000/api/v1';
                    const summaryUrl = `${crmApiUrl}/crm/call/summary`;
                    
                    logger.log(`📤 Sending call summary to CRM for leadId: ${leadId}`);
                    
                    await axios.post(summaryUrl, {
                        sessionId: sessionId,
                        leadId: leadId,
                        summary: summary,
                        transcript: summaryData.transcript,
                        metadata: {
                            turns: summaryData.turns,
                            duration: summaryData.duration,
                            context: summaryData.context,
                            summaryFileUrl: summaryPath
                        }
                    });
                    
                    logger.log(`✅ Call summary sent to CRM successfully`);
                } catch (crmError) {
                    logger.error(`❌ Error sending summary to CRM: ${crmError.message}`);
                    // Don't throw - CRM integration failure shouldn't affect call ending
                }
            } else {
                logger.log(`ℹ️ No leadId in session - summary not sent to CRM`);
            }

        } catch (error) {
            logger.error(`❌ Error generating/saving call summary: ${error.message}`);
            // Don't throw - this is non-critical, shouldn't affect call ending
        }
    }
}

module.exports = WebRTCVoiceAgent;

