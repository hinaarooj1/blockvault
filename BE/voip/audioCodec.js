const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AudioCodec {
    constructor(options = {}) {
        this.debugMode = options.debugMode || false;
        this.saveIntermediateFiles = options.saveIntermediateFiles || false;
        this.tempDir = options.tempDir || path.join(__dirname, '../tmp');
        this.ensureTempDir();
    }

    /**
     * Ensure temp directory exists
     */
    ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    /**
     * Convert MP3 audio to PCM 16-bit, 8kHz, mono
     * @param {Buffer} mp3Buffer - Input MP3 audio
     * @returns {Promise<Buffer>} PCM audio buffer
     */
    async mp3ToPCM(mp3Buffer, options = {}) {
        return new Promise((resolve, reject) => {
            const tempId = Date.now();
            const tempMp3 = path.join(this.tempDir, `input_${tempId}.mp3`);
            const tempPcm = path.join(this.tempDir, `pcm_${tempId}.raw`);

            // Write MP3 to temp file
            fs.writeFileSync(tempMp3, mp3Buffer);

            const targetSampleRate = options.sampleRate || options.targetSampleRate || 8000;
            const targetChannels = options.channels || 1;
            const targetFormat = options.format || 's16le';

            console.log(`🔄 Converting MP3 to PCM (${targetSampleRate}Hz, ${targetChannels}ch, ${targetFormat})...`);

            ffmpeg(tempMp3)
                .format(targetFormat)           // PCM format (default s16le)
                .audioChannels(targetChannels)  // Channels
                .audioFrequency(targetSampleRate)      // Sample rate
                .audioCodec('pcm_s16le')   // PCM codec
                .outputOptions([
                    `-ar ${targetSampleRate}`,
                    `-ac ${targetChannels}`,
                    `-f ${targetFormat}`
                ])
                .on('start', (commandLine) => {
                    if (this.debugMode) {
                        console.log('FFmpeg command:', commandLine);
                    }
                })
                .on('progress', (progress) => {
                    if (this.debugMode) {
                        console.log(`Progress: ${progress.percent || 0}%`);
                    }
                })
                .on('end', () => {
                    try {
                        const pcmBuffer = fs.readFileSync(tempPcm);
                        const hash = crypto.createHash('md5').update(pcmBuffer).digest('hex');
                        
                        console.log(`✅ PCM conversion complete: ${pcmBuffer.length} bytes (MD5: ${hash.substring(0, 8)})`);

                        // Save for debugging if enabled
                        if (this.saveIntermediateFiles) {
                            const debugPath = path.join(this.tempDir, `debug_pcm_${tempId}.raw`);
                            fs.copyFileSync(tempPcm, debugPath);
                            console.log(`💾 Saved debug PCM: ${debugPath}`);
                        }

                        // Cleanup
                        this.cleanupFile(tempMp3);
                        if (!this.saveIntermediateFiles) {
                            this.cleanupFile(tempPcm);
                        }

                        resolve(pcmBuffer);
                    } catch (error) {
                        console.error('❌ Error reading PCM file:', error);
                        this.cleanupFile(tempMp3);
                        this.cleanupFile(tempPcm);
                        reject(error);
                    }
                })
                .on('error', (err) => {
                    console.error('❌ FFmpeg conversion error:', err.message);
                    this.cleanupFile(tempMp3);
                    this.cleanupFile(tempPcm);
                    reject(err);
                })
                .save(tempPcm);
        });
    }

    /**
     * Convert PCM to G.711 μ-law (PCMU)
     * @param {Buffer} pcmBuffer - Input PCM audio (16-bit, 8kHz, mono)
     * @returns {Promise<Buffer>} G.711 μ-law buffer
     */
    async pcmToMulaw(pcmBuffer) {
        return new Promise((resolve, reject) => {
            const tempId = Date.now();
            const tempPcm = path.join(this.tempDir, `pcm_in_${tempId}.raw`);
            const tempMulaw = path.join(this.tempDir, `mulaw_${tempId}.raw`);

            // Write PCM to temp file
            fs.writeFileSync(tempPcm, pcmBuffer);

            console.log('🔄 Converting PCM to G.711 μ-law...');

            ffmpeg(tempPcm)
                .inputFormat('s16le')
                .inputOptions([
                    '-ar 8000',            // Input sample rate
                    '-ac 1',               // Mono
                    '-f s16le'             // Input format
                ])
                .audioCodec('pcm_mulaw')   // G.711 μ-law
                .audioChannels(1)          // Mono
                .audioFrequency(8000)      // 8kHz
                .format('mulaw')           // Output format
                .outputOptions([
                    '-ar 8000',            // Sample rate
                    '-ac 1',               // Mono channel
                    '-f mulaw'             // Format
                ])
                .on('start', (commandLine) => {
                    if (this.debugMode) {
                        console.log('FFmpeg command:', commandLine);
                    }
                })
                .on('end', () => {
                    try {
                        const mulawBuffer = fs.readFileSync(tempMulaw);
                        const hash = crypto.createHash('md5').update(mulawBuffer).digest('hex');
                        
                        console.log(`✅ G.711 μ-law conversion complete: ${mulawBuffer.length} bytes (MD5: ${hash.substring(0, 8)})`);

                        // Verify buffer size (should be exactly half of input PCM)
                        const expectedSize = pcmBuffer.length / 2;
                        if (Math.abs(mulawBuffer.length - expectedSize) > 100) {
                            console.warn(`⚠️ Unexpected size: expected ~${expectedSize}, got ${mulawBuffer.length}`);
                        }

                        // Save for debugging if enabled
                        if (this.saveIntermediateFiles) {
                            const debugPath = path.join(this.tempDir, `debug_mulaw_${tempId}.raw`);
                            fs.copyFileSync(tempMulaw, debugPath);
                            console.log(`💾 Saved debug μ-law: ${debugPath}`);
                        }

                        // Cleanup
                        this.cleanupFile(tempPcm);
                        if (!this.saveIntermediateFiles) {
                            this.cleanupFile(tempMulaw);
                        }

                        resolve(mulawBuffer);
                    } catch (error) {
                        console.error('❌ Error reading μ-law file:', error);
                        this.cleanupFile(tempPcm);
                        this.cleanupFile(tempMulaw);
                        reject(error);
                    }
                })
                .on('error', (err) => {
                    console.error('❌ FFmpeg μ-law conversion error:', err.message);
                    this.cleanupFile(tempPcm);
                    this.cleanupFile(tempMulaw);
                    reject(err);
                })
                .save(tempMulaw);
        });
    }

    /**
     * Convert PCM to G.711 a-law (PCMA) - fallback option
     * @param {Buffer} pcmBuffer - Input PCM audio
     * @returns {Promise<Buffer>} G.711 a-law buffer
     */
    async pcmToAlaw(pcmBuffer) {
        return new Promise((resolve, reject) => {
            const tempId = Date.now();
            const tempPcm = path.join(this.tempDir, `pcm_in_${tempId}.raw`);
            const tempAlaw = path.join(this.tempDir, `alaw_${tempId}.raw`);

            fs.writeFileSync(tempPcm, pcmBuffer);

            console.log('🔄 Converting PCM to G.711 a-law...');

            ffmpeg(tempPcm)
                .inputFormat('s16le')
                .inputOptions(['-ar 8000', '-ac 1', '-f s16le'])
                .audioCodec('pcm_alaw')
                .audioChannels(1)
                .audioFrequency(8000)
                .format('alaw')
                .outputOptions(['-ar 8000', '-ac 1', '-f alaw'])
                .on('end', () => {
                    try {
                        const alawBuffer = fs.readFileSync(tempAlaw);
                        console.log(`✅ G.711 a-law conversion complete: ${alawBuffer.length} bytes`);
                        
                        if (this.saveIntermediateFiles) {
                            const debugPath = path.join(this.tempDir, `debug_alaw_${tempId}.raw`);
                            fs.copyFileSync(tempAlaw, debugPath);
                        }

                        this.cleanupFile(tempPcm);
                        if (!this.saveIntermediateFiles) {
                            this.cleanupFile(tempAlaw);
                        }

                        resolve(alawBuffer);
                    } catch (error) {
                        this.cleanupFile(tempPcm);
                        this.cleanupFile(tempAlaw);
                        reject(error);
                    }
                })
                .on('error', (err) => {
                    this.cleanupFile(tempPcm);
                    this.cleanupFile(tempAlaw);
                    reject(err);
                })
                .save(tempAlaw);
        });
    }

    /**
     * Complete conversion: MP3 → PCM → G.711 (μ-law or a-law)
     * @param {Buffer} mp3Buffer - Input MP3 from OpenAI TTS
     * @param {string} codec - 'PCMU' for μ-law (default) or 'PCMA' for a-law
     * @returns {Promise<Object>} { pcm, g711, duration, checksums, codec }
     */
    async convertMP3ToG711(mp3Buffer, codec = 'PCMU') {
        try {
            console.log('\n🎵 Starting audio codec conversion pipeline...');
            console.log(`📊 Input: ${mp3Buffer.length} bytes (MP3)`);

            // Step 1: MP3 to PCM
            const pcmSampleRate = 8000;
            const pcmChannels = 1;
            const bytesPerSample = 2 * pcmChannels; // 16-bit per channel

            const pcmBuffer = await this.mp3ToPCM(mp3Buffer, {
                sampleRate: pcmSampleRate,
                channels: pcmChannels,
                format: 's16le'
            });
            const duration = pcmBuffer.length / (pcmSampleRate * bytesPerSample);

            // Step 2: PCM to G.711 (μ-law or a-law)
            const upperCodec = (codec || 'PCMU').toUpperCase();
            let g711Buffer;

            if (upperCodec === 'PCMA') {
                console.log('🎚 Using G.711 a-law (PCMA) for outbound audio');
                g711Buffer = await this.pcmToAlaw(pcmBuffer);
            } else {
                console.log('🎚 Using G.711 μ-law (PCMU) for outbound audio');
                g711Buffer = await this.pcmToMulaw(pcmBuffer);
            }

            // Calculate checksums for verification
            const mp3Hash = crypto.createHash('md5').update(mp3Buffer).digest('hex');
            const pcmHash = crypto.createHash('md5').update(pcmBuffer).digest('hex');
            const g711Hash = crypto.createHash('md5').update(g711Buffer).digest('hex');

            console.log('\n✅ Audio conversion pipeline complete!');
            console.log(`📊 Results:`);
            console.log(`   MP3: ${mp3Buffer.length} bytes (MD5: ${mp3Hash.substring(0, 8)})`);
            console.log(`   PCM: ${pcmBuffer.length} bytes (MD5: ${pcmHash.substring(0, 8)})`);
            console.log(`   G.711 (${upperCodec}): ${g711Buffer.length} bytes (MD5: ${g711Hash.substring(0, 8)})`);
            console.log(`   Duration: ${duration.toFixed(2)}s`);

            // Save final result if debug mode
            if (this.saveIntermediateFiles) {
                const finalPath = path.join(this.tempDir, `final_g711_${upperCodec}_${Date.now()}.raw`);
                fs.writeFileSync(finalPath, g711Buffer);
                console.log(`💾 Saved final G.711 (${upperCodec}): ${finalPath}`);
            }

            return {
                pcm: pcmBuffer,
                g711: g711Buffer,
                duration: duration,
                checksums: {
                    mp3: mp3Hash,
                    pcm: pcmHash,
                    g711: g711Hash
                },
                codec: upperCodec
            };

        } catch (error) {
            console.error('❌ Audio conversion failed:', error);
            throw error;
        }
    }

    /**
     * Decode G.711 μ-law to PCM
     * @param {Buffer} mulawBuffer - G.711 μ-law audio
     * @returns {Promise<Buffer>} PCM audio buffer
     */
    async mulawToPCM(mulawBuffer) {
        return new Promise((resolve, reject) => {
            const tempId = Date.now();
            const tempMulaw = path.join(this.tempDir, `mulaw_in_${tempId}.raw`);
            const tempPcm = path.join(this.tempDir, `pcm_out_${tempId}.raw`);

            fs.writeFileSync(tempMulaw, mulawBuffer);

            console.log('🔄 Converting G.711 μ-law to PCM...');

            ffmpeg(tempMulaw)
                .inputFormat('mulaw')
                .inputOptions(['-ar 8000', '-ac 1', '-f mulaw'])
                .audioCodec('pcm_s16le')
                .audioChannels(1)
                .audioFrequency(8000)
                .format('s16le')
                .outputOptions(['-ar 8000', '-ac 1', '-f s16le'])
                .on('end', () => {
                    try {
                        const pcmBuffer = fs.readFileSync(tempPcm);
                        console.log(`✅ μ-law to PCM complete: ${pcmBuffer.length} bytes`);
                        
                        this.cleanupFile(tempMulaw);
                        if (!this.saveIntermediateFiles) {
                            this.cleanupFile(tempPcm);
                        }

                        resolve(pcmBuffer);
                    } catch (error) {
                        this.cleanupFile(tempMulaw);
                        this.cleanupFile(tempPcm);
                        reject(error);
                    }
                })
                .on('error', (err) => {
                    this.cleanupFile(tempMulaw);
                    this.cleanupFile(tempPcm);
                    reject(err);
                })
                .save(tempPcm);
        });
    }

    /**
     * Decode G.711 a-law to PCM
     * @param {Buffer} alawBuffer - G.711 a-law audio
     * @returns {Promise<Buffer>} PCM audio buffer
     */
    async alawToPCM(alawBuffer) {
        return new Promise((resolve, reject) => {
            const tempId = Date.now();
            const tempAlaw = path.join(this.tempDir, `alaw_in_${tempId}.raw`);
            const tempPcm = path.join(this.tempDir, `pcm_out_${tempId}.raw`);

            fs.writeFileSync(tempAlaw, alawBuffer);

            console.log('🔄 Converting G.711 a-law to PCM...');

            ffmpeg(tempAlaw)
                .inputFormat('alaw')
                .inputOptions(['-ar 8000', '-ac 1', '-f alaw'])
                .audioCodec('pcm_s16le')
                .audioChannels(1)
                .audioFrequency(8000)
                .format('s16le')
                .outputOptions(['-ar 8000', '-ac 1', '-f s16le'])
                .on('end', () => {
                    try {
                        const pcmBuffer = fs.readFileSync(tempPcm);
                        console.log(`✅ a-law to PCM complete: ${pcmBuffer.length} bytes`);

                        this.cleanupFile(tempAlaw);
                        if (!this.saveIntermediateFiles) {
                            this.cleanupFile(tempPcm);
                        }

                        resolve(pcmBuffer);
                    } catch (error) {
                        this.cleanupFile(tempAlaw);
                        this.cleanupFile(tempPcm);
                        reject(error);
                    }
                })
                .on('error', (err) => {
                    this.cleanupFile(tempAlaw);
                    this.cleanupFile(tempPcm);
                    reject(err);
                })
                .save(tempPcm);
        });
    }

    /**
     * Convert PCM to WAV for OpenAI Whisper
     * @param {Buffer} pcmBuffer - PCM audio buffer
     * @returns {Promise<Buffer>} WAV audio buffer
     */
    async pcmToWAV(pcmBuffer, options = {}) {
        return new Promise((resolve, reject) => {
            const tempId = Date.now();
            const tempPcm = path.join(this.tempDir, `pcm_wav_${tempId}.raw`);
            const tempWav = path.join(this.tempDir, `output_${tempId}.wav`);

            fs.writeFileSync(tempPcm, pcmBuffer);

            const sourceSampleRate = options.sourceSampleRate || 8000;
            const targetSampleRate = options.targetSampleRate || 16000;
            const channels = options.channels || 1;

            console.log(`🔄 Converting PCM to WAV for Whisper (source ${sourceSampleRate}Hz → target ${targetSampleRate}Hz)...`);

            ffmpeg(tempPcm)
                .inputFormat('s16le')
                .inputOptions([`-ar ${sourceSampleRate}`, `-ac ${channels}`, '-f s16le'])
                .audioCodec('pcm_s16le')
                .audioChannels(channels)
                .audioFrequency(targetSampleRate)  // Whisper prefers 16kHz by default
                .format('wav')
                .on('end', () => {
                    try {
                        const wavBuffer = fs.readFileSync(tempWav);
                        console.log(`✅ WAV conversion complete: ${wavBuffer.length} bytes`);
                        
                        this.cleanupFile(tempPcm);
                        this.cleanupFile(tempWav);
                        
                        resolve(wavBuffer);
                    } catch (error) {
                        this.cleanupFile(tempPcm);
                        this.cleanupFile(tempWav);
                        reject(error);
                    }
                })
                .on('error', (err) => {
                    this.cleanupFile(tempPcm);
                    this.cleanupFile(tempWav);
                    reject(err);
                })
                .save(tempWav);
        });
    }

    /**
     * Convert G.711 μ-law chunk to Linear PCM in real-time (pure JavaScript)
     * Fast conversion for streaming - no file I/O
     * @param {Buffer} mulawChunk - G.711 μ-law audio chunk
     * @returns {Buffer} Linear PCM 16-bit audio chunk
     */
    mulawToPCMChunk(mulawChunk) {
        const pcmBuffer = Buffer.alloc(mulawChunk.length * 2); // 16-bit = 2 bytes per sample
        
        for (let i = 0; i < mulawChunk.length; i++) {
            const mulawByte = mulawChunk[i];
            
            // Decode μ-law to linear PCM (ITU-T G.711 standard)
            // Invert all bits
            const inverted = mulawByte ^ 0xFF;
            
            // Extract sign, exponent, and mantissa
            const sign = (inverted & 0x80) ? -1 : 1;
            const exponent = (inverted >> 4) & 0x07;
            const mantissa = (inverted & 0x0F) | 0x10; // Add implicit leading 1
            
            // Reconstruct linear value: (mantissa << (exponent + 3)) - 33
            let linear = (mantissa << (exponent + 3)) - 33;
            
            // Apply sign
            const pcmValue = sign * linear;
            
            // Clamp to 16-bit range and write as little-endian
            const clamped = Math.max(-32768, Math.min(32767, pcmValue));
            pcmBuffer.writeInt16LE(clamped, i * 2);
        }
        
        return pcmBuffer;
    }

    /**
     * Convert G.711 a-law chunk to Linear PCM in real-time (pure JavaScript)
     * Fast conversion for streaming - no file I/O
     * @param {Buffer} alawChunk - G.711 a-law audio chunk
     * @returns {Buffer} Linear PCM 16-bit audio chunk
     */
    alawToPCMChunk(alawChunk) {
        const pcmBuffer = Buffer.alloc(alawChunk.length * 2); // 16-bit = 2 bytes per sample
        
        for (let i = 0; i < alawChunk.length; i++) {
            const alawByte = alawChunk[i] ^ 0x55; // Invert even bits
            
            // Decode a-law to linear PCM
            const sign = (alawByte & 0x80) ? -1 : 1;
            const exponent = (alawByte >> 4) & 0x07;
            const mantissa = alawByte & 0x0F;
            
            // Reconstruct linear value
            let linear;
            if (exponent === 0) {
                linear = (mantissa << 4) + 8;
            } else {
                linear = ((mantissa << 4) + 264) << (exponent - 1);
            }
            
            // Apply sign and convert to 16-bit signed integer
            const pcmValue = sign * linear;
            
            // Clamp to 16-bit range and write as little-endian
            const clamped = Math.max(-32768, Math.min(32767, pcmValue));
            pcmBuffer.writeInt16LE(clamped, i * 2);
        }
        
        return pcmBuffer;
    }

    /**
     * Cleanup temporary file
     * @param {string} filePath - Path to file to delete
     */
    cleanupFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            // Ignore cleanup errors
        }
    }

    /**
     * Cleanup all temporary files
     */
    cleanupAll() {
        try {
            const files = fs.readdirSync(this.tempDir);
            for (const file of files) {
                const filePath = path.join(this.tempDir, file);
                if (fs.statSync(filePath).isFile()) {
                    // Only delete temp files older than 1 hour
                    const stats = fs.statSync(filePath);
                    const age = Date.now() - stats.mtimeMs;
                    if (age > 3600000) { // 1 hour
                        fs.unlinkSync(filePath);
                    }
                }
            }
        } catch (error) {
            console.error('Error cleaning up temp files:', error);
        }
    }
}

module.exports = AudioCodec;

