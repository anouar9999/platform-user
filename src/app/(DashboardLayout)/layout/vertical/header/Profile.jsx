import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TbDoorEnter } from 'react-icons/tb';
import AuthStorage from './GlobalStorage'; // Make sure path is correct

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateColor = (name) => {
    const colors = [
      'bg-gray-600',
      'bg-green-600',
      'bg-yellow-600',
      'bg-red-600',
      'bg-purple-600',
      'bg-pink-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Helper function to get cookie (for backward compatibility)
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }

  useEffect(() => {
    // Async function to handle auth data fetching
    const fetchAuthData = async () => {
      setIsLoading(true);
      try {
        // First try to get from local AuthStorage
        let userData = await AuthStorage.getUserData();
        console.log('Initial user data:', userData);
        // If not found, force sync with cross-storage
        if (!userData || !userData.id) {
          console.log('User data not found locally, checking cross-storage...');
          userData = await AuthStorage.syncWithCrossStorage();
        }
        
        console.log('Auth data retrieved:', userData);
        
        // For backward compatibility, also check cookies
        const cookieToken = getCookie('userSessionToken');
        const cookieUsername = getCookie('username');
        const cookieAvatar = getCookie('avatarUrl');
        
        console.log('Cookie data:', { 
          token: cookieToken ? 'exists' : 'not found', 
          username: cookieUsername, 
          avatar: cookieAvatar 
        });
        
        // Use values from AuthStorage first, fall back to cookies
        const username = userData?.username || cookieUsername;
        const avatar = userData?.avatarUrl  || cookieAvatar;
        const type = userData?.userType || '';
        
        if (!username) {
          console.log('No username found, redirecting to login');
          router.push('/login');
        } else {
          // User is logged in, update state
          console.log('Setting user state with:', { username, avatar, type });
          setUserName(username);
          setAvatarUrl(avatar);
          setUserType(type);
          
          // If we found data in cross-storage but not in cookies, update cookies
          if (userData && (!cookieUsername || !cookieToken)) {
            console.log('Syncing data to cookies for cross-domain access');
            await AuthStorage.setUserData(userData);
          }
        }
      } catch (error) {
        console.error('Error fetching auth data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuthData();
    
    // Handle clicking outside dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [router]);

  // Updated sign out function to use AuthStorage
  const handleSignOut = async () => {
    console.log("Starting sign out process...");
    
    try {
      // Clear all auth data using cross-storage
      console.log("Clearing auth data from all storages...");
      
      console.log("Auth data cleared, redirecting...");
      
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 rounded-lg py-2.5 px-4 min-w-[180px]">
        <div className="w-9 h-9 rounded-full bg-gray-700 animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded animate-pulse w-20"></div>
        </div>
      </div>
    );
  }

  // If no user, return null
  if (!userName) return null;

  const avatarColor = generateColor(userName);
  const userInitials = getInitials(userName);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        className="flex items-center space-x-3 rounded-lg py-2.5 px-4
                 transition-all duration-300 
                 min-w-[340px] sm:min-w-[180px] backdrop-blur-sm
                angular-cut"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div
          className="relative w-9 h-9 rounded-full overflow-hidden 
                    flex items-center justify-center flex-shrink-0"
        >
          {avatarUrl && !imageError ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${avatarUrl}`}
              alt={userName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`w-full h-full ${avatarColor} flex items-center 
                         justify-center text-white text-base font-medium
                         shadow-inner`}
            >
              {userInitials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white">
            {userName}
          </p>
          {userType && (
            <p className="text-xs text-gray-400 truncate">
              {userType}
            </p>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 
                   flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="fixed sm:absolute right-0 bottom-0 sm:bottom-auto sm:mt-2 
                    w-full sm:w-64 shadow-lg bg-gradient-to-t from-black to-transparent backdrop-blur-md
                  z-50 
                    sm:rounded-lg rounded-t-lg
                    transition-all duration-300 ease-out
                    animate-in slide-in-from-bottom sm:slide-in-from-top"
        >
          <div className="p-4 space-y-4" role="menu">
         
            
            <button
              className="flex w-full items-center justify-between px-2 py-2
                       text-sm text-gray-400 hover:text-white
                       rounded-md
                       transition-colors duration-200"
              onClick={handleSignOut}
              role="menuitem"
            >
              <span>Back To Home</span>
              <LogOut className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;