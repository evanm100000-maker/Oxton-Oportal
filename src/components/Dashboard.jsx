import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, ClipboardList, Calendar, FileText, 
  AlertTriangle, Slash, Settings, LogOut, ArrowLeft, User, Trophy, Medal, Award, MessageSquare, Eye,
  Activity, CheckSquare, LifeBuoy, BarChart2, Megaphone, Bell, Battery, BatteryCharging, BatteryFull, BatteryMedium, BatteryLow, BatteryWarning, Clock
} from 'lucide-react';

// Subcomponents
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
import NotificationsModal from './NotificationsModal';
import StaffChat from './StaffChat';
import AllStaff from './AllStaff';
import MeetingsAndEvents from './MeetingsAndEvents';
import CalendarPage from './CalendarPage';
import { formatCustomLongDate } from '../utils/timeUtils';

const tabToPath = {
  home: '/',
  calendar: '/calendar',
  announcements: '/announcements',
  meetingsAndEvents: '/meetings-events',
  performance: '/performance',
  tasks: '/tasks',
  tickets: '/tickets',
  staffChat: '/staff-chat',
  leaderboard: '/leaderboard',
  allStaff: '/all-staff',
  reports: '/reports',
  logs: '/logs',
  schedule: '/schedule',
  roster: '/roster',
  loa: '/loa',
  documents: '/documents',
  analytics: '/analytics',
  infractions: '/infractions',
  admin: '/admin'
};
const pathToTab = Object.fromEntries(Object.entries(tabToPath).map(([k, v]) => [v, k]));

export default function Dashboard() {
  const { currentUser, logout, chatMessages, infractions, flights, pageConfig, superAdminEmail, tasks, announcements, documents, reports, showClockBattery, use24HourClock, useLongDateFormat } = useApp();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) return tabParam;
    
    const currentPath = window.location.pathname;
    if (pathToTab[currentPath]) {
      return pathToTab[currentPath];
    }
    
    return sessionStorage.getItem('oxton_activeTab') || 'home';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [lastReadChatCount, setLastReadChatCount] = useState(0);
  const [lastReadFlightCount, setLastReadFlightCount] = useState(0);
  const [lastReadAnnouncementsCount, setLastReadAnnouncementsCount] = useState(0);
  const [lastReadDocumentsCount, setLastReadDocumentsCount] = useState(0);
  const [lastReadReportsCount, setLastReadReportsCount] = useState(0);
  const [reviewedInfractionIds, setReviewedInfractionIds] = useState([]);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [hasBattery, setHasBattery] = useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const checkBattery = () => {
          const isDesktopFake = battery.charging && battery.chargingTime === 0 && battery.dischargingTime === Infinity && battery.level === 1;
          setHasBattery(!isDesktopFake);
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        checkBattery();
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
      }).catch(() => {
        setHasBattery(false);
      });
    }
  }, []);

  React.useEffect(() => {
    if (currentUser?.email) {
      try {
        const chatRead = localStorage.getItem(`oxton_chat_read_${currentUser.email}`);
        if (chatRead !== null) setLastReadChatCount(parseInt(chatRead, 10) || 0);

        const flightRead = localStorage.getItem(`oxton_flight_read_${currentUser.email}`);
        if (flightRead !== null) setLastReadFlightCount(parseInt(flightRead, 10) || 0);

        const annRead = localStorage.getItem(`oxton_ann_read_${currentUser.email}`);
        if (annRead !== null) setLastReadAnnouncementsCount(parseInt(annRead, 10) || 0);

        const docRead = localStorage.getItem(`oxton_doc_read_${currentUser.email}`);
        if (docRead !== null) setLastReadDocumentsCount(parseInt(docRead, 10) || 0);

        const reportRead = localStorage.getItem(`oxton_report_read_${currentUser.email}`);
        if (reportRead !== null) setLastReadReportsCount(parseInt(reportRead, 10) || 0);

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

  React.useEffect(() => {
    if (activeTab === 'staffChat') {
      const chatLen = Array.isArray(chatMessages) ? chatMessages.length : 0;
      setLastReadChatCount(chatLen);
      localStorage.setItem(`oxton_chat_read_${currentUser.email}`, chatLen);
    }
    if (activeTab === 'schedule' || activeTab === 'roster') {
      const flightLen = Array.isArray(flights) ? flights.length : 0;
      setLastReadFlightCount(flightLen);
      localStorage.setItem(`oxton_flight_read_${currentUser.email}`, flightLen);
    }
    if (activeTab === 'announcements') {
      const annLen = Array.isArray(announcements) ? announcements.length : 0;
      setLastReadAnnouncementsCount(annLen);
      localStorage.setItem(`oxton_ann_read_${currentUser.email}`, annLen);
    }
    if (activeTab === 'documents') {
      const docLen = Array.isArray(documents) ? documents.length : 0;
      setLastReadDocumentsCount(docLen);
      localStorage.setItem(`oxton_doc_read_${currentUser.email}`, docLen);
    }
    if (activeTab === 'reports') {
      const repLen = Array.isArray(reports) ? reports.length : 0;
      setLastReadReportsCount(repLen);
      localStorage.setItem(`oxton_report_read_${currentUser.email}`, repLen);
    }
  }, [activeTab, chatMessages, flights, announcements, documents, reports, currentUser.email]);

  React.useEffect(() => {
    sessionStorage.setItem('oxton_activeTab', activeTab);
    window.scrollTo(0, 0);
    
    const newPath = tabToPath[activeTab] || '/';
    if (window.location.pathname !== newPath) {
      const url = new URL(window.location.href);
      url.pathname = newPath;
      if (activeTab !== 'schedule' && activeTab !== 'roster') {
         url.searchParams.delete('flightId');
         url.searchParams.delete('tab');
      }
      window.history.pushState({}, '', url.toString());
    }
  }, [activeTab]);

  React.useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (pathToTab[currentPath]) {
        setActiveTab(pathToTab[currentPath]);
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const safeChatMessages = Array.isArray(chatMessages) ? chatMessages : [];
  const unreadChatCount = Math.max(0, safeChatMessages.length - lastReadChatCount);
  const unreadFlightCount = Math.max(0, (Array.isArray(flights) ? flights.length : 0) - lastReadFlightCount);
  const unreadAnnouncementsCount = Math.max(0, (Array.isArray(announcements) ? announcements.length : 0) - lastReadAnnouncementsCount);
  const unreadDocumentsCount = Math.max(0, (Array.isArray(documents) ? documents.length : 0) - lastReadDocumentsCount);
  const unreadReportsCount = Math.max(0, (Array.isArray(reports) ? reports.length : 0) - lastReadReportsCount);
  const myInfractions = React.useMemo(
    () => infractions.filter(inf => inf.staffEmail === currentUser.email),
    [infractions, currentUser.email]
  );
  const unreadInfractions = myInfractions.filter(inf => !reviewedInfractionIds.includes(inf.id));

  const myTasks = React.useMemo(
    () => (tasks || []).filter(t => t.assignedToEmail === currentUser.email && t.status !== 'Completed'),
    [tasks, currentUser.email]
  );
  const pendingTasksCount = myTasks.length;

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

  const approvedFlightsCount = React.useMemo(() => {
    const usersLogs = (currentUser.flightLogs || []).length;
    // fallback or calculate from flightLogs if empty
    return usersLogs || 0;
  }, [currentUser]);

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingFlightsList = (flights || []).filter(f => f.date >= todayStr).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)).slice(0, 5);
  const completedFlightsList = (flights || []).filter(f => f.date < todayStr).sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)).slice(0, 5);
  const recentReportsList = (reports || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

  // Flat navItems definitions for dynamic lookup
  const navItems = [
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'View the latest news and updates from the administration.',
      icon: Megaphone,
      color: '#8b5cf6',
      component: Announcements,
      badgeCount: unreadAnnouncementsCount
    },
    {
      id: 'schedule',
      title: 'Weekly Schedule',
      description: 'View the live schedule of all upcoming flights.',
      icon: Plane,
      color: '#2563eb',
      component: AllocationRequests,
      badgeCount: unreadFlightCount
    },
    {
      id: 'roster',
      title: 'My Roster',
      description: 'View the flights you are allocated to attend.',
      icon: ClipboardList,
      color: '#3b82f6',
      component: AllocationRequests
    },
    {
      id: 'loa',
      title: 'Leave of Absence',
      description: 'Request time off and monitor administrative replies.',
      icon: Calendar,
      color: '#1d4ed8',
      component: LeaveOfAbsence
    },
    {
      id: 'meetingsAndEvents',
      title: 'Meetings & Events',
      description: 'View scheduled meetings and events side-by-side.',
      icon: Calendar,
      color: '#10b981',
      component: MeetingsAndEvents
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
      id: 'reports',
      title: 'Reports',
      description: 'Report rule-breaking players or review admin actions.',
      icon: AlertTriangle,
      color: '#2563eb',
      component: Reports,
      badgeCount: unreadReportsCount
    },
    {
      id: 'tickets',
      title: 'Support Tickets',
      description: 'Open a ticket for private support and communication with admins.',
      icon: LifeBuoy,
      color: '#f43f5e',
      component: SupportTickets
    },
    {
      id: 'infractions',
      title: 'Disciplinary Record',
      description: 'Track disciplinary alerts and official performance marks.',
      icon: Slash,
      color: '#1e3a8a',
      component: Infractions,
      badgeCount: unreadInfractions.length
    },
    {
      id: 'calendar',
      title: 'Calendar Overview',
      description: 'View upcoming flights, events, and meetings for the year.',
      icon: Calendar,
      color: '#f59e0b',
      component: CalendarPage
    },
    {
      id: 'documents',
      title: 'Handbooks & FAQs',
      description: 'Read operations manuals, protocols, and guides.',
      icon: FileText,
      color: '#1e40af',
      component: Documents,
      badgeCount: unreadDocumentsCount
    },
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
      id: 'allStaff',
      title: 'All Staff',
      description: 'View the complete staff roster and online presence.',
      icon: User,
      color: '#8b5cf6',
      component: AllStaff
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
      component: Tasks,
      badgeCount: pendingTasksCount
    },
    {
      id: 'logs',
      title: 'Flight Logs',
      description: 'Submit and inspect detailed flight operations reports.',
      icon: ClipboardList,
      color: '#3b82f6',
      component: FlightLogs
    },
    ...(currentUser.isAdmin ? [{
      id: 'analytics',
      title: 'Analytics',
      description: 'View server-wide statistics, staff activity, and analytics.',
      icon: BarChart2,
      color: '#8b5cf6',
      component: Analytics
    }] : [])
  ];

  const renderActiveComponent = () => {
    if (activeTab === 'admin') {
      if (pageConfig && !pageConfig.adminPanel && currentUser?.email !== superAdminEmail) {
        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center'}}>
            <Slash size={48} color="#ef4444" style={{marginBottom: '20px'}} />
            <h2 style={{color: 'var(--color-text-main)', fontSize: '1.5rem', marginBottom: '10px'}}>Temporarily Unavailable</h2>
            <p style={{color: 'var(--color-text-muted)'}}>This page has been temporarily disabled by the administration.</p>
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
            <h2 style={{color: 'var(--color-text-main)', fontSize: '1.5rem', marginBottom: '10px'}}>Temporarily Unavailable</h2>
            <p style={{color: 'var(--color-text-muted)'}}>This page has been temporarily disabled by the administration.</p>
          </div>
        );
      }
      const Component = item.component;
      if (activeTab === 'schedule') {
        return <Component showOnlyMyRoster={false} />;
      }
      if (activeTab === 'roster') {
        return <Component showOnlyMyRoster={true} />;
      }
      return <Component />;
    }
    return null;
  };

  return (
    <div className="portal-container">
      {/* Persistent Left Sidebar */}
      <aside className="portal-sidebar">
        <div className="portal-sidebar-logo-container">
          <img src="./make_the_wing_symbol.png" alt="Luma Logo" className="portal-sidebar-logo" />
          <h1 className="portal-sidebar-title">Luma</h1>
          <p className="portal-sidebar-subtitle">Staff Portal</p>
          <span className="portal-sidebar-subtext">Luma Airways</span>
        </div>

        {/* Group: MAIN */}
        <div className="portal-sidebar-group">
          <div className="portal-sidebar-group-header">Main</div>
          <div className="portal-sidebar-menu">
            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Activity size={18} />
              <span>Dashboard</span>
            </div>
            
            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Plane size={18} />
              <span>Schedule</span>
            </div>

            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'roster' ? 'active' : ''}`}
              onClick={() => setActiveTab('roster')}
            >
              <ClipboardList size={18} />
              <span>My Roster</span>
            </div>

            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'loa' ? 'active' : ''}`}
              onClick={() => setActiveTab('loa')}
            >
              <Calendar size={18} />
              <span>Absences</span>
            </div>

            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'meetingsAndEvents' ? 'active' : ''}`}
              onClick={() => setActiveTab('meetingsAndEvents')}
            >
              <Calendar size={18} />
              <span>Meetings & Events</span>
            </div>

            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'announcements' ? 'active' : ''}`}
              onClick={() => setActiveTab('announcements')}
            >
              <Megaphone size={18} />
              <span>Announcements</span>
              {unreadAnnouncementsCount > 0 && (
                <span className="portal-sidebar-menu-item-badge">{unreadAnnouncementsCount}</span>
              )}
            </div>

            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              <Trophy size={18} />
              <span>Staff of the Week</span>
            </div>
          </div>
        </div>

        {/* Group: REPORTS & SUPPORT */}
        <div className="portal-sidebar-group">
          <div className="portal-sidebar-group-header">Reports & Support</div>
          <div className="portal-sidebar-menu">
            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <AlertTriangle size={18} />
              <span>Reports</span>
              {unreadReportsCount > 0 && (
                <span className="portal-sidebar-menu-item-badge">{unreadReportsCount}</span>
              )}
            </div>

            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <LifeBuoy size={18} />
              <span>Support</span>
            </div>

            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'infractions' ? 'active' : ''}`}
              onClick={() => reviewInfractions()}
            >
              <Slash size={18} />
              <span>Disciplinary Record</span>
              {unreadInfractions.length > 0 && (
                <span className="portal-sidebar-menu-item-badge">{unreadInfractions.length}</span>
              )}
            </div>
          </div>
        </div>

        {/* Group: RESOURCES */}
        <div className="portal-sidebar-group">
          <div className="portal-sidebar-group-header">Resources</div>
          <div className="portal-sidebar-menu">
            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar size={18} />
              <span>Calendar Overview</span>
            </div>

            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <FileText size={18} />
              <span>Handbooks & FAQs</span>
              {unreadDocumentsCount > 0 && (
                <span className="portal-sidebar-menu-item-badge">{unreadDocumentsCount}</span>
              )}
            </div>
          </div>
        </div>

        {/* Group: ADMIN (Conditional) */}
        {currentUser.isAdmin && (
          <div className="portal-sidebar-group">
            <div className="portal-sidebar-group-header">Admin</div>
            <div className="portal-sidebar-menu">
              <div 
                className={`portal-sidebar-menu-item ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <Settings size={18} />
                <span>Admin Panel</span>
              </div>
            </div>
          </div>
        )}

        {/* Group: SYSTEM */}
        <div className="portal-sidebar-group" style={{ marginTop: 'auto' }}>
          <div className="portal-sidebar-menu">
            <div 
              className={`portal-sidebar-menu-item ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <LifeBuoy size={18} />
              <span>Report a Bug</span>
            </div>

            <div 
              className="portal-sidebar-menu-item"
              onClick={logout}
              style={{ color: '#ef4444' }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="portal-main-area">
        {/* Top Header Bar */}
        <header className="portal-top-bar">
          <div className="portal-breadcrumbs">
            <User size={16} />
            <span>Home</span>
            <span>/</span>
            <span style={{ fontWeight: '700', color: '#0f294a' }}>
              {activeTab === 'home' ? 'Dashboard' : activeTab === 'meetingsAndEvents' ? 'Meetings & Events' : activeTab}
            </span>
          </div>

          <div className="portal-top-bar-right">
            {/* Clock Pill */}
            {showClockBattery && (
              <div className="portal-clock-capsule">
                <Clock size={16} />
                <span>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !use24HourClock })} BST
                </span>
              </div>
            )}

            {/* Notification Bell */}
            <div className="portal-notification-bell" onClick={() => setIsNotificationsOpen(true)}>
              <Bell size={18} />
              {unreadInfractions.length > 0 && (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
              )}
            </div>

            {/* User Widget */}
            <div className="portal-user-widget" onClick={() => setIsSettingsOpen(true)}>
              {currentUser.profilePicture ? (
                <img src={currentUser.profilePicture} alt="Profile" className="portal-user-avatar" />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#5bc2e7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                  {currentUser.firstName ? currentUser.firstName[0] : 'U'}
                </div>
              )}
              <div className="portal-user-info">
                <span className="portal-user-name">{currentUser.firstName}</span>
                <span className="portal-user-username">@{currentUser.robloxUsername}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="portal-content">
          {/* Warning Banners inside layout */}
          {unreadInfractions.length > 0 && activeTab !== 'infractions' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.infractionAlert}
              className="glass-panel"
            >
              <div style={styles.infractionAlertIcon}>
                <AlertTriangle size={20} color="#fff" />
              </div>
              <div style={styles.infractionAlertBody}>
                <span style={{ ...styles.infractionAlertKicker, color: '#fecaca' }}>NEW DISCIPLINARY RECORD</span>
                <strong style={{ ...styles.infractionAlertTitle, color: '#fff' }}>
                  You have {unreadInfractions.length} unreviewed infraction{unreadInfractions.length > 1 ? 's' : ''} on your record.
                </strong>
              </div>
              <button onClick={reviewInfractions} className="btn-secondary" style={{ ...styles.infractionReviewBtn, background: '#fff', color: '#dc2626' }}>
                <Eye size={16} />
                <span>Review</span>
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'home' ? (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                style={styles.homeContainer}
              >
                {/* Greeting Card */}
                <div style={customStyles.greetingCard}>
                  <div style={customStyles.greetingLeft}>
                    <h2 style={customStyles.greetingTitle}>Hiya, {currentUser.firstName}!</h2>
                    <p style={customStyles.greetingSubtitle}>Welcome back to Luma Staff Portal. You have access to all your schedules and rosters.</p>
                    <div style={customStyles.usernameBadge}>@{currentUser.robloxUsername}</div>
                  </div>
                  <div style={customStyles.greetingRight}>
                    <div style={customStyles.flightCountBox}>
                      <Plane size={24} style={{ color: '#fff' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={customStyles.flightCountNumber}>{approvedFlightsCount}</span>
                        <span style={customStyles.flightCountLabel}>Approved Flights Done</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Lists */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '16px' }}>
                  
                  {/* Upcoming Flights */}
                  <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                      <Plane size={18} color="#5bc2e7" />
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>Upcoming Flights</h3>
                    </div>
                    {upcomingFlightsList.length === 0 ? (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No upcoming flights scheduled.</p>
                    ) : (
                      upcomingFlightsList.map(flight => (
                        <div 
                          key={flight.id} 
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.pathname = tabToPath['schedule'];
                            url.searchParams.set('flightId', flight.id);
                            window.history.pushState({}, '', url.toString());
                            setActiveTab('schedule');
                          }}
                          style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                          className="hover-card"
                        >
                          <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{flight.flightCode}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{flight.date} • {flight.time} BST</div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Completed Flights */}
                  <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                      <CheckSquare size={18} color="#10b981" />
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>Completed Flights</h3>
                    </div>
                    {completedFlightsList.length === 0 ? (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No completed flights found.</p>
                    ) : (
                      completedFlightsList.map(flight => (
                        <div 
                          key={flight.id} 
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.pathname = tabToPath['schedule'];
                            url.searchParams.set('flightId', flight.id);
                            window.history.pushState({}, '', url.toString());
                            setActiveTab('schedule');
                          }}
                          style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                          className="hover-card"
                        >
                          <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{flight.flightCode}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{flight.date} • {flight.time} BST</div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Recent Reports */}
                  <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                      <AlertTriangle size={18} color="#ef4444" />
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>Recent Reports</h3>
                    </div>
                    {recentReportsList.length === 0 ? (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No recent reports.</p>
                    ) : (
                      recentReportsList.map(report => (
                        <div 
                          key={report.id} 
                          onClick={() => setActiveTab('reports')}
                          style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                          className="hover-card"
                        >
                          <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{report.reportedPlayer}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{report.type} • {report.status}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Sub-pages Container */
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div style={styles.backBar}>
                  <button onClick={() => setActiveTab('home')} className="btn-secondary" style={styles.backBtn}>
                    <ArrowLeft size={16} />
                    <span>Return to Dashboard</span>
                  </button>
                  <div style={styles.pageTitleContainer}>
                    <h2 style={styles.pageTitle}>
                      {activeTab === 'admin' ? 'Admin Control Center' : activeTab === 'schedule' ? 'Flight Schedule' : activeTab === 'roster' ? 'My Roster' : activeTab === 'meetingsAndEvents' ? 'Meetings & Events' : navItems.find(i => i.id === activeTab)?.title}
                    </h2>
                  </div>
                </div>

                <div className="glass-panel" style={styles.pageCard}>
                  {renderActiveComponent()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
}

const customStyles = {
  greetingCard: {
    background: 'linear-gradient(135deg, #5bc2e7 0%, #2563eb 100%)',
    borderRadius: '16px',
    padding: '32px',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.15)',
    flexWrap: 'wrap',
    gap: '20px',
  },
  greetingLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-start',
  },
  greetingTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
    margin: 0,
    color: '#ffffff',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  greetingSubtitle: {
    fontSize: '1rem',
    color: '#ffffff',
    opacity: 0.9,
    margin: 0,
    maxWidth: '500px',
  },
  usernameBadge: {
    background: 'rgba(255, 255, 255, 0.25)',
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffffff',
    marginTop: '4px',
  },
  greetingRight: {
    display: 'flex',
    alignItems: 'center',
  },
  flightCountBox: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backdropFilter: 'blur(10px)',
  },
  flightCountNumber: {
    fontSize: '2rem',
    fontWeight: '900',
    lineHeight: '1',
    color: '#ffffff',
  },
  flightCountLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#ffffff',
    opacity: 0.8,
    letterSpacing: '0.5px',
  },
};

const styles = {
  appWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    position: 'relative',
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
    width: '100%',
    margin: '0 auto 24px auto',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.85), rgba(15, 23, 42, 0.9))',
    boxShadow: '0 18px 44px rgba(239, 68, 68, 0.1)',
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
    fontSize: '0.78rem',
    fontWeight: '900',
    letterSpacing: '0.5px',
  },
  infractionAlertTitle: {
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
    gap: '24px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  menuCard: {
    padding: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    borderRadius: '14px',
  },
  cardIconWrapper: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
  },
  cardDescription: {
    fontSize: '0.82rem',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
  },
  backBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
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
    padding: '24px',
    minHeight: '400px',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: '#ef4444',
    color: '#ffffff',
    fontSize: '0.68rem',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '10px',
    border: '2px solid #ffffff',
  }
};
