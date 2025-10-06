'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Profile from './Profile';
import { Stack } from '@mui/material';
import CustomButton from '@/app/(DashboardLayout)/CustomButton';
import Image from 'next/image';
import Link from 'next/link';

const Header = ({ setIsMobileOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  const toggleMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 md:h-20 flex items-center justify-between px-4 md:px-12 z-[100]">
      {/* Background with angular styling */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-transparent border-b border-white/5">
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50" />
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className={`relative ${isMobile ? 'mx-auto' : ''} w-28 h-12 md:w-32 md:h-20`}>
          <Link href={`https://gnews.ma/`}>
            <Image
              src="/images/logo-gamius-white.png"
              alt="Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isMobile && (
            <Stack spacing={1} direction="row" alignItems="center">
              <Profile />
            </Stack>
          )}
          {isMobile && (
            <button 
              className="p-2 bg-primary/20 border border-primary/40 transform -skew-x-6 hover:bg-primary/30 transition-all duration-300 group" 
              onClick={toggleMenu}
            >
              <Menu className="w-5 h-5 text-primary transform skew-x-6 group-hover:scale-110 transition-transform duration-300" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;