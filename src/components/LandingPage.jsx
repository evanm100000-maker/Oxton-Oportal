import React, { useState } from 'react';
import { Plane, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage({ onSelectPortal }) {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleSelect = (portal) => {
    setSelectedCard(portal);
    setTimeout(() => {
      onSelectPortal(portal);
    }, 700);
  };

  return (
    <div style={styles.container}>
      {/* Background layer */}
      <div style={styles.background} />

      <div style={styles.contentWrapper}>
        <div style={styles.cardsContainer}>
          {/* Passenger Card */}
          <motion.button
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={
              selectedCard === 'passenger' 
                ? { scale: 50, zIndex: 100, opacity: 0 } 
                : selectedCard 
                  ? { opacity: 0, scale: 0.8 } 
                  : { opacity: 1, y: 0, scale: 1 }
            }
            whileHover={selectedCard ? {} : { scale: 1.03 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => handleSelect('passenger')}
            style={{...styles.card, background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.5)'}}
          >
            <div style={styles.cardInner}>
              <Users size={64} color="#60a5fa" style={styles.cardIcon} />
              <div style={styles.textContainer}>
                <h2 style={styles.cardTitle}>PASSENGER</h2>
                <div style={styles.playButtonWrapper}>
                  <div style={{...styles.playButton, background: '#60a5fa'}}>ENTER</div>
                </div>
              </div>
            </div>
          </motion.button>

          {/* Staff Card */}
          <motion.button
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={
              selectedCard === 'staff' 
                ? { scale: 50, zIndex: 100, opacity: 0 } 
                : selectedCard 
                  ? { opacity: 0, scale: 0.8 } 
                  : { opacity: 1, y: 0, scale: 1 }
            }
            whileHover={selectedCard ? {} : { scale: 1.03 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: selectedCard ? 0 : 0.1 }}
            onClick={() => handleSelect('staff')}
            style={{...styles.card, background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.5)'}}
          >
            <div style={styles.cardInner}>
              <Plane size={64} color="#c084fc" style={styles.cardIcon} />
              <div style={styles.textContainer}>
                <h2 style={styles.cardTitle}>STAFF</h2>
                <div style={styles.playButtonWrapper}>
                  <div style={{...styles.playButton, background: '#c084fc'}}>LOGIN</div>
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedCard ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={styles.footer}
        >
          SELECT YOUR DESTINATION
        </motion.div>
      </div>

      <div style={styles.versionText}>V1.1</div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    background: '#0f172a',
  },
  background: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)',
    zIndex: 0,
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '40px 20px',
  },
  cardsContainer: {
    display: 'flex',
    gap: '32px',
    width: '100%',
    maxWidth: '1200px',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: '40px',
  },
  card: {
    flex: 1,
    maxWidth: '500px',
    border: '4px solid',
    borderRadius: '12px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    padding: 0,
    outline: 'none',
  },
  cardInner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    position: 'relative',
    zIndex: 2,
  },
  cardIcon: {
    marginBottom: 'auto',
    marginTop: 'auto',
    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))',
  },
  textContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  cardTitle: {
    fontSize: '4rem',
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    textAlign: 'center',
    margin: 0,
    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
  },
  playButtonWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  playButton: {
    padding: '16px 48px',
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: '900',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s',
  },
  footer: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '3px',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  versionText: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    color: '#6b7280',
    fontSize: '0.85rem',
    fontWeight: '500',
    letterSpacing: '1px',
    zIndex: 10,
  }
};
