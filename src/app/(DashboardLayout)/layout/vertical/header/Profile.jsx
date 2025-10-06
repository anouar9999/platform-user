import React, { useState, useEffect, useRef } from 'react';
import { Backpack, ChevronDown, Home, LogOut } from 'lucide-react';
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
      'bg-gradient-to-br from-gray-600 to-gray-700',
      'bg-gradient-to-br from-green-600 to-green-700',
      'bg-gradient-to-br from-yellow-600 to-yellow-700',
      'bg-gradient-to-br from-red-600 to-red-700',
      'bg-gradient-to-br from-purple-600 to-purple-700',
      'bg-gradient-to-br from-pink-600 to-pink-700',
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      const localAuthData = localStorage.getItem('authData');
      if (localAuthData) {
        try {
          const parsedData = JSON.parse(localAuthData);
          if (parsedData.username) {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me.php`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUserName(data.user.username || '');
          setUserType(data.user.user_type || '');
          setAvatarUrl(data.user.avatar || '');
          setUserEmail(data.user.email || '');
          setUserPoints(data.user.points || 0);
          setIsAuthenticated(true);
          
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
          setIsAuthenticated(false);
          clearUserData();
        }
      } else if (response.status === 401) {
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

  const handleSignOut = async () => {
    console.log("Starting session-based sign out process...");
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout.php`, {
        method: 'POST',
        credentials: 'include',
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

    try {
      clearUserData();
      localStorage.clear();
      sessionStorage.clear();
      setIsAuthenticated(false);
      setIsOpen(false);
      
      console.log("✅ Frontend cleanup completed");
      
      const noCache = `?nocache=${Date.now()}`;
      if (window.location.hostname === 'localhost') {
        window.location.href = `http://localhost:5173/${noCache}`;
      } else {
        window.location.href = `https://gnews.ma/${noCache}`;
      }
    } catch (error) {
      console.error("❌ Frontend cleanup failed:", error);
      window.location.reload();
    }
  };

  useEffect(() => {
    checkAuthStatus();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 py-2.5 px-4 min-w-[180px]">
        <div className="w-9 h-9 bg-primary/20 border border-primary/40 animate-pulse transform -skew-x-6"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-primary/20 animate-pulse w-20"></div>
          <div className="h-2 bg-primary/10 animate-pulse w-16"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !userName) {
    return null;
  }

  const avatarColor = generateColor(userName);
  const userInitials = getInitials(userName);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        className="group relative flex items-center space-x-3 py-2.5 px-4 min-w-[200px] sm:min-w-[180px] transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Background with angular styling */}
        <div className="absolute inset-0 bg-black/40 border border-white/10 group-hover:border-primary/30 transition-all duration-300 overflow-hidden">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50" />
          
          {/* Hover accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center space-x-3 w-full">
          {/* Avatar with skewed container */}
          <div className="relative w-9 h-9 flex-shrink-0 transform -skew-x-6 border border-primary/40 overflow-hidden bg-black/40">
            <div className="transform skew-x-6 w-full h-full">
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
                <div className={`w-full h-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                  {userInitials}
                </div>
              )}
            </div>
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-white truncate uppercase tracking-wide">
              {userName}
            </p>
            {userType && (
              <p className="text-xs text-primary truncate font-ea-football capitalize">
                {userType}
              </p>
            )}
          </div>

          {/* Chevron with skewed container */}
          <div className="flex-shrink-0 w-5 h-5 bg-primary/20 border border-primary/40 flex items-center justify-center transform -skew-x-6 group-hover:bg-primary/30 transition-all duration-300">
            <ChevronDown
              className={`w-3 h-3 text-primary transition-transform duration-300 transform skew-x-6 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 z-[110]">
          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary z-10" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary z-10" />
          
          <div className="relative bg-black/90 backdrop-blur-md border border-white/10 overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50 pointer-events-none" />
            
            <div className="relative z-10 p-4 space-y-4" role="menu">
              {/* User Info Section */}
              <div className="text-center border-b border-white/10 pb-4">
                <p className="text-white font-bold uppercase tracking-wider mb-1">{userName}</p>
                {userEmail && (
                  <p className="text-gray-400 text-xs font-circular-web mb-2">{userEmail}</p>
                )}
                {/* Points display with tech styling */}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-1">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">
                    {userPoints || 0} Points
                  </span>
                </div>
              </div>

              {/* Home Link */}
              <a
                href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}`}
                className="group/item relative flex items-center justify-between px-3 py-2 text-sm transition-all duration-300 overflow-hidden"
                role="menuitem"
              >
                <div className="absolute inset-0 bg-white/0 group-hover/item:bg-white/5 border-l-2 border-transparent group-hover/item:border-green-500/50 transition-all duration-300" />
                
                <div className="relative z-10 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500/20 border border-green-500/40 flex items-center justify-center transform -skew-x-6 group-hover/item:bg-green-500/30 transition-all duration-300">
                    <Backpack className="h-3 w-3 text-green-400 transform skew-x-6" />
                  </div>
                  <span className="text-gray-300 group-hover/item:text-white font-circular-web font-bold uppercase text-xs tracking-wider">
                    Home
                  </span>
                </div>
              </a>
              
              {/* Sign Out Button */}
              <button
                className="group/item relative flex w-full items-center justify-between px-3 py-2 text-sm transition-all duration-300 overflow-hidden"
                onClick={handleSignOut}
                disabled={isLoading}
                role="menuitem"
              >
                <div className="absolute inset-0 bg-white/0 group-hover/item:bg-red-500/10 border-l-2 border-transparent group-hover/item:border-red-500/50 transition-all duration-300" />
                
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500/20 border border-red-500/40 flex items-center justify-center transform -skew-x-6 group-hover/item:bg-red-500/30 transition-all duration-300">
                      <LogOut className="h-3 w-3 text-red-400 transform skew-x-6" />
                    </div>
                    <span className="text-gray-300 group-hover/item:text-white font-circular-web font-bold uppercase text-xs tracking-wider">
                      {isLoading ? 'Signing out...' : 'Sign Out'}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Bottom accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;