import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import globalStorage from './GlobalStorage';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageError, setImageError] = useState(false);
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

  // Cookie utility functions
  const setCookie = (name, value, days = 7, path = '/') => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value,
    )}; expires=${expires}; path=${path}; SameSite=Strict`;
  };

  const removeCookie = (name, path = '/') => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  };
  // Your component - with the same structure, just replacing localStorage with GlobalStorage
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }

  // In your component:
  useEffect(() => {
    // Get all user data from AuthStorage
    const userData = AuthStorage.getUserData();
    console.log('AuthStorage data:', userData);

    // For backward compatibility, also check individual cookies
    const cookieToken = getCookie('userSessionToken');
    const cookieUsername = getCookie('username');
    const cookieAvatar = getCookie('avatarUrl');

    console.log('Cookie User Session Token:', cookieToken);
    console.log('Cookie Avatar URL:', cookieAvatar);
    console.log('Cookie Username:', cookieUsername);

    // Use values from AuthStorage first, fall back to cookies
    const username = userData?.username || cookieUsername;
    const avatarUrl = userData?.avatarUrl || cookieAvatar;

    if (!username) {
      // Not logged in, uncomment to redirect
      // router.push('/login');
    } else {
      // User is logged in, update state
      setUserName(username);
      setAvatarUrl(avatarUrl);
      setUserType(userData?.userType || ''); // Default to empty string if not available
      setAvatarUrl(cookieAvatar);
      // For any missing values in cookies, update them from other sources
      if (userData && (!cookieUsername || !cookieToken)) {
        // Sync to cookies for cross-domain access
        AuthStorage.setUserData(userData);
      }
    }

    // Handle clicking outside dropdown (unchanged)
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [router]);

  // Updated sign out function to use AuthStorage
  const handleSignOut = () => {
    // Clear all auth data at once
    AuthStorage.clearUserData();

    // For backward compatibility, also clear Global Storage directly
    if (window.GlobalStorage) {
      window.GlobalStorage.remove('userSessionToken');
      window.GlobalStorage.remove('userId');
      window.GlobalStorage.remove('username');
      window.GlobalStorage.remove('userType');
      window.GlobalStorage.remove('avatarUrl');
    }

    router.push('/login');
  };

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
                    flex items-center justify-center flex-shrink-0
                   "
        >
          {avatarUrl ? (
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
              <span>Sign out</span>
              <LogOut className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
