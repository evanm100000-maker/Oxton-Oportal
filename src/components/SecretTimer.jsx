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
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        padding: '12px 24px',
        textAlign: 'center',
        zIndex: 9999,
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
        minWidth: '250px'
      }}
    >
      <div style={{ color: '#ef4444', fontWeight: '900', letterSpacing: '4px', fontSize: '1.2rem', marginBottom: '8px', textShadow: '0 0 10px rgba(239,68,68,0.8)' }}>
        TOP SECRET
      </div>
      <div style={{ color: '#fff', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>
        {timeLeft || '00d 00h 00m 00s'}
      </div>
    </motion.div>
  );
}
