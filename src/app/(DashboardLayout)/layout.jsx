'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from './layout/vertical/header/Header';
import Sidebar from './layout/vertical/sidebar/Sidebar';
import { Home, Trophy, Users, GamepadIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import VotePopup from './VotePopup'; // Import the VotePopup component

const Layout = ({ children }) => {
  const [showGlow, setShowGlow] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showVotePopup, setShowVotePopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const pathname = usePathname();

  // Define all possible questions
  const questions = [
    {
      id: 'experience',
      title: 'Rate Your Experience',
      description: "We'd love to hear your feedback on our platform!",
    },
    {
      id: 'difficulty',
      title: 'Game Difficulty',
      description: 'How would you rate the difficulty of our games?',
    },
    {
      id: 'features',
      title: 'Favorite Feature',
      description: 'Which feature do you enjoy the most?',
    },
    {
      id: 'improvement',
      title: 'What Needs Improvement?',
      description: 'Which aspect should we focus on improving first?',
    },
    {
      id: 'recommendation',
      title: 'Would You Recommend Us?',
      description: 'Would you recommend our platform to friends?',
    },
  ];

  useEffect(() => {
    let timer;
    if (showGlow) {
      timer = setTimeout(() => setShowGlow(false), 1200);
    }
    return () => clearTimeout(timer);
  }, [showGlow]);

  // Function to get a random question that hasn't been asked recently
  const getRandomQuestion = () => {
    // Get recently asked question IDs from localStorage
    const recentQuestionsString = localStorage.getItem('recentQuestions') || '[]';
    const recentQuestions = JSON.parse(recentQuestionsString);

    // Filter out recently asked questions
    const availableQuestions = questions.filter((q) => !recentQuestions.includes(q.id));

    // If all questions have been asked recently, reset and use all questions
    const questionPool = availableQuestions.length > 0 ? availableQuestions : questions;

    // Select a random question
    const randomIndex = Math.floor(Math.random() * questionPool.length);
    return questionPool[randomIndex];
  };

  // Effect to show the vote popup periodically
  useEffect(() => {
    // Initial timer to show first popup after a short delay (e.g., 10 seconds)
    const initialTimer = setTimeout(() => {
      setCurrentQuestion(getRandomQuestion());
      setShowVotePopup(true);
    }, 10000); // 10 seconds for first popup

    // Setup periodic timer for subsequent popups (every 2 minutes)
    const periodicTimer = setInterval(() => {
      setCurrentQuestion(getRandomQuestion());
      setShowVotePopup(true);
    }, 2 * 60 * 1000); // 2 minutes

    return () => {
      clearTimeout(initialTimer);
      clearInterval(periodicTimer);
    };
  }, []);

  // Function to handle vote popup close
  const handleVoteClose = (questionId, answer) => {
    setShowVotePopup(false);

    if (questionId && answer) {
      // Store the answer
      const votesHistory = JSON.parse(localStorage.getItem('votesHistory') || '{}');
      votesHistory[questionId] = answer;
      localStorage.setItem('votesHistory', JSON.stringify(votesHistory));

      // Track this question as recently asked
      const recentQuestions = JSON.parse(localStorage.getItem('recentQuestions') || '[]');

      // Add the current question to recent questions
      if (!recentQuestions.includes(questionId)) {
        // Keep only the last 3 questions to ensure rotation
        const updatedRecentQuestions = [...recentQuestions, questionId].slice(-3);
        localStorage.setItem('recentQuestions', JSON.stringify(updatedRecentQuestions));
      }

      console.log(`Saved vote: ${questionId} = ${answer}`);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-secondary overflow-x-hidden">
      {/* Background and Overlay Container */}
      <div className="fixed top-0 left-0 right-0 h-screen w-full z-0">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://curry.gg/images/bg_left.webp"
            alt="Background"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="object-center"
          />
        </div>

        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-secondary/5 to-secondary"></div>
      </div>

      {/* Content */}
      <div className="relative w-full z-10">
        <Header setIsMobileOpen={setIsMobileOpen} />
        <div className="flex flex-1">
          <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
          <main className="font-pilot flex-1 flex flex-col  mt-8 mb-4">
           

            <div className="sm:pl-16 md:pl-18">{children}</div>
          </main>
        </div>
           {/* Footer section */}
      
      </div>

      {/* Vote Popup */}
    </div>
  );
};

export default Layout;
