// src/utils/AuthStorage.js

const AuthStorage = {
    // Store auth data with cookies as primary method and localStorage as backup
    setUserData: function(userData) {
      // 1. Define fields we want to store
      const fields = Object.keys(userData);
      
      // 2. First attempt to store in cookies (primary)
      const cookiesEnabled = this._areCookiesEnabled();
      if (cookiesEnabled) {
        fields.forEach(key => {
          this._setCookie(key, userData[key], {
            days: 30,
            path: '/',
            // Use domain for cross-subdomain support
            domain: window.location.hostname.includes('mgexpo.ma') ? '.mgexpo.ma' : undefined,
            sameSite: 'Lax'  // Allows navigation from links on other sites
          });
        });
      }
      
      // 3. Always store in localStorage as backup
      fields.forEach(key => {
        localStorage.setItem(key, userData[key]);
      });
      
      // 4. Also store in memory for immediate access
      this._memoryStorage = {...this._memoryStorage, ...userData};
      
      return true;
    },
    
    // Get user data from any available source
    getUserData: function() {
      // Define fields we want to retrieve
      const fields = ["userSessionToken", "userId", "username", "userType", "avatarUrl"];
      const result = {};
      
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
        // 3. Finally try localStorage (most compatible)
        else if (localStorage.getItem(key)) {
          result[key] = localStorage.getItem(key);
        }
      });
      
      // Update memory for next time
      this._memoryStorage = {...this._memoryStorage, ...result};
      
      return Object.keys(result).length > 0 ? result : null;
    },
    
    // Check if user is authenticated
    isAuthenticated: function() {
      const userData = this.getUserData();
      return userData && userData.userSessionToken && userData.userId;
    },
    
    // Completely clear all auth data
    clearUserData: function() {
      const fields = ["userSessionToken", "userId", "username", "userType", "avatarUrl"];
      
      // Clear cookies
      fields.forEach(key => {
        this._removeCookie(key, {
          path: '/',
          domain: window.location.hostname.includes('mgexpo.ma') ? '.mgexpo.ma' : undefined
        });
      });
      
      // Clear localStorage
      fields.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Clear memory
      this._memoryStorage = {};
      
      return true;
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
      this._setCookie(name, '', opts);
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