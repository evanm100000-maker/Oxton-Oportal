import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { isDesktopBrowser } from '../utils/platform';

export default function InstallAppButton({ style, className }) {
  // If they are on a mobile phone or already in the Electron app, we might not want to show this
  // However, we definitely want to show it to standard desktop browsers.
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isElectron = userAgent.indexOf('electron') > -1;

  if (isElectron) {
    return null; // Already in the app, no need to download
  }

  return (
    <motion.a
      href="/Oxton-Oportal-Setup.exe" // Placeholder for where the actual .exe will be hosted
      download="Oxton-Oportal-Setup.exe"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`btn-primary ${className || ''}`}
      style={{
        display: 'inline-flex',
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
        textDecoration: 'none',
        ...style
      }}
    >
      <Download size={18} />
      <span>Download PC App</span>
    </motion.a>
  );
}
