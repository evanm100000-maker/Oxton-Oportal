import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SecretTimer() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // 1st August 2026 18:00 BST = 17:00 UTC
    const targetDate = new Date('2026-08-01T17:00:00Z').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft('00:00:00:00');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const format = (n) => String(n).padStart(2, '0');
      setTimeLeft(`${format(days)}d ${format(hours)}h ${format(minutes)}m ${format(seconds)}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes screenFlicker {
            0% { opacity: 0.95; }
            5% { opacity: 0.8; }
            10% { opacity: 0.95; }
            15% { opacity: 1; }
            50% { opacity: 0.95; }
            55% { opacity: 0.7; }
            60% { opacity: 1; }
            100% { opacity: 0.95; }
          }
          .shattered-glass {
            position: fixed;
            bottom: -50px;
            right: -50px;
            width: 400px;
            height: 400px;
            z-index: 9997;
            pointer-events: none;
          }
          .glass-crack {
            stroke: rgba(255, 255, 255, 0.3);
            stroke-width: 1.5;
            fill: none;
            filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.8));
          }
          .glass-crack-dark {
            stroke: rgba(0, 0, 0, 0.6);
            stroke-width: 2;
            fill: none;
          }
          .timer-screen-casing {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #111;
            border: 8px solid #222;
            border-radius: 12px;
            padding: 15px 25px;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,1);
            transform: rotate(-3deg);
            /* Smashed corner effect */
            clip-path: polygon(0 0, 100% 0, 100% 85%, 90% 90%, 85% 100%, 0 100%);
          }
          .timer-screen {
            position: relative;
            background: #050505;
            border: 2px solid #000;
            padding: 15px 20px;
            overflow: hidden;
            box-shadow: inset 0 0 15px rgba(0,0,0,1);
            animation: screenFlicker 4s infinite;
          }
          .timer-screen::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(
              rgba(18, 16, 16, 0) 50%, 
              rgba(0, 0, 0, 0.25) 50%), 
              linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
            z-index: 2;
            pointer-events: none;
          }
          .scanline {
            position: absolute;
            top: 0; left: 0; right: 0; height: 10%;
            background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: scanline 3s linear infinite;
            z-index: 3;
            pointer-events: none;
          }
          .screen-text {
            position: relative;
            z-index: 1;
            text-shadow: 0 0 5px rgba(255, 0, 0, 0.7);
          }
        `}
      </style>

      {/* Shattered Glass SVG overlaying the background */}
      <svg className="shattered-glass" viewBox="0 0 400 400">
        <g className="glass-crack-dark">
          <path d="M 200 200 L 0 50" />
          <path d="M 200 200 L 80 0" />
          <path d="M 200 200 L 350 0" />
          <path d="M 200 200 L 400 150" />
          <path d="M 200 200 L 0 250" />
          
          <path d="M 80 120 L 120 70 L 180 50" />
          <path d="M 250 80 L 290 120 L 320 70" />
          <path d="M 120 180 L 60 160" />
        </g>
        <g className="glass-crack">
          <path d="M 198 198 L -2 48" />
          <path d="M 198 198 L 78 -2" />
          <path d="M 198 198 L 348 -2" />
          <path d="M 198 198 L 398 148" />
          <path d="M 198 198 L -2 248" />
          
          <path d="M 78 118 L 118 68 L 178 48" />
          <path d="M 248 78 L 288 118 L 318 68" />
          <path d="M 118 178 L 58 158" />
          <path d="M 220 180 L 260 140 L 280 160" />
        </g>
        
        {/* Central impact point shattering */}
        <path d="M 180 190 L 210 180 L 220 210 L 190 220 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
        <path d="M 210 180 L 240 160 L 250 190 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" />
        <path d="M 180 190 L 150 170 L 160 200 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      </svg>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0, x: 50 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="timer-screen-casing"
      >
        <div className="timer-screen">
          <div className="scanline" />
          
          <div className="screen-text" style={{ 
            color: '#ff3333', 
            fontWeight: '900', 
            letterSpacing: '6px', 
            fontSize: '1.2rem', 
            marginBottom: '10px', 
            fontFamily: 'Impact, sans-serif',
            textAlign: 'center'
          }}>
            Coming Soon...
          </div>
          
          <div className="screen-text" style={{ 
            color: '#ff1111', 
            fontFamily: '"Courier New", Courier, monospace', 
            fontSize: '1.6rem', 
            fontWeight: 'bold', 
            letterSpacing: '2px',
            textAlign: 'center'
          }}>
            {timeLeft || '00d 00h 00m 00s'}
          </div>
        </div>
      </motion.div>
    </>
  );
}
