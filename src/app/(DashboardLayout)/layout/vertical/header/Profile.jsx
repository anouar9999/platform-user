import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const generateColor = (name) => {
    const colors = ['bg-gray-600', 'bg-green-600', 'bg-yellow-600', 'bg-red-600', 'bg-purple-600', 'bg-pink-600'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    const storedUserType = localStorage.getItem('userType');
    const storedAvatarUrl = localStorage.getItem('avatarUrl');

    if (!storedUsername || !storedUserId) {
      router.push('/auth/auth1/login');
    } else {
      setUserName(storedUsername);
      setUserType(storedUserType || 'User');
      setAvatarUrl(storedAvatarUrl);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('userSessionToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('avatarUrl');
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
      <div className="relative w-9 h-9 rounded-full overflow-hidden 
                    flex items-center justify-center flex-shrink-0
                   ">
        {avatarUrl ? (
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${avatarUrl}`}
            alt={userName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full ${avatarColor} flex items-center 
                         justify-center text-white text-base font-medium
                         shadow-inner`}>
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
      <div className="fixed sm:absolute right-0 bottom-0 sm:bottom-auto sm:mt-2 
                    w-full sm:w-64 shadow-lg bg-gradient-to-t from-black to-transparent backdrop-blur-md
                  z-50 
                    sm:rounded-lg rounded-t-lg
                    transition-all duration-300 ease-out
                    animate-in slide-in-from-bottom sm:slide-in-from-top">
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