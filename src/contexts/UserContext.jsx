import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthStorage from '../app/(DashboardLayout)/layout/vertical/header/GlobalStorage';

// Create the context
const UserContext = createContext(null);

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Helper function to get cookie (for backward compatibility)
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

// Provider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Function to fetch user data
  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to get from local AuthStorage
      let userDataResult = await AuthStorage.getUserData();
      
      // If not found, force sync with cross-storage
      if (!userDataResult || !userDataResult.username) {
        console.log('User data not found locally, checking cross-storage...');
        userDataResult = await AuthStorage.syncWithCrossStorage();
      }
      
      // For backward compatibility, also check cookies
      const cookieToken = getCookie('userSessionToken');
      const cookieUsername = getCookie('username');
      const cookieAvatar = getCookie('avatarUrl');
      
      // Use values from AuthStorage first, fall back to cookies
      const username = userDataResult?.username || cookieUsername;
      const avatar = userDataResult?.avatarUrl || cookieAvatar;
      const type = userDataResult?.userType || '';
      const token = userDataResult?.token || cookieToken;
      
      if (!username || !token) {
        setUserData(null);
        return false;
      } else {
        // User is logged in, update state
        const finalUserData = {
          username,
          avatarUrl: avatar,
          userType: type,
          token,
          ...userDataResult
        };
        
        setUserData(finalUserData);
        
        // If we found data in cross-storage but not in cookies, update cookies
        if (userDataResult && (!cookieUsername || !cookieToken)) {
          await AuthStorage.setUserData(finalUserData);
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message || 'Failed to fetch user data');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign out
  const signOut = async () => {
    try {
      // Clear all auth data using cross-storage
      await AuthStorage.clearUserData();
      setUserData(null);
      
      // Force page reload with cache clearing parameters
      const noCache = `?nocache=${Date.now()}`;
      
      if (window.location.hostname === 'localhost') {
        // For local development, navigate to login on React app
        window.location.href = `http://localhost:5173/`;
      } else {
        // For production, redirect to login page on React app
        window.location.href = `https://your-react-app.com/login${noCache}`;
      }
    } catch (error) {
      console.error("Error during sign out:", error);
      
      // Fallback - clear everything manually
      try {
        localStorage.clear();
        sessionStorage.clear();
        
        // Also try to clear cookies
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Force redirect
        window.location.href = window.location.hostname === 'localhost' 
          ? `http://localhost:5173/login${noCache}`
          : `https://your-react-app.com/login${noCache}`;
      } catch (e) {
        console.error("Emergency logout failed:", e);
        alert("Logout failed. Please close your browser and try again.");
      }
    }
  };

  // Function to update user data
  const updateUserData = async (newData) => {
    try {
      const updatedData = { ...userData, ...newData };
      await AuthStorage.setUserData(updatedData);
      setUserData(updatedData);
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      setError(error.message || 'Failed to update user data');
      return false;
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // The value that will be provided to consumers of this context
  const value = {
    userData,
    isLoading,
    error,
    fetchUserData,
    signOut,
    updateUserData,
    isAuthenticated: !!userData?.username && !!userData?.token
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;