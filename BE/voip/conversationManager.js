const VoiceInteraction = require('./voiceInteraction');
const AudioCodec = require('./audioCodec');
const logger = require('./logger');

class ConversationManager {
    constructor() {
        this.voiceInteraction = new VoiceInteraction();
        // Production defaults: no debug temp files to avoid filling tmp/ and constant I/O
        this.audioCodec = new AudioCodec({ debugMode: false, saveIntermediateFiles: false });
        this.conversations = new Map();
    }

    /**
     * Start a new conversation session
     * @param {string} sessionId - Session ID
     * @param {Object} options - Conversation options
     * @returns {Object} Conversation object
     */
    startConversation(sessionId, options = {}) {
        const conversation = {
            sessionId,
            startTime: new Date(),
            status: 'active',
            messages: [],
            context: {
                userName: null,
                userEmail: null,
                userPhone: null,
                intent: null,
                stage: 'greeting'
            },
            options: {
                voice: options.voice || 'shimmer',
                greeting: options.greeting || null,
                maxTurns: options.maxTurns || 10,
                timeout: options.timeout || 60000 // 60 seconds
            }
        };

        this.conversations.set(sessionId, conversation);
        return conversation;
    }

    /**
     * Process user speech and generate bot response
     * @param {string} sessionId - Session ID
     * @param {Buffer} audioBuffer - User audio buffer (for fallback)
     * @param {string} transcript - Pre-transcribed text from Deepgram (if available)
     * @returns {Promise<Object>} { userText, botResponse, botAudio }
     */
    async processUserSpeech(sessionId, audioBuffer, transcript = null) {
        const conversation = this.conversations.get(sessionId);
        if (!conversation) {
            throw new Error(`Conversation ${sessionId} not found`);
        }

        try {
            let userText;
            
            // Step 1: Transcribe user speech (use Deepgram transcript if available, else Whisper)
            // Skip transcription entirely if we have a transcript and no audio buffer
            if (transcript && transcript.trim().length > 0 && (!audioBuffer || audioBuffer.length === 0)) {
                console.log(`✅ Using Deepgram transcript directly (no audio processing needed): "${transcript}"`);
                userText = transcript;
            } else {
                // Need to transcribe (either no transcript or have audio buffer for fallback)
                console.log(`🎤 Transcribing user speech for session ${sessionId}...`);
                userText = await this.voiceInteraction.speechToText(audioBuffer, transcript);
            }
            
            if (!userText || userText.trim().length === 0) {
                console.log(`⚠️ No speech detected`);
                return {
                    userText: '',
                    botResponse: "I didn't catch that. Could you please repeat?",
                    botAudio: null
                };
            }

            console.log(`✅ User said: "${userText}"`);

            // Step 2: Update conversation context
            this.updateContext(conversation, userText);

            // Step 3: Generate AI response
            logger.startTiming('gptResponse');
            logger.log(`🤖 Generating AI response...`);
            logger.log(`   User said: "${userText}"`);
            logger.log(`   Session: ${sessionId}`);
            
            let botResponse;
            try {
                botResponse = await this.voiceInteraction.generateVoiceResponse(
                    userText,
                    sessionId
                );
                logger.log(`✅ Bot responds: "${botResponse}" [${logger.endTiming('gptResponse')}]`);
            } catch (error) {
                console.error(`❌ Error generating AI response: ${error.message}`);
                console.error(`   Stack: ${error.stack}`);
                // Fallback response
                botResponse = "I'm sorry, I'm having trouble processing that. Could you please repeat?";
                console.log(`⚠️ Using fallback response: "${botResponse}"`);
            }

            // Step 4: Skip TTS conversion here - it will be done in speakAndWait
            // This avoids duplicate TTS generation and saves time
            // The botAudio will be generated on-demand in speakAndWait
            logger.log(`⏭️ Skipping TTS conversion here - will be done in speakAndWait to avoid duplication`);
            const mp3Audio = null; // Not generated here
            const g711 = null; // Not generated here
            const codec = null; // Not generated here

            // Step 5: Save conversation turn (audio will be generated in speakAndWait)
            conversation.messages.push({
                timestamp: new Date(),
                user: userText,
                bot: botResponse
            });

            // Step 7: Check if conversation should end
            const shouldEnd = this.shouldEndConversation(conversation, userText, botResponse);

            return {
                userText,
                botResponse,
                botAudio: g711, // Will be null - generated in speakAndWait
                audioDuration: g711 ? (g711.length / 8000) : 0, // Will be 0 - calculated in speakAndWait
                shouldEnd,
                conversationState: {
                    stage: conversation.context.stage,
                    turnCount: conversation.messages.length
                }
            };

        } catch (error) {
            console.error(`❌ Error processing user speech: ${error.message}`);
            throw error;
        }
    }

    /**
     * Update conversation context based on user input
     */
    updateContext(conversation, userText) {
        const text = userText.toLowerCase();

        // Extract name
        if (!conversation.context.userName) {
            const nameMatch = userText.match(/\b(?:my name is|i'm|i am|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
            if (nameMatch) {
                conversation.context.userName = nameMatch[1];
                console.log(`📝 Extracted name: ${conversation.context.userName}`);
            }
        }

        // Extract email
        if (!conversation.context.userEmail) {
            const emailMatch = userText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
            if (emailMatch) {
                conversation.context.userEmail = emailMatch[0];
                console.log(`📝 Extracted email: ${conversation.context.userEmail}`);
            }
        }

        // Extract phone
        if (!conversation.context.userPhone) {
            const phoneMatch = userText.match(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
            if (phoneMatch) {
                conversation.context.userPhone = phoneMatch[0];
                console.log(`📝 Extracted phone: ${conversation.context.userPhone}`);
            }
        }

        // Update stage based on conversation flow
        if (conversation.context.stage === 'greeting') {
            conversation.context.stage = 'conversation';
        }

        // Detect intent
        if (text.includes('schedule') || text.includes('appointment') || text.includes('demo')) {
            conversation.context.intent = 'schedule';
        } else if (text.includes('price') || text.includes('cost') || text.includes('fee')) {
            conversation.context.intent = 'pricing';
        } else if (text.includes('goodbye') || text.includes('bye bye') || 
                   (text.includes('bye') && !text.includes('thank you'))) {
            conversation.context.stage = 'ending';
        }
    }

    /**
     * Determine if conversation should end
     */
    shouldEndConversation(conversation, userText, botResponse) {
        const text = userText.toLowerCase();
        const botText = botResponse.toLowerCase();

        // Check max turns
        if (conversation.messages.length >= conversation.options.maxTurns) {
            console.log(`🛑 Max turns reached (${conversation.options.maxTurns})`);
            return true;
        }

        // Check for goodbye signals (only explicit goodbyes, not "thank you" alone)
        // "Thank you" is polite but doesn't necessarily mean the conversation should end
        const explicitGoodbye = text.includes('goodbye') || text.includes('bye bye') || 
                               (text.includes('bye') && !text.includes('thank you'));
        const botSaidGoodbye = botText.includes('goodbye') || botText.includes('have a great day');
        
        if (explicitGoodbye || botSaidGoodbye) {
            console.log(`🛑 Goodbye detected`);
            return true;
        }
        
        // "Thank you" alone should not end conversation, but if user says "thank you, goodbye" it should
        if (text.includes('thank you') && (text.includes('goodbye') || text.includes('bye'))) {
            console.log(`🛑 Goodbye detected (thank you + goodbye)`);
            return true;
        }

        // Check if we've captured required info and completed intent
        if (conversation.context.stage === 'ending') {
            return true;
        }

        return false;
    }

    /**
     * End conversation session
     */
    endConversation(sessionId) {
        const conversation = this.conversations.get(sessionId);
        if (conversation) {
            conversation.status = 'ended';
            conversation.endTime = new Date();
            conversation.duration = conversation.endTime - conversation.startTime;

            console.log(`✅ Conversation ended: ${sessionId}`);
            console.log(`   Duration: ${(conversation.duration / 1000).toFixed(2)}s`);
            console.log(`   Turns: ${conversation.messages.length}`);
            console.log(`   Context:`, conversation.context);

            // Keep conversation for a while for analytics
            setTimeout(() => {
                this.conversations.delete(sessionId);
            }, 3600000); // 1 hour

            return conversation;
        }
        return null;
    }

    /**
     * Generate call summary using GPT
     * This is called AFTER the call ends to avoid any delay
     * @param {string} sessionId - Session ID
     * @returns {Promise<string>} Generated summary
     */
    async generateCallSummary(sessionId) {
        const conversation = this.conversations.get(sessionId);
        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
            logger.warn(`⚠️ No conversation data found for summary: ${sessionId}`);
            return null;
        }

        try {
            logger.log(`📝 Generating call summary for session: ${sessionId}`);
            logger.startTiming('callSummary');

            // Build conversation transcript
            const transcript = conversation.messages.map((msg, index) => {
                // Messages are stored as { user, bot, timestamp }
                if (msg.user) {
                    return `User: ${msg.user}`;
                } else if (msg.bot) {
                    return `Bot: ${msg.bot}`;
                } else {
                    // Fallback for other formats
                    return `Turn ${index + 1}: ${JSON.stringify(msg)}`;
                }
            }).filter(line => line && line.trim().length > 0).join('\n');

            // Create summary prompt
            const summaryPrompt = `You are analyzing a phone call conversation. Generate a concise, professional summary of this call.

Conversation Transcript:
${transcript}

Please provide a summary that includes:
1. Purpose/Reason for the call
2. Key topics discussed
3. Any decisions made or actions agreed upon
4. Next steps (if any)
5. Overall outcome

Format the summary in clear, professional language. Keep it concise but comprehensive.`;

            // Generate summary using GPT
            const summary = await this.voiceInteraction.generateSummary(summaryPrompt);
            
            logger.log(`✅ Call summary generated [${logger.endTiming('callSummary')}]`);
            return summary;

        } catch (error) {
            logger.error(`❌ Error generating call summary: ${error.message}`);
            return null;
        }
    }

    /**
     * Get conversation details
     */
    getConversation(sessionId) {
        return this.conversations.get(sessionId);
    }

    /**
     * Get all active conversations
     */
    getActiveConversations() {
        const active = [];
        for (const [sessionId, conversation] of this.conversations) {
            if (conversation.status === 'active') {
                active.push({
                    sessionId,
                    startTime: conversation.startTime,
                    turnCount: conversation.messages.length,
                    stage: conversation.context.stage
                });
            }
        }
        return active;
    }
}

module.exports = ConversationManager;

