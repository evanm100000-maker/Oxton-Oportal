import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  Plane, ClipboardList, Calendar, FileText, 
  AlertTriangle, Slash, Settings, LogOut, ArrowLeft, User, Trophy, MessageSquare, Eye,
  Activity, CheckSquare, LifeBuoy, BarChart2, Megaphone
} from 'lucide-react';

// Subcomponents (we will create these next)
import Announcements from './Announcements';
import AllocationRequests from './AllocationRequests';
import Performance from './Performance';
import Tasks from './Tasks';
import SupportTickets from './SupportTickets';
import Analytics from './Analytics';
import FlightLogs from './FlightLogs';
import LeaveOfAbsence from './LeaveOfAbsence';
import Documents from './Documents';
import Reports from './Reports';
import Infractions from './Infractions';
import AdminPanel from './AdminPanel';
import Leaderboard from './Leaderboard';
import SettingsModal from './SettingsModal';
import StaffChat from './StaffChat';
import AllStaff from './AllStaff';
import Events from './Events';

export default function Dashboard() {
  const { currentUser, logout, chatMessages, infractions, flights, pageConfig, superAdminEmail } = useApp();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('oxton_activeTab') || 'home';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastReadChatCount, setLastReadChatCount] = useState(0);
  const [lastReadFlightCount, setLastReadFlightCount] = useState(0);
  const [reviewedInfractionIds, setReviewedInfractionIds] = useState([]);

  React.useEffect(() => {
    if (currentUser?.email) {
      try {
        const chatRead = localStorage.getItem(`oxton_chat_read_${currentUser.email}`);
        if (chatRead !== null) setLastReadChatCount(parseInt(chatRead, 10) || 0);

        const flightRead = localStorage.getItem(`oxton_flight_read_${currentUser.email}`);
        if (flightRead !== null) setLastReadFlightCount(parseInt(flightRead, 10) || 0);

        const infractionsRead = localStorage.getItem(`oxton_infraction_reviewed_${currentUser.email}`);
        if (infractionsRead !== null) {
          try {
            const parsed = JSON.parse(infractionsRead);
            if (Array.isArray(parsed)) setReviewedInfractionIds(parsed);
          } catch (e) {
            console.error('Failed to parse reviewed infractions', e);
          }
        }
      } catch (e) {
        console.error('Failed to access localStorage', e);
      }
    }
  }, [currentUser?.email]);

  // Update read count when opening the chat
  React.useEffect(() => {
    if (activeTab === 'staffChat') {
      const chatLen = Array.isArray(chatMessages) ? chatMessages.length : 0;
      setLastReadChatCount(chatLen);
      localStorage.setItem(`oxton_chat_read_${currentUser.email}`, chatLen);
    }
    if (activeTab === 'allocation') {
      const flightLen = Array.isArray(flights) ? flights.length : 0;
      setLastReadFlightCount(flightLen);
      localStorage.setItem(`oxton_flight_read_${currentUser.email}`, flightLen);
    }
  }, [activeTab, chatMessages, flights, currentUser.email]);

  React.useEffect(() => {
    sessionStorage.setItem('oxton_activeTab', activeTab);
    window.scrollTo(0, 0);
  }, [activeTab]);

  const safeChatMessages = Array.isArray(chatMessages) ? chatMessages : [];
  const unreadChatCount = Math.max(0, safeChatMessages.length - lastReadChatCount);
  const unreadFlightCount = Math.max(0, (Array.isArray(flights) ? flights.length : 0) - lastReadFlightCount);
  const myInfractions = React.useMemo(
    () => infractions.filter(inf => inf.staffEmail === currentUser.email),
    [infractions, currentUser.email]
  );
  const unreadInfractions = myInfractions.filter(inf => !reviewedInfractionIds.includes(inf.id));

  const markInfractionsReviewed = React.useCallback(() => {
    const reviewedIds = Array.from(new Set([
      ...reviewedInfractionIds,
      ...myInfractions.map(inf => inf.id)
    ]));
    setReviewedInfractionIds(reviewedIds);
    localStorage.setItem(`oxton_infraction_reviewed_${currentUser.email}`, JSON.stringify(reviewedIds));
  }, [currentUser.email, myInfractions, reviewedInfractionIds]);

  const reviewInfractions = () => {
    markInfractionsReviewed();
    setActiveTab('infractions');
  };

  const navItems = [
    // Row 1: Personal & Daily Use
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'View the latest news and updates from the administration.',
      icon: Megaphone,
      color: '#8b5cf6',
      component: Announcements
    },
    {
      id: 'events',
      title: 'Upcoming Events',
      description: 'View scheduled events and meetings.',
      icon: Calendar,
      color: '#10b981',
      component: Events
    },
    {
      id: 'performance',
      title: 'My Performance',
      description: 'View your activity, logs, badges, and overall performance.',
      icon: Activity,
      color: '#ec4899',
      component: Performance
    },
    {
      id: 'tasks',
      title: 'Tasks & Assignments',
      description: 'Manage and complete tasks assigned by administrators.',
      icon: CheckSquare,
      color: '#14b8a6',
      component: Tasks
    },
    {
      id: 'tickets',
      title: 'Support Tickets',
      description: 'Open a ticket for private support and communication with admins.',
      icon: LifeBuoy,
      color: '#f43f5e',
      component: SupportTickets
    },
    
    // Row 2
    {
      id: 'staffChat',
      title: 'Messages',
      description: 'Communicate with staff and security in real-time.',
      icon: MessageSquare,
      color: '#10b981',
      component: StaffChat,
      badgeCount: unreadChatCount
    },
    {
      id: 'leaderboard',
      title: 'Staff of the Week',
      description: 'View the top performing staff based on approved flights.',
      icon: Trophy,
      color: '#f59e0b',
      component: Leaderboard
    },
    {
      id: 'allStaff',
      title: 'All Staff',
      description: 'View the complete staff roster and online presence.',
      icon: User,
      color: '#8b5cf6',
      component: AllStaff
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Report rule-breaking players. Review admin actions.',
      icon: AlertTriangle,
      color: '#2563eb',
      component: Reports
    },

    // Row 3
    {
      id: 'logs',
      title: 'Flight Logs',
      description: 'Submit and inspect detailed flight operations reports.',
      icon: ClipboardList,
      color: '#3b82f6',
      component: FlightLogs
    },
    {
      id: 'allocation',
      title: 'Allocation Requests',
      description: 'View airport flight allocations and server connections.',
      icon: Plane,
      color: '#2563eb',
      component: AllocationRequests,
      badgeCount: unreadFlightCount
    },
    {
      id: 'loa',
      title: 'Leave of Absence Requests',
      description: 'Request time off and monitor administrative replies.',
      icon: Calendar,
      color: '#1d4ed8',
      component: LeaveOfAbsence
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Read operations manuals, protocols, and manuals.',
      icon: FileText,
      color: '#1e40af',
      component: Documents
    },

    // Row 4
    ...(currentUser.isAdmin ? [{
      id: 'analytics',
      title: 'Analytics',
      description: 'View server-wide statistics, staff activity, and analytics.',
      icon: BarChart2,
      color: '#8b5cf6',
      component: Analytics
    }] : []),
    {
      id: 'infractions',
      title: 'My Consequences',
      description: 'Track disciplinary alerts and official performance marks.',
      icon: Slash,
      color: '#1e3a8a',
      component: Infractions,
      badgeCount: unreadInfractions.length
    }
  ];

  // Framer Motion Animation Settings
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 20,
      opacity: 0,
    },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.2
      }
    }
  };

  const renderActiveComponent = () => {
    if (activeTab === 'admin') {
      if (pageConfig && !pageConfig.adminPanel && currentUser?.email !== superAdminEmail) {
        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center'}}>
            <Slash size={48} color="#ef4444" style={{marginBottom: '20px'}} />
            <h2 style={{color: '#fff', fontSize: '1.5rem', marginBottom: '10px'}}>Temporarily Unavailable</h2>
            <p style={{color: '#94a3b8'}}>This page has been temporarily disabled by the administration.</p>
          </div>
        );
      }
      return <AdminPanel />;
    }
    const item = navItems.find(i => i.id === activeTab);
    if (item) {
      if (pageConfig && pageConfig[item.id] === false) {
        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center'}}>
            <Slash size={48} color="#ef4444" style={{marginBottom: '20px'}} />
            <h2 style={{color: '#fff', fontSize: '1.5rem', marginBottom: '10px'}}>Temporarily Unavailable</h2>
            <p style={{color: '#94a3b8'}}>This page has been temporarily disabled by the administration.</p>
          </div>
        );
      }
      const Component = item.component;
      return <Component />;
    }
    return null;
  };

  return (
    <div style={styles.appWrapper}>
      {/* Navbar */}
      <nav className="glass-panel dashboard-navbar" style={styles.navbar}>
        <div className="dashboard-nav-brand" style={styles.navBrand} onClick={() => setActiveTab('home')}>
          <img src="/logo.png" alt="Oxton Logo" style={styles.navLogo} />
          <span style={styles.navBrandText}>Oxton Staff Portal</span>
        </div>

        <div style={styles.navControls}>
          {currentUser.isAdmin && (
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
              className="btn-secondary"
              style={{
                ...styles.adminNavBtn,
                background: activeTab === 'admin' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                borderColor: activeTab === 'admin' ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <Settings size={16} />
              <span>Admin Panel</span>
            </button>
          )}

          <div style={styles.profileBadge}>
            {currentUser.profilePicture ? (
              <img src={currentUser.profilePicture} alt="PFP" style={{width: 24, height: 24, borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              <User size={14} color="#3b82f6" />
            )}
            <span style={styles.profileText}>
              {currentUser.firstName} ({currentUser.robloxUsername})
            </span>
            {currentUser.isAdmin && <span className="badge badge-admin">Admin</span>}
          </div>

          <button onClick={() => setIsSettingsOpen(true)} className="btn-secondary" style={{...styles.logoutBtn, color: 'var(--color-text-main)'}}>
            <Settings size={16} />
          </button>
          
          <button onClick={logout} className="btn-secondary" style={styles.logoutBtn}>
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {unreadInfractions.length > 0 && activeTab !== 'infractions' && (
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          style={styles.infractionAlert}
          className="glass-panel"
          role="alert"
        >
          <div style={styles.infractionAlertIcon}>
            <AlertTriangle size={22} color="var(--color-text-main)" />
          </div>
          <div style={styles.infractionAlertBody}>
            <span style={styles.infractionAlertKicker}>NEW INFRACTION</span>
            <strong style={styles.infractionAlertTitle}>
              {unreadInfractions.length === 1
                ? 'A new infraction has been added to your staff record.'
                : `${unreadInfractions.length} new infractions have been added to your staff record.`}
            </strong>
          </div>
          <button onClick={reviewInfractions} className="btn-danger" style={styles.infractionReviewBtn}>
            <Eye size={16} />
            <span>Review</span>
          </button>
        </motion.div>
      )}

      {/* Main Area */}
      <main className="dashboard-main-content" style={styles.mainContent}>
        {activeTab === 'home' ? (
          <div style={styles.homeContainer}>
            {/* Header Greeting */}
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              style={styles.greetingHeader}
            >
              <h1 style={styles.greetingText}>Hello, {currentUser.firstName}!</h1>
              <p style={styles.greetingSub}>
                Welcome back. Use the cards below to view, log, and request staff actions.
              </p>
            </motion.div>

            <motion.div 
              key={`dashboard-card-grid-${activeTab}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              style={styles.cardGrid}
              className="dashboard-card-grid"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.015,
                      y: -3,
                      boxShadow: '0 12px 30px rgba(37, 99, 235, 0.2)',
                      borderColor: 'rgba(37, 99, 235, 0.4)'
                    }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => item.id === 'infractions' ? reviewInfractions() : setActiveTab(item.id)}
                    className="glass-panel interactive-card"
                    style={styles.menuCard}
                  >
                    <div style={{ ...styles.cardIconWrapper, backgroundColor: `${item.color}15`, position: 'relative' }}>
                      <Icon size={24} color={item.color} />
                      {item.badgeCount > 0 && (
                        <div style={styles.notificationBadge}>
                          {item.badgeCount > 99 ? '99+' : item.badgeCount}
                        </div>
                      )}
                    </div>
                    <div style={styles.cardInfo}>
                      <h2 style={styles.cardTitle}>{item.title}</h2>
                      <p style={styles.cardDescription}>{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}

              {currentUser.isAdmin && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.015,
                    y: -3,
                    boxShadow: '0 12px 30px rgba(6, 182, 212, 0.2)',
                    borderColor: 'rgba(6, 182, 212, 0.4)'
                  }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setActiveTab('admin')}
                  className="glass-panel interactive-card"
                  style={{ ...styles.menuCard, border: '1px dashed rgba(6, 182, 212, 0.3)' }}
                >
                  <div style={{ ...styles.cardIconWrapper, backgroundColor: 'rgba(6, 182, 212, 0.15)' }}>
                    <Settings size={24} color="#06b6d4" />
                  </div>
                  <div style={styles.cardInfo}>
                    <h2 style={{ ...styles.cardTitle, color: '#22d3ee' }}>Admin Control Center</h2>
                    <p style={styles.cardDescription}>
                      Manage approvals, allocate staff schedules, review LOAs, post documents, and log infractions.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        ) : (
          /* Sub-pages Container */
          <div>
            <div style={styles.backBar}>
              <button onClick={() => setActiveTab('home')} className="btn-secondary" style={styles.backBtn}>
                <ArrowLeft size={16} />
                <span>Return to Dashboard</span>
              </button>
              <div style={styles.pageTitleContainer}>
                <h2 style={styles.pageTitle}>
                  {activeTab === 'admin' ? 'Admin Control Center' : navItems.find(i => i.id === activeTab)?.title}
                </h2>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={styles.pageCard}
              className="glass-panel"
            >
              {renderActiveComponent()}
            </motion.div>
          </div>
        )}
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

const styles = {
  appWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    margin: '16px auto',
    width: 'calc(100% - 32px)',
    maxWidth: '1200px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  navLogo: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    objectFit: 'contain',
  },
  navBrandText: {
    fontWeight: '700',
    fontSize: '1.25rem',
    letterSpacing: '-0.3px',
    color: 'var(--color-text-main)',
  },
  navControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  adminNavBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
  },
  profileText: {
    fontWeight: '500',
    color: '#e5e7eb',
  },
  logoutBtn: {
    padding: '8px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#ef4444',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px 40px 16px',
  },
  infractionAlert: {
    width: 'calc(100% - 32px)',
    maxWidth: '1200px',
    margin: '0 auto 18px auto',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.78), rgba(15, 23, 42, 0.86))',
    boxShadow: '0 18px 44px rgba(239, 68, 68, 0.2)',
  },
  infractionAlertIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: '#ef4444',
    boxShadow: '0 0 0 6px rgba(239, 68, 68, 0.16)',
  },
  infractionAlertBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    flex: 1,
  },
  infractionAlertKicker: {
    color: '#fecaca',
    fontSize: '0.78rem',
    fontWeight: '900',
    letterSpacing: '0',
  },
  infractionAlertTitle: {
    color: 'var(--color-text-main)',
    fontSize: '0.98rem',
    lineHeight: 1.35,
  },
  infractionReviewBtn: {
    padding: '10px 14px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    perspective: '1000px', // Enhances 3D card rotation during slam
  },
  greetingHeader: {
    marginTop: '24px',
  },
  greetingText: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    letterSpacing: '-0.5px',
  },
  greetingSub: {
    fontSize: '1.05rem',
    color: '#9ca3af',
    marginTop: '4px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
    transformStyle: 'preserve-3d',
  },
  menuCard: {
    padding: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '18px',
    borderRadius: '16px',
  },
  cardIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
  },
  cardDescription: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    lineHeight: '1.4',
  },
  backBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    marginTop: '20px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
  },
  pageTitleContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
  },
  pageCard: {
    padding: '32px',
    minHeight: '400px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: '#ef4444',
    color: 'var(--color-text-main)',
    fontSize: '0.7rem',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '10px',
    border: '2px solid var(--color-bg-deep)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
  }
};
