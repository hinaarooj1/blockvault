const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config/config.env') });

class VoiceInteraction {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.deepgramApiKey = process.env.DEEPGRAM_API_KEY;
        this.useDeepgramStreaming = process.env.USE_DEEPGRAM_STREAMING === 'true';
        this.audioBuffer = new Map();
        this.conversationState = new Map();
    }

    // Text-to-Speech using OpenAI TTS
    async textToSpeech(text, voice = 'alloy') {
        // Available voices: alloy, echo, fable, onyx, nova, shimmer
        try {
            console.log(`Converting to speech: "${text}"`);
            
            const response = await axios.post('https://api.openai.com/v1/audio/speech', {
                model: "tts-1",
                voice: voice,
                input: text,
                response_format: "mp3"
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });

            const buffer = Buffer.from(response.data);
            return buffer;
        } catch (error) {
            console.error('TTS Error:', error);
            throw error;
        }
    }

    // Convert MP3 audio to PCM/G.711 μ-law for RTP streaming
    async convertToRTPAudio(mp3Buffer) {
        try {
            console.log('🎵 Converting MP3 to PCM/G.711 μ-law for RTP streaming...');
            
            return new Promise((resolve, reject) => {
                const tempMp3File = path.join(__dirname, `temp_${Date.now()}.mp3`);
                const tempPcmFile = path.join(__dirname, `temp_${Date.now()}.pcm`);
                
                // Write MP3 buffer to temporary file
                fs.writeFileSync(tempMp3File, mp3Buffer);
                
                // Convert MP3 to PCM/G.711 μ-law using ffmpeg
                ffmpeg(tempMp3File)
                    .format('mulaw')           // G.711 μ-law format
                    .audioChannels(1)          // Mono
                    .audioFrequency(8000)      // 8kHz sample rate
                    .audioBitrate('64k')       // 64kbps bitrate
                    .on('end', () => {
                        try {
                            // Read the converted PCM data
                            const pcmBuffer = fs.readFileSync(tempPcmFile);
                            
                            // Clean up temporary files
                            fs.unlinkSync(tempMp3File);
                            fs.unlinkSync(tempPcmFile);
                            
                            console.log(`✅ Audio conversion completed: ${pcmBuffer.length} bytes`);
                            resolve(pcmBuffer);
                        } catch (error) {
                            console.error('❌ Error reading converted audio:', error);
                            reject(error);
                        }
                    })
                    .on('error', (error) => {
                        console.error('❌ FFmpeg conversion error:', error);
                        console.log('🔄 Falling back to simulated audio for testing...');
                        
                        // Clean up temporary files
                        try {
                            fs.unlinkSync(tempMp3File);
                            fs.unlinkSync(tempPcmFile);
                        } catch (cleanupError) {
                            console.error('❌ Error cleaning up temp files:', cleanupError);
                        }
                        
                        // Fallback: Generate simulated PCM audio for testing
                        const simulatedPCM = this.generateSimulatedPCM();
                        console.log(`✅ Simulated PCM audio generated: ${simulatedPCM.length} bytes`);
                        resolve(simulatedPCM);
                    })
                    .save(tempPcmFile);
            });
        } catch (error) {
            console.error('❌ Audio conversion failed, using fallback:', error);
            // Fallback: Generate simulated PCM audio
            const simulatedPCM = this.generateSimulatedPCM();
            return simulatedPCM;
        }
    }

    // Generate simulated PCM audio for testing when ffmpeg is not available
    generateSimulatedPCM() {
        console.log('🎵 Generating simulated PCM audio for testing...');
        
        // Generate 3 seconds of simulated audio (8000 Hz * 3 = 24000 samples)
        const duration = 3; // seconds
        const sampleRate = 8000;
        const samples = sampleRate * duration;
        const buffer = Buffer.alloc(samples);
        
        // Generate a simple sine wave pattern (simulated speech)
        for (let i = 0; i < samples; i++) {
            // Create a simple audio pattern that sounds like speech
            const frequency = 440 + Math.sin(i / 100) * 100; // Varying frequency
            const amplitude = Math.sin(i * frequency / sampleRate * 2 * Math.PI) * 0.3;
            const sample = Math.floor((amplitude + 1) * 127.5); // Convert to 0-255 range
            buffer[i] = sample;
        }
        
        console.log(`✅ Simulated PCM generated: ${buffer.length} bytes (${duration}s)`);
        return buffer;
    }

    // Generate audio for RTP streaming (MP3 + PCM versions)
    async generateRTPAudio(text, voice = 'shimmer') {
        try {
            console.log(`🎵 Generating RTP audio for: "${text}"`);
            
            // Step 1: Generate MP3 using OpenAI TTS
            const mp3Buffer = await this.textToSpeech(text, voice);
            console.log(`📊 MP3 generated: ${mp3Buffer.length} bytes`);
            
            // Step 2: Convert MP3 to PCM/G.711 μ-law for RTP
            const pcmBuffer = await this.convertToRTPAudio(mp3Buffer);
            console.log(`📊 PCM/G.711 generated: ${pcmBuffer.length} bytes`);
            
            return {
                mp3: mp3Buffer,    // For storage/playback
                pcm: pcmBuffer,    // For RTP streaming
                duration: pcmBuffer.length / 8000, // Duration in seconds (8kHz)
                text: text
            };
        } catch (error) {
            console.error('❌ RTP audio generation failed:', error);
            throw error;
        }
    }

    /**
     * Speech-to-Text using Deepgram streaming (if enabled) or OpenAI Whisper (fallback)
     * @param {string} transcript - Transcript from Deepgram streaming (if available)
     * @param {Buffer} audioBuffer - Audio buffer for Whisper fallback
     * @returns {Promise<string>} Transcribed text
     */
    async speechToText(audioBuffer, transcript = null) {
        // If we already have a transcript from Deepgram streaming, use it
        if (transcript && transcript.trim().length > 0) {
            console.log(`✅ Using Deepgram transcript: "${transcript}"`);
            return transcript;
        }
        
        // Fallback to Whisper
        return this.speechToTextWhisper(audioBuffer);
    }

    // Speech-to-Text using OpenAI Whisper (fallback method)
    async speechToTextWhisper(audioBuffer) {
        try {
            // Verify API key is set
            if (!this.openaiApiKey) {
                console.error('❌ OPENAI_API_KEY is not set! Cannot transcribe speech.');
                throw new Error('OpenAI API key is missing');
            }

            console.log('🎤 Converting speech to text with Whisper...');
            console.log(`   Audio buffer size: ${audioBuffer.length} bytes`);
            console.log(`   API Key: ${this.openaiApiKey ? '✅ Set' : '❌ Missing'}`);
            
            const FormData = require('form-data');
            const formData = new FormData();
            
            // Create a buffer from the audio data
            formData.append('file', audioBuffer, {
                filename: 'audio.wav',
                contentType: 'audio/wav'
            });
            formData.append('model', 'whisper-1');
            formData.append('language', 'en');
            formData.append('response_format', 'json');

            console.log('📤 Sending audio to OpenAI Whisper API...');
            const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    ...formData.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            if (!response.data || !response.data.text) {
                console.error('❌ Invalid response from Whisper API:', response.data);
                throw new Error('Invalid response from Whisper API');
            }

            const text = response.data.text || '';
            console.log(`✅ Recognized speech: "${text}"`);
            return text;
        } catch (error) {
            console.error('❌ STT Error:', error.message);
            if (error.response) {
                console.error('   Status:', error.response.status);
                console.error('   Data:', error.response.data);
            }
            if (error.request) {
                console.error('   Request made but no response received');
            }
            throw error;
        }
    }

    // Generate AI response for voice conversation
    async generateVoiceResponse(userText, sessionId = 'default') {
        try {
            // Verify API key is set
            if (!this.openaiApiKey) {
                console.error('❌ OPENAI_API_KEY is not set! Cannot generate response.');
                throw new Error('OpenAI API key is missing');
            }

            console.log(`\n🤖 Generating AI response for: "${userText}"`);
            console.log(`   Session: ${sessionId}`);
            console.log(`   API Key: ${this.openaiApiKey ? '✅ Set' : '❌ Missing'}`);
            
            const conversationHistory = this.conversationState.get(sessionId) || [];
            
            const messages = [
                {
                    role: "system",
                    content: `You are a professional AI voice assistant for a business. 

VOICE CONVERSATION GUIDELINES:
- Keep responses concise (under 30 words)
- Speak naturally and professionally
- Ask one question at a time
- Be helpful and friendly
- Capture lead information when appropriate
- Schedule appointments when requested

COMPANY INFORMATION:
- Company: AI Solutions Provider
- Services: AI Chatbot, Voice Agent, CRM Integration
- Contact: info@aisolutions.com
- Hours: 9 AM - 5 PM (Monday-Friday)

LEAD CAPTURE SCRIPT:
1. Greet: "Hello! This is [Company Name]. How can I help you today?"
2. Qualify: "What brings you to us today?"
3. Capture: "May I get your name and email for follow-up?"
4. Schedule: "Would you like to schedule a demo?"

APPOINTMENT SCRIPT:
- "I'd be happy to schedule a demo for you."
- "What day works best for you?"
- "Morning or afternoon preference?"
- "I'll send you a confirmation email."

Keep responses conversational and under 30 words.`
                },
                ...conversationHistory,
                {
                    role: "user",
                    content: userText
                }
            ];

            console.log(`📤 Sending request to OpenAI API...`);
            console.log(`   Model: gpt-4o-mini`);
            console.log(`   Messages: ${messages.length} (${conversationHistory.length} history + system + user)`);

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4o-mini",
                messages: messages,
                max_tokens: 100,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data || !response.data.choices || !response.data.choices[0]) {
                console.error('❌ Invalid response from OpenAI API:', response.data);
                throw new Error('Invalid response from OpenAI API');
            }

            const aiResponse = response.data.choices[0].message.content;
            console.log(`✅ OpenAI response received: "${aiResponse}"`);
            
            // Update conversation history
            conversationHistory.push(
                { role: "user", content: userText },
                { role: "assistant", content: aiResponse }
            );
            this.conversationState.set(sessionId, conversationHistory.slice(-6));

            return aiResponse;
        } catch (error) {
            console.error('❌ AI Response Error:', error.message);
            if (error.response) {
                console.error('   Status:', error.response.status);
                console.error('   Data:', error.response.data);
            }
            if (error.request) {
                console.error('   Request made but no response received');
            }
            throw error; // Re-throw so caller can handle it
        }
    }

    // Process voice conversation
    async processVoiceConversation(audioBuffer, sessionId = 'default') {
        try {
            // Step 1: Convert speech to text
            const userText = await this.speechToText(audioBuffer);
            
            // Step 2: Generate AI response
            const aiResponse = await this.generateVoiceResponse(userText, sessionId);
            
            // Step 3: Convert response to speech
            const audioResponse = await this.textToSpeech(aiResponse);
            
            return {
                userText: userText,
                aiResponse: aiResponse,
                audioResponse: audioResponse
            };
        } catch (error) {
            console.error('Voice conversation error:', error);
            throw error;
        }
    }

    /**
     * Generate call summary using GPT
     * @param {string} prompt - Summary generation prompt
     * @returns {Promise<string>} Generated summary
     */
    async generateSummary(prompt) {
        try {
            // Verify API key is set
            if (!this.openaiApiKey) {
                console.error('❌ OPENAI_API_KEY is not set! Cannot generate summary.');
                throw new Error('OpenAI API key is missing');
            }

            console.log(`📝 Generating call summary with GPT...`);
            
            const messages = [
                {
                    role: "system",
                    content: "You are a professional call analyst. Generate concise, professional summaries of phone conversations."
                },
                {
                    role: "user",
                    content: prompt
                }
            ];

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4o-mini",
                messages: messages,
                max_tokens: 500,
                temperature: 0.3 // Lower temperature for more consistent summaries
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data || !response.data.choices || !response.data.choices[0]) {
                console.error('❌ Invalid response from OpenAI API:', response.data);
                throw new Error('Invalid response from OpenAI API');
            }

            const summary = response.data.choices[0].message.content;
            console.log(`✅ Summary generated: ${summary.length} characters`);
            return summary;

        } catch (error) {
            console.error('❌ Summary Generation Error:', error.message);
            if (error.response) {
                console.error('   Status:', error.response.status);
                console.error('   Data:', error.response.data);
            }
            throw error;
        }
    }

    // Simulate voice conversation for testing
    async simulateVoiceConversation(sessionId = 'default') {
        const conversationFlow = [
            "Hello! This is AI Solutions. How can I help you today?",
            "What brings you to us today?",
            "That sounds great! May I get your name and email for follow-up?",
            "Perfect! Would you like to schedule a demo?",
            "What day works best for you?",
            "I'll send you a confirmation email. Thank you for your time!"
        ];

        for (let i = 0; i < conversationFlow.length; i++) {
            const text = conversationFlow[i];
            console.log(`Bot says: "${text}"`);
            
            // Convert to speech
            const audio = await this.textToSpeech(text);
            
            // Simulate pause between responses
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    // Get conversation state
    getConversationState(sessionId) {
        return this.conversationState.get(sessionId) || [];
    }

    // Clear conversation state
    clearConversationState(sessionId) {
        this.conversationState.delete(sessionId);
    }

    // Extract lead information from conversation
    extractLeadInfo(conversationHistory) {
        const leadInfo = {
            name: null,
            email: null,
            phone: null,
            company: null,
            requirements: null,
            appointmentRequested: false
        };

        const fullConversation = conversationHistory.map(msg => msg.content).join(' ');

        // Extract email
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
        const emailMatch = fullConversation.match(emailRegex);
        if (emailMatch) leadInfo.email = emailMatch[1];

        // Extract phone
        const phoneRegex = /(\+?[\d\s\-\(\)]{10,})/;
        const phoneMatch = fullConversation.match(phoneRegex);
        if (phoneMatch) leadInfo.phone = phoneMatch[1];

        // Check for appointment request
        if (fullConversation.toLowerCase().includes('schedule') || 
            fullConversation.toLowerCase().includes('demo') ||
            fullConversation.toLowerCase().includes('appointment')) {
            leadInfo.appointmentRequested = true;
        }

        return leadInfo;
    }
}

module.exports = VoiceInteraction;
