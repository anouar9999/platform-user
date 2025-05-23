class AuthService {
    constructor() {
      this.authData = null;
      this.listeners = [];
      console.log('[AuthService] Initializing...');
      this.initializeAuth();
    }
  
    initializeAuth() {
      // Check for existing auth data
      console.log('[AuthService] Checking localStorage for auth data...');
      
      // Check both possible storage keys
      const authDataStr = localStorage.getItem('authData');
      const sessionToken = localStorage.getItem('userSessionToken');
      
      console.log('[AuthService] Found authData:', authDataStr ? 'Yes' : 'No');
      console.log('[AuthService] Found sessionToken:', sessionToken ? 'Yes' : 'No');
      
      if (authDataStr) {
        try {
          const parsed = JSON.parse(authDataStr);
          console.log('[AuthService] Parsed auth data:', parsed);
          
          // Check if token is not expired (24 hours)
          if (parsed.timestamp && (new Date().getTime() - parsed.timestamp) < 24 * 60 * 60 * 1000) {
            this.authData = parsed;
            console.log('[AuthService] Auth data is valid and not expired');
          } else {
            console.log('[AuthService] Auth data is expired');
            this.clearAuth();
          }
        } catch (e) {
          console.error('[AuthService] Failed to parse auth data:', e);
          this.clearAuth();
        }
      } else if (sessionToken) {
        // Fallback: Try to reconstruct from individual localStorage items
        console.log('[AuthService] Trying to reconstruct from individual items...');
        const userData = {
          sessionToken: sessionToken,
          userId: localStorage.getItem('userId'),
          username: localStorage.getItem('username'),
          userType: localStorage.getItem('userType'),
          avatarUrl: localStorage.getItem('avatarUrl'),
          timestamp: new Date().getTime()
        };
        
        if (userData.username) {
          console.log('[AuthService] Reconstructed user data:', userData);
          this.setAuth(userData);
        }
      }
  
      // Set up listeners
      this.setupListeners();
    }
  
    setupListeners() {
      // Listen for auth changes across tabs
      console.log('[AuthService] Setting up BroadcastChannel listener...');
      const channel = new BroadcastChannel('auth_channel');
      channel.onmessage = (event) => {
        console.log('[AuthService] Received broadcast message:', event.data);
        if (event.data.type === 'login') {
          this.authData = event.data.data;
          this.notifyListeners('login', this.authData);
        } else if (event.data.type === 'logout' || event.data.type === 'LOGOUT') {
          this.clearAuth();
          this.notifyListeners('logout');
        }
      };
  
      // Listen for storage changes (fallback for older browsers)
      window.addEventListener('storage', (e) => {
        console.log('[AuthService] Storage event:', e.key, e.newValue);
        if (e.key === 'authData') {
          if (e.newValue) {
            try {
              this.authData = JSON.parse(e.newValue);
              console.log('[AuthService] Updated auth data from storage:', this.authData);
              this.notifyListeners('login', this.authData);
            } catch (err) {
              console.error('[AuthService] Failed to parse auth data from storage:', err);
            }
          } else {
            console.log('[AuthService] Auth data removed from storage');
            this.clearAuth();
            this.notifyListeners('logout');
          }
        }
      });
  
      // Listen for cross-origin messages
      window.addEventListener('message', (event) => {
        console.log('[AuthService] Received postMessage:', event.origin, event.data);
        
        // Verify origin - update with your actual domains
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];
        if (!allowedOrigins.includes(event.origin)) {
          console.log('[AuthService] Rejected message from unauthorized origin:', event.origin);
          return;
        }
  
        if (event.data.type === 'auth_success') {
          console.log('[AuthService] Processing auth_success message');
          this.setAuth(event.data.data);
        }
      });
    }
  
    setAuth(authData) {
      console.log('[AuthService] Setting auth data:', authData);
      this.authData = authData;
      
      // Store complete auth data
      localStorage.setItem('authData', JSON.stringify({
        ...authData,
        timestamp: authData.timestamp || new Date().getTime()
      }));
      
      // Also store individual items for compatibility
      if (authData.sessionToken) localStorage.setItem('userSessionToken', authData.sessionToken);
      if (authData.userId) localStorage.setItem('userId', authData.userId);
      if (authData.username) localStorage.setItem('username', authData.username);
      if (authData.userType) localStorage.setItem('userType', authData.userType);
      if (authData.avatarUrl) localStorage.setItem('avatarUrl', authData.avatarUrl);
      
      this.notifyListeners('login', authData);
    }
  
    clearAuth() {
      console.log('[AuthService] Clearing auth data');
      this.authData = null;
      
      // Clear all auth-related items
      localStorage.removeItem('authData');
      localStorage.removeItem('userSessionToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('userType');
      localStorage.removeItem('avatarUrl');
    }
  
    getAuth() {
      console.log('[AuthService] Getting auth data:', this.authData);
      return this.authData;
    }
  
    getSessionToken() {
      const token = this.authData?.sessionToken || localStorage.getItem('userSessionToken');
      console.log('[AuthService] Getting session token:', token ? 'Found' : 'Not found');
      return token;
    }
  
    isAuthenticated() {
      const isAuth = !!this.getSessionToken();
      console.log('[AuthService] Is authenticated:', isAuth);
      return isAuth;
    }
  
    logout() {
      console.log('[AuthService] Logging out...');
      this.clearAuth();
      
      // Broadcast logout
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage({ type: 'LOGOUT' });
      channel.close();
  
      this.notifyListeners('logout');
      
      // Redirect to login
      window.location.href = 'http://localhost:3000/login';
    }
  
    // Observer pattern for auth changes
    subscribe(callback) {
      console.log('[AuthService] New subscriber added');
      this.listeners.push(callback);
      // Return unsubscribe function
      return () => {
        this.listeners = this.listeners.filter(cb => cb !== callback);
        console.log('[AuthService] Subscriber removed');
      };
    }
  
    notifyListeners(type, data) {
      console.log(`[AuthService] Notifying ${this.listeners.length} listeners:`, type, data);
      this.listeners.forEach(callback => callback({ type, data }));
    }
  }
  
  // Create and export a single instance
  const authService = new AuthService();
  
  // Make it available globally for debugging
  if (typeof window !== 'undefined') {
    window.authService = authService;
  }
  
  export default authService;