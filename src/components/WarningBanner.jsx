import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, AlertOctagon, CheckCircle } from 'lucide-react';

export default function WarningBanner() {
  const { warningConfig } = useApp();
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!warningConfig?.countdownEnabled || !warningConfig?.countdownTarget) return;

    const calculateTimeLeft = () => {
      const difference = new Date(warningConfig.countdownTarget) - new Date();
      if (difference <= 0) {
        return { minutes: 0, seconds: 0, isExpired: true };
      }
      return {
        minutes: Math.floor((difference / 1000 / 60)),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [warningConfig?.countdownEnabled, warningConfig?.countdownTarget]);

  if (!warningConfig?.isActive) return null;

  const type = warningConfig.type || 'warning';

  let Icon = AlertTriangle;
  if (type === 'issue') Icon = AlertOctagon;
  if (type === 'resolved') Icon = CheckCircle;

  return (
    <div className="warning-banner-container slam-element">
      <div className={`warning-box ${type}`}>
        <div className="warning-icon-container">
          <Icon size={48} color="#1f2937" />
        </div>
        <div className="warning-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <div className="warning-header">
              {warningConfig.title}
            </div>
            <div className="warning-body">
              {warningConfig.message}
            </div>
          </div>
          {warningConfig.countdownEnabled && (
            <div style={{
              fontSize: '2rem',
              fontWeight: '900',
              fontFamily: 'monospace',
              color: timeLeft.isExpired ? '#ef4444' : '#1f2937',
              marginLeft: '20px',
              padding: '10px 20px',
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '12px'
            }}>
              {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
