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
	 link: `https://gnews.ma/`,
        enabled: true
      },
      {
        image: "images/20250523_2358_Abstract_Game_Landscapes_simple_compose_01jvzjcqszezdbheaacge7fqcv.png",
        title: "Dashboard",
        description: "Track your progress, view statistics, and manage your gaming profile in one place.",
        link: `/tournaments`,
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

// "use client"
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const CARD_CONFIG = [
//   {
//     id: 'home',
//     image: "images/20250523_2358_Abstract_Game_Landscapes_simple_compose_01jvzjcqsyesps0bxff567n5cb.png",
//     title: "Home",
//     description: "Welcome to your gaming hub. Start your journey here with everything you need to get started.",
//     link: "https://gnews.ma/",
//     enabled: true
//   },
//   {
//     id: 'dashboard',
//     image: "images/20250523_2358_Abstract_Game_Landscapes_simple_compose_01jvzjcqszezdbheaacge7fqcv.png",
//     title: "Dashboard",
//     description: "Track your progress, view statistics, and manage your gaming profile in one place.",
//     link: "/tournaments",
//     enabled: true
//   },
//   {
//     id: 'news',
//     image: "/images/20250523_2358_Abstract_Game_Landscapes_simple_compose_01jvzjcqswfmd94yy93n5kb079.png",
//     title: "News",
//     description: "Stay updated with the latest gaming news, updates, and community highlights.",
//     link: "/news",
//     enabled: false
//   },
//   {
//     id: 'shop',
//     image: "/images/20250523_2358_Abstract_Game_Landscapes_simple_compose_01jvzjcqsxe5abjekq77rs6at2.png",
//     title: "Shop",
//     description: "Browse our collection of gaming gear, accessories, and digital content.",
//     link: "/shop",
//     enabled: false
//   }
// ];

// const AnimatedCards = ({ userId = null }) => {
//   const [isAnimated, setIsAnimated] = useState(false);
//   const [isLoading, setIsLoading] = useState(!userId);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [direction, setDirection] = useState(0);
//   const router = useRouter();
  
//   // Touch handling refs
//   const touchStartX = useRef(0);
//   const touchEndX = useRef(0);
//   const isDragging = useRef(false);

//   useEffect(() => {
//     if (userId) {
//       setIsLoading(false);
//     }
    
//     const timer = setTimeout(() => setIsAnimated(true), 100);
//     return () => clearTimeout(timer);
//   }, [userId]);

//   const nextSlide = useCallback(() => {
//     setDirection(1);
//     setCurrentIndex((prev) => (prev + 1) % CARD_CONFIG.length);
//   }, []);

//   const prevSlide = useCallback(() => {
//     setDirection(-1);
//     setCurrentIndex((prev) => (prev - 1 + CARD_CONFIG.length) % CARD_CONFIG.length);
//   }, []);

//   const goToSlide = useCallback((index) => {
//     setDirection(index > currentIndex ? 1 : -1);
//     setCurrentIndex(index);
//   }, [currentIndex]);

//   const handleCardClick = useCallback((card) => {
//     if (!card.enabled || !card.link) return;
    
//     if (card.link.startsWith('http')) {
//       window.location.href = card.link;
//     } else {
//       router.push(card.link);
//     }
//   }, [router]);

//   // Touch handlers
//   const handleTouchStart = useCallback((e) => {
//     touchStartX.current = e.touches[0].clientX;
//     isDragging.current = true;
//   }, []);

//   const handleTouchMove = useCallback((e) => {
//     if (!isDragging.current) return;
//     touchEndX.current = e.touches[0].clientX;
//   }, []);

//   const handleTouchEnd = useCallback(() => {
//     if (!isDragging.current) return;
    
//     const swipeDistance = touchStartX.current - touchEndX.current;
//     const minSwipeDistance = 50;
    
//     if (Math.abs(swipeDistance) > minSwipeDistance) {
//       if (swipeDistance > 0) {
//         nextSlide();
//       } else {
//         prevSlide();
//       }
//     }
    
//     isDragging.current = false;
//     touchStartX.current = 0;
//     touchEndX.current = 0;
//   }, [nextSlide, prevSlide]);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'ArrowLeft') prevSlide();
//       if (e.key === 'ArrowRight') nextSlide();
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [nextSlide, prevSlide]);

//   const getCardPosition = (index) => {
//     const diff = index - currentIndex;
//     const totalCards = CARD_CONFIG.length;
    
//     let normalizedDiff = diff;
//     if (Math.abs(diff) > totalCards / 2) {
//       normalizedDiff = diff > 0 ? diff - totalCards : diff + totalCards;
//     }
    
//     return normalizedDiff;
//   };

//   return (
//     <div 
//       className="min-h-screen bg-[#263238] flex items-center justify-center overflow-hidden relative touch-none"
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//     >
//       <PageTitle isAnimated={isAnimated} />
      
//       {/* Carousel Container */}
//       <div className="relative w-full h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
//         {/* Cards */}
//         <div className="relative w-full h-full flex items-center justify-center">
//           {CARD_CONFIG.map((card, index) => {
//             const position = getCardPosition(index);
//             const isCenter = position === 0;
//             const isVisible = Math.abs(position) <= 2;
            
//             return (
//               <Card
//                 key={card.id}
//                 card={card}
//                 position={position}
//                 isCenter={isCenter}
//                 isVisible={isVisible}
//                 isAnimated={isAnimated}
//                 onClick={() => {
//                   if (isCenter) {
//                     handleCardClick(card);
//                   } else {
//                     goToSlide(index);
//                   }
//                 }}
//               />
//             );
//           })}
//         </div>

//         {/* Navigation Buttons */}
//         <NavigationButton 
//           direction="left" 
//           onClick={prevSlide}
//           isAnimated={isAnimated}
//         />
//         <NavigationButton 
//           direction="right" 
//           onClick={nextSlide}
//           isAnimated={isAnimated}
//         />

//         {/* Swipe Indicator for Mobile */}
//         <SwipeIndicator isAnimated={isAnimated} />
//       </div>
//     </div>
//   );
// };

// const PageTitle = ({ isAnimated }) => (
//   <div
//     className="absolute left-1/2 -translate-x-1/2 sm:left-[10%] sm:translate-x-0 md:left-[20%] lg:left-[30%] top-[3%] sm:top-[5%] font-zentry uppercase whitespace-nowrap text-white z-50 px-4"
//     style={{
//       fontSize: 'clamp(2rem, 5vw, 6rem)',
//       opacity: isAnimated ? 1 : 0,
//       transition: 'opacity 0.8s ease 1.5s',
//       fontFeatureSettings: '"ss01" on',
//       fontWeight: 'bold',
//       letterSpacing: '0.05em'
//     }}
//   >
//     Choose Your Direction
//   </div>
// );

// const SwipeIndicator = ({ isAnimated }) => (
//   <div
//     className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 lg:hidden flex items-center gap-2 text-white/60 text-xs sm:text-sm z-50"
//     style={{
//       opacity: isAnimated ? 1 : 0,
//       transition: 'opacity 0.8s ease 2.5s',
//       animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//     }}
//   >
//     <ChevronLeft className="w-4 h-4" />
//     <span>Swipe to navigate</span>
//     <ChevronRight className="w-4 h-4" />
//   </div>
// );

// const Card = React.memo(({ card, position, isCenter, isVisible, isAnimated, onClick }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const getCardStyle = () => {
//     // Responsive translate distance based on screen size
//     const baseTranslate = position * (window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 400);
//     const scale = isCenter ? 1 : (window.innerWidth < 640 ? 0.75 : 0.7);
//     const opacity = isVisible ? (isCenter ? 1 : 0.5) : 0;
//     const zIndex = isCenter ? 50 : 40 - Math.abs(position);
    
//     return {
//       transform: `translateX(${baseTranslate}px) scale(${scale}) skewX(-10deg)`,
//       opacity: opacity,
//       zIndex: zIndex,
//       pointerEvents: isVisible ? 'auto' : 'none'
//     };
//   };

//   return (
//     <div
//       className="absolute transition-all duration-700 ease-out"
//       style={{
//         ...getCardStyle(),
//         height: 'clamp(350px, 70vh, 80vh)',
//         width: 'clamp(250px, 80vw, 400px)',
//         maxWidth: '90vw',
//         cursor: card.enabled ? 'pointer' : 'not-allowed',
//         filter: isHovered && card.enabled && isCenter ? 'brightness(1.1)' : 'brightness(1)'
//       }}
//       onClick={onClick}
//       onMouseEnter={() => isCenter && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className="relative overflow-hidden shadow-2xl"
//         style={{
//           height: isAnimated ? '100%' : '0%',
//           transition: 'height 1s ease 1s',
//           // borderRadius: 'clamp(8px, 2vw, 12px)'
//         }}
//       >
//         <CardImage 
//           src={card.image} 
//           alt={card.title} 
//           isAnimated={isAnimated}
//           isEnabled={card.enabled}
//           isHovered={isHovered && isCenter}
//         />
        
//         {!card.enabled && <DisabledOverlay />}
//         {card.enabled && <GradientOverlay isHovered={isHovered && isCenter} />}
        
//         <CardTitle title={card.title} isHovered={isHovered && isCenter} isCenter={isCenter} />
//         {card.enabled && isCenter && (
//           <CardDescription 
//             description={card.description} 
//             isHovered={isHovered} 
//           />
//         )}
//       </div>
//     </div>
//   );
// });

// Card.displayName = 'Card';

// const CardImage = React.memo(({ src, alt, isAnimated, isEnabled, isHovered }) => (
//   <img
//     src={src}
//     alt={alt}
//     loading="lazy"
//     className="h-full w-full object-cover transition-all duration-400"
//     style={{
//       opacity: isAnimated ? 1 : 0,
//       transform: isHovered && isEnabled ? 'scale(1.15)' : 'scale(1.1)',
//       transition: 'opacity 0.5s ease 2s, transform 0.4s ease'
//     }}
//   />
// ));

// CardImage.displayName = 'CardImage';

// const DisabledOverlay = React.memo(() => (
//   <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-25">
//     <div 
//       className="px-4 sm:px-5 py-2 sm:py-2.5  text-base sm:text-xl font-bold tracking-widest text-white"
//       style={{ transform: 'rotate(-10deg)' }}
//     >
//       Coming Soon
//     </div>
//   </div>
// ));

// DisabledOverlay.displayName = 'DisabledOverlay';

// const GradientOverlay = React.memo(({ isHovered }) => (
//   <div
//     className="absolute inset-x-0 bottom-0 h-full pointer-events-none z-5 transition-transform duration-500"
//     style={{
//       background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0) 100%)',
//       transform: 'translateY(0%)'
//     }}
//   />
// ));

// GradientOverlay.displayName = 'GradientOverlay';

// const CardTitle = React.memo(({ title, isHovered, isCenter }) => (
//   <div
//     className="absolute top-[12%] sm:top-[15%] uppercase whitespace-nowrap  font-zentry z-20 transition-all duration-400"
//     style={{
//       right: isCenter ? (isHovered ? '25%' : '20%') : '20%',
//       transform: 'translateY(-50%) rotate(-90deg)',
//       transformOrigin: 'right center',
//       fontSize: 'clamp(2rem, 4vw, 5rem)',
//       color: '#ff8c42',
//       textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(187, 170, 221, 0.5)',
//       fontFeatureSettings: '"ss01" on',
//       fontWeight: 'bold'
//     }}
//   >
//     {title}
//   </div>
// ));

// CardTitle.displayName = 'CardTitle';

// const CardDescription = React.memo(({ description, isHovered }) => (
//   <div
//     className="absolute right-[10%] sm:right-[15%] left-[8%] sm:left-[10%] p-3 sm:p-5  z-20 transition-all duration-400"
//     style={{
//       bottom: isHovered ? '3%' : '5%',
//       opacity: isHovered ? 1 : 0.9,
//       transform: isHovered ? 'translateY(-10px)' : 'translateY(0)'
//     }}
//   >
//     <p className="text-xs sm:text-sm md:text-base text-white leading-relaxed">
//       {description}
//     </p>
//   </div>
// ));

// CardDescription.displayName = 'CardDescription';

// const NavigationButton = ({ direction, onClick, isAnimated }) => {
//   const isLeft = direction === 'left';
  
//   return (
//     <button
//       onClick={onClick}
//       className="hidden lg:block absolute top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 lg:p-3 transition-all duration-300 hover:scale-110 active:scale-95"
//       style={{
//         [isLeft ? 'left' : 'right']: 'clamp(2%, 5vw, 5%)',
//         opacity: isAnimated ? 1 : 0,
//         transition: 'opacity 0.8s ease 2s, background-color 0.3s, transform 0.3s'
//       }}
//       aria-label={isLeft ? 'Previous card' : 'Next card'}
//     >
//       {isLeft ? (
//         <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
//       ) : (
//         <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
//       )}
//     </button>
//   );
// };

// export default AnimatedCards;