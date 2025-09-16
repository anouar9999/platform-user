import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TbDoorEnter } from 'react-icons/tb';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'U';
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
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // 🔥 NEW: Check authentication status using session-based approach
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // First check localStorage for quick UI update
      const localAuthData = localStorage.getItem('authData');
      if (localAuthData) {
        try {
          const parsedData = JSON.parse(localAuthData);
          if (parsedData.username) {
            // Quick UI update from localStorage
            setUserName(parsedData.username);
            setUserType(parsedData.userType || '');
            setAvatarUrl(parsedData.avatarUrl || '');
            setUserEmail(parsedData.email || '');
            setUserPoints(parsedData.points || 0);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error parsing localStorage auth data:', error);
        }
      }

      // Then verify with backend session
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me.php`, {
        method: 'GET',
        credentials: 'include', // Important for session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          // Update state with fresh data from backend
          setUserName(data.user.username || '');
          setUserType(data.user.user_type || '');
          setAvatarUrl(data.user.avatar || '');
          setUserEmail(data.user.email || '');
          setUserPoints(data.user.points || 0);
          setIsAuthenticated(true);
          
          // Update localStorage with fresh data
          const authDataForStorage = {
            username: data.user.username,
            userType: data.user.user_type,
            avatarUrl: data.user.avatar,
            email: data.user.email,
            points: data.user.points,
            userId: data.user.id,
            timestamp: new Date().getTime()
          };
          localStorage.setItem('authData', JSON.stringify(authDataForStorage));
          
          console.log('✅ Auth check successful:', data.user);
        } else {
          // Not authenticated
          setIsAuthenticated(false);
          clearUserData();
        }
      } else if (response.status === 401) {
        // Session expired or not authenticated
        console.log('❌ Not authenticated - session expired or invalid');
        setIsAuthenticated(false);
        clearUserData();
      } else {
        console.error('Auth check failed with status:', response.status);
        setIsAuthenticated(false);
        clearUserData();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      clearUserData();
    } finally {
      setIsLoading(false);
    }
  };

  // Clear user data from state and localStorage
  const clearUserData = () => {
    setUserName('');
    setUserType('');
    setAvatarUrl('');
    setUserEmail('');
    setUserPoints(0);
    localStorage.removeItem('authData');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
  };

  // 🔥 NEW: Session-based logout
  const handleSignOut = async () => {
    console.log("Starting session-based sign out process...");
    setIsLoading(true);
    
    try {
      // Call backend logout endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout.php`, {
        method: 'POST',
        credentials: 'include', // Important for session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log("✅ Backend session cleared successfully");
      } else {
        console.log("⚠️ Backend logout failed, but continuing with frontend cleanup");
      }
    } catch (error) {
      console.error("❌ Backend logout error:", error);
      console.log("Continuing with frontend cleanup...");
    }

    // Clear all frontend data
    try {
      clearUserData();
      
      // Clear any additional storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Update component state
      setIsAuthenticated(false);
      setIsOpen(false);
      
      console.log("✅ Frontend cleanup completed");
      
      // Redirect to home page (Vite app)
      const noCache = `?nocache=${Date.now()}`;
      if (window.location.hostname === 'localhost') {
        window.location.href = `http://localhost:5173/${noCache}`;
      } else {
        window.location.href = `https://your-vite-app.com/${noCache}`;
      }
    } catch (error) {
      console.error("❌ Frontend cleanup failed:", error);
      // Force reload as fallback
      window.location.reload();
    }
  };

  // Initialize auth check on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Handle clicking outside dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // If no user or not authenticated, return null
  if (!isAuthenticated || !userName) {
    return null;
  }

  const avatarColor = generateColor(userName);
  const userInitials = getInitials(userName);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        className="flex items-center space-x-3 rounded-lg py-2.5 px-4
                 transition-all duration-300 hover:bg-white/5
                 min-w-[200px] sm:min-w-[180px] backdrop-blur-sm
                 border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div
          className="relative w-9 h-9 rounded-full overflow-hidden 
                    flex items-center justify-center flex-shrink-0
                    ring-2 ring-green-400"
        >
          {avatarUrl && !imageError ? (
            <img
              src={
                avatarUrl.startsWith('http') 
                  ? avatarUrl 
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}${avatarUrl}`
              }
              alt={userName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`w-full h-full ${avatarColor} flex items-center 
                         justify-center text-white text-sm font-medium
                         shadow-inner`}
            >
              {userInitials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {userName}
          </p>
          {userType && (
            <p className="text-xs text-gray-400 truncate capitalize">
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
          className="absolute right-0 mt-2 w-64 shadow-lg 
                    bg-black/90 backdrop-blur-md z-50 rounded-lg 
                    border border-white/10
                    transition-all duration-300 ease-out
                    animate-in slide-in-from-top"
        >
          <div className="p-4 space-y-4" role="menu">
            {/* User Info Section */}
            <div className="text-center border-b border-white/10 pb-3">
              <p className="text-white font-medium">{userName}</p>
              {userEmail && (
                <p className="text-gray-400 text-sm">{userEmail}</p>
              )}
              <p className="text-gray-400 text-xs">
                Points: {userPoints || 0}
              </p>
            </div>

            {/* Access Dashboard Link */}
            {/* <a
              href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}:3000/tournaments`}
              className="flex items-center justify-between px-2 py-2
                       text-sm text-gray-400 hover:text-white
                       rounded-md hover:bg-white/5
                       transition-colors duration-200"
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                <TbDoorEnter className="h-4 w-4 text-green-400" />
                <span>Access Dashboard</span>
              </div>
            </a> */}
            
            {/* Sign Out Button */}
            <button
              className="flex w-full items-center justify-between px-2 py-2
                       text-sm text-gray-400 hover:text-white
                       rounded-md hover:bg-white/5
                       transition-colors duration-200"
              onClick={handleSignOut}
              disabled={isLoading}
              role="menuitem"
            >
              <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
              <LogOut className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;