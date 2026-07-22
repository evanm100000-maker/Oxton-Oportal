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
          @keyframes flameFlicker {
            0% { transform: scale(1) translateY(0) rotate(-45deg); opacity: 0.8; background: #ff9900; box-shadow: 0 0 10px #ff9900, 0 0 20px #ff0000; }
            50% { transform: scale(1.3) translateY(-4px) rotate(-45deg); opacity: 1; background: #ff4500; box-shadow: 0 0 15px #ff4500, 0 0 30px #ff0000; }
            100% { transform: scale(0.9) translateY(-8px) rotate(-45deg); opacity: 0; background: #ff0000; box-shadow: 0 0 5px #ff0000; }
          }
          @keyframes textGlitch {
            0% { text-shadow: 2px 0 red, -2px 0 blue; transform: skewX(0deg); }
            5% { text-shadow: -2px 0 red, 2px 0 blue; transform: skewX(-5deg); }
            10% { text-shadow: 2px 0 red, -2px 0 blue; transform: skewX(5deg); }
            15% { text-shadow: -2px 0 red, 2px 0 blue; transform: skewX(0deg); }
            100% { text-shadow: 2px 0 red, -2px 0 blue; transform: skewX(0deg); }
          }
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes glowPulse {
            0% { text-shadow: 0 0 10px #fff, 0 0 20px #ff0000, 0 0 30px #ff0000; }
            50% { text-shadow: 0 0 20px #fff, 0 0 30px #ff4500, 0 0 40px #ff0000; }
            100% { text-shadow: 0 0 10px #fff, 0 0 20px #ff0000, 0 0 30px #ff0000; }
          }
          .flame-particle {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50% 0 50% 50%;
            animation: flameFlicker 0.6s infinite alternate;
            mix-blend-mode: screen;
          }
          .cyber-container {
            position: fixed;
            bottom: -10px;
            right: -20px;
            background: linear-gradient(135deg, #1a0505 0%, #300 50%, #111 100%);
            border-left: 4px solid #ff3333;
            border-top: 4px solid #ff3333;
            border-top-left-radius: 20px;
            padding: 24px 40px 32px 32px;
            text-align: center;
            z-index: 9999;
            min-width: 300px;
            clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 25%);
            box-shadow: -10px -10px 40px rgba(255, 0, 0, 0.4), inset 5px 5px 20px rgba(255, 0, 0, 0.3);
            overflow: hidden;
          }
          .cyber-container::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 0, 0, 0.1) 2px,
              rgba(255, 0, 0, 0.1) 4px
            );
            z-index: 1;
            pointer-events: none;
          }
          .scanline {
            position: absolute;
            top: 0; left: 0; right: 0; height: 20%;
            background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent);
            animation: scanline 2s linear infinite;
            z-index: 2;
            pointer-events: none;
          }
          .hazard-stripes {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 6px;
            background: repeating-linear-gradient(
              45deg,
              #ffcc00,
              #ffcc00 10px,
              #000 10px,
              #000 20px
            );
            z-index: 3;
          }
        `}
      </style>
      
      <motion.div 
        initial={{ opacity: 0, x: 100, y: 100, rotate: 0 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: -10 }}
        transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.5 }}
        className="cyber-container"
      >
        <div className="hazard-stripes" />
        <div className="scanline" />
        
        {/* Flames container */}
        <div style={{ position: 'absolute', top: '2px', left: '10px', width: '90%', height: '15px', display: 'flex', justifyContent: 'space-between', zIndex: 4 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flame-particle" style={{ left: \`\${i * 12}%\`, animationDelay: \`\${Math.random() * 0.5}s\`, transform: \`scale(\${0.8 + Math.random() * 0.5})\` }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 5 }}>
          <div style={{ 
            color: '#fff', 
            fontWeight: '900', 
            letterSpacing: '8px', 
            fontSize: '1.4rem', 
            marginBottom: '12px', 
            fontFamily: 'Impact, sans-serif',
            textTransform: 'uppercase',
            animation: 'textGlitch 3s infinite',
          }}>
            TOP SECRET
          </div>
          
          <div style={{ 
            color: '#fff', 
            fontFamily: '"Courier New", Courier, monospace', 
            fontSize: '1.8rem', 
            fontWeight: 'bold', 
            letterSpacing: '3px',
            animation: 'glowPulse 2s infinite alternate',
            background: 'rgba(0,0,0,0.5)',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(255,0,0,0.3)'
          }}>
            {timeLeft || '00d 00h 00m 00s'}
          </div>
        </div>
      </motion.div>
    </>
  );
}
