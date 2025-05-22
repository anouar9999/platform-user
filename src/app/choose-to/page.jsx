"use client"
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const ChooseTo = () => {
  const router = useRouter();

  const handlePortalClick = (path) => {
    document.getElementById('loader-container').classList.remove('hidden');
    setTimeout(() => {
      router.push(path);
    }, 1000);
  };

  return (
    <StyledWrapper>
      {/* Background */}
      <div className="fixed inset-0 bg-black bg-opacity-90 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-gray-800/20 to-black"></div>
      </div>
      
      {/* Portal Cards Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-16 relative z-20">
          Choose Your <span className="text-orange-500">Path</span>
          <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-transparent"></div>
        </h1>
        
        <div className="portal-cards-container">
          <div 
            className="portal-card"
            onClick={() => handlePortalClick('/dashboard')}
            style={{"--index": "0"}}
          >
            <img 
              src="/dashboard-bg.jpg" 
              alt="Dashboard"
              className="portal-image"
            />
            <div className="portal-content">
              <h2>Dashboard</h2>
            </div>
          </div>
          
          <div 
            className="portal-card"
            onClick={() => handlePortalClick('/tournaments')}
            style={{"--index": "1"}}
          >
            <img 
              src="/tournaments-bg.jpg" 
              alt="Tournaments"
              className="portal-image"
            />
            <div className="portal-content">
              <h2>Tournaments</h2>
            </div>
          </div>
          
          <div 
            className="portal-card"
            onClick={() => handlePortalClick('/community')}
            style={{"--index": "2"}}
          >
            <img 
              src="/community-bg.jpg" 
              alt="Community"
              className="portal-image"
            />
            <div className="portal-content">
              <h2>Community</h2>
            </div>
          </div>
          
          <div 
            className="portal-card"
            onClick={() => handlePortalClick('/store')}
            style={{"--index": "3"}}
          >
            <img 
              src="/store-bg.jpg" 
              alt="Store"
              className="portal-image"
            />
            <div className="portal-content">
              <h2>Store</h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loader */}
      <div id="loader-container" className="hidden">
        <div className='flex items-center justify-center bg-black w-screen h-screen fixed top-0 left-0 z-50'>
          <div className="loader">
            <svg viewBox="0 0 80 80">
              <circle r={32} cy={40} cx={40} id="test" />
            </svg>
          </div>
          <div className="loader triangle">
            <svg viewBox="0 0 86 80">
              <polygon points="43 8 79 72 7 72" />
            </svg>
          </div>
          <div className="loader">
            <svg viewBox="0 0 80 80">
              <rect height={64} width={64} y={8} x={8} />
            </svg>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .portal-cards-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: -100px;
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  .portal-card {
    position: relative;
    width: 300px;
    height: 400px;
    background: #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transform: rotate3d(1, 1, 0, 15deg) translateX(calc(var(--index) * -100px));
    transition: all 0.4s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

    &:hover {
      transform: rotate3d(1, 1, 0, 0deg) translateX(calc(var(--index) * -100px)) translateZ(50px);
      z-index: 10;
    }
  }

  .portal-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
    transition: opacity 0.4s ease;
  }

  .portal-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    color: white;

    h2 {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }
  }
  
  .portal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #d65032 0%, #ff8c42 100%);
    opacity: 0.3;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  .loader {
    --path: #2f3545;
    --dot: #d65032;
    --duration: 3s;
    width: 80px;
    height: 80px;
    position: relative;
  }

  .loader:before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    display: block;
    background: var(--dot);
    top: 67px;
    left: 34px;
    transform: translate(-18px, -18px);
    animation: dotRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
      infinite;
  }

  .loader svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .loader svg rect,
  .loader svg polygon,
  .loader svg circle {
    fill: none;
    stroke: var(--path);
    stroke-width: 10px;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .loader svg polygon {
    stroke-dasharray: 145 76 145 76;
    stroke-dashoffset: 0;
    animation: pathTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
      infinite;
  }

  .loader svg rect {
    stroke-dasharray: 192 64 192 64;
    stroke-dashoffset: 0;
    animation: pathRect 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
  }

  .loader svg circle {
    stroke-dasharray: 150 50 150 50;
    stroke-dashoffset: 75;
    animation: pathCircle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
      infinite;
  }

  .loader.triangle {
    width: 86px;
  }

  .loader.triangle:before {
    left: 38px;  /* Adjusted from 21px */
    top: 67px;   /* Added top position */
    transform: translate(-10px, -18px);
    animation: dotTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
      infinite;
  }

  @keyframes pathTriangle {
    33% {
      stroke-dashoffset: 74;
    }

    66% {
      stroke-dashoffset: 147;
    }

    100% {
      stroke-dashoffset: 221;
    }
  }

  @keyframes dotTriangle {
    33% {
      transform: translate(0, 0);
    }

    66% {
      transform: translate(18px, -32px);  /* Adjusted from 10px, -18px */
    }

    100% {
      transform: translate(-18px, -32px);  /* Adjusted from -10px, -18px */
    }
  }

  @keyframes pathRect {
    25% {
      stroke-dashoffset: 64;
    }

    50% {
      stroke-dashoffset: 128;
    }

    75% {
      stroke-dashoffset: 192;
    }

    100% {
      stroke-dashoffset: 256;
    }
  }

  @keyframes dotRect {
    25% {
      transform: translate(0, 0);
    }

    50% {
      transform: translate(32px, -32px);  /* Adjusted from 18px, -18px */
    }

    75% {
      transform: translate(0, -64px);  /* Adjusted from 0, -36px */
    }

    100% {
      transform: translate(-32px, -32px);  /* Adjusted from -18px, -18px */
    }
  }

  @keyframes pathCircle {
    25% {
      stroke-dashoffset: 125;
    }

    50% {
      stroke-dashoffset: 175;
    }

    75% {
      stroke-dashoffset: 225;
    }

    100% {
      stroke-dashoffset: 275;
    }
  }

  .loader {
    display: inline-block;
    margin: 0 30px;  /* Increased from 16px for more spacing between elements */
  }`;

export default ChooseTo;
