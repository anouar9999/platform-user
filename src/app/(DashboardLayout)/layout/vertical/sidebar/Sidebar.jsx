  'use client';

  import React, { useState, useEffect } from 'react';
  import { usePathname } from 'next/navigation';
  import Link from 'next/link';
  import { 
    Settings, 
    Trophy, 
    Medal, 
    Users, 
    ChevronRight, 
    X, 
    Gamepad, 
    Users2, 
    Ticket, 
    CalendarDays,
    Layers,
    ShieldCheck,
    Home,
    Gamepad2,
    UserRound,
    UsersRound
  } from 'lucide-react';
  import Image from 'next/image';

  // Updated menu items with more appropriate icons
  const menuItems = [
    { id: 1, icon: Trophy, name: 'Tournaments', href: '/tournaments' },
    { id: 2, icon: Medal, name: 'My Tournament', href: '/my-tournaments' },
    { id: 3, icon: Users2, name: 'Teams', href: '/teams' },
    { id: 4, icon: Settings, name: 'Stats', href: '/settings' },
    { id: 5, icon: Ticket, name: 'Pass Gamers', href: '/pass-gamers' },
  ];


  const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleToggle = () => {
      if (isMobile) {
        setIsMobileOpen(!isMobileOpen);
      } else {
        setIsExpanded(!isExpanded);
      }
    };

    const isOpen = isMobile ? isMobileOpen : isExpanded;

    return (
      <>
        {/* Mobile Overlay */}
        {isMobile && isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full ${
            isOpen ? 'w-full md:w-20' : 'w-20'
          } md:left-0 md:top-0 md:h-full flex flex-col justify-center items-center py-6 transition-all duration-300 ease-in-out z-50 ${
            isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0 z-[999999]'
          }`}
        >
        
          {/* Close button for mobile */}
          {isMobile && isMobileOpen && (
            <>
              <div className="absolute top-4 left-4 p-2 w-28 h-12 md:w-32 md:h-20">
                <Link href={'/'}>
                  <Image
                    src="/images/logo-gamius-white.png"
                    alt="Logo"
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                </Link>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Menu items container */}
          <div className="flex flex-col items-center space-y-2 w-full pt-12 ">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  href={item.href}
                  key={item.id} 
                  className={`w-full px-8 py-2 p-5 group relative transition-all duration-300 ml-2
                    ${isActive ? 'bg-primary/40 rounded-r-lg angular-cut' : 'hover:bg-primary/5'}`}
                  onClick={() => isMobile && setIsMobileOpen(false)}
                >
                  {/* Background hover effect that covers the entire item */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-300"></div>
                  
                  {/* Active indicator */}
              
                  
                  <div className="flex flex-col items-center  relative z-10">
                    <div
                      className={`flex items-center justify-center w-10 h-10  rounded-full transition-all duration-300 
                      ${isActive 
                        ? 'bg-dark text-primary' 
                        : 'text-gray-400 group-hover:text-white group-hover:bg-primary/20'
                      }`}
                    >
                      <Icon
                        className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                        strokeWidth={2}
                      />
                    </div>
                    
                    <span className={`text-xs  font-ea-football   transition-all m-1 duration-300 text-center 
                      ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </>
    );
  };

  export default Sidebar;