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
            0% { transform: scale(1) translateY(0) rotate(-45deg); opacity: 0.8; background: #ff9900; }
            50% { transform: scale(1.2) translateY(-3px) rotate(-45deg); opacity: 1; background: #ff4500; }
            100% { transform: scale(0.9) translateY(-6px) rotate(-45deg); opacity: 0; background: #ff0000; }
          }
          .flame-particle {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50% 0 50% 50%;
            animation: flameFlicker 0.6s infinite alternate;
          }
        `}
      </style>
      <motion.div 
        initial={{ opacity: 0, x: 50, y: 50, rotate: 0 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: -8 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        style={{
          position: 'fixed',
          bottom: '-5px',
          right: '-15px',
          background: 'linear-gradient(135deg, #111 0%, #300 100%)',
          border: '2px solid #ef4444',
          borderBottom: 'none',
          borderRight: 'none',
          borderTopLeftRadius: '16px',
          padding: '16px 32px 24px 24px',
          textAlign: 'center',
          zIndex: 9999,
          boxShadow: '-5px -5px 30px rgba(239, 68, 68, 0.6), inset 0 0 15px rgba(239, 68, 68, 0.3)',
          minWidth: '280px',
          clipPath: 'polygon(0% 0%, 100% 5%, 95% 100%, 5% 100%)'
        }}
      >
        {/* Flames container */}
        <div style={{ position: 'absolute', top: '-6px', left: '20px', width: '80%', height: '10px', display: 'flex', justifyContent: 'space-between', zIndex: -1 }}>
          <div className="flame-particle" style={{ left: '10%', animationDelay: '0.1s' }} />
          <div className="flame-particle" style={{ left: '30%', animationDelay: '0.3s' }} />
          <div className="flame-particle" style={{ left: '50%', animationDelay: '0.0s' }} />
          <div className="flame-particle" style={{ left: '70%', animationDelay: '0.4s' }} />
          <div className="flame-particle" style={{ left: '90%', animationDelay: '0.2s' }} />
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ 
            color: '#ef4444', 
            fontWeight: '900', 
            letterSpacing: '4px', 
            fontSize: '1.2rem', 
            marginBottom: '8px', 
            textShadow: '0 0 10px rgba(239,68,68,1), 0 0 20px rgba(239,68,68,0.5)',
            transform: 'skewX(-5deg)'
          }}>
            TOP SECRET
          </div>
          <div style={{ 
            color: '#fff', 
            fontFamily: 'monospace', 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            letterSpacing: '2px',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            {timeLeft || '00d 00h 00m 00s'}
          </div>
        </div>
      </motion.div>
    </>
  );
}
