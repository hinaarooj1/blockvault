const { createClient } = require('@deepgram/sdk');
const EventEmitter = require('events');

/**
 * Deepgram Nova-3 Streaming Transcription Service
 * Handles real-time audio streaming and transcription via WebSocket
 */
class DeepgramStreaming extends EventEmitter {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
        this.deepgram = createClient(apiKey);
        this.connection = null;
        this.isConnected = false;
        this.isStreaming = false;
        this.sessionId = null;
        
        // Transcript tracking
        this.partialTranscript = '';
        this.finalTranscript = '';
        this.transcriptHistory = [];
        
        // Speech completion detection
        this.lastFinalTime = null;
        this.silenceStartTime = null;
        this.hasReceivedSpeech = false;
        
        // Track packet count for debugging
        this.packetCount = 0;
    }

    /**
     * Start streaming session
     * @param {string} sessionId - Session identifier
     * @param {Object} options - Configuration options
     * @returns {Promise<void>}
     */
    async startStream(sessionId, options = {}) {
        if (this.isStreaming) {
            console.log('⚠️ Deepgram stream already active, stopping previous stream');
            await this.stopStream();
        }

        this.sessionId = sessionId;
        this.partialTranscript = '';
        this.finalTranscript = '';
        this.transcriptHistory = [];
        this.hasReceivedSpeech = false;
        this.lastFinalTime = null;
        this.silenceStartTime = null;
        this.packetCount = 0; // Reset packet counter

        try {
            console.log(`🎙️ Starting Deepgram streaming for session: ${sessionId}`);
            
            // Configure Deepgram connection options
            // Using only validated parameters to avoid 400 errors
            // utterance_end_ms is NOT a valid parameter in Deepgram SDK v3
            const connectionOptions = {
                model: options.model || 'nova-2',
                language: options.language || 'en',
                smart_format: true,
                interim_results: true,
                encoding: 'linear16',
                sample_rate: 8000,
                channels: 1
            };
            
            // Only merge options that don't include invalid parameters
            // Explicitly exclude utterance_end_ms, endpointing, vad_events
            const validOptions = { ...options };
            delete validOptions.utterance_end_ms;
            delete validOptions.endpointing;
            delete validOptions.vad_events;
            
            Object.assign(connectionOptions, validOptions);

            // Create live transcription connection
            this.connection = this.deepgram.listen.live(connectionOptions);
            this.audioStream = null; // Will be set when connection opens

            // Handle connection events
            this.connection.on('open', () => {
                console.log('✅ Deepgram WebSocket connected');
                this.isConnected = true;
                // Don't set isStreaming to true yet - wait for the ready signal
                
                // Try to get the audio stream for sending chunks
                try {
                    // Deepgram SDK v3: The connection object has a `conn` property which is the WebSocket
                    // Also check for `sendBuffer` method which might be the correct way to send audio
                    if (typeof this.connection.sendBuffer === 'function') {
                        // sendBuffer might be the method to send audio chunks
                        this.audioStream = this.connection; // Use connection itself with sendBuffer
                        console.log('✅ Deepgram audio stream will use sendBuffer() method');
                    } else if (this.connection.conn) {
                        // The `conn` property is the underlying WebSocket connection
                        this.audioStream = this.connection.conn;
                        console.log('✅ Deepgram audio stream obtained via connection.conn (WebSocket)');
                    } else if (typeof this.connection.getStream === 'function') {
                        this.audioStream = this.connection.getStream();
                        console.log('✅ Deepgram audio stream obtained via getStream()');
                    } else if (typeof this.connection.getRawAudio === 'function') {
                        this.audioStream = this.connection.getRawAudio();
                        console.log('✅ Deepgram audio stream obtained via getRawAudio()');
                    } else if (this.connection.stream) {
                        this.audioStream = this.connection.stream;
                        console.log('✅ Deepgram audio stream found in connection.stream');
                    } else {
                        console.log('⚠️ Deepgram connection opened but no audio stream method found');
                        console.log(`   Available methods: ${Object.getOwnPropertyNames(this.connection).join(', ')}`);
                        // Try using the connection object itself - it might be a stream
                        if (typeof this.connection.write === 'function') {
                            this.audioStream = this.connection;
                            console.log('✅ Using connection object directly as stream (has write method)');
                        }
                    }
                } catch (error) {
                    console.error('❌ Error getting Deepgram audio stream:', error);
                }
                
                this.emit('connected');
            });

            this.connection.on('error', (error) => {
                console.error('❌ Deepgram connection error:', error);
                this.isConnected = false;
                this.isStreaming = false;
                this.emit('error', error);
            });

            this.connection.on('close', () => {
                console.log('🔌 Deepgram WebSocket closed');
                this.isConnected = false;
                this.isStreaming = false;
                this.emit('closed');
            });

            // Handle transcription results
            this.connection.on('Results', (data) => {
                console.log('📥 Deepgram Results event received');
                this.handleTranscript(data);
            });
            
            // Also listen for 'transcript' event (some SDK versions use this)
            this.connection.on('transcript', (data) => {
                console.log('📥 Deepgram transcript event received');
                this.handleTranscript(data);
            });

            // Handle metadata
            this.connection.on('Metadata', (data) => {
                if (this.debugMode) {
                    console.log('📊 Deepgram metadata:', JSON.stringify(data, null, 2));
                }
            });

            // Handle utterance end (speech completion)
            this.connection.on('UtteranceEnd', () => {
                console.log('🔇 Deepgram detected utterance end');
                console.log(`   Final transcript: "${this.finalTranscript}"`);
                console.log(`   Partial transcript: "${this.partialTranscript}"`);
                this.emit('utteranceEnd', {
                    finalTranscript: this.finalTranscript,
                    partialTranscript: this.partialTranscript
                });
                
                // If we have a final transcript, emit complete thought
                if (this.finalTranscript && this.isCompleteThought(this.finalTranscript)) {
                    this.emit('completeThought', {
                        text: this.finalTranscript,
                        confidence: 1.0
                    });
                }
            });

            // Wait for connection to open AND be ready to receive audio
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Deepgram connection timeout'));
                }, 5000);

                const onOpen = () => {
                    clearTimeout(timeout);
                    // Give Deepgram a small moment to fully initialize before accepting audio
                    setTimeout(() => {
                        this.isStreaming = true; // Now mark as ready to stream
                        console.log('✅ Deepgram connection ready to receive audio');
                        resolve();
                    }, 150); // 150ms delay to ensure WebSocket is fully ready and initialized
                };

                this.connection.once('open', onOpen);

                this.connection.once('error', (error) => {
                    clearTimeout(timeout);
                    reject(error);
                });
            });

            console.log('✅ Deepgram streaming started successfully');

        } catch (error) {
            console.error('❌ Failed to start Deepgram stream:', error);
            this.isStreaming = false;
            this.isConnected = false;
            throw error;
        }
    }

    /**
     * Handle transcript results from Deepgram
     * @param {Object} data - Deepgram result data
     */
    handleTranscript(data) {
        try {
            const transcript = data.channel?.alternatives?.[0]?.transcript || '';
            const isFinal = data.is_final || false;
            const confidence = data.channel?.alternatives?.[0]?.confidence || 0;

            if (!transcript) {
                return; // No transcript in this result
            }

            if (isFinal) {
                // Final transcript - user finished speaking
                this.finalTranscript = transcript.trim();
                this.lastFinalTime = Date.now();
                this.hasReceivedSpeech = true;
                
                // Append to history
                if (this.finalTranscript) {
                    this.transcriptHistory.push({
                        text: this.finalTranscript,
                        timestamp: Date.now(),
                        confidence: confidence
                    });
                }

                console.log(`✅ Deepgram final transcript: "${this.finalTranscript}" (confidence: ${(confidence * 100).toFixed(1)}%)`);
                
                this.emit('finalTranscript', {
                    text: this.finalTranscript,
                    confidence: confidence,
                    sessionId: this.sessionId
                });

                // Check if this looks like a complete thought
                if (this.isCompleteThought(this.finalTranscript)) {
                    console.log('💬 Complete thought detected - ready for processing');
                    this.emit('completeThought', {
                        text: this.finalTranscript,
                        confidence: confidence
                    });
                }

            } else {
                // Partial transcript - user still speaking
                this.partialTranscript = transcript.trim();
                
                if (this.partialTranscript && !this.hasReceivedSpeech) {
                    this.hasReceivedSpeech = true;
                    console.log(`🎤 Deepgram detected speech: "${this.partialTranscript}"`);
                }

                this.emit('partialTranscript', {
                    text: this.partialTranscript,
                    confidence: confidence,
                    sessionId: this.sessionId
                });
            }

        } catch (error) {
            console.error('❌ Error handling Deepgram transcript:', error);
        }
    }

    /**
     * Check if transcript represents a complete thought
     * Looks for sentence endings, question marks, natural pauses
     * @param {string} text - Transcript text
     * @returns {boolean}
     */
    isCompleteThought(text) {
        if (!text || text.length < 3) {
            return false;
        }

        // Check for sentence endings
        const sentenceEndings = /[.!?]\s*$/;
        if (sentenceEndings.test(text)) {
            return true;
        }

        // Check for natural pause indicators (commas followed by silence)
        // If we have a comma and the transcript hasn't changed for a bit, likely complete
        if (text.includes(',') && text.length > 10) {
            return true;
        }

        // Check for question words that suggest completion
        const questionWords = /\b(what|where|when|why|how|who|which|can|could|would|should|is|are|do|does|did)\b/i;
        if (questionWords.test(text) && text.length > 15) {
            return true; // Likely a complete question
        }

        // If transcript is long enough and has natural structure, consider it complete
        if (text.length > 20 && (text.includes(' ') || text.includes(','))) {
            return true;
        }

        return false;
    }

    /**
     * Send audio chunk to Deepgram
     * @param {Buffer} audioChunk - PCM audio data (16-bit, 8kHz or 16kHz, mono)
     */
    sendAudioChunk(audioChunk) {
        if (!this.isConnected || !this.connection) {
            console.warn('⚠️ Deepgram not connected, cannot send audio chunk');
            return false;
        }

        if (!this.isStreaming) {
            console.warn('⚠️ Deepgram not streaming, cannot send audio chunk');
            return false;
        }

        try {
            // Method 1: Try sendBuffer() if available (this might be the correct Deepgram SDK method)
            if (this.connection && typeof this.connection.sendBuffer === 'function') {
                try {
                    // sendBuffer might accept Buffer or need to be called differently
                    const result = this.connection.sendBuffer(audioChunk);
                    this.packetCount++; // Increment packet counter
                    // Only log first packet to avoid spam
                    if (this.packetCount === 1) {
                        console.log(`🔍 Using sendBuffer() method for Deepgram audio`);
                    }
                    return true;
                } catch (err) {
                    // sendBuffer might have different signature, continue to other methods
                    if (this.packetCount <= 3) {
                        console.log(`⚠️ sendBuffer() failed: ${err.message}, trying other methods...`);
                    }
                    this.packetCount++; // Increment even on error
                }
            }
            
            // Method 1b: Try connection.conn.send() directly (WebSocket send)
            if (this.connection && this.connection.conn && typeof this.connection.conn.send === 'function') {
                try {
                    // WebSocket.send() accepts Buffer directly
                    this.connection.conn.send(audioChunk);
                    this.packetCount++; // Increment packet counter
                    // Only log first packet and then every 1000 packets to avoid log spam
                    if (this.packetCount === 1 || this.packetCount % 1000 === 0) {
                        console.log(`🔍 Sent audio chunk ${this.packetCount} to Deepgram via WebSocket`);
                    }
                    return true;
                } catch (err) {
                    if (this.packetCount <= 3) {
                        console.log(`⚠️ connection.conn.send() failed: ${err.message}`);
                    }
                    this.packetCount++; // Increment even on error
                }
            }
            
            // Use the audio stream we obtained when connection opened
            if (this.audioStream) {
                // Method 2: If it's a WebSocket (has send method), use send()
                if (typeof this.audioStream.send === 'function') {
                    // WebSocket.send() accepts Buffer directly
                    this.audioStream.send(audioChunk);
                    this.packetCount++; // Increment packet counter
                    return true;
                }
                // Method 3: If it's a stream (has write method), use write()
                if (typeof this.audioStream.write === 'function') {
                    this.audioStream.write(audioChunk);
                    this.packetCount++; // Increment packet counter
                    return true;
                }
            }
            
            // Fallback: Try to get stream on-demand if not already obtained
            if (this.connection) {
                // Method 4: Try connection.conn (WebSocket) - this is the actual WebSocket
                if (this.connection.conn && typeof this.connection.conn.send === 'function') {
                    if (!this.audioStream) {
                        this.audioStream = this.connection.conn;
                    }
                    this.audioStream.send(audioChunk);
                    this.packetCount++; // Increment packet counter
                    return true;
                }
                
                // Method 2: Try getStream() (most common in Deepgram SDK)
                if (typeof this.connection.getStream === 'function') {
                    if (!this.audioStream) {
                        this.audioStream = this.connection.getStream();
                    }
                    if (this.audioStream && typeof this.audioStream.write === 'function') {
                        this.audioStream.write(audioChunk);
                        this.packetCount++; // Increment packet counter
                        return true;
                    }
                }
                
                // Method 3: Try getRawAudio() stream
                if (typeof this.connection.getRawAudio === 'function') {
                    if (!this.audioStream) {
                        this.audioStream = this.connection.getRawAudio();
                    }
                    if (this.audioStream && typeof this.audioStream.write === 'function') {
                        this.audioStream.write(audioChunk);
                        this.packetCount++; // Increment packet counter
                        return true;
                    }
                }
                
                // Method 4: Try send() method directly on connection
                if (typeof this.connection.send === 'function') {
                    try {
                        this.connection.send(audioChunk);
                        return true;
                    } catch (err) {
                        // send() might not accept raw audio, continue to next method
                    }
                }
                
                // Method 5: Try accessing internal stream property
                if (this.connection.stream && typeof this.connection.stream.write === 'function') {
                    if (!this.audioStream) {
                        this.audioStream = this.connection.stream;
                    }
                    this.audioStream.write(audioChunk);
                    return true;
                }
                
                // Debug: Log available methods (only first time)
                if (this.packetCount === 0) {
                    console.log(`🔍 Deepgram connection methods: ${Object.getOwnPropertyNames(this.connection).join(', ')}`);
                    if (this.connection.conn) {
                        console.log(`🔍 Deepgram connection.conn type: ${typeof this.connection.conn}`);
                        console.log(`🔍 Deepgram connection.conn methods: ${Object.getOwnPropertyNames(this.connection.conn).join(', ')}`);
                    }
                }
                this.packetCount++;
            }
            
            // Log warning only occasionally to avoid spam
            if (this.packetCount <= 3 || this.packetCount % 100 === 0) {
                console.warn(`⚠️ Deepgram: Cannot send audio chunk ${this.packetCount} - no working method found`);
            }
            return false;
        } catch (error) {
            console.error('❌ Error sending audio chunk to Deepgram:', error);
            this.emit('error', error);
            return false;
        }
    }

    /**
     * Stop streaming and get final transcript
     * @returns {Promise<string>} Final transcript
     */
    async stopStream() {
        // Prevent duplicate calls
        if (!this.isStreaming) {
            const finalText = this.finalTranscript || this.partialTranscript;
            return finalText;
        }

        // Mark as stopping immediately to prevent duplicate calls
        this.isStreaming = false;

        try {
            console.log('🛑 Stopping Deepgram stream...');

            // Send finish signal
            if (this.connection && this.isConnected) {
                try {
                    if (typeof this.connection.finish === 'function') {
                        this.connection.finish();
                    }
                } catch (err) {
                    // Ignore errors when finishing
                }
            }

            // Wait a bit for final transcript
            await new Promise(resolve => setTimeout(resolve, 500));

            // Close connection properly
            if (this.connection) {
                try {
                    // Remove all listeners to prevent further events
                    this.connection.removeAllListeners();
                } catch (err) {
                    // Ignore errors
                }
                this.connection = null;
            }

            this.isConnected = false;

            const finalText = this.finalTranscript || this.partialTranscript;
            console.log(`✅ Deepgram stream stopped. Final transcript: "${finalText}"`);

            return finalText;

        } catch (error) {
            console.error('❌ Error stopping Deepgram stream:', error);
            this.isStreaming = false;
            this.isConnected = false;
            return this.finalTranscript || this.partialTranscript;
        }
    }

    /**
     * Get current transcript (final or partial)
     * @returns {string}
     */
    getCurrentTranscript() {
        return this.finalTranscript || this.partialTranscript;
    }

    /**
     * Check if we have received any speech
     * @returns {boolean}
     */
    hasSpeech() {
        return this.hasReceivedSpeech;
    }

    /**
     * Check if we have a final transcript
     * @returns {boolean}
     */
    hasFinalTranscript() {
        return !!this.finalTranscript;
    }
}

module.exports = DeepgramStreaming;

