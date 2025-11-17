const dgram = require('dgram');
const fs = require('fs');
const path = require('path');
const AudioCodec = require('./audioCodec');
const logger = require('./logger');

class AudioStreamManager {
    constructor(options = {}) {
        this.audioCodec = new AudioCodec({
            debugMode: options.debugMode || false,
            saveIntermediateFiles: options.saveIntermediateFiles || false
        });
        this.saveReceivedAudio = options.saveReceivedAudio || false;
        this.tempDir = path.join(__dirname, '../tmp');
        this.ensureTempDir();
        
        // RTP configuration
        this.sampleRate = 8000;
        this.samplesPerPacket = 160; // 20ms at 8kHz
        this.packetInterval = 20; // milliseconds
    }

    ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    /**
     * Send audio stream to PBX RTP endpoint
     * @param {Buffer} audioData - G.711 μ-law audio data
     * @param {Object} rtpEndpoint - {host, port}
     * @param {Object} sessionInfo - Session information
     * @returns {Promise<void>}
     */
    async sendAudioStream(audioData, rtpEndpoint, sessionInfo = {}) {
        return new Promise((resolve, reject) => {
            try {
                // CRITICAL FIX: Use the port specified in sessionInfo.localPort (which should be the SDP-advertised port)
                // This ensures symmetric RTP - we send FROM the same port we receive ON
                const localPort = sessionInfo.localPort || sessionInfo.rtpSendPort || 0;

                console.log(`\n🎵 Starting audio stream to ${rtpEndpoint.host}:${rtpEndpoint.port}`);
                console.log(`📊 Audio size: ${audioData.length} bytes`);
                console.log(`⏱️ Duration: ${(audioData.length / this.sampleRate).toFixed(2)}s`);
                if (localPort) {
                    console.log(`🔌 Using local RTP send port: ${localPort} (SDP-advertised port for symmetric RTP)`);
                    console.log(`   ✅ This matches the port in SDP - prevents port mismatch`);
                } else {
                    console.log(`⚠️ WARNING: No local port specified, using ephemeral port (may cause port mismatch!)`);
                }

                const udpSocket = dgram.createSocket('udp4');
                let sequenceNumber = Math.floor(Math.random() * 0xFFFF);
                let timestamp = 0; // Start from 0, increment by samples per packet
                let currentOffset = 0;
                
                const ssrc = sessionInfo.ssrc || Math.floor(Math.random() * 0xFFFFFFFF);
                // Determine payload type based on codec (0 = PCMU, 8 = PCMA)
                const codec = (sessionInfo.codec || 'PCMU').toUpperCase();
                const payloadType = sessionInfo.payloadType !== undefined
                    ? sessionInfo.payloadType
                    : (codec === 'PCMA' ? 8 : 0);

                // Save sent audio for debugging
                if (this.saveReceivedAudio && sessionInfo.sessionId) {
                    const savePath = path.join(this.tempDir, `sent_audio_${sessionInfo.sessionId}.raw`);
                    fs.writeFileSync(savePath, audioData);
                    console.log(`💾 Saved sent audio: ${savePath}`);
                }

                let packetCount = 0;
                const totalPackets = Math.ceil(audioData.length / this.samplesPerPacket);
                
                // Use setInterval for precise timing instead of setTimeout
                const interval = setInterval(() => {
                    if (currentOffset >= audioData.length) {
                        console.log(`✅ Audio streaming complete (${packetCount}/${totalPackets} packets)`);
                        clearInterval(interval);
                        udpSocket.close();
                        resolve();
                        return;
                    }

                    // Get next chunk
                    const chunkSize = Math.min(this.samplesPerPacket, audioData.length - currentOffset);
                    const audioChunk = audioData.slice(currentOffset, currentOffset + chunkSize);

                    // Create RTP packet
                    const rtpPacket = this.createRTPPacket(audioChunk, {
                        sequenceNumber,
                        timestamp,
                        ssrc,
                        payloadType,
                        marker: currentOffset + chunkSize >= audioData.length // Marker on last packet
                    });

                    // Log first 5 and last 5 packets for debugging
                    if (packetCount < 5 || packetCount >= totalPackets - 5) {
                        console.log(`📦 Packet ${packetCount + 1}/${totalPackets}: seq=${sequenceNumber}, ts=${timestamp}, size=${audioChunk.length}`);
                    }

                    // Send packet
                    udpSocket.send(rtpPacket, rtpEndpoint.port, rtpEndpoint.host, (err) => {
                        if (err) {
                            console.error(`❌ Failed to send RTP packet: ${err.message}`);
                            clearInterval(interval);
                            udpSocket.close();
                            reject(err);
                            return;
                        }
                    });

                    // Update counters
                    currentOffset += chunkSize;
                    sequenceNumber = (sequenceNumber + 1) % 0x10000;
                    // Wrap timestamp at 32 bits (use unsigned right shift to ensure unsigned 32-bit)
                    timestamp = ((timestamp + chunkSize) >>> 0) % 0x100000000;
                    packetCount++;
                }, this.packetInterval); // Exactly 20ms

                udpSocket.on('error', (err) => {
                    if (err.code === 'EADDRINUSE' && localPort) {
                        console.error(`❌ Port ${localPort} is already in use (likely by receive socket)`);
                        console.error(`   ⚠️ CRITICAL: This breaks symmetric RTP - port mismatch will occur!`);
                        console.error(`   💡 Solution: Use a single socket for both send/receive (requires refactoring)`);
                        console.error(`   🔄 Attempting to send without binding (will use ephemeral port - NOT ideal)`);
                        // Don't reject - try to continue, but this will cause port mismatch
                        // The socket will use an ephemeral port when sending
                        return; // Don't close or reject, let it try to send
                    }
                    console.error(`❌ UDP socket error: ${err.message}`);
                    clearInterval(interval);
                    try {
                        udpSocket.close();
                    } catch (closeErr) {
                        console.error(`❌ Failed to close UDP socket: ${closeErr.message}`);
                    }
                    reject(err);
                });

                // Start streaming
                // CRITICAL: For symmetric RTP, we need to bind to the SDP-advertised port
                // If the port is already in use (by the receive socket), we'll get EADDRINUSE
                // This is a limitation - we can't bind two sockets to the same port
                // The proper solution is to use a single socket for both send/receive
                udpSocket.bind(localPort, (err) => {
                    if (err) {
                        if (err.code === 'EADDRINUSE') {
                            console.error(`❌ Cannot bind to port ${localPort} - already in use`);
                            console.error(`   ⚠️ This will cause port mismatch (sending from ephemeral port)`);
                            console.error(`   💡 For symmetric RTP, the receive socket should also handle sending`);
                            // Try to send anyway (will use ephemeral port)
                            // This is not ideal but allows the call to continue
                            return;
                        }
                        console.error(`❌ Bind error: ${err.message}`);
                        clearInterval(interval);
                        udpSocket.close();
                        reject(err);
                        return;
                    }
                    const address = udpSocket.address();
                    console.log(`🔌 RTP sender bound to ${address.address}:${address.port}`);
                    console.log(`📡 Sending to ${rtpEndpoint.host}:${rtpEndpoint.port}`);
                    if (address.port === localPort) {
                        console.log(`   ✅ Successfully bound to SDP-advertised port ${localPort} (symmetric RTP)`);
                    } else {
                        console.log(`   ⚠️ Bound to different port ${address.port} instead of ${localPort}`);
                    }
                    // setInterval will start automatically, no need to call sendNextPacket
                });

            } catch (error) {
                console.error('❌ Audio streaming error:', error);
                reject(error);
            }
        });
    }

    /**
     * Receive audio stream from PBX RTP endpoint
     * @param {number} localPort - Local port to listen on
     * @param {Object} sessionInfo - Session information
     * @param {number} duration - Maximum duration to listen (seconds)
     * @param {number} retryCount - Retry attempt number
     * @param {Object} options - Options including deepgramStream for real-time transcription
     * @returns {Promise<Object>} { audioBuffer, transcript } - Audio buffer and transcript (if streaming)
     */
    async receiveAudioStream(localPort, sessionInfo = {}, duration = 10, retryCount = 0, options = {}) {
        const maxRetries = 3;
        return new Promise((resolve, reject) => {
            try {
                logger.startTiming('receiveAudioStream');
                if (retryCount > 0) {
                    logger.log(`👂 Retrying audio receiver on port ${localPort} (attempt ${retryCount + 1}/${maxRetries + 1})`);
                } else {
                    logger.log(`👂 Starting audio receiver on port ${localPort}`);
                }
                logger.log(`⏱️ Listening for ${duration} seconds (VAD enabled - will stop early on completeThought + 1.5s grace)`);

                const udpSocket = dgram.createSocket('udp4');
                const audioBuffer = [];
                let expectedSequenceNumber = null;
                let startTime = Date.now();
                const maxTime = startTime + (duration * 1000);

                let packetCount = 0;
                let lastPacketTime = Date.now();
                let firstPacketHandled = false;
                
                // Deepgram streaming setup
                const deepgramStream = options.deepgramStream || null;
                const codec = sessionInfo.codec || 'PCMU'; // PCMU or PCMA
                let transcript = '';
                let transcriptResolved = false;
                
                // Audio codec for real-time conversion (if streaming)
                let audioCodec = null;
                let deepgramUtteranceEnded = false;
                let utteranceEndHandled = false; // Prevent duplicate handling
                let stopStreamInitiated = false; // Track if we've already initiated stopping
                let deepgramAcceptingChunks = true; // Track if we should still send chunks to Deepgram
                const deepgramAudioBuffer = []; // Buffer audio until Deepgram is ready
                let deepgramReady = false; // Track if Deepgram is ready to receive audio
                let cleanupDeepgramCheck = null; // Cleanup function for Deepgram ready check interval
                if (deepgramStream) {
                    const AudioCodec = require('./audioCodec');
                    audioCodec = new AudioCodec({ debugMode: false, saveIntermediateFiles: false });
                    console.log(`🎙️ Deepgram streaming enabled - will transcribe in real-time`);
                    
                    // Wait for Deepgram to be ready before sending audio
                    const checkDeepgramReady = setInterval(() => {
                        if (deepgramStream && deepgramStream.isStreaming && !deepgramReady) {
                            deepgramReady = true;
                            console.log('✅ Deepgram is ready - sending buffered audio and streaming new packets');
                            clearInterval(checkDeepgramReady);
                            
                            // Send any buffered audio chunks
                            if (deepgramAudioBuffer.length > 0) {
                                console.log(`📤 Sending ${deepgramAudioBuffer.length} buffered audio chunks to Deepgram`);
                                deepgramAudioBuffer.forEach((pcmChunk) => {
                                    deepgramStream.sendAudioChunk(pcmChunk);
                                });
                                deepgramAudioBuffer.length = 0; // Clear buffer
                            }
                        }
                    }, 50); // Check every 50ms
                    
                    // Store cleanup function to be called from finishReceiving
                    cleanupDeepgramCheck = () => {
                        clearInterval(checkDeepgramReady);
                    };
                    
                    // Listen for Deepgram utterance end - this means user finished speaking
                    deepgramStream.on('utteranceEnd', (data) => {
                        if (utteranceEndHandled || isFinishing) {
                            return; // Already handled, ignore duplicate events
                        }
                        utteranceEndHandled = true;
                        console.log('🔇 Deepgram detected utterance end - user finished speaking');
                        deepgramUtteranceEnded = true;
                        // Get final transcript immediately
                        transcript = data.finalTranscript || deepgramStream.getCurrentTranscript() || transcript;
                        logger.log(`✅ Deepgram final transcript on utterance end: "${transcript}"`);
                        
                        // Mark that we should stop sending chunks (but continue receiving for a bit)
                        if (!stopStreamInitiated && deepgramStream && deepgramStream.isStreaming && !isFinishing) {
                            stopStreamInitiated = true;
                            deepgramAcceptingChunks = false; // Stop sending new chunks
                            logger.log(`🔇 Deepgram utterance end detected - stopping early (received ${packetCount} packets)`, 'utteranceEnd');
                            
                            // Stop Deepgram immediately and finish receiving
                            // No delays - Deepgram already detected the end, we should process immediately
                            if (deepgramStream && deepgramStream.isStreaming) {
                                logger.startTiming('stopDeepgram');
                                // Don't wait for stopStream - finish receiving immediately with current transcript
                                // The stopStream will complete in background
                                const currentTranscript = deepgramStream.getCurrentTranscript() || transcript;
                                if (currentTranscript && currentTranscript.trim().length > 0) {
                                    transcript = currentTranscript;
                                }
                                
                                // Finish receiving immediately (don't wait for stopStream)
                                if (!isFinishing) {
                                    logger.startTiming('finishReceiving');
                                    finishReceiving();
                                }
                                
                                // Stop Deepgram in background (non-blocking)
                                deepgramStream.stopStream().then(finalTranscript => {
                                    logger.log(`✅ Deepgram stopped [${logger.endTiming('stopDeepgram')}]`);
                                    // Update transcript if final is better
                                    if (finalTranscript && finalTranscript.trim().length > 0) {
                                        transcript = finalTranscript;
                                    }
                                }).catch(err => {
                                    logger.error(`❌ Error stopping Deepgram: ${err.message}`);
                                });
                            } else {
                                // Deepgram already stopped, just finish receiving
                                if (!isFinishing) {
                                    finishReceiving();
                                }
                            }
                        }
                    });
                    
                    // Listen for complete thought - ready to process
                    // This fires when Deepgram detects a natural speech completion (sentence end, pause, etc.)
                    // We'll stop audio collection after a short grace period (1-2 seconds) to allow trailing audio
                    let completeThoughtTime = null;
                    deepgramStream.on('completeThought', (data) => {
                        console.log(`💬 Deepgram complete thought detected: "${data.text}"`);
                        transcript = data.text || transcript;
                        completeThoughtTime = Date.now();
                        
                        // Stop audio collection after 1.5 seconds of grace period
                        // This allows for any trailing audio but doesn't wait the full 12 seconds
                        setTimeout(() => {
                            if (!isFinishing && !stopStreamInitiated && completeThoughtTime) {
                                logger.log(`🛑 Stopping audio collection - complete thought detected ${((Date.now() - completeThoughtTime) / 1000).toFixed(1)}s ago`);
                                stopStreamInitiated = true;
                                deepgramAcceptingChunks = false;
                                
                                // Get final transcript and finish
                                const finalTranscript = deepgramStream.getCurrentTranscript() || transcript;
                                if (finalTranscript && finalTranscript.trim().length > 0) {
                                    transcript = finalTranscript;
                                }
                                
                                if (!isFinishing) {
                                    finishReceiving();
                                }
                            }
                        }, 1500); // 1.5 second grace period after complete thought
                    });
                }
                
                // Helper function to finish receiving and resolve
                let isFinishing = false; // Prevent duplicate calls
                const finishReceiving = () => {
                    if (isFinishing) {
                        return; // Already finishing, ignore duplicate calls
                    }
                    isFinishing = true;
                    
                    // Cleanup Deepgram ready check interval if it exists
                    if (cleanupDeepgramCheck) {
                        cleanupDeepgramCheck();
                    }
                    
                    if (vadCheckInterval) clearInterval(vadCheckInterval);
                    this.finalizeReceivedAudio(audioBuffer, sessionInfo);
                    
                    logger.log(`✅ Audio receiving complete [${logger.endTiming('receiveAudioStream')}]`);
                    
                    // Only close socket if it's still open
                    try {
                        if (udpSocket && typeof udpSocket.close === 'function') {
                            udpSocket.close();
                        }
                    } catch (err) {
                        // Socket already closed, ignore
                    }
                    
                    resolve({
                        audioBuffer: Buffer.concat(audioBuffer),
                        transcript: transcript || ''
                    });
                };
                
                // Voice Activity Detection (VAD) parameters - Trend-based detection
                const SILENCE_DURATION_MS = 600; // Stop after 0.6 seconds of low energy (faster response)
                const ENERGY_DROP_THRESHOLD = 0.4; // Stop if energy drops to 40% of peak
                const MIN_PACKETS_FOR_VOICE = 5; // Need at least 5 packets before detecting end
                
                // VAD state tracking
                let energyHistory = []; // Sliding window of recent energy values
                const ENERGY_WINDOW_SIZE = 10; // Track last 10 packets
                let peakEnergy = 0; // Highest energy seen so far
                let lastVoiceTime = null;
                let silenceStartTime = null;
                let vadCheckInterval = null;

                // Helper function to calculate audio energy (variance-based for μ-law)
                // Silence in μ-law is typically 0xFF or 0x7F (constant), speech has variation
                const calculateEnergy = (payload) => {
                    if (!payload || payload.length === 0) return 0;
                    // Calculate variance - silence has low variance, speech has high variance
                    let sum = 0;
                    let sumSq = 0;
                    for (let i = 0; i < payload.length; i++) {
                        const sample = payload[i];
                        sum += sample;
                        sumSq += sample * sample;
                    }
                    const mean = sum / payload.length;
                    const variance = (sumSq / payload.length) - (mean * mean);
                    return Math.sqrt(variance); // Standard deviation as energy measure
                };
                
                // Check if we should stop based on energy trend
                const shouldStopEarly = (currentEnergy, now) => {
                    // Add current energy to history
                    energyHistory.push({ energy: currentEnergy, time: now });
                    if (energyHistory.length > ENERGY_WINDOW_SIZE) {
                        energyHistory.shift(); // Remove oldest
                    }
                    
                    // Update peak energy
                    if (currentEnergy > peakEnergy) {
                        peakEnergy = currentEnergy;
                        lastVoiceTime = now;
                        silenceStartTime = null;
                        return false; // Still speaking
                    }
                    
                    // Need minimum packets before we can detect end
                    if (packetCount < MIN_PACKETS_FOR_VOICE) {
                        return false;
                    }
                    
                    // If we never had significant voice, don't stop early
                    if (peakEnergy < 20) {
                        return false; // Too quiet, might be noise
                    }
                    
                    // Check if energy has dropped significantly from peak
                    const energyRatio = currentEnergy / peakEnergy;
                    const isLowEnergy = energyRatio < ENERGY_DROP_THRESHOLD;
                    
                    // Check if energy has been consistently low in recent window
                    const recentEnergies = energyHistory.slice(-5).map(e => e.energy);
                    if (recentEnergies.length < 3) {
                        return false; // Not enough history yet
                    }
                    const avgRecentEnergy = recentEnergies.reduce((a, b) => a + b, 0) / recentEnergies.length;
                    const recentEnergyRatio = avgRecentEnergy / peakEnergy;
                    const isConsistentlyLow = recentEnergyRatio < ENERGY_DROP_THRESHOLD;
                    
                    if (isLowEnergy && isConsistentlyLow) {
                        // Energy dropped significantly - likely end of speech
                        if (silenceStartTime === null) {
                            silenceStartTime = now;
                            return false; // Just started silence, wait a bit
                        } else if (now - silenceStartTime >= SILENCE_DURATION_MS) {
                            // Silence for long enough - stop early
                            return true;
                        }
                    } else {
                        // Energy is still high or recovering - reset silence timer
                        silenceStartTime = null;
                    }
                    
                    return false;
                };

                udpSocket.on('message', (msg, rinfo) => {
                    try {
                        packetCount++;
                        lastPacketTime = Date.now();
                        
                        // Reduced logging - only first 5, then every 50 packets
                        if (packetCount <= 5 || packetCount % 50 === 0) {
                            console.log(`📥 Received packet ${packetCount} from ${rinfo.address}:${rinfo.port} (${msg.length} bytes)`);
                        }
                        
                        // Parse RTP packet
                        const rtpData = this.parseRTPPacket(msg);
                        
                        if (!rtpData) {
                            if (packetCount <= 5) {
                            console.log(`⚠️ Invalid RTP packet ${packetCount}`);
                            }
                            return; // Invalid packet
                        }

                        // Check sequence number for continuity
                        if (expectedSequenceNumber !== null) {
                            const gap = (rtpData.sequenceNumber - expectedSequenceNumber + 0x10000) % 0x10000;
                            if (gap > 1 && gap < 0x8000) {
                                console.log(`⚠️ Sequence gap detected: ${gap} packets missing (seq: ${expectedSequenceNumber} -> ${rtpData.sequenceNumber})`);
                            }
                        }
                        expectedSequenceNumber = (rtpData.sequenceNumber + 1) % 0x10000;

                        if (!firstPacketHandled) {
                            firstPacketHandled = true;
                            if (typeof options.onFirstPacket === 'function') {
                                try {
                                    options.onFirstPacket(rinfo);
                                } catch (callbackError) {
                                    console.error('❌ onFirstPacket callback error:', callbackError);
                                }
                            }
                        }

                        if (typeof options.onPacket === 'function') {
                            try {
                                options.onPacket(rinfo, rtpData);
                            } catch (callbackError) {
                                console.error('❌ onPacket callback error:', callbackError);
                            }
                        }

                        // Append audio payload to buffer first (we'll use it for VAD and processing)
                        audioBuffer.push(rtpData.payload);

                        // Stream to Deepgram in real-time if enabled (only if still accepting chunks and streaming)
                        if (deepgramStream && deepgramStream.isConnected && deepgramStream.isStreaming && audioCodec && deepgramAcceptingChunks && !stopStreamInitiated) {
                            try {
                                // Convert G.711 chunk to Linear PCM
                                let pcmChunk;
                                if (codec === 'PCMA') {
                                    pcmChunk = audioCodec.alawToPCMChunk(rtpData.payload);
                                } else {
                                    pcmChunk = audioCodec.mulawToPCMChunk(rtpData.payload);
                                }
                                
                                // Buffer audio if Deepgram isn't ready yet, otherwise send immediately
                                if (!deepgramReady) {
                                    // Buffer the chunk until Deepgram is ready
                                    deepgramAudioBuffer.push(pcmChunk);
                                    if (packetCount === 0) {
                                        console.log(`📦 Buffering audio until Deepgram is ready (${pcmChunk.length} bytes PCM per chunk)`);
                                    }
                                } else {
                                    // Send to Deepgram immediately
                                    const sent = deepgramStream.sendAudioChunk(pcmChunk);
                                    // Only log errors and first packet to avoid log spam
                                    if (!sent && packetCount <= 10) {
                                        console.log(`⚠️ Failed to send audio chunk ${packetCount} to Deepgram (connected: ${deepgramStream.isConnected}, streaming: ${deepgramStream.isStreaming})`);
                                    } else if (sent && packetCount === 0) {
                                        console.log(`✅ Streaming audio to Deepgram (${pcmChunk.length} bytes PCM per chunk)`);
                                    }
                                }
                            } catch (error) {
                                // Log errors for debugging
                                if (deepgramAcceptingChunks && !stopStreamInitiated && packetCount <= 10) {
                                    console.error(`❌ Error streaming to Deepgram (packet ${packetCount}):`, error.message);
                                }
                            }
                        } else if (deepgramStream && packetCount <= 5) {
                            // Debug why we're not sending
                            const reasons = [];
                            if (!deepgramStream.isConnected) reasons.push('not connected');
                            if (!audioCodec) reasons.push('no audioCodec');
                            if (!deepgramAcceptingChunks) reasons.push('not accepting chunks');
                            if (stopStreamInitiated) reasons.push('stop initiated');
                            if (reasons.length > 0) {
                                console.log(`⚠️ Not sending to Deepgram (packet ${packetCount}): ${reasons.join(', ')}`);
                            }
                        }

                        // Voice Activity Detection: Calculate energy of this packet
                        const energy = calculateEnergy(rtpData.payload);
                        const now = Date.now();
                        
                        // Debug logging for first few packets and when energy drops
                        if (packetCount <= 10 || packetCount % 50 === 0) {
                            const energyRatio = peakEnergy > 0 ? (energy / peakEnergy * 100).toFixed(1) : 'N/A';
                            console.log(`🔊 VAD: packet ${packetCount}, energy=${energy.toFixed(2)}, peak=${peakEnergy.toFixed(2)}, ratio=${energyRatio}%`);
                        }
                        
                        // Check if Deepgram detected utterance end (user finished speaking)
                        // Note: stopStream is now initiated in the utteranceEnd event handler to prevent duplicates
                        if (deepgramUtteranceEnded && !isFinishing && stopStreamInitiated) {
                            // Already initiated stopping, just return to stop processing more packets
                            return;
                        }
                        
                        // Check if we should stop early based on energy trend
                        if (shouldStopEarly(energy, now)) {
                            const energyRatio = peakEnergy > 0 ? (energy / peakEnergy * 100).toFixed(1) : 'N/A';
                            console.log(`🔇 Energy dropped to ${energyRatio}% of peak (${energy.toFixed(2)}/${peakEnergy.toFixed(2)}) - stopping early after ${SILENCE_DURATION_MS}ms silence (received ${packetCount} packets)`);
                            
                            // Stop Deepgram stream and get final transcript
                            if (deepgramStream && deepgramStream.isStreaming && !isFinishing) {
                                console.log('🛑 Stopping Deepgram stream...');
                                deepgramStream.stopStream().then(finalTranscript => {
                                    transcript = finalTranscript || deepgramStream.getCurrentTranscript();
                                    transcriptResolved = true;
                                    console.log(`✅ Deepgram final transcript: "${transcript}"`);
                                }).catch(err => {
                                    console.error('❌ Error stopping Deepgram:', err);
                                    transcript = deepgramStream.getCurrentTranscript();
                                    transcriptResolved = true;
                                });
                                
                                // Wait a bit for transcript
                                setTimeout(() => {
                                    if (!transcriptResolved) {
                                        transcript = deepgramStream.getCurrentTranscript();
                                        transcriptResolved = true;
                                    }
                                    finishReceiving();
                                }, 300);
                            } else {
                                finishReceiving();
                            }
                            
                            return;
                        }

                        // Check if we should stop (timeout or marker bit) - but VAD takes priority
                        if ((rtpData.marker || Date.now() > maxTime) && !isFinishing) {
                            if (rtpData.marker) {
                                console.log(`✅ Received end-of-stream marker (received ${packetCount} packets)`);
                            }
                            if (Date.now() > maxTime) {
                                console.log(`⏰ Receiving timeout reached`);
                            }
                            
                            // Stop Deepgram stream and get final transcript
                            if (deepgramStream && deepgramStream.isStreaming && !isFinishing) {
                                console.log('🛑 Stopping Deepgram stream (timeout/marker)...');
                                deepgramStream.stopStream().then(finalTranscript => {
                                    transcript = finalTranscript || deepgramStream.getCurrentTranscript();
                                    finishReceiving();
                                }).catch(err => {
                                    console.error('❌ Error stopping Deepgram:', err);
                                    transcript = deepgramStream.getCurrentTranscript();
                                    finishReceiving();
                                });
                            } else {
                                finishReceiving();
                            }
                        }

                    } catch (error) {
                        console.error('❌ Error processing RTP packet:', error);
                    }
                });

                udpSocket.on('error', (err) => {
                    if (vadCheckInterval) clearInterval(vadCheckInterval);
                    if (err.code === 'EADDRINUSE') {
                        console.error(`❌ UDP receiver error: Port ${localPort} is still in use`);
                        console.error(`   ⏳ This usually means the SIP socket hasn't fully released the port yet`);
                        
                        // Close the failed socket
                        try {
                            udpSocket.close();
                        } catch (e) {
                            // Ignore close errors
                        }
                        
                        // Retry if we haven't exceeded max retries
                        if (retryCount < maxRetries) {
                            console.error(`   🔄 Retrying in 1 second... (${retryCount + 1}/${maxRetries})`);
                            setTimeout(() => {
                                this.receiveAudioStream(localPort, sessionInfo, duration, retryCount + 1, options).then(resolve).catch(reject);
                            }, 1000);
                            return;
                        } else {
                            console.error(`   ❌ Max retries (${maxRetries}) exceeded. Port ${localPort} is still in use.`);
                            reject(new Error(`Port ${localPort} is still in use after ${maxRetries} retries`));
                            return;
                        }
                        }
                    console.error(`❌ UDP receiver error: ${err.message}`);
                    reject(err);
                });

                udpSocket.bind(localPort, () => {
                    const address = udpSocket.address();
                    logger.log(`🔌 RTP receiver listening on ${address.address}:${address.port}`);
                    logger.log(`📡 Waiting for RTP packets from PBX...`);
                    logger.log(`📥 Ready to receive audio packets...`);
                    logger.log(`🌐 Listening on ALL interfaces (0.0.0.0) to receive from any source`);
                    logger.log(`⏰ Will timeout after ${duration} seconds if no packets received`);
                    logger.log(`🔇 VAD: Trend-based detection - stops when energy drops to 40% of peak for ${SILENCE_DURATION_MS}ms (reduces response delay)`);
                    logger.log(`🔍 DEBUG: If you see NO '📥 Received packet' messages, the PBX cannot reach this port`);

                    // Helper function to finish on timeout
                    let timeoutHandled = false; // Prevent duplicate timeout handling
                    const finishTimeout = async () => {
                        if (timeoutHandled || isFinishing) {
                            return; // Already handled
                        }
                        timeoutHandled = true;
                        
                        if (vadCheckInterval) clearInterval(vadCheckInterval);
                        
                        // Stop Deepgram stream
                        if (deepgramStream && deepgramStream.isStreaming && !isFinishing) {
                            try {
                                console.log('🛑 Stopping Deepgram stream (timeout)...');
                                const finalTranscript = await deepgramStream.stopStream();
                                transcript = finalTranscript || deepgramStream.getCurrentTranscript() || transcript;
                                console.log(`✅ Deepgram final transcript: "${transcript}"`);
                            } catch (err) {
                                console.error('❌ Error stopping Deepgram:', err);
                                transcript = deepgramStream.getCurrentTranscript() || transcript;
                            }
                        }
                        
                        if (audioBuffer.length > 0) {
                            console.log(`⏰ Stopping receiver after ${duration}s (timeout)`);
                            this.finalizeReceivedAudio(audioBuffer, sessionInfo);
                            
                            // Only close socket if it's still open
                            try {
                                if (udpSocket && typeof udpSocket.close === 'function') {
                            udpSocket.close();
                                }
                            } catch (err) {
                                // Socket already closed, ignore
                            }
                            
                            resolve({
                                audioBuffer: Buffer.concat(audioBuffer),
                                transcript: transcript || ''
                            });
                        } else {
                            console.log(`⚠️ No audio received after ${duration}s`);
                            
                            // Only close socket if it's still open
                            try {
                                if (udpSocket && typeof udpSocket.close === 'function') {
                            udpSocket.close();
                                }
                            } catch (err) {
                                // Socket already closed, ignore
                            }
                            
                            resolve({
                                audioBuffer: Buffer.alloc(0),
                                transcript: transcript || ''
                            });
                        }
                    };
                    
                    // Set timeout to stop receiving (fallback if VAD doesn't trigger)
                    setTimeout(() => {
                        finishTimeout();
                    }, duration * 1000);
                });

            } catch (error) {
                console.error('❌ Audio receiving error:', error);
                reject(error);
            }
        });
    }

    /**
     * Create RTP packet
     * @param {Buffer} payload - Audio payload (G.711)
     * @param {Object} options - RTP header options
     * @returns {Buffer} RTP packet
     */
    createRTPPacket(payload, options = {}) {
        const header = Buffer.alloc(12);
        
        // Validate and clamp values using unsigned 32-bit operations
        const safeSequence = ((options.sequenceNumber || 0) >>> 0) & 0xFFFF;
        // Use unsigned right shift to ensure timestamp is always unsigned 32-bit
        const safeTimestamp = ((options.timestamp || 0) >>> 0) % 0x100000000;
        const safeSSRC = ((options.ssrc || 0) >>> 0);
        
        // Debug only if values are out of range before fixing
        if (options.timestamp !== undefined && (options.timestamp < 0 || options.timestamp >= 0x100000000)) {
            console.log(`🔍 RTP Debug - Timestamp wrapped: ${options.timestamp} -> ${safeTimestamp}`);
        }
        
        // Version (2), Padding (0), Extension (0), CSRC Count (0)
        header[0] = 0x80;
        
        // Marker (1 bit), Payload Type (7 bits)
        header[1] = (options.marker ? 0x80 : 0x00) | ((options.payloadType || 0) & 0x7F);
        
        // Sequence Number (16 bits)
        header.writeUInt16BE(safeSequence, 2);
        
        // Timestamp (32 bits) - safeTimestamp is guaranteed to be in valid range
        header.writeUInt32BE(safeTimestamp, 4);
        
        // SSRC (32 bits)
        header.writeUInt32BE(safeSSRC, 8);
        
        return Buffer.concat([header, payload]);
    }

    /**
     * Parse RTP packet
     * @param {Buffer} packet - RTP packet
     * @returns {Object|null} Parsed RTP data
     */
    parseRTPPacket(packet) {
        if (packet.length < 12) {
            return null; // Invalid packet
        }

        const version = (packet[0] >> 6) & 0x03;
        if (version !== 2) {
            return null; // Not RTP version 2
        }

        const marker = (packet[1] >> 7) & 0x01;
        const payloadType = packet[1] & 0x7F;
        const sequenceNumber = packet.readUInt16BE(2);
        const timestamp = packet.readUInt32BE(4);
        const ssrc = packet.readUInt32BE(8);

        // Extract payload (skip header)
        const payload = packet.slice(12);

        return {
            version,
            marker: marker === 1,
            payloadType,
            sequenceNumber,
            timestamp,
            ssrc,
            payload
        };
    }

    /**
     * Finalize received audio
     * @param {Array<Buffer>} audioBuffer - Array of audio chunks
     * @param {Object} sessionInfo - Session information
     */
    async finalizeReceivedAudio(audioBuffer, sessionInfo) {
        if (audioBuffer.length === 0) {
            console.log(`⚠️ No audio received`);
            return;
        }

        const combinedAudio = Buffer.concat(audioBuffer);
        console.log(`📊 Received ${combinedAudio.length} bytes of audio`);

        // Save received audio for debugging (keep only latest per session)
        if (this.saveReceivedAudio && sessionInfo.sessionId) {
            const savePath = path.join(this.tempDir, `received_audio_${sessionInfo.sessionId}.raw`);
            
            // Delete old files for this session (keep only latest)
            try {
                const files = fs.readdirSync(this.tempDir);
                files.forEach(file => {
                    // Delete old received_audio files for this session
                    if (file.startsWith(`received_audio_${sessionInfo.sessionId}`) && file !== `received_audio_${sessionInfo.sessionId}.raw`) {
                        const oldFilePath = path.join(this.tempDir, file);
                        try {
                            fs.unlinkSync(oldFilePath);
                            console.log(`🗑️ Deleted old audio file: ${file}`);
                        } catch (err) {
                            console.error(`Failed to delete old file ${file}:`, err);
                        }
                    }
                });
            } catch (err) {
                console.error('Error cleaning up old audio files:', err);
            }
            
            fs.writeFileSync(savePath, combinedAudio);
            console.log(`💾 Saved received audio: ${savePath}`);
        }
    }

    /**
     * Convert received G.711 audio to format suitable for OpenAI Whisper
     * @param {Buffer} g711Audio - G.711 audio (μ-law or a-law)
     * @param {string} codec - 'PCMU' (μ-law) or 'PCMA' (a-law)
     * @returns {Promise<Buffer>} WAV audio for Whisper
     */
    async prepareForWhisper(g711Audio, codec = 'PCMU') {
        try {
            let pcm;

            // Decode according to negotiated codec
            if ((codec || '').toUpperCase() === 'PCMA') {
                console.log('🎧 Preparing audio for Whisper using G.711 a-law decoder (PCMA)');
                pcm = await this.audioCodec.alawToPCM(g711Audio);
            } else {
                console.log('🎧 Preparing audio for Whisper using G.711 μ-law decoder (PCMU)');
                pcm = await this.audioCodec.mulawToPCM(g711Audio);
            }
            
            // Convert PCM to WAV (16kHz for Whisper)
            const wav = await this.audioCodec.pcmToWAV(pcm);
            
            return wav;
        } catch (error) {
            console.error('Error preparing audio for Whisper:', error);
            throw error;
        }
    }
}

module.exports = AudioStreamManager;

