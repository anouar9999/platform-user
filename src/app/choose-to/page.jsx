"use client"
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AnimatedCards = () => {
  const [animated, setAnimated] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  // Safe localStorage access with error handling
  useEffect(() => {
    try {
      const authData = localStorage.getItem('authData');
      if (authData) {
        const parsedData = JSON.parse(authData);
        setUserData(parsedData);
        console.log('User ID:', parsedData.userId);
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }, []);

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Memoized card data to prevent unnecessary re-renders
  const allCards = useMemo(() => {
    if (!userData) return [];
    
    return [
      {
        image: "images/20250523_2358_Abstract_Game_Landscapes_simple_compose_01jvzjcqsyesps0bxff567n5cb.png",
        title: "Home",
        description: "Welcome to your gaming hub. Start your journey here with everything you need to get started.",
        link: `http://localhost:5173`,
        enabled: true
      },
      {
        image: "images/20250523_2358_Abstract_Game_Landscapes_simple_compose_01jvzjcqszezdbheaacge7fqcv.png",
        title: "Dashboard",
        description: "Track your progress, view statistics, and manage your gaming profile in one place.",
        link: "http://localhost:3000/tournaments",
        enabled: true
      },
      {
        image: "/images/20250523_2358_Abstract_Game_Landscapes_simple_compose_01jvzjcqswfmd94yy93n5kb079.png",
        title: "News",
        description: "Stay updated with the latest gaming news, updates, and community highlights.",
        link: "/news",
        enabled: false
      },
      {
        image: "/images/20250523_2358_Abstract_Game_Landscapes_simple_compose_01jvzjcqsxe5abjekq77rs6at2.png",
        title: "Shop",
        description: "Browse our collection of gaming gear, accessories, and digital content.",
        link: "/shop",
        enabled: false
      }
    ];
  }, [userData]);

  // Optimized card click handler
  const handleCardClick = useCallback((card) => {
    if (card.enabled && card.link) {
      router.push(card.link);
    }
  }, [router]);

  // Early return if no user data
  if (!userData) {
    return (
      <div style={{
        backgroundColor: '#263238',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#263238',
      fontFamily: 'Merriweather, serif',
      color: 'white',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Vertical Title */}
      <div
        className="font-free-fire"
        style={{
          position: 'absolute',
          left: '10%',
          top: '5%',
          // transformOrigin: 'left center',
          fontSize: 'clamp(2.5rem, 3vw, 3rem)',
          fontWeight: '800',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.8s ease 1.5s',

        }}
      >
        Choose Your Direction
      </div>

      {/* Cards */}
      {allCards.map((card, index) => (
        <Card
          key={`card-${index}`}
          card={card}
          index={index}
          animated={animated}
          onClick={() => handleCardClick(card)}
        />
      ))}
    </div>
  );
};

// Extracted Card component for better organization and performance
const Card = React.memo(({ card, index, animated, onClick }) => {
  const cardStyle = {
    transform: 'skewX(-10deg)',
    height: '80vh',
    width: 'calc(25vw - 25px)',
    minWidth: '200px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: card.enabled ? 'pointer' : 'not-allowed',
    filter: 'brightness(1) blur(0px)',
    zIndex: 10,
    position: 'relative',
    opacity: card.enabled ? 1 : 0.7
  };

  const imgWrapperStyle = {
    position: 'relative',
    transform: 'translate(50px, 0)',
    height: animated ? '100vh' : '0px',
    transition: 'height 1s ease 1s, background-color 1s ease 1s',
    overflow: 'hidden'
  };

  const imgStyle = {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    opacity: animated ? 1 : 0,
    transition: 'opacity 0.5s ease 2s, transform 0.4s ease',
    transform: card.enabled ? 'scale(1.1)' : 'scale(1)'
  };

  return (
    <div className="card" onClick={onClick} style={cardStyle}>
      
      <div className="img-wrapper" style={imgWrapperStyle}>
        <img
          className="img"
          src={card.image}
          alt={card.title}
          style={imgStyle}
          loading="lazy"
        />

        {/* Disabled overlay */}
        {!card.enabled && (
          <DisabledOverlay />
        )}

        {/* Bottom gradient overlay - only for enabled cards */}
        {card.enabled && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '100%',
              background: `linear-gradient(to top, 
                rgba(0, 0, 0, 0.9) 0%, 
                rgba(0, 0, 0, 0.6) 50%,
                rgba(0, 0, 0, 0) 100%)`,
              transform: 'translateY(0%)',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none',
              zIndex: 5
            }}
          />
        )}

        {/* Hover overlay - only for enabled cards */}
        {card.enabled && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transition: 'background 0.3s ease',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Card Title */}
        <CardTitle title={card.title} />

        {/* Card Description - only for enabled cards */}
        <CardDescription description={card.description} />
      </div>
    </div>
  );
});

Card.displayName = 'Card';

// Extracted components for better readability
const DisabledOverlay = React.memo(() => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25
  }}>
    <div 
      className='font-valorant tracking-widest' 
      style={{
        padding: '10px 20px',
        borderRadius: '4px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        transform: 'rotate(-10deg)'
      }}
    >
      Coming Soon
    </div>
  </div>
));
DisabledOverlay.displayName = 'DisabledOverlay';

const CardTitle = React.memo(({ title }) => (
  <div
    className='font-free-fire text-orange-mge'
    style={{
      position: 'absolute',
      right: '20%',
      top: '15%',
      transform: 'translateY(-50%) rotate(-90deg)',
      transformOrigin: 'right center',
      padding: '15px 30px',
      borderRadius: '8px',
      transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: 1,
      whiteSpace: 'nowrap',
      fontSize: 'clamp(4rem, 5vw, 5rem)',
      fontWeight: '600',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(187, 170, 221, 0.5)',
      zIndex: 20
    }}
  >
    {title}
  </div>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.memo(({ description }) => (
  <div
    className="description"
    style={{
      position: 'absolute',
      bottom: '40%',
      top: '60%',
      right: '30%',
      padding: '20px',
      borderRadius: '8px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: 1,
      zIndex: 20,
      transform: 'translateY(0)'
    }}
  >
    <p className="text-lg font-ea-football text-white mb-2">
      {description}
    </p>
  </div>
));
CardDescription.displayName = 'CardDescription';

export default AnimatedCards;