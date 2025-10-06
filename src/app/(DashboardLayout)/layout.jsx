'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from './layout/vertical/header/Header';
import Sidebar from './layout/vertical/sidebar/Sidebar';
import { Home, Trophy, Users, GamepadIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import VotePopup from './VotePopup'; 
import CookiesModal from './CookiesModal'; // Import the simplified expandable modal

const Layout = ({ children }) => {
  const [showGlow, setShowGlow] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const [showVotePopup, setShowVotePopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // Function to get a random question (placeholder)
  const getRandomQuestion = () => {
    return "Sample question"; 
  };

  useEffect(() => {
    let timer;
    if (showGlow) {
      timer = setTimeout(() => setShowGlow(false), 1200);
    }
    return () => clearTimeout(timer);
  }, [showGlow]);

  // Effect to show the vote popup periodically
  useEffect(() => {
    // Initial timer to show first popup after a short delay
    const initialTimer = setTimeout(() => {
      setCurrentQuestion(getRandomQuestion());
      setShowVotePopup(true);
    }, 10000); 

    // Setup periodic timer for subsequent popups
    const periodicTimer = setInterval(() => {
      setCurrentQuestion(getRandomQuestion());
      setShowVotePopup(true);
    }, 2 * 60 * 1000); 

    return () => {
      clearTimeout(initialTimer);
      clearInterval(periodicTimer);
    };
  }, []);

  // Cookie consent handlers
  const handleCookieAccept = (preferences) => {
    console.log('Cookies accepted:', preferences);
    // Initialize your analytics, marketing scripts, etc.
  };

  const handleCookieReject = (preferences) => {
    console.log('Cookies rejected:', preferences);
    // Ensure only necessary cookies are used
  };

  const handleSavePreferences = (preferences) => {
    console.log('Custom preferences saved:', preferences);
    // Initialize only the allowed services
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-secondary overflow-x-hidden">
      {/* Background and Overlay Container */}
      <div className="fixed top-0 left-0 right-0 h-screen w-full z-0">
        {/* Background Image */}
        <div className="absolute inset-0">
          {/* <Image
            src="https://curry.gg/images/bg_left.webp"
            alt="Background"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="object-center"
          /> */}
        </div>

        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-secondary/5 to-secondary"></div>
      </div>

      {/* Content */}
      <div className="relative w-full z-10">
        <Header setIsMobileOpen={setIsMobileOpen} />
        <div className="flex flex-1">
          <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            <main className="font-pilot flex-1 flex flex-col mt-8 mb-4">
              <div className="sm:pl-16 md:pl-18">{children}</div>
            </main>
        </div>
      </div>

    
      
      {/* Final Simplified Modal */}
      <CookiesModal 
        title="About Your Privacy"
        description="We process your data to deliver content or advertisements and measure the delivery of such content or advertisements to extract insights about our website. We share this information with our partners on the basis of consent and legitimate interest. You may exercise your right to consent or object to a legitimate interest, based on a specific purpose below or at a partner level in the link under each purpose. These choices will be signaled to our vendors."
        acceptAllButtonText="Allow all"
        customizeButtonText="Manage Consent Preferences"
        submitChoicesText="Submit My Choices"
        rejectAllButtonText="Reject all"
        primaryColor="#1a1a3a" // Dark blue/navy color from image
        cookieOptions={[
          {
            id: 'necessary',
            name: 'Strictly Necessary Cookies',
            description: 'These cookies are essential for the website to function properly and cannot be disabled.',
            isRequired: true,
          },
          {
            id: 'functional',
            name: 'Functional Cookies',
            description: 'These cookies enable personalized features and remember your preferences.',
            isRequired: false,
          },
          {
            id: 'performance',
            name: 'Performance Cookies',
            description: 'These cookies help us understand how visitors interact with our website, helping us improve our site and services.',
            isRequired: false,
          },
          {
            id: 'marketing',
            name: 'Personalised ads and content measurement, audience insights and product development',
            description: 'These cookies are used to deliver advertisements more relevant to you and your interests, limit the number of times you see an advertisement, and understand user behavior.',
            isRequired: false,
          }
        ]}
        onAccept={handleCookieAccept}
        onReject={handleCookieReject}
        onSavePreferences={handleSavePreferences}
      />
    </div>
  );
};

export default Layout;