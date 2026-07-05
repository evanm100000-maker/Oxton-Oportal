import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstallAppButton({ style, className }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable) {
    return null; // Don't show the button if not installable
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleInstallClick}
      className={`btn-primary ${className || ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        ...style
      }}
    >
      <Download size={18} />
      <span>Install App</span>
    </motion.button>
  );
}
