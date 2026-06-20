import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, DownloadCloud } from 'lucide-react';

let INITIAL_VERSION = null;

export default function UpdateBanner() {
  const { siteVersion } = useApp();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (siteVersion) {
      if (!INITIAL_VERSION) {
        INITIAL_VERSION = siteVersion;
      } else if (INITIAL_VERSION !== siteVersion) {
        setShowBanner(true);
      }
    }
  }, [siteVersion]);

  if (!showBanner) return null;

  return (
    <div style={styles.container} className="slam-element">
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <DownloadCloud size={20} color="#3b82f6" />
        </div>
        <div style={styles.textContainer}>
          <strong style={styles.title}>Update Available</strong>
          <span style={styles.description}>A new version of the site has been published.</span>
        </div>
      </div>
      <button 
        style={styles.refreshBtn} 
        className="btn-primary"
        onClick={() => window.location.reload()}
      >
        <RefreshCw size={14} />
        <span>Refresh</span>
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 10001,
    background: 'rgba(15, 23, 42, 0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    borderRadius: '12px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconContainer: {
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: '#eff6ff',
    fontSize: '0.95rem',
  },
  description: {
    color: '#93c5fd',
    fontSize: '0.8rem',
  },
  refreshBtn: {
    padding: '8px 12px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  }
};
