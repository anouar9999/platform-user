export class SharedDataManager {
    constructor(channelName = 'auth-data-sync') {
      this.channel = new BroadcastChannel(channelName);
      this.data = new Map();
      this.listeners = new Set();
      
      // Bind methods to preserve context
      this.handleMessage = this.handleMessage.bind(this);
      this.destroy = this.destroy.bind(this);
      
      this.channel.addEventListener('message', this.handleMessage);
      
      // Request initial data from other windows
      this.requestInitialData();
      
      console.log('🔧 SharedDataManager initialized');
    }
    
    handleMessage(event) {
      const { type, key, value, requestId, snapshot } = event.data;
      console.log('🔧 SharedDataManager received message:', event.data);
      
      switch(type) {
        case 'set':
          this.data.set(key, value);
          this.notifyListeners('set', key, value);
          break;
          
        case 'delete':
          this.data.delete(key);
          this.notifyListeners('delete', key);
          break;
          
        case 'clear':
          this.data.clear();
          this.notifyListeners('clear');
          break;
          
        case 'request-data':
          this.sendDataSnapshot(requestId);
          break;
          
        case 'data-snapshot':
          if (this.data.size === 0 && snapshot) {
            console.log('🔧 Applying data snapshot:', snapshot);
            Object.entries(snapshot).forEach(([key, value]) => {
              this.data.set(key, value);
            });
            this.notifyListeners('sync', null, snapshot);
          }
          break;
          
        case 'auth-success':
          this.set('authData', value);
          this.notifyListeners('auth-success', 'authData', value);
          break;
          
        case 'logout':
          this.delete('authData');
          this.notifyListeners('logout');
          break;
      }
    }
    
    // Subscribe to data changes
    subscribe(callback) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }
    
    // Notify all listeners of changes
    notifyListeners(type, key, value) {
      this.listeners.forEach(callback => {
        try {
          callback(type, key, value);
        } catch (error) {
          console.error('Error in SharedDataManager listener:', error);
        }
      });
    }
    
    set(key, value) {
      console.log('🔧 SharedDataManager.set:', key, value);
      this.data.set(key, value);
      this.channel.postMessage({ type: 'set', key, value });
      this.notifyListeners('set', key, value);
    }
    
    get(key) {
      return this.data.get(key);
    }
    
    delete(key) {
      console.log('🔧 SharedDataManager.delete:', key);
      this.data.delete(key);
      this.channel.postMessage({ type: 'delete', key });
      this.notifyListeners('delete', key);
    }
    
    clear() {
      console.log('🔧 SharedDataManager.clear');
      this.data.clear();
      this.channel.postMessage({ type: 'clear' });
      this.notifyListeners('clear');
    }
    
    has(key) {
      return this.data.has(key);
    }
    
    getAll() {
      return Object.fromEntries(this.data);
    }
    
    // Auth-specific methods
    setAuthData(userData) {
      console.log('🔧 SharedDataManager.setAuthData:', userData);
      this.set('authData', userData);
      // Also broadcast auth success to other windows
      this.channel.postMessage({ type: 'auth-success', value: userData });
    }
    
    getAuthData() {
      return this.get('authData');
    }
    
    clearAuthData() {
      console.log('🔧 SharedDataManager.clearAuthData');
      this.delete('authData');
      this.channel.postMessage({ type: 'logout' });
    }
    
    requestInitialData() {
      const requestId = `${Date.now()}-${Math.random()}`;
      console.log('🔧 Requesting initial data, requestId:', requestId);
      this.channel.postMessage({ type: 'request-data', requestId });
    }
    
    sendDataSnapshot(requestId) {
      const snapshot = this.getAll();
      console.log('🔧 Sending data snapshot:', { requestId, snapshot });
      this.channel.postMessage({
        type: 'data-snapshot',
        requestId,
        snapshot
      });
    }
    
    destroy() {
      console.log('🔧 SharedDataManager.destroy');
      this.listeners.clear();
      this.channel.removeEventListener('message', this.handleMessage);
      this.channel.close();
    }
  }