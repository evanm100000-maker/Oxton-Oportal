import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Megaphone, AlertTriangle, Hammer, Trash2, Send } from 'lucide-react';

export default function Announcements() {
  const { announcements, addAnnouncement, deleteAnnouncement, currentUser, setBypassAnnouncement } = useApp();
  
  const [type, setType] = useState('Normal');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All');
  const [countdownDate, setCountdownDate] = useState('');

  // Bypass Announcement State
  const [bypassTitle, setBypassTitle] = useState('');
  const [bypassMessage, setBypassMessage] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    addAnnouncement({ type, title, subtitle, message, targetAudience, countdownDate: countdownDate || null });
    setTitle('');
    setSubtitle('');
    setMessage('');
    setType('Normal');
    setTargetAudience('All');
    setCountdownDate('');
  };

  const handleBypassPost = (e) => {
    e.preventDefault();
    if (!bypassMessage.trim()) return;
    if (setBypassAnnouncement) {
      setBypassAnnouncement(bypassTitle, bypassMessage);
      setBypassTitle('');
      setBypassMessage('');
    }
  };

  const getIcon = (annType) => {
    switch (annType) {
      case 'Severe': return <AlertTriangle size={24} color="#ef4444" />;
      case 'Maintenance': return <Hammer size={24} color="#f59e0b" />;
      default: return <Megaphone size={24} color="#3b82f6" />;
    }
  };

  const getCardStyle = (annType) => {
    switch (annType) {
      case 'Severe': return { border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' };
      case 'Maintenance': return { border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' };
      default: return { border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.05)' };
    }
  };

  // Sort announcements newest first
  const sortedAnnouncements = [...(announcements || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference <= 0) return null;
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearTimeout(timer);
    });

    if (!timeLeft) return <div style={styles.countdownBox}><span style={{color: '#10b981', fontWeight: 'bold'}}>Event has passed</span></div>;

    return (
      <div style={styles.countdownBox}>
        <div style={styles.countdownUnit}><span style={styles.countdownSpan}>{timeLeft.days}</span><label style={styles.countdownLabel}>Days</label></div>
        <div style={styles.countdownUnit}><span style={styles.countdownSpan}>{timeLeft.hours}</span><label style={styles.countdownLabel}>Hrs</label></div>
        <div style={styles.countdownUnit}><span style={styles.countdownSpan}>{timeLeft.minutes}</span><label style={styles.countdownLabel}>Min</label></div>
        <div style={styles.countdownUnit}><span style={styles.countdownSpan}>{timeLeft.seconds}</span><label style={styles.countdownLabel}>Sec</label></div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {currentUser?.isAdmin && (
        <div className="glass-panel" style={styles.composeBox}>
          <h3 style={styles.composeTitle}>Post Announcement</h3>
          <form onSubmit={handlePost} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Announcement Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="input-field">
                  <option value="Normal">Normal</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Target Audience</label>
                <select value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="input-field">
                  <option value="All">All (Staff & Passengers)</option>
                  <option value="Staff">Staff Only</option>
                  <option value="Passenger">Passengers Only</option>
                </select>
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Title (Optional)</label>
                <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="input-field" placeholder="Brief title..." />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Subtitle (Optional)</label>
                <input type="text" value={subtitle} onChange={e=>setSubtitle(e.target.value)} className="input-field" placeholder="Brief subtitle..." />
              </div>
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Message</label>
              <textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                className="input-field" 
                rows="3" 
                placeholder="What do you want to announce to the staff?"
                required
              />
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Countdown Target Date (Optional)</label>
              <input 
                type="datetime-local" 
                value={countdownDate} 
                onChange={e => setCountdownDate(e.target.value)} 
                className="input-field" 
              />
            </div>
            <button type="submit" className="btn-primary" style={styles.postBtn}>
              <Send size={16} /> Post Announcement
            </button>
          </form>
        </div>
      )}

      {currentUser?.isAdmin && (
        <div className="glass-panel" style={{...styles.composeBox, borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.02)'}}>
          <h3 style={{...styles.composeTitle, color: '#ef4444'}}>Send Global Screen Takeover (Bypass Announcement)</h3>
          <p style={{fontSize: '0.85rem', color: '#9ca3af', marginBottom: '16px'}}>This will force an urgent announcement overlay on the screens of all staff members currently online.</p>
          <form onSubmit={handleBypassPost} style={styles.form}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Alert Title</label>
              <input type="text" value={bypassTitle} onChange={e=>setBypassTitle(e.target.value)} className="input-field" placeholder="e.g. SERVER RESTART IMMINENT" required />
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Alert Message</label>
              <textarea value={bypassMessage} onChange={e=>setBypassMessage(e.target.value)} className="input-field" rows="2" placeholder="Urgent message details..." required />
            </div>
            <button type="submit" className="btn-danger" style={styles.postBtn}>
              <Megaphone size={16} /> Trigger Screen Takeover
            </button>
          </form>
        </div>
      )}

      <div style={styles.feed}>
        {sortedAnnouncements.length === 0 ? (
          <div style={styles.emptyState}>
            <Megaphone size={48} color="rgba(255,255,255,0.1)" />
            <p>No announcements at this time.</p>
          </div>
        ) : (
          sortedAnnouncements.map((ann, index) => (
            <motion.div 
              key={ann.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel"
              style={{ ...styles.card, ...getCardStyle(ann.type) }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.headerLeft}>
                  {getIcon(ann.type)}
                  <div>
                    <h4 style={styles.author}>{ann.authorName}</h4>
                    <span style={styles.timestamp}>{new Date(ann.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                {currentUser?.isAdmin && (
                  <button 
                    onClick={() => deleteAnnouncement(ann.id)} 
                    className="btn-danger" 
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div style={styles.cardBody}>
                {ann.title && <h3 style={styles.annTitle}>{ann.title}</h3>}
                {ann.subtitle && <h4 style={styles.annSubtitle}>{ann.subtitle}</h4>}
                <p style={styles.message}>{ann.message}</p>
                {ann.countdownDate && <CountdownTimer targetDate={ann.countdownDate} />}
              </div>
              <div style={styles.badgeWrapper}>
                <span style={styles.badge}>{ann.type}</span>
                {ann.targetAudience && ann.targetAudience !== 'All' && (
                  <span style={{...styles.badge, marginLeft: '8px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa'}}>
                    {ann.targetAudience}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  composeBox: {
    padding: '24px',
    borderRadius: '16px',
    border: '1px dashed rgba(139, 92, 246, 0.4)',
  },
  composeTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  postBtn: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    marginTop: '8px',
  },
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    padding: '24px',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  author: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    margin: 0,
  },
  timestamp: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
  },
  deleteBtn: {
    padding: '6px',
    borderRadius: '8px',
    background: 'transparent',
    color: '#ef4444',
    border: '1px solid transparent',
  },
  cardBody: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: 'var(--color-text-main)',
  },
  message: {
    whiteSpace: 'pre-wrap',
  },
  annTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    margin: '0 0 4px 0',
  },
  annSubtitle: {
    fontSize: '1rem',
    fontWeight: '500',
    color: 'var(--color-primary)',
    margin: '0 0 12px 0',
  },
  badgeWrapper: {
    position: 'absolute',
    top: '24px',
    right: '24px',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    padding: '4px 8px',
    borderRadius: '6px',
    background: 'rgba(0,0,0,0.3)',
    color: 'var(--color-text-main)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    color: 'var(--color-text-muted)',
    gap: '16px',
  },
  countdownBox: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    padding: '12px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    width: 'fit-content'
  },
  countdownUnit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.05)',
    padding: '8px 12px',
    borderRadius: '6px',
    minWidth: '50px',
  },
  countdownSpan: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'var(--color-text-main)'
  },
  countdownLabel: {
    fontSize: '0.7rem',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginTop: '4px'
  }
};
