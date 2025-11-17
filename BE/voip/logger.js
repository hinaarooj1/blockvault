/**
 * Logger utility with timestamps and performance tracking
 */

class Logger {
    constructor() {
        this.startTimes = new Map();
    }

    /**
     * Get formatted timestamp
     */
    getTimestamp() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${ms}`;
    }

    /**
     * Get elapsed time since start
     */
    getElapsed(startKey) {
        if (!this.startTimes.has(startKey)) {
            return null;
        }
        const elapsed = Date.now() - this.startTimes.get(startKey);
        return `${elapsed}ms`;
    }

    /**
     * Start timing an operation
     */
    startTiming(key) {
        this.startTimes.set(key, Date.now());
    }

    /**
     * End timing and get elapsed
     */
    endTiming(key) {
        const elapsed = this.getElapsed(key);
        this.startTimes.delete(key);
        return elapsed;
    }

    /**
     * Log with timestamp
     */
    log(message, timingKey = null) {
        const timestamp = this.getTimestamp();
        const timing = timingKey ? ` [${this.getElapsed(timingKey)}]` : '';
        console.log(`[${timestamp}]${timing} ${message}`);
    }

    /**
     * Error with timestamp
     */
    error(message, timingKey = null) {
        const timestamp = this.getTimestamp();
        const timing = timingKey ? ` [${this.getElapsed(timingKey)}]` : '';
        console.error(`[${timestamp}]${timing} ${message}`);
    }

    /**
     * Warn with timestamp
     */
    warn(message, timingKey = null) {
        const timestamp = this.getTimestamp();
        const timing = timingKey ? ` [${this.getElapsed(timingKey)}]` : '';
        console.warn(`[${timestamp}]${timing} ${message}`);
    }
}

// Export singleton instance
module.exports = new Logger();

