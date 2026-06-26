import React from 'react';
import { Plane, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage({ onSelectPortal }) {
  return (
    <div style={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.heroSection}
      >
        <div style={styles.logoIconContainer}>
          <img src="/logo.png" alt="Oxton Logo" style={styles.logoIcon} />
        </div>
        <h1 style={styles.brandTitle}>OXTON OPORTAL</h1>
        <p style={styles.brandSubtitle}>Please select your destination to continue</p>
      </motion.div>

      <div style={styles.grid}>
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => onSelectPortal('passenger')}
          className="glass-panel interactive-card"
          style={styles.card}
        >
          <div style={{...styles.iconWrapper, background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)'}}>
            <Users size={28} />
          </div>
          <h2 style={styles.cardTitle}>I am a Passenger</h2>
          <p style={styles.cardDesc}>Access upcoming flights, read public announcements, submit support tickets, and apply for a staff position.</p>
          <div style={{...styles.actionText, color: '#60a5fa'}}>
            Enter Portal <span className="arrow">→</span>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onSelectPortal('staff')}
          className="glass-panel-glow interactive-card"
          style={styles.card}
        >
          <div style={{...styles.iconWrapper, background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', borderColor: 'rgba(139, 92, 246, 0.3)'}}>
            <Plane size={28} />
          </div>
          <h2 style={styles.cardTitle}>I am a Staff Member</h2>
          <p style={styles.cardDesc}>Access the secure staff dashboard to manage operations, moderate the community, and review applications.</p>
          <div style={{...styles.actionText, color: '#c084fc'}}>
            Staff Login <span className="arrow">→</span>
          </div>
        </motion.button>
      </div>
      
      <div style={styles.versionText}>V1.1.1</div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '48px',
  },
  logoIconContainer: {
    width: '90px',
    height: '90px',
    borderRadius: '24px',
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
    marginBottom: '20px',
  },
  logoIcon: {
    width: '70px',
    height: '70px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))',
  },
  brandTitle: {
    fontSize: '2.5rem',
    fontWeight: '900',
    letterSpacing: '3px',
    color: 'var(--color-text-main)',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.15)',
    marginBottom: '8px',
  },
  brandSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--color-text-muted)',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    width: '100%',
    maxWidth: '800px',
    zIndex: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '32px',
    textAlign: 'left',
    background: 'transparent',
    cursor: 'pointer',
    position: 'relative',
    minHeight: '260px',
  },
  iconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    border: '1px solid',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    marginBottom: '12px',
  },
  cardDesc: {
    fontSize: '0.95rem',
    color: 'var(--color-text-muted)',
    lineHeight: '1.6',
    flexGrow: 1,
  },
  actionText: {
    marginTop: '24px',
    fontWeight: '700',
    fontSize: '1.05rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  versionText: {
    position: 'absolute',
    bottom: '20px',
    color: '#6b7280',
    fontSize: '0.85rem',
    fontWeight: '500',
    letterSpacing: '1px',
  },
};
