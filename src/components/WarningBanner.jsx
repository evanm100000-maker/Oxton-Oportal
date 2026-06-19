import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, AlertOctagon, CheckCircle } from 'lucide-react';

export default function WarningBanner() {
  const { warningConfig } = useApp();

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
        <div className="warning-content">
          <div className="warning-header">
            {warningConfig.title}
          </div>
          <div className="warning-body">
            {warningConfig.message}
          </div>
        </div>
      </div>
    </div>
  );
}
