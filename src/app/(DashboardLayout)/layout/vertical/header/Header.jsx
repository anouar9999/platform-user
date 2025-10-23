'use client';
import React from 'react';
import { Menu } from 'lucide-react';
import Profile from './Profile';
import { Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const Header = ({ setIsMobileOpen }) => {
  const toggleMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-14 sm:h-16 md:h-18 lg:h-20 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 z-[100]">
      {/* Background with angular styling */}
        {/* Scanline effect */}
        
        {/* Bottom accent line */}
    

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-[1920px] mx-auto">
        {/* Left side: Mobile menu button + Logo */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Mobile menu button - Visible only on mobile and tablet */}
          <div className="md:hidden relative inline-block">
            <button 
              className="relative group p-2 sm:p-2.5 overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
              style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
            >
              {/* Corner accents */}
              <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-2 group-hover:h-2"></div>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-2 group-hover:h-2"></div>
              <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-2 group-hover:h-2"></div>
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-2 group-hover:h-2"></div>
              
              {/* Background */}
              <div className="absolute inset-0 bg-primary/20 border border-primary/40 transition-all duration-300 group-hover:bg-primary/30 group-active:bg-primary/40">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.05)_1px,rgba(255,255,255,0.05)_2px)] opacity-50"></div>
              </div>
              
              <Menu className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Logo */}
          <Link href="https://gamius.ma/" className="relative group flex-shrink-0">
            <div className="relative w-20 h-8 sm:w-24 sm:h-10 md:w-28 md:h-12 lg:w-32 lg:h-14 xl:w-36 xl:h-16 transition-all duration-300 group-hover:scale-105">
              {/* Corner accents on hover */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              
              <Image
                src="/images/logo-gamius-white.png"
                alt="Logo"
                layout="fill"
                objectFit="contain"
                priority
                className="transition-all duration-300 group-hover:brightness-110"
              />
            </div>
          </Link>
        </div>
        
        {/* Right side: Profile/Avatar - Always visible */}
        <div className="flex items-center flex-shrink-0">
          <Stack spacing={{ xs: 0.5, sm: 1 }} direction="row" alignItems="center">
            <Profile />
          </Stack>
        </div>
      </div>
    </header>
  );
};

export default Header;