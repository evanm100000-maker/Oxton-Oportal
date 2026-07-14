import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, Megaphone, Ticket, ChevronLeft, Send, Clock, AlertCircle, FileText, UserPlus, LogIn, MessageSquare } from 'lucide-react';
import StaffApplication from './StaffApplication';
import SupportTickets from './SupportTickets';
import { formatFlightTimeLocal, formatFlightDateLocal } from '../utils/timeUtils';

export default function PassengerPortal({ onBack }) {
  const { flights, events, announcements, createTicket, currentUser, login, signup } = useApp();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('oxton_passengerTab') || 'overview';
  });
  
  React.useEffect(() => {
    sessionStorage.setItem('oxton_passengerTab', activeTab);
    window.scrollTo(0, 0);
  }, [activeTab]);

  const [ticketForm, setTicketForm] = useState({ title: '', description: '', robloxUsername: '' });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authForm, setAuthForm] = useState({ email: '', password: '', firstName: '', lastName: '', robloxUsername: '' });
  const [authError, setAuthError] = useState('');

  // Filter announcements for passengers
  const passengerAnnouncements = announcements.filter(a => a.targetAudience === 'Passenger' || a.targetAudience === 'All' || !a.targetAudience);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.description || !ticketForm.robloxUsername) return;
    
    createTicket({
      title: ticketForm.title,
      description: ticketForm.description,
      authorName: ticketForm.robloxUsername,
      authorType: 'Passenger'
    });
    
    setTicketSubmitted(true);
    setTicketForm({ title: '', description: '', robloxUsername: '' });
    setTimeout(() => setTicketSubmitted(false), 5000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        await login(authForm.email, authForm.password);
      } else {
        if (!authForm.firstName || !authForm.lastName || !authForm.robloxUsername) {
          setAuthError('Please fill in all fields.');
          return;
        }
        await signup({ ...authForm, role: 'passenger' });
        setAuthMode('login');
        setAuthError(''); // Clear any previous errors
        setAuthForm(prev => ({ ...prev, password: '' })); // Clear password for security
        alert('Account created successfully! Please log in with your new credentials.');
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Plane },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'support', label: 'Support', icon: Ticket },
    { id: 'apply', label: 'Staff Application', icon: FileText }
  ];

  const renderContent = () => {
    if (activeTab === 'apply') {
      return <StaffApplication onBack={() => setActiveTab('overview')} />;
    }

    const sortedFlights = [...flights].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateA - dateB;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {activeTab === 'overview' && (
          <div style={styles.grid}>
            {/* Upcoming Flights */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={styles.sectionHeader}>
                <div style={{...styles.sectionIcon, background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa'}}><Plane size={20} /></div>
                <h2 style={styles.sectionTitle}>Upcoming Flights</h2>
              </div>
              <div>
                {sortedFlights.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>No scheduled flights at this time.</div>
                ) : (
                  sortedFlights.slice(0, 5).map(flight => (
                    <div key={flight.id} style={{...styles.itemCard, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#fff' }}>Flight {flight.flightCode}</div>
                          <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{flight.location}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#60a5fa', fontWeight: '600' }}>{formatFlightTimeLocal(flight.date, flight.time) || flight.time}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{formatFlightDateLocal(flight.date, flight.time) || flight.date}</div>
                        </div>
                      </div>
                      {flight.serverLink && (
                        <button 
                          onClick={() => window.open(flight.serverLink, '_blank')} 
                          className="btn-primary" 
                          style={{width: '100%', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'}}
                        >
                          <Plane size={14} />
                          Join Flight Server
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={styles.sectionHeader}>
                <div style={{...styles.sectionIcon, background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc'}}><Megaphone size={20} /></div>
                <h2 style={styles.sectionTitle}>Latest Announcements</h2>
              </div>
              <div>
                {passengerAnnouncements.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>No recent announcements.</div>
                ) : (
                  passengerAnnouncements.slice(0, 3).map(ann => (
                    <div key={ann.id} style={styles.annCard}>
                      <div style={{ fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{ann.title}</div>
                      <div style={{ fontSize: '0.9rem', color: '#d1d5db', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ann.message}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {new Date(ann.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {passengerAnnouncements.length > 3 && (
                <button onClick={() => setActiveTab('announcements')} style={styles.viewAllBtn}>
                  View all announcements
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{...styles.sectionIcon, background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc'}}><Megaphone size={24} /></div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#fff' }}>All Announcements</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {passengerAnnouncements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>No announcements found.</div>
              ) : (
                passengerAnnouncements.map(ann => (
                  <div key={ann.id} style={{ ...styles.annCard, padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>{ann.title}</div>
                      <div style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', color: '#d1d5db' }}>
                        {new Date(ann.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    {ann.subtitle && <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#c084fc', marginBottom: '12px' }}>{ann.subtitle}</div>}
                    <div style={{ color: '#d1d5db', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{ann.message}</div>
                    <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#6b7280', textAlign: 'right' }}>Posted by {ann.authorName}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{...styles.sectionIcon, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399'}}><Calendar size={24} /></div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#fff' }}>Upcoming Events</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {(!events || events.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af', gridColumn: '1 / -1' }}>No events scheduled. Check back later!</div>
              ) : (
                events.map(event => (
                  <div key={event.id} style={styles.eventCard}>
                    <div style={styles.dateBox}>
                      <div style={{ color: '#34d399', fontWeight: '800', fontSize: '1.5rem', lineHeight: '1' }}>{new Date(event.date).getDate()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', marginTop: '4px', fontWeight: '600' }}>{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>{event.title}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>{event.description}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      {event.serverLink && (
                        <button 
                          onClick={() => window.open(event.serverLink, '_blank')} 
                          className="btn-primary" 
                          style={{marginTop: '12px', width: 'fit-content', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'}}
                        >
                          <Calendar size={14} />
                          Join Event Server
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            {!currentUser ? (
              <div className="glass-panel" style={{ padding: '32px', maxWidth: '450px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{...styles.sectionIcon, background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6'}}>
                    {authMode === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#fff' }}>
                    {authMode === 'login' ? 'Passenger Login' : 'Create Account'}
                  </h2>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '24px' }}>
                  {authMode === 'login' ? 'Log in to view and create support tickets.' : 'Create an account to submit support tickets.'}
                </p>

                {authError && (
                  <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input type="email" required value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="input-field" placeholder="your@email.com" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input type="password" required value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="input-field" placeholder="••••••••" />
                  </div>
                  
                  {authMode === 'signup' && (
                    <>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={styles.label}>First Name</label>
                          <input type="text" required value={authForm.firstName} onChange={e => setAuthForm({...authForm, firstName: e.target.value})} className="input-field" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={styles.label}>Last Name</label>
                          <input type="text" required value={authForm.lastName} onChange={e => setAuthForm({...authForm, lastName: e.target.value})} className="input-field" />
                        </div>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Roblox Username</label>
                        <input type="text" required value={authForm.robloxUsername} onChange={e => setAuthForm({...authForm, robloxUsername: e.target.value})} className="input-field" />
                      </div>
                    </>
                  )}

                  <button type="submit" className="btn-primary" style={{ padding: '14px', borderRadius: '10px', marginTop: '8px' }}>
                    {authMode === 'login' ? 'Login' : 'Create Account'}
                  </button>
                  
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
                      {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '32px' }}>
                <SupportTickets />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Top Navbar */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerLeft}>
            <button 
              onClick={onBack}
              style={styles.backBtn}
            >
              <ChevronLeft size={20} />
            </button>
            <div style={styles.logoContainer}>
              <div style={styles.logoIconBox}>
                <Plane size={20} color="#fff" />
              </div>
              <span style={styles.logoText}>OPORTAL <span style={{ color: '#9ca3af', fontWeight: '500', fontSize: '1rem' }}>| Passenger</span></span>
            </div>
          </div>
            {/* App downloads removed */}
        </div>
      </header>

      <div className="page-container" style={{ padding: '0 12px 32px 12px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginBottom: '32px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', scrollbarWidth: 'none' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s',
                whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
                background: activeTab === item.id ? '#2563eb' : 'transparent',
                color: activeTab === item.id ? '#fff' : '#9ca3af',
                boxShadow: activeTab === item.id ? '0 4px 14px rgba(37, 99, 235, 0.4)' : 'none'
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    marginBottom: '32px',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIconBox: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  sectionIcon: {
    padding: '10px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
  },
  itemCard: {
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background 0.2s',
  },
  annCard: {
    padding: '20px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '16px',
  },
  eventCard: {
    padding: '20px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '16px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  dateBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    minWidth: '70px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  viewAllBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'color 0.2s',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: '8px',
  },
};
