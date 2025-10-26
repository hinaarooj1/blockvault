// src/config.js

// Dynamic API URL based on the current domain
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Check if we're in production by checking the protocol and hostname
  const isProduction = protocol === "https:" && !hostname.includes("localhost");

  // Priority 1: Domain-based routing in production (ALWAYS use this first!)
  if (isProduction) {
 
    if (hostname.includes("blockvault.pro")) {
      return "https://api.blockvault.pro/api/v1";
    }
  }

  // Priority 2: Check for explicit environment variable (fallback for dev/unknown domains)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Priority 3: Development fallback
  return "http://localhost:4000/api";
};

const baseUrl = getBaseUrl();

module.exports = { baseUrl };
