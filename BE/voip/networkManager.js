const dgram = require('dgram');
const axios = require('axios');

// Try to require stun, but make it optional
let stun = null;
try {
    stun = require('stun');
} catch (error) {
    console.log('⚠️ STUN package not available, will use fallback IP detection');
}

class NetworkManager {
    constructor() {
        this.publicIP = null;
        this.localIP = '0.0.0.0';
        this.portPool = new Set();
        // Determine RTP port range (default 10000-20000)
        const defaultRange = { min: 10000, max: 20000 };
        const rangeEnv = process.env.RTP_PORT_RANGE;
        let parsedRange = null;

        if (rangeEnv) {
            const match = rangeEnv.match(/(\d+)\s*-\s*(\d+)/);
            if (match) {
                const min = parseInt(match[1], 10);
                const max = parseInt(match[2], 10);
                if (!Number.isNaN(min) && !Number.isNaN(max) && min < max) {
                    parsedRange = { min, max };
                }
            }
            if (!parsedRange) {
                console.warn(`⚠️ Invalid RTP_PORT_RANGE value "${rangeEnv}". Using default ${defaultRange.min}-${defaultRange.max}.`);
            }
        }

        this.portRange = parsedRange || defaultRange;
        console.log(`🎯 RTP port range set to ${this.portRange.min}-${this.portRange.max}`);

        this.cachedIP = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.lastCacheTime = 0;
        this.requireEvenPorts = process.env.RTP_REQUIRE_EVEN === 'false' ? false : true;
        if (this.requireEvenPorts) {
            console.log('🎯 RTP ports will be allocated as even numbers (symmetrical RTP friendly)');
        }
    }

    /**
     * Detect public IP using STUN server or fallback to api.ipify.org
     * @returns {Promise<string>} Public IP address
     */
    async detectPublicIP() {
        // Return cached IP if still valid
        if (this.cachedIP && (Date.now() - this.lastCacheTime) < this.cacheTimeout) {
            console.log(`🌐 Using cached public IP: ${this.cachedIP}`);
            return this.cachedIP;
        }

        console.log('🌐 Detecting public IP address...');

        try {
            // Try STUN server first (more reliable for NAT traversal)
            const stunIP = await this.detectViaSTUN();
            if (stunIP) {
                this.cachedIP = stunIP;
                this.lastCacheTime = Date.now();
                this.publicIP = stunIP;
                console.log(`✅ Public IP detected via STUN: ${stunIP}`);
                return stunIP;
            }
        } catch (error) {
            console.log(`⚠️ STUN detection failed: ${error.message}, trying fallback...`);
        }

        try {
            // Fallback to api.ipify.org
            const response = await axios.get('https://api.ipify.org?format=json', { timeout: 5000 });
            const ip = response.data.ip;
            
            if (this.isValidIP(ip)) {
                this.cachedIP = ip;
                this.lastCacheTime = Date.now();
                this.publicIP = ip;
                console.log(`✅ Public IP detected via api.ipify.org: ${ip}`);
                return ip;
            }
        } catch (error) {
            console.error(`❌ API IP detection failed: ${error.message}`);
        }

        // Final fallback: use default IP from config
        const fallbackIP = process.env.PUBLIC_IP || '103.134.3.216';
        console.log(`⚠️ Using fallback public IP: ${fallbackIP}`);
        this.publicIP = fallbackIP;
        return fallbackIP;
    }

    /**
     * Detect public IP using STUN protocol
     * @returns {Promise<string|null>} Public IP or null if failed
     */
    async detectViaSTUN() {
        // If STUN is not available, skip it
        if (!stun) {
            return null;
        }

        return new Promise((resolve, reject) => {
            const stunConfig = {
                address: 'stun.l.google.com',
                port: 19302
            };

            const client = stun.createConnection();
            
            const timeout = setTimeout(() => {
                client.close();
                reject(new Error('STUN request timeout'));
            }, 5000);

            client.on('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });

            client.on('response', (response) => {
                clearTimeout(timeout);
                
                if (response && response.getXorAddress) {
                    const addr = response.getXorAddress();
                    if (addr && addr.address) {
                        client.close();
                        resolve(addr.address);
                    } else {
                        client.close();
                        reject(new Error('No address in STUN response'));
                    }
                } else {
                    client.close();
                    reject(new Error('Invalid STUN response'));
                }
            });

            try {
                const request = stun.createMessage(stun.constants.STUN_BINDING_REQUEST);
                client.send(request, stunConfig.port, stunConfig.address);
            } catch (err) {
                clearTimeout(timeout);
                reject(err);
            }
        });
    }

    /**
     * Validate IP address format
     * @param {string} ip - IP address to validate
     * @returns {boolean}
     */
    isValidIP(ip) {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(ip)) return false;
        
        const parts = ip.split('.');
        return parts.every(part => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    }

    /**
     * Get an available port from the pool
     * @returns {number} Available port number
     */
    async getAvailablePort() {
        // Find an available port
        const step = this.requireEvenPorts ? 2 : 1;
        let startPort = this.portRange.min;
        if (this.requireEvenPorts && startPort % 2 !== 0) {
            startPort += 1; // ensure even start
        }

        for (let port = startPort; port <= this.portRange.max; port += step) {
            if (!this.portPool.has(port)) {
                // Test if port is actually available
                if (await this.isPortAvailable(port)) {
                    this.portPool.add(port);
                    console.log(`🔌 Allocated port: ${port}`);
                    return port;
                }
            }
        }
        
        throw new Error('No available ports in range');
    }

    /**
     * Check if a port is available
     * @param {number} port - Port to check
     * @returns {Promise<boolean>}
     */
    async isPortAvailable(port) {
        return new Promise((resolve) => {
            const server = dgram.createSocket('udp4');
            
            server.once('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(false);
                } else {
                    resolve(false);
                }
            });
            
            server.once('listening', () => {
                server.close();
                resolve(true);
            });
            
            server.bind(port);
        });
    }

    /**
     * Release a port back to the pool
     * @param {number} port - Port to release
     */
    releasePort(port) {
        if (this.portPool.has(port)) {
            this.portPool.delete(port);
            console.log(`🔌 Released port: ${port}`);
        }
    }

    /**
     * Get current public IP (cached or detect)
     * @returns {Promise<string>}
     */
    async getPublicIP() {
        if (!this.publicIP) {
            return await this.detectPublicIP();
        }
        return this.publicIP;
    }

    /**
     * Get local IP for binding
     * @returns {string}
     */
    getLocalIP() {
        return this.localIP;
    }

    /**
     * Clear IP cache (force re-detection)
     */
    clearCache() {
        this.cachedIP = null;
        this.lastCacheTime = 0;
        this.publicIP = null;
        console.log('🗑️ IP cache cleared');
    }

    /**
     * Get network diagnostics
     * @returns {Promise<Object>}
     */
    async getDiagnostics() {
        const publicIP = await this.getPublicIP();
        
        return {
            publicIP: publicIP,
            localIP: this.localIP,
            cachedIP: this.cachedIP,
            cacheAge: this.cachedIP ? Date.now() - this.lastCacheTime : 0,
            allocatedPorts: Array.from(this.portPool),
            portCount: this.portPool.size,
            portRange: `${this.portRange.min}-${this.portRange.max}`
        };
    }
}

module.exports = NetworkManager;

