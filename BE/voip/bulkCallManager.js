const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const CRMIntegration = require('./crmIntegration');

class BulkCallManager {
    constructor(voiceAgent, chatbotService) {
        this.voiceAgent = voiceAgent;
        this.chatbotService = chatbotService;
        this.campaigns = new Map();
        this.callResults = new Map();
        this.crmIntegration = new CRMIntegration();
    }

    // Parse CSV file
    async parseCSV(filePath) {
        return new Promise((resolve, reject) => {
            const contacts = [];
            
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    // Support multiple column name formats
                    const name = row.name || row.Name || row.NAME || 
                                row.customer_name || row['Customer Name'] || 'Customer';
                    const phone = row.phone || row.Phone || row.PHONE || 
                                 row.number || row.Number || row.mobile || row.Mobile;
                    
                    if (phone) {
                        contacts.push({
                            name: name.trim(),
                            phone: this.formatPhoneNumber(phone)
                        });
                    }
                })
                .on('end', () => {
                    resolve(contacts);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    // Parse Excel file
    parseExcel(filePath) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            const contacts = data.map(row => {
                // Support multiple column name formats
                const name = row.name || row.Name || row.NAME || 
                            row.customer_name || row['Customer Name'] || 'Customer';
                const phone = row.phone || row.Phone || row.PHONE || 
                             row.number || row.Number || row.mobile || row.Mobile;

                return {
                    name: name ? name.trim() : 'Customer',
                    phone: this.formatPhoneNumber(phone)
                };
            }).filter(contact => contact.phone);

            return contacts;
        } catch (error) {
            throw new Error(`Failed to parse Excel file: ${error.message}`);
        }
    }

    // Format phone number (add + if missing, remove spaces/dashes)
    formatPhoneNumber(phone) {
        if (!phone) return null;
        
        // Convert to string and clean
        let cleaned = String(phone).replace(/[\s\-\(\)]/g, '');
        
        // Add + if missing
        if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }
        
        return cleaned;
    }

    // Validate contact list
    validateContacts(contacts) {
        const errors = [];
        const validContacts = [];

        contacts.forEach((contact, index) => {
            const issues = [];
            
            // Validate phone number
            if (!contact.phone) {
                issues.push('Missing phone number');
            } else if (contact.phone.length < 10) {
                issues.push('Phone number too short');
            }

            if (issues.length > 0) {
                errors.push({
                    row: index + 1,
                    contact: contact,
                    issues: issues
                });
            } else {
                validContacts.push(contact);
            }
        });

        return {
            valid: validContacts,
            invalid: errors,
            stats: {
                total: contacts.length,
                valid: validContacts.length,
                invalid: errors.length
            }
        };
    }

    // Create bulk call campaign
    async createCampaign(contacts, options = {}) {
        const campaignId = `campaign_${Date.now()}`;
        
        const campaign = {
            id: campaignId,
            contacts: contacts,
            options: {
                delay: options.delay || 5000, // 5 seconds between calls
                voice: options.voice || 'shimmer',
                greeting: options.greeting || 'Hello {name}, this is your AI assistant from TechCorp. I hope I\'m not catching you at a bad time.', // Default template to save costs
                maxRetries: options.maxRetries || 0,
                ...options
            },
            status: 'pending',
            stats: {
                total: contacts.length,
                completed: 0,
                successful: 0,
                failed: 0,
                pending: contacts.length
            },
            createdAt: new Date(),
            startedAt: null,
            completedAt: null
        };

        this.campaigns.set(campaignId, campaign);
        return campaign;
    }

    // Execute bulk call campaign
    async executeCampaign(campaignId) {
        const campaign = this.campaigns.get(campaignId);
        
        if (!campaign) {
            throw new Error('Campaign not found');
        }

        if (campaign.status === 'running') {
            throw new Error('Campaign is already running');
        }

        campaign.status = 'running';
        campaign.startedAt = new Date();

        console.log(`Starting campaign ${campaignId} with ${campaign.contacts.length} contacts`);

        const results = [];

        for (let i = 0; i < campaign.contacts.length; i++) {
            const contact = campaign.contacts[i];
            
            try {
                console.log(`Calling ${i + 1}/${campaign.contacts.length}: ${contact.name} (${contact.phone})`);
                
                // Personalize greeting with contact name (or let AI generate if null)
                let personalizedGreeting = campaign.options.greeting;
                if (personalizedGreeting && typeof personalizedGreeting === 'string') {
                    personalizedGreeting = personalizedGreeting.replace(/{name}/g, contact.name);
                } else {
                    // Pass null to let AI auto-generate
                    personalizedGreeting = null;
                }
                
                // Make the call
                const callResult = await this.makePersonalizedCall(
                    contact.phone,
                    contact.name,
                    personalizedGreeting,
                    campaign.options.voice
                );

                results.push({
                    contact: contact,
                    status: 'success',
                    callId: callResult.id,
                    timestamp: new Date()
                });

                campaign.stats.successful++;
                campaign.stats.completed++;
                campaign.stats.pending--;

            } catch (error) {
                console.error(`Failed to call ${contact.name}: ${error.message}`);
                
                results.push({
                    contact: contact,
                    status: 'failed',
                    error: error.message,
                    timestamp: new Date()
                });

                campaign.stats.failed++;
                campaign.stats.completed++;
                campaign.stats.pending--;
            }

            // Delay between calls (except for the last one)
            if (i < campaign.contacts.length - 1) {
                await this.delay(campaign.options.delay);
            }
        }

        campaign.status = 'completed';
        campaign.completedAt = new Date();
        campaign.results = results;

        console.log(`Campaign ${campaignId} completed. Success: ${campaign.stats.successful}, Failed: ${campaign.stats.failed}`);

        // Store results
        this.callResults.set(campaignId, results);

        return {
            campaignId: campaignId,
            stats: campaign.stats,
            results: results
        };
    }

    // Make personalized call with name - AI FULLY AUTOMATED
    async makePersonalizedCall(phoneNumber, name, greeting, voice = 'shimmer') {
        try {
            console.log(`\n🤖 AI-Powered Call to ${name} (${phoneNumber})`);
            
            // Let OpenAI Assistant generate the greeting if not provided (AUTOMATIC!)
            let aiGreeting = greeting;
            if (!greeting || (typeof greeting === 'string' && greeting.trim() === '')) {
                console.log(`\n🤖 AI AUTO-GENERATION MODE ACTIVATED`);
                console.log(`🤖 Generating personalized greeting for: ${name}...`);
                
                // Ask OpenAI Assistant to generate personalized greeting
                const greetingPrompt = `You are making a professional sales call. Generate a personalized opening greeting for a voice call to ${name}.

The greeting should:
- Start with name verification: "Hello, am I speaking with ${name}?"
- Introduce yourself as an AI assistant from TechCorp
- Be professional but friendly
- Be 2-3 sentences maximum
- Be natural for voice conversation

Generate ONLY the greeting text. No explanation or extra text.`;
                
                console.log(`📤 Sending to OpenAI Assistant...`);
                aiGreeting = await this.chatbotService.getChatbotResponse(greetingPrompt, `greeting_${Date.now()}`);
                console.log(`\n✅ AI-GENERATED GREETING:`);
                console.log(`📝 "${aiGreeting}"\n`);
            } else if (typeof greeting === 'string') {
                console.log(`📝 Using custom greeting template`);
                // Replace {name} placeholder if present
                aiGreeting = greeting.replace(/{name}/g, name);
            }

            // Make the call with AI-powered greeting
            const session = await this.voiceAgent.makeCall(phoneNumber, voice, aiGreeting);
            
            // Store context
            session.context = {
                customerName: name,
                greeting: aiGreeting,
                voice: voice,
                aiGenerated: !greeting
            };

            console.log(`📞 Bot will say: "${aiGreeting}"`);
            
            // Generate TTS audio
            const audioBuffer = await this.voiceAgent.voiceInteraction.textToSpeech(aiGreeting, voice);
            console.log(`🎵 Generated ${audioBuffer.length} bytes of audio (${voice} voice)`);

            return session;
            
        } catch (error) {
            console.error(`Error making personalized call: ${error.message}`);
            throw error;
        }
    }

    // Get campaign status
    getCampaignStatus(campaignId) {
        const campaign = this.campaigns.get(campaignId);
        
        if (!campaign) {
            return null;
        }

        return {
            id: campaign.id,
            status: campaign.status,
            stats: campaign.stats,
            createdAt: campaign.createdAt,
            startedAt: campaign.startedAt,
            completedAt: campaign.completedAt,
            progress: Math.round((campaign.stats.completed / campaign.stats.total) * 100)
        };
    }

    // Get campaign results
    getCampaignResults(campaignId) {
        return this.callResults.get(campaignId) || [];
    }

    // Export results to CSV
    exportResultsToCSV(campaignId) {
        const results = this.callResults.get(campaignId);
        
        if (!results) {
            throw new Error('Campaign results not found');
        }

        const csvLines = [
            'Name,Phone,Status,Call ID,Error,Timestamp'
        ];

        results.forEach(result => {
            csvLines.push([
                result.contact.name,
                result.contact.phone,
                result.status,
                result.callId || '',
                result.error || '',
                result.timestamp.toISOString()
            ].join(','));
        });

        return csvLines.join('\n');
    }

    // Helper: Delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get all campaigns
    getAllCampaigns() {
        return Array.from(this.campaigns.values()).map(campaign => ({
            id: campaign.id,
            status: campaign.status,
            stats: campaign.stats,
            createdAt: campaign.createdAt,
            contactCount: campaign.contacts.length
        }));
    }
}

module.exports = BulkCallManager;

