import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BypassOverlay() {
  const { bypassConfig, currentUser } = useApp();
  const [dismissedId, setDismissedId] = useState(null);

  useEffect(() => {
    // Check session storage for dismissed ID on mount
    const savedId = sessionStorage.getItem('dismissedBypassId');
    if (savedId) {
      setDismissedId(savedId);
    }
  }, []);

  const handleClose = () => {
    if (bypassConfig?.id) {
      setDismissedId(bypassConfig.id);
      sessionStorage.setItem('dismissedBypassId', bypassConfig.id);
    }
  };

  if (!currentUser) return null; // Only show to logged in staff
  
  const isExpired = bypassConfig?.timestamp ? (Date.now() - bypassConfig.timestamp > 5 * 60 * 1000) : false;

  if (!bypassConfig?.isActive || bypassConfig.id === dismissedId || isExpired) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={styles.overlay}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="glass-panel-glow"
          style={styles.modal}
        >
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <Megaphone size={28} color="#ef4444" />
            </div>
            <button onClick={handleClose} style={styles.closeBtn} className="hover-opacity">
              <X size={24} />
            </button>
          </div>
          
          <div style={styles.content}>
            <h1 style={styles.title}>{bypassConfig.title || 'URGENT ANNOUNCEMENT'}</h1>
            <p style={styles.message}>{bypassConfig.message}</p>
          </div>
          
          <div style={styles.footer}>
            <span style={styles.sender}>Sent by: {bypassConfig.senderName}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(12px)',
    zIndex: 999999, // Ensure it's above absolutely everything
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '800px',
    background: 'rgba(20, 20, 25, 0.95)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)',
    borderRadius: '24px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    background: 'rgba(239, 68, 68, 0.1)',
    padding: '12px',
    borderRadius: '12px',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  },
  content: {
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#f87171',
    margin: 0,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  message: {
    fontSize: '1.25rem',
    color: '#f3f4f6',
    lineHeight: '1.6',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  footer: {
    padding: '20px 24px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    justifyContent: 'center',
  },
  sender: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }
};
