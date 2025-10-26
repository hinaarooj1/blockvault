/**
 * Get the backend URL for Socket.io connections
 * Uses domain-matched API URLs to avoid third-party cookie issues
 * 
 * @returns {string} Backend URL for Socket.io
 */
export const getSocketBackendUrl = () => {
  const hostname = window.location.hostname;
  const isProduction = window.location.protocol === "https:" && !hostname.includes("localhost");

  // First, try to use REACT_APP_API_URL if set
  if (process.env.REACT_APP_API_URL) {
    try {
      const url = new URL(process.env.REACT_APP_API_URL);
      return `${url.protocol}//${url.host}`;
    } catch (e) {
      // Invalid URL, continue to next options
    }
  }

  // Use domain-specific API URLs in production
  if (isProduction) { 


    if (hostname.includes("blockvault.pro")) {
      return 'https://api.blockvault.pro';
    }
  }

  // Development fallback
  return 'http://localhost:5000';
};

/**
 * Default Socket.io connection options
 */
export const socketOptions = {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
};

