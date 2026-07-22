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
          @keyframes intenseFlameFlicker {
            0% { transform: scale(1) translateY(0) rotate(-45deg); opacity: 0.9; background: #fff700; box-shadow: 0 0 15px #ff9900, 0 0 30px #ff0000; }
            50% { transform: scale(1.5) translateY(-6px) rotate(-45deg); opacity: 1; background: #ff4500; box-shadow: 0 0 25px #ff4500, 0 0 50px #ff0000; }
            100% { transform: scale(0.8) translateY(-12px) rotate(-45deg); opacity: 0; background: #ff0000; box-shadow: 0 0 10px #ff0000; }
          }
          @keyframes textGlitchExtreme {
            0% { text-shadow: 4px 0 red, -4px 0 blue; transform: skewX(0deg); }
            5% { text-shadow: -4px 0 red, 4px 0 blue; transform: skewX(-10deg); }
            10% { text-shadow: 4px 0 red, -4px 0 blue; transform: skewX(10deg); }
            15% { text-shadow: -4px 0 red, 4px 0 blue; transform: skewX(0deg); }
            100% { text-shadow: 2px 0 red, -2px 0 blue; transform: skewX(0deg); }
          }
          @keyframes crackGlow {
            0% { filter: drop-shadow(0 0 5px #ff4500); opacity: 0.6; }
            50% { filter: drop-shadow(0 0 15px #ff0000); opacity: 1; }
            100% { filter: drop-shadow(0 0 5px #ff4500); opacity: 0.6; }
          }
          @keyframes pulsingCore {
            0% { box-shadow: 0 0 30px #ff0000, inset 0 0 40px #ff4500; }
            50% { box-shadow: 0 0 60px #ff0000, inset 0 0 80px #ff9900; }
            100% { box-shadow: 0 0 30px #ff0000, inset 0 0 40px #ff4500; }
          }
          @keyframes emberFloat {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-100px) scale(0); opacity: 0; }
          }
          
          .flame-particle {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50% 0 50% 50%;
            animation: intenseFlameFlicker 0.5s infinite alternate;
            mix-blend-mode: screen;
          }
          
          .ember {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ffcc00;
            border-radius: 50%;
            box-shadow: 0 0 10px #ff4500, 0 0 20px #ff0000;
            animation: emberFloat 2s linear infinite;
          }

          .smash-cracks {
            position: fixed;
            bottom: -50px;
            right: -50px;
            width: 500px;
            height: 500px;
            z-index: 9998;
            pointer-events: none;
            opacity: 0.8;
          }

          .timer-core {
            position: fixed;
            bottom: -20px;
            right: -20px;
            background: linear-gradient(135deg, #1a0505 0%, #300 50%, #111 100%);
            border: 4px solid #ff3333;
            padding: 30px 50px 40px 40px;
            text-align: center;
            z-index: 9999;
            min-width: 350px;
            clip-path: polygon(10% 0, 95% 10%, 100% 90%, 90% 100%, 0 95%, 5% 10%); /* Jagged concrete shape */
            animation: pulsingCore 2s infinite alternate;
            transform: rotate(-12deg);
          }
          
          .timer-core::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(0, 0, 0, 0.4) 10px,
              rgba(0, 0, 0, 0.4) 20px
            );
            z-index: 1;
            pointer-events: none;
          }
          
          .shatter-hole {
            position: fixed;
            bottom: -50px;
            right: -50px;
            width: 400px;
            height: 350px;
            background: radial-gradient(circle at center, #000 30%, transparent 70%);
            z-index: 9997;
            pointer-events: none;
            box-shadow: inset 0 0 100px rgba(0,0,0,1);
          }
        `}
      </style>
      
      {/* Background hole shadow */}
      <div className="shatter-hole" />

      {/* SVG Cracks radiating outward */}
      <svg className="smash-cracks" viewBox="0 0 500 500">
        <g style={{ animation: 'crackGlow 3s infinite alternate', stroke: '#ff2200', strokeWidth: 3, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
          <path d="M 250 250 L 50 100 L 20 80 M 50 100 L 10 130" />
          <path d="M 250 250 L 100 300 L 20 320 M 100 300 L 80 400" />
          <path d="M 250 250 L 200 50 L 180 10" />
          <path d="M 250 250 L 350 30 L 400 10 M 350 30 L 320 0" />
          <path d="M 250 250 L 80 200 L 10 180" />
          <path d="M 250 250 L 220 450 L 200 480" />
          <path d="M 250 250 L 380 400 L 450 450" />
          {/* Secondary smaller cracks */}
          <path d="M 150 175 L 120 120" strokeWidth="1.5" stroke="#ff5500" />
          <path d="M 180 270 L 130 250" strokeWidth="1.5" stroke="#ff5500" />
          <path d="M 270 150 L 230 100" strokeWidth="1.5" stroke="#ff5500" />
        </g>
      </svg>

      <motion.div 
        initial={{ scale: 0.1, opacity: 0, rotate: 180 }}
        animate={{ scale: 1, opacity: 1, rotate: -12 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="timer-core"
      >
        {/* Intense Flames */}
        <div style={{ position: 'absolute', top: '10px', left: '20px', width: '90%', height: '20px', display: 'flex', justifyContent: 'space-between', zIndex: 4 }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flame-particle" style={{ left: `${i * 8}%`, animationDelay: `${Math.random() * 0.4}s`, transform: `scale(${0.8 + Math.random() * 0.7})` }} />
          ))}
        </div>

        {/* Flying Embers */}
        <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
          {[...Array(15)].map((_, i) => (
            <div key={`ember-${i}`} className="ember" style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s` 
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ 
            color: '#fff', 
            fontWeight: '900', 
            letterSpacing: '8px', 
            fontSize: '1.8rem', 
            marginBottom: '15px', 
            fontFamily: 'Impact, sans-serif',
            textTransform: 'uppercase',
            animation: 'textGlitchExtreme 2s infinite',
            textShadow: '0 0 10px #ff0000, 0 0 20px #ff4500'
          }}>
            TOP SECRET
          </div>
          
          <div style={{ 
            color: '#ffdd00', 
            fontFamily: '"Courier New", Courier, monospace', 
            fontSize: '2rem', 
            fontWeight: '900', 
            letterSpacing: '4px',
            textShadow: '0 0 15px rgba(255, 69, 0, 1), 0 0 30px rgba(255, 0, 0, 0.8)',
            background: 'rgba(0,0,0,0.8)',
            padding: '12px 15px',
            borderRadius: '8px',
            border: '2px solid rgba(255,0,0,0.5)',
            boxShadow: 'inset 0 0 20px rgba(255,0,0,0.5)'
          }}>
            {timeLeft || '00d 00h 00m 00s'}
          </div>
        </div>
      </motion.div>
    </>
  );
}
