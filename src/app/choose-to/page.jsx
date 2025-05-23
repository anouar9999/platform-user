"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AnimatedCards = () => {
  const [animated, setAnimated] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const router = useRouter();
  const userData = JSON.parse(localStorage.getItem('authData'))
console.log(userData.userId)
  // Set animated state after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Define all card data with links
  const allCards = [
    {
      image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/75de3cbd3816ca43b8ea74788d0de09a8900f1a4-1280x720.jpg",
      title: "Home",
      description: "Welcome to your gaming hub. Start your journey here with everything you need to get started.",
link: `http://localhost:5173?userId=${userData.userId}&token=${userData.sessionToken}`
    },
    {
      image: "https://preview.redd.it/qyqwlhmu3j0e1.jpeg?width=640&crop=smart&auto=webp&s=ad4e35481a2553775e1e2ccb32cfdf9129ecee3b",
      title: "Dashboard",
      description: "Track your progress, view statistics, and manage your gaming profile in one place.",
      link: "http://localhost:3000/tournaments"
    },
    {
      image: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/arcane-poster-daniel-turner.jpg",
      title: "News",
      description: "Stay updated with the latest gaming news, updates, and community highlights.",
      link: "/news"
    },
    {
      image: "https://i.redd.it/s4x3e1zs9h0e1.jpeg",
      title: "Shop",
      description: "Browse our collection of gaming gear, accessories, and digital content.",
      link: "/shop"
    }
  ];

  // Handle card click
  const handleCardClick = (index) => {
    const card = allCards[index];
    if (!isDisabled(index)) {
      router.push(card.link);
    }
  };

  // Check if card is disabled
  const isDisabled = (index) => index >= 2;

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
        className="font-free-fire text-white"
        style={{
          position: 'absolute',
          left: '20px',
          top: '90%',
          transform: 'translateY(-50%) rotate(-80deg)',
          transformOrigin: 'left center',
          fontSize: 'clamp(2.5rem, 3vw, 3rem)',
          fontWeight: '800',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',

          opacity: animated ? 1 : 0,
          transition: 'opacity 0.8s ease 1.5s'
        }}
      >
        Choose Your Direction
      </div>

      {/* Cards - showing all but disabling last two */}
      {allCards.map((card, index) => {
        const isCardDisabled = isDisabled(index);

        return (
          <div
            key={index}
            className="card"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(index)}
            style={{
              transform: `skewX(-10deg)`,
              height: '100vh',
              width: 'calc(25vw - 25px)',
              minWidth: '200px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: isCardDisabled ? 'not-allowed' : 'pointer',
              filter: isCardDisabled
                ? ''
                : hoveredCard !== null && hoveredCard !== index
                  ? ''
                  : 'brightness(1) blur(0px)',
              zIndex: hoveredCard === index ? 10 : 1,
              position: 'relative',
              opacity: isCardDisabled ? 0.7 : 1
            }}
          >
            <div
              className="img-wrapper"
              style={{
                position: 'relative',
                transform: 'translate(50px, 0)',
                height: animated ? '100vh' : '0px',
                backgroundColor: animated ? '#bbaadd' : 'transparent',
                transition: 'height 1s ease 1s, background-color 1s ease 1s',
                overflow: 'hidden',
                boxShadow: hoveredCard === index
                  ? '0 0 40px rgba(187, 170, 221, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1)'
                  : '0 0 0px rgba(187, 170, 221, 0)'
              }}
            >
              <img
                className="img"
                src={card.image}
                alt={`Card ${index + 1}`}
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                  opacity: animated ? 1 : 0,
                  transition: 'opacity 0.5s ease 2s, transform 0.4s ease',
                  transform: hoveredCard === index ? 'scale(1.1)' : 'scale(1)'
                }}
              />

              {/* Disabled overlay for last two cards */}
              {isCardDisabled && (
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
                  <div className='font-valorant tracking-widest' style={{
                    padding: '10px 20px',

                    borderRadius: '4px',

                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    transform: 'rotate(-10deg)'
                  }}>
                    Coming Soon
                  </div>
                </div>
              )}

              {/* Bottom overlay with gradient - only for enabled cards */}
              {!isCardDisabled && (
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
                    transform: `translateY(${hoveredCard === index ? '0%' : '100%'})`,
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: 'none',
                    zIndex: 5
                  }}
                />
              )}

              {/* Hover overlay with gradient - only for enabled cards */}
              {!isCardDisabled && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: hoveredCard === index
                      ? 'linear-gradient(45deg, rgba(187, 170, 221, 0.2) 0%, rgba(225, 190, 231, 0.1) 100%)'
                      : 'transparent',
                    transition: 'background 0.3s ease',
                    pointerEvents: 'none'
                  }}
                />
              )}

              {/* Shine effect - only for enabled cards */}
              {!isCardDisabled && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: hoveredCard === index ? '0%' : '-100%',
                    width: '100%',
                    height: '100%',
                    transition: 'left 0.6s ease',
                    pointerEvents: 'none',
                    opacity: hoveredCard === index ? 1 : 0,
                    zIndex: 6
                  }}
                />
              )}

              {/* Vertical title that appears on hover */}
              <div
                className='font-free-fire text-orange-mge'
                style={{
                  position: 'absolute',
                  right: hoveredCard === index ? '30px' : '-50px',
                  top: '20%',
                  right: '20%',
                  transform: 'translateY(-50%) rotate(-90deg)',
                  transformOrigin: 'right center',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: hoveredCard === index ? 1 : 0,
                  whiteSpace: 'nowrap',
                  fontSize: 'clamp(4rem, 5vw, 5rem)',
                  fontWeight: '600',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(187, 170, 221, 0.5)',
                  zIndex: 20
                }}
              >
                {card.title}
              </div>

              {/* Description that appears on hover - only for enabled cards */}
              {!isCardDisabled && (
                <div
                  className="description"
                  style={{
                    position: 'absolute',
                    bottom: hoveredCard === index ? '50px' : '-100px',
                    top: '70%',
                    right: '30%',
                    padding: '20px',
                    borderRadius: '8px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: hoveredCard === index ? 1 : 0,
                    zIndex: 20,
                    transform: hoveredCard === index ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <p className="text-lg font-ea-football text-white mb-2">
                    {card.description}
                  </p>


                </div>
              )}


            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnimatedCards;