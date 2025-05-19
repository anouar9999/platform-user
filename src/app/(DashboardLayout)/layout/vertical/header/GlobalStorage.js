// GlobalStorage.js
import crossStorageClient from '../../../../../utils/cross-storage-client';
const AuthStorage = {
  // Configuration for domains and their cookie settings
  config: {
    domains: {
      'mgexpo.ma': {
        cookieDomain: '.mgexpo.ma',
        sameSite: 'Lax'
      },
      // Localhost configuration
      'localhost': {
        cookieDomain: 'localhost',
        sameSite: 'Lax'
      },
      // Add Next.js domain here
      'http://localhost:3000/': {
        cookieDomain: '.your-nextjs-domain.com',
        sameSite: 'Lax'
      }
    },
    // Default configuration if no domain matches
    default: {
      cookieDomain: undefined,
      sameSite: 'Lax'
    }
  },
  
  // Get domain configuration based on current hostname
  _getDomainConfig: function() {
    const hostname = window.location.hostname;
    
    // Direct lookup for exact matches like 'localhost'
    if (this.config.domains[hostname]) {
      console.log(`Found exact domain config for ${hostname}`);
      return this.config.domains[hostname];
    }
    
    // For localhost or development environment with IP address
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('Using localhost configuration');
      return this.config.domains['localhost'] || this.config.default;
    }
    
    // Check if the hostname contains any of our configured domains
    for (const domain in this.config.domains) {
      if (hostname.includes(domain)) {
        console.log(`Found domain config for ${domain} in ${hostname}`);
        return this.config.domains[domain];
      }
    }
    
    // Return default configuration if no match
    console.log(`No domain config found for ${hostname}, using default`);
    return this.config.default;
  },
  
  // Store auth data with cookies as primary method and localStorage as backup
  // Also store in cross-storage
  setUserData: async function(userData) {
    // 1. Define fields we want to store
    const fields = Object.keys(userData);
    
    // Get domain configuration
    const domainConfig = this._getDomainConfig();
    
    // 2. First attempt to store in cookies (primary)
    const cookiesEnabled = this._areCookiesEnabled();
    if (cookiesEnabled) {
      fields.forEach(key => {
        this._setCookie(key, userData[key], {
          days: 30,
          path: '/',
          domain: domainConfig.cookieDomain,
          sameSite: domainConfig.sameSite
        });
      });
    }
    
    // 3. Always store in localStorage as backup
    fields.forEach(key => {
      localStorage.setItem(key, userData[key]);
    });
    
    // 4. Also store in memory for immediate access
    this._memoryStorage = {...this._memoryStorage, ...userData};
    
    // 5. Store in cross-storage for cross-domain access
    try {
      await crossStorageClient.setUserData(userData);
    } catch (error) {
      console.error('Failed to store in cross-storage:', error);
      // Continue even if cross-storage fails
    }
    
    return true;
  },
  
  // Get user data from any available source including cross-storage
  getUserData: async function(forceSync = false) {
    // Define fields we want to retrieve
    const fields = ["userSessionToken", "userId", "username", "userType", "avatarUrl"];
    let result = {};
    
    // If not forcing sync with cross-storage, check local sources first
    if (!forceSync) {
      // Check each source in order of reliability
      fields.forEach(key => {
        // 1. First try memory (fastest)
        if (this._memoryStorage && this._memoryStorage[key] !== undefined) {
          result[key] = this._memoryStorage[key];
        }
        // 2. Then try cookies (cross-domain support)
        else if (this._getCookie(key)) {
          result[key] = this._getCookie(key);
        }
        // 3. Then try localStorage (most compatible)
        else if (localStorage.getItem(key)) {
          result[key] = localStorage.getItem(key);
        }
      });
      
      // If we found data locally, return it
      if (Object.keys(result).length > 0) {
        // Update memory for next time
        this._memoryStorage = {...this._memoryStorage, ...result};
        return result;
      }
    }
    
    // 4. If we didn't find data locally or forceSync is true, check cross-storage
    try {
      const crossStorageData = await crossStorageClient.getUserData();
      if (crossStorageData) {
        // Update local storage with data from cross-storage
        this.setUserData(crossStorageData);
        return crossStorageData;
      }
    } catch (error) {
      console.error('Error retrieving from cross-storage:', error);
    }
    
    // Return whatever we have, which might be empty
    return Object.keys(result).length > 0 ? result : null;
  },
  
  // Check if user is authenticated (with cross-storage check)
  isAuthenticated: async function() {
    // First check local
    const userData = this.getUserData();
    if (userData && userData.userSessionToken && userData.userId) {
      return true;
    }
    
    // Then check cross-storage
    try {
      return await crossStorageClient.isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication in cross-storage:', error);
      return false;
    }
  },
  
  // Completely clear all auth data including cross-storage
  clearUserData: async function() {
    const fields = ["userSessionToken", "userId", "username", "userType", "avatarUrl"];
    const domainConfig = this._getDomainConfig();
    
    // Clear cookies - we need to ensure we're removing with the exact same parameters
    // that were used to set them
    fields.forEach(key => {
      // First try to remove with domain-specific configuration
      if (domainConfig.cookieDomain) {
        this._removeCookie(key, {
          path: '/',
          domain: domainConfig.cookieDomain
        });
      }
      
      // Also try removing without domain specification
      // This ensures cookies are cleared even if domain detection changes
      this._removeCookie(key, {
        path: '/'
      });
    });
    
    // Clear localStorage
    fields.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear memory
    this._memoryStorage = {};
    
    // Clear cross-storage
    try {
      await crossStorageClient.clearUserData();
    } catch (error) {
      console.error('Error clearing cross-storage:', error);
      // Continue even if cross-storage fails
    }
    
    return true;
  },
  
  // Add a new domain configuration dynamically
  addDomainConfig: function(domain, config) {
    this.config.domains[domain] = config;
  },
  
  // Synchronize with cross-storage to ensure latest data
  syncWithCrossStorage: async function() {
    try {
      return await this.getUserData(true);
    } catch (error) {
      console.error('Error syncing with cross-storage:', error);
      return null;
    }
  },
  
  // Private methods and properties
  _memoryStorage: {},
  
  _setCookie: function(name, value, options = {}) {
    const defaultOptions = {
      days: 30,
      path: '/',
      sameSite: 'Strict'
    };
    
    const opts = {...defaultOptions, ...options};
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (opts.days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + opts.days * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${expires.toUTCString()}`;
    }
    
    if (opts.path) cookieString += `; path=${opts.path}`;
    if (opts.domain) cookieString += `; domain=${opts.domain}`;
    if (opts.sameSite) cookieString += `; SameSite=${opts.sameSite}`;
    if (opts.secure) cookieString += '; Secure';
    
    document.cookie = cookieString;
  },
  
  _getCookie: function(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${encodeURIComponent(name)}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
  },
  
  _removeCookie: function(name, options = {}) {
    const opts = {
      days: -1, // Expire immediately
      ...options
    };
    
    // To properly remove a cookie, we need to set its value to empty and expiration to the past
    this._setCookie(name, '', opts);
    
    // For some browsers and configurations, we need an additional step to ensure removal
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${opts.path || '/'}${opts.domain ? `; domain=${opts.domain}` : ''}`;
  },
  
  _areCookiesEnabled: function() {
    try {
      document.cookie = "testcookie=1";
      const result = document.cookie.indexOf("testcookie=") !== -1;
      document.cookie = "testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return result;
    } catch (e) {
      return false;
    }
  }
};

// Make globally available
window.AuthStorage = AuthStorage;

export default AuthStorage;