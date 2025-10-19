import React, { useState, useEffect, useRef } from 'react';
import { Backpack, ChevronDown, LogOut, Settings } from 'lucide-react';
import { IoIosNotifications } from "react-icons/io";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [userId, setUserId] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
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

  // Fetch unread notification count
  const fetchUnreadCount = async (uid) => {
    if (!uid) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications.php?action=count&user_id=${uid}`
      );
      const result = await response.json();
      
      if (result.success) {
        setUnreadCount(result.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
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
            setUserId(parsedData.userId);
            setIsAuthenticated(true);
            
            // Fetch notification count
            if (parsedData.userId) {
              fetchUnreadCount(parsedData.userId);
            }
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
          setUserId(data.user.id);
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
          
          // Fetch notification count
          fetchUnreadCount(data.user.id);
        } else {
          setIsAuthenticated(false);
          clearUserData();
        }
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        clearUserData();
      } else {
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
    setUserId(null);
    setUnreadCount(0);
    localStorage.removeItem('authData');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Backend logout error:", error);
    }

    try {
      clearUserData();
      localStorage.clear();
      sessionStorage.clear();
      setIsAuthenticated(false);
      setIsOpen(false);
      
      const noCache = `?nocache=${Date.now()}`;
      if (window.location.hostname === 'localhost') {
        window.location.href = `http://localhost:5173/${noCache}`;
      } else {
        window.location.href = `https://gnews.ma/${noCache}`;
      }
    } catch (error) {
      console.error("Frontend cleanup failed:", error);
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
    
    // Poll for new notifications every 30 seconds
    const notifInterval = setInterval(() => {
      if (userId) {
        fetchUnreadCount(userId);
      }
    }, 30000);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(notifInterval);
    };
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="md:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/20 border-2 border-primary/40 animate-pulse" />
        <div className="hidden md:flex items-center space-x-3 py-2.5 px-4 min-w-[180px]">
          <div className="w-9 h-9 bg-primary/20 border border-primary/40 animate-pulse transform -skew-x-6"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-primary/20 animate-pulse w-20"></div>
            <div className="h-2 bg-primary/10 animate-pulse w-16"></div>
          </div>
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
      {/* Notification Badge - Above the button */}
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 z-20 min-w-[20px] h-[20px] bg-red-500 border-2 border-black rounded-full flex items-center justify-center px-1 animate-pulse shadow-lg shadow-red-500/50">
          <span className="text-white text-[10px] font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </div>
      )}

      <button
        className="group relative flex items-center transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Mobile: Just rounded avatar */}
        <div className="md:hidden">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex-shrink-0 shadow-lg hover:border-primary hover:scale-105 transition-all duration-300">
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
              <div className={`w-full h-full ${avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                {userInitials}
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Full profile button */}
        <div className="hidden md:flex items-center space-x-3 py-2.5 px-4 min-w-[200px] lg:min-w-[220px]">
          <div className="absolute inset-0 bg-black/40 border border-white/10 group-hover:border-primary/30 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="relative z-10 flex items-center space-x-3 w-full">
            {/* Avatar */}
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

            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-white truncate uppercase tracking-wide">
                {userName}
              </p>
              {userType && (
                <p className="text-xs text-primary truncate capitalize">
                  {userType}
                </p>
              )}
            </div>

            <div className="flex-shrink-0 w-5 h-5 bg-primary/20 border border-primary/40 flex items-center justify-center transform -skew-x-6 group-hover:bg-primary/30 transition-all duration-300">
              <ChevronDown
                className={`w-3 h-3 text-primary transition-transform duration-300 transform skew-x-6 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 z-[110]">
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary z-10" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary z-10" />
          
          <div className="relative bg-black/90 backdrop-blur-md border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50 pointer-events-none" />
            
            <div className="relative z-10 p-4 space-y-4" role="menu">
              <div className="text-center border-b border-white/10 pb-4">
                <p className="text-white font-bold uppercase tracking-wider mb-1">{userName}</p>
                {userEmail && (
                  <p className="text-gray-400 text-xs mb-2">{userEmail}</p>
                )}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-1">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">
                    {userPoints || 0} Points
                  </span>
                </div>
              </div>

              <a
                href={`https://gnews.ma`}
                className="group/item relative flex items-center justify-between px-3 py-2 text-sm transition-all duration-300 overflow-hidden"
                role="menuitem"
              >
                <div className="absolute inset-0 bg-white/0 group-hover/item:bg-white/5 border-l-2 border-transparent group-hover/item:border-green-500/50 transition-all duration-300" />
                
                <div className="relative z-10 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500/20 border border-green-500/40 flex items-center justify-center transform -skew-x-6 group-hover/item:bg-green-500/30 transition-all duration-300">
                    <Backpack className="h-3 w-3 text-green-400 transform skew-x-6" />
                  </div>
                  <span className="text-gray-300 group-hover/item:text-white font-bold uppercase text-xs tracking-wider">
                    Home
                  </span>
                </div>
              </a>

              <a
                href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/settings`}
                className="group/item relative flex items-center justify-between px-3 py-2 text-sm transition-all duration-300 overflow-hidden"
                role="menuitem"
              >
                <div className="absolute inset-0 bg-white/0 group-hover/item:bg-white/5 border-l-2 border-transparent group-hover/item:border-yellow-500/50 transition-all duration-300" />
                
                <div className="relative z-10 flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center transform -skew-x-6 group-hover/item:bg-yellow-500/30 transition-all duration-300">
                    <Settings className="h-3 w-3 text-yellow-400 transform skew-x-6" />
                  </div>
                  <span className="text-gray-300 group-hover/item:text-white font-bold uppercase text-xs tracking-wider">
                    Settings
                  </span>
                </div>
              </a>

              <a
                href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/notifications`}
                className="group/item relative flex items-center justify-between px-3 py-2 text-sm transition-all duration-300 overflow-hidden"
                role="menuitem"
              >
                <div className="absolute inset-0 bg-white/0 group-hover/item:bg-white/5 border-l-2 border-transparent group-hover/item:border-blue-500/50 transition-all duration-300" />
                
                <div className="relative z-10 flex items-center gap-2 w-full">
                  <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/40 flex items-center justify-center transform -skew-x-6 group-hover/item:bg-blue-500/30 transition-all duration-300 relative">
                    <IoIosNotifications className="h-3 w-3 text-blue-400 transform skew-x-6" />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[12px] h-[12px] bg-red-500 border border-black transform -skew-x-6 flex items-center justify-center px-0.5">
                        <span className="text-white text-[8px] font-bold transform skew-x-6">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-300 group-hover/item:text-white font-bold uppercase text-xs tracking-wider">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </a>

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
                    <span className="text-gray-300 group-hover/item:text-white font-bold uppercase text-xs tracking-wider">
                      {isLoading ? 'Signing out...' : 'Sign Out'}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;