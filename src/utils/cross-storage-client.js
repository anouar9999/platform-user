import crossStorage from 'cross-storage';

// Configuration for your storage hubs
const STORAGE_HUBS = {
  // Your React app (login app)
  REACT_APP: 'https://your-react-app.com/storage-hub.html',  // Replace with actual URL
  // Your Next.js app (dashboard app)
  NEXTJS_APP: 'https://your-nextjs-app.com/storage-hub.html' // Replace with actual URL
};

class CrossStorageClient {
  constructor() {
    this._clients = {};
    this._connected = false;
    this._connectPromise = null;
    this._primaryHub = null;
    this._authData = null;
  }

  // Connect to the appropriate storage hub based on the current URL
  async connect() {
    if (this._connected) return Promise.resolve();
    
    if (this._connectPromise) return this._connectPromise;
    
    this._connectPromise = new Promise(async (resolve, reject) => {
      try {
        // Determine if we're on React or Next.js domain
        const currentDomain = window.location.origin;
        
        // Set primary hub (the one we're not on)
        this._primaryHub = 
          currentDomain.includes(new URL(STORAGE_HUBS.REACT_APP).hostname) 
            ? STORAGE_HUBS.NEXTJS_APP 
            : STORAGE_HUBS.REACT_APP;
            
        // Connect to the primary hub
        this._clients.primary = new crossStorage.CrossStorageClient(this._primaryHub);
        await this._clients.primary.onConnect();
        
        console.log('Connected to cross-storage hub:', this._primaryHub);
        this._connected = true;
        resolve();
      } catch (error) {
        console.error('Failed to connect to cross-storage hub:', error);
        this._connectPromise = null;
        reject(error);
      }
    });
    
    return this._connectPromise;
  }

  // Set auth data in cross-storage and local AuthStorage
  async setUserData(userData) {
    if (!userData) return false;
    
    try {
      // First set in local storage using your existing AuthStorage
      window.AuthStorage.setUserData(userData);
      
      // Then try to set in cross-storage
      await this.connect();
      
      // Store each field individually in cross-storage
      const promises = Object.entries(userData).map(([key, value]) => 
        this._clients.primary.set(key, value)
      );
      
      await Promise.all(promises);
      console.log('User data successfully saved to cross-storage');
      
      return true;
    } catch (error) {
      console.error('Error setting user data in cross-storage:', error);
      // Even if cross-storage fails, local storage worked, so return true
      return true;
    }
  }

  // Get auth data from cross-storage or fall back to local AuthStorage
  async getUserData() {
    // Try local storage first
    const localData = window.AuthStorage.getUserData();
    if (localData) {
      this._authData = localData;
      return localData;
    }
    
    // If not found locally, try to get from cross-storage
    try {
      await this.connect();
      
      const fields = ["userSessionToken", "userId", "username", "userType", "avatarUrl"];
      const values = await Promise.all(
        fields.map(key => this._clients.primary.get(key))
      );
      
      const userData = {};
      fields.forEach((key, index) => {
        if (values[index]) {
          userData[key] = values[index];
        }
      });
      
      // If we got anything from cross-storage, save it locally
      if (Object.keys(userData).length > 0) {
        window.AuthStorage.setUserData(userData);
        this._authData = userData;
        return userData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user data from cross-storage:', error);
      return null;
    }
  }

  // Check if user is authenticated (in either storage)
  async isAuthenticated() {
    // Try to get from memory cache first
    if (this._authData && this._authData.userSessionToken) {
      return true;
    }
    
    // Check local storage
    if (window.AuthStorage.isAuthenticated()) {
      return true;
    }
    
    // Finally check cross-storage
    try {
      const userData = await this.getUserData();
      return !!(userData && userData.userSessionToken);
    } catch (error) {
      console.error('Error checking authentication in cross-storage:', error);
      return false;
    }
  }

  // Clear auth data from both storages
  async clearUserData() {
    // Clear local storage
    window.AuthStorage.clearUserData();
    this._authData = null;
    
    // Clear cross-storage
    try {
      await this.connect();
      
      const fields = ["userSessionToken", "userId", "username", "userType", "avatarUrl"];
      const promises = fields.map(key => this._clients.primary.del(key));
      
      await Promise.all(promises);
      console.log('User data successfully cleared from cross-storage');
      
      return true;
    } catch (error) {
      console.error('Error clearing user data from cross-storage:', error);
      // Even if cross-storage fails, local storage was cleared, so return true
      return true;
    }
  }
}

// Create and export singleton instance
const crossStorageClient = new CrossStorageClient();
export default crossStorageClient;