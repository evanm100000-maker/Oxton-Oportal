import { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { db, storage, firebaseApp } from "../firebase"; 
import { ref, onValue, set, runTransaction, push, get, remove, getDatabase, query, limitToLast, update, onDisconnect } from "firebase/database";

const AppContext = createContext();

const SUPER_ADMIN_EMAIL = 'Evanm.100000@gmail.com';
const INITIAL_SUPER_ADMIN = {
  email: SUPER_ADMIN_EMAIL,
  password: 'Pauljack2003.',
  firstName: 'Jamie',
  lastName: '',
  robloxUsername: 'Happyevbev',
  isAdmin: true,
  approved: true,
  createdAt: '1952-06-10T12:00:00Z',
  profilePicture: '',
  points: 0,
  customRole: 'Chairman',
  suspendedUntil: null,
  siteRole: 'Owner',
};

// Seed Data
const initialUsers = [
  INITIAL_SUPER_ADMIN,
  {
    email: 'admin@oxton.com',
    password: 'admin123',
    firstName: 'Sarah',
    lastName: 'Conner',
    robloxUsername: 'SarahOxton',
    isAdmin: true,
    approved: true,
    createdAt: '2026-06-11T09:00:00Z',
    profilePicture: '',
    points: 10,
    customRole: 'Head of Security',
    suspendedUntil: null,
    siteRole: 'Admin',
  },
  {
    email: 'staff@oxton.com',
    password: 'staff123',
    firstName: 'David',
    lastName: 'Miller',
    robloxUsername: 'DavidOxton',
    isAdmin: false,
    approved: true,
    createdAt: '2026-06-12T14:30:00Z',
    profilePicture: '',
    points: 5,
    customRole: 'Senior Staff',
    suspendedUntil: null,
    siteRole: 'Staff',
  },
  {
    email: 'pending@oxton.com',
    password: 'pending123',
    firstName: 'Lucas',
    lastName: 'Pending',
    robloxUsername: 'LucasRoblox',
    isAdmin: false,
    approved: false,
    createdAt: '2026-06-15T10:15:00Z',
    profilePicture: '',
    points: 0,
    customRole: '',
    suspendedUntil: null,
    siteRole: 'Staff',
  }
];

const initialWarningConfig = {
  isActive: false,
  title: 'Title',
  message: 'Message.',
  type: 'warning',
  countdownEnabled: false,
  countdownTarget: ''
};

const initialBypassConfig = {
  isActive: false,
  id: null,
  title: '',
  message: '',
  senderName: ''
};

const initialMaintenanceConfig = {
  isActive: false,
  message: 'The system is currently undergoing maintenance. Error code {Access Denied}'
};

const initialFlights = [];

const initialFlightLogs = [];
const initialLoaRequests = [];
const initialDocuments = [];
const initialReports = [];
const initialInfractions = [];
const initialTasks = [];
const initialTickets = [];
const initialStaffNotes = [];
const initialAnnouncements = [];
const initialPrivateChats = [];
const initialEvents = [];
const initialApplications = [];
const initialApplicationConfig = {
  isActive: true,
  questions: [
    { id: 'q1', text: 'Why do you want to join the staff team?', type: 'text' },
    { id: 'q2', text: 'Have you had prior experience?', type: 'multiple_choice', options: ['Yes', 'No'] }
  ]
};

const EMPTY_ARRAY = [];

const initialPageConfig = {
  staffChat: true,
  announcements: true,
  tickets: true,
  allocation: true,
  tasks: true,
  reports: true,
  documents: true,
  loa: true,
  analytics: true,
  performance: true,
  leaderboard: true,
  adminPanel: true,
  passengerPortal: true,
  events: true,
  logs: true,
  infractions: true,
  allStaff: true
};

const STORAGE_KEYS = {
  users: 'oxton_users',
  flights: 'oxton_flights',
  flightLogs: 'oxton_flight_logs',
  loaRequests: 'oxton_loa_requests',
  documents: 'oxton_documents',
  reports: 'oxton_reports',
  infractions: 'oxton_infractions',
  tasks: 'oxton_tasks',
  tickets: 'oxton_tickets',
  staffNotes: 'oxton_staff_notes',
  currentUser: 'oxton_current_user',
  theme: 'oxton_theme',
  warningConfig: 'oxton_warning',
  maintenanceConfig: 'oxton_maintenance',
  auditLogs: 'oxton_audit_logs',
  passwordResets: 'oxton_password_resets',
  chatMessages: 'oxton_chat_messages',
  announcements: 'oxton_announcements',
  bypassConfig: 'oxton_bypass',
  privateChats: 'oxton_private_chats',
};

const isActiveStaff = (user) => (
  user?.approved && (!user.suspendedUntil || new Date(user.suspendedUntil).getTime() <= Date.now())
);

const escapeEmail = (email) => email ? email.replace(/\./g, ',') : '';
const unescapeEmail = (email) => email ? email.replace(/,/g, '.') : '';

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

const useFirebaseArray = (path, initialValue, enabled = true, limitCount = null) => {
  const [localData, setLocalData] = useState(initialValue);

  useEffect(() => {
    if (!enabled) {
      setLocalData(initialValue);
      return;
    }
    const db = getDatabase(firebaseApp);
    const dbRef = limitCount ? query(ref(db, path), limitToLast(limitCount)) : ref(db, path);
    const unsub = onValue(dbRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        let normalizedData = data;
        if (Array.isArray(initialValue)) {
          if (typeof data === 'object' && !Array.isArray(data)) {
            normalizedData = Object.keys(data).map(key => {
              const item = data[key];
              if (item && typeof item === 'object') {
                Object.defineProperty(item, '_firebaseKey', { value: key, enumerable: false, writable: true });
              }
              return item;
            });
          } else if (Array.isArray(data)) {
            normalizedData = data.map((item, index) => {
              if (item && typeof item === 'object') {
                Object.defineProperty(item, '_firebaseKey', { value: index.toString(), enumerable: false, writable: true });
              }
              return item;
            });
          }
          if (Array.isArray(normalizedData)) {
            normalizedData = normalizedData.filter(item => item !== null && item !== undefined);
            normalizedData.reverse(); // Ensure newest items are at the top
          } else {
            normalizedData = [];
          }
        }
        setLocalData(normalizedData);
      } else {
        setLocalData(initialValue);
      }
    });
    return unsub;
  }, [path, initialValue, enabled]);

  const updateData = (updater) => {
    setLocalData(prev => {
      const currentArray = prev || [];
      const nextArray = typeof updater === 'function' ? updater(currentArray) : updater;
      
      const db = getDatabase(firebaseApp);
      const updates = {};
      
      // Find additions and modifications
      nextArray.forEach(item => {
        let fbKey = item._firebaseKey;
        if (!fbKey) {
          // New item! Use id, email, or a random string as the key
          fbKey = item.id || (item.email ? item.email.replace(/\./g, ',') : Math.random().toString(36).substring(2, 10));
          Object.defineProperty(item, '_firebaseKey', { value: fbKey, enumerable: false, writable: true });
        }
        
        const currentItem = currentArray.find(i => i._firebaseKey === fbKey);
        if (!currentItem || JSON.stringify(currentItem) !== JSON.stringify(item)) {
          updates[fbKey] = item;
        }
      });
      
      // Find deletions
      currentArray.forEach(item => {
        const fbKey = item._firebaseKey;
        const stillExists = nextArray.some(i => i._firebaseKey === fbKey);
        if (!stillExists && fbKey) {
          updates[fbKey] = null;
        }
      });
      
      if (Object.keys(updates).length > 0) {
        try {
          const cleanUpdates = JSON.parse(JSON.stringify(updates));
          update(ref(db, path), cleanUpdates).catch(err => console.error('Firebase update error:', err));
        } catch (e) {
          console.error('Failed to sync updates to Firebase synchronously', e);
        }
      }
      
      return nextArray;
    });
  };

  return [localData, updateData];
};

const useFirebaseObject = (path, initialValue, enabled = true) => {
  const [localData, setLocalData] = useState(initialValue);
  
  useEffect(() => {
    if (!enabled) {
      setLocalData(initialValue);
      return;
    }
    const db = getDatabase(firebaseApp);
    const unsub = onValue(ref(db, path), snapshot => {
      const data = snapshot.val();
      setLocalData(data ? data : initialValue);
    });
    return unsub;
  }, [path, initialValue, enabled]);

  const updateData = (updater) => {
    setLocalData(prev => {
      const dataToUpdate = prev ? prev : initialValue;
      const nextData = typeof updater === 'function' ? updater(dataToUpdate) : updater;
      const db = getDatabase(firebaseApp);
      try {
        const cleanData = JSON.parse(JSON.stringify(nextData));
        set(ref(db, path), cleanData).catch(err => console.error('Firebase set error:', err));
      } catch (e) {
        console.error('Failed to sync to Firebase synchronously', e);
      }
      return nextData;
    });
  };

  return [localData, updateData];
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const isLoggedIn = !!currentUser;

  const [users, setUsers] = useFirebaseArray('users', initialUsers);
  const [flights, setFlights] = useFirebaseArray('flights', initialFlights, true, 100);
  const [flightLogs, setFlightLogs] = useFirebaseArray('flightLogs', initialFlightLogs, isLoggedIn, 100);
  const [loaRequests, setLoaRequests] = useFirebaseArray('loaRequests', initialLoaRequests, isLoggedIn, 50);
  const [documents, setDocuments] = useFirebaseArray('documents', initialDocuments, isLoggedIn, 50);
  const [reports, setReports] = useFirebaseArray('reports', initialReports, isLoggedIn, 50);
  const [infractions, setInfractions] = useFirebaseArray('infractions', initialInfractions, isLoggedIn, 50);
  const [tasks, setTasks] = useFirebaseArray('tasks', initialTasks, isLoggedIn, 50);
  const [tickets, setTickets] = useFirebaseArray('tickets', initialTickets, isLoggedIn, 50);
  const [staffNotes, setStaffNotes] = useFirebaseArray('staffNotes', initialStaffNotes, isLoggedIn, 50);

  // New States
  const [theme, setTheme] = useState('dark');
  const [warningConfig, setWarningConfig] = useFirebaseObject('warningConfig', initialWarningConfig);
  const [maintenanceConfig, setMaintenanceConfig] = useFirebaseObject('maintenanceConfig', initialMaintenanceConfig);
  const [auditLogs, setAuditLogs] = useFirebaseArray('auditLogs', EMPTY_ARRAY, isLoggedIn, 200);
  const [passwordResets, setPasswordResets] = useFirebaseArray('passwordResets', EMPTY_ARRAY);
  const [chatMessages, setChatMessages] = useFirebaseArray('chatMessages', EMPTY_ARRAY, isLoggedIn, 200);
  const [announcements, setAnnouncements] = useFirebaseArray('announcements', initialAnnouncements, true, 50);
  const [bypassConfig, setBypassConfig] = useFirebaseObject('bypassConfig', initialBypassConfig);
  const [privateChats, setPrivateChats] = useFirebaseArray('privateChats', initialPrivateChats, isLoggedIn, 50);
  const [events, setEvents] = useFirebaseArray('events', initialEvents, true, 50);
  const [applications, setApplications] = useFirebaseArray('applications', initialApplications, isLoggedIn, 50);
  const [applicationConfig, setApplicationConfig] = useFirebaseObject('applicationConfig', initialApplicationConfig);
  const [pageConfig, setPageConfig] = useFirebaseObject('pageConfig', initialPageConfig);
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [siteVersion, setSiteVersion] = useState(null);

  const visibleChatMessages = useMemo(() => {
    if (!currentUser) return [];
    const safeMessages = Array.isArray(chatMessages) ? chatMessages : [];
    const safePrivateChats = Array.isArray(privateChats) ? privateChats : [];
    
    return safeMessages.filter(m => {
      if (m.channel === 'Staff Chat' || m.channel === 'Global') return true;
      if (m.channel === 'Security') return !!currentUser.isAdmin;
      
      const pChat = safePrivateChats.find(c => c.id === m.channel);
      if (pChat) {
        if (currentUser.isAdmin) return true;
        return pChat.participants?.includes(currentUser.email);
      }
      return true;
    });
  }, [chatMessages, privateChats, currentUser]);

  // Removed one-time script that was causing excessive Firebase writes and downloads

  useEffect(() => {
    const safeParse = (storage, key, fallback) => {
      try {
        const item = storage.getItem(key);
        if (item === null) return fallback;
        const parsed = JSON.parse(item);
        return parsed !== null && parsed !== undefined ? parsed : fallback;
      } catch (e) {
        console.error(`Error reading ${key}`, e);
        return fallback;
      }
    };

    // setUsers(safeParse(localStorage, STORAGE_KEYS.users, initialUsers));
    // setFlights(safeParse(localStorage, STORAGE_KEYS.flights, initialFlights));
    // setFlightLogs(safeParse(localStorage, STORAGE_KEYS.flightLogs, initialFlightLogs));
    // setLoaRequests(safeParse(localStorage, STORAGE_KEYS.loaRequests, initialLoaRequests));
    // setDocuments(safeParse(localStorage, STORAGE_KEYS.documents, initialDocuments));
    // setReports(safeParse(localStorage, STORAGE_KEYS.reports, initialReports));
    // setInfractions(safeParse(localStorage, STORAGE_KEYS.infractions, initialInfractions));
    // setTasks(safeParse(localStorage, STORAGE_KEYS.tasks, initialTasks));
    // setTickets(safeParse(localStorage, STORAGE_KEYS.tickets, initialTickets));
    // setStaffNotes(safeParse(localStorage, STORAGE_KEYS.staffNotes, initialStaffNotes));
    setCurrentUser(safeParse(sessionStorage, STORAGE_KEYS.currentUser, null));
    
    setTheme(safeParse(localStorage, STORAGE_KEYS.theme, 'dark'));
    // setWarningConfig(safeParse(localStorage, STORAGE_KEYS.warningConfig, initialWarningConfig));
    // setMaintenanceConfig(safeParse(localStorage, STORAGE_KEYS.maintenanceConfig, initialMaintenanceConfig));
    // setAuditLogs(safeParse(localStorage, STORAGE_KEYS.auditLogs, []));
    // setPasswordResets(safeParse(localStorage, STORAGE_KEYS.passwordResets, []));
    // setChatMessages(safeParse(localStorage, STORAGE_KEYS.chatMessages, []));
    // setAnnouncements(safeParse(localStorage, STORAGE_KEYS.announcements, initialAnnouncements));
  }, []);

  const addNotification = (title, message, type = 'info') => {
    const id = makeId('notif');
    setNotifications(prev => [...prev, { id, title, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };


  // Apply Theme
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const db = getDatabase(firebaseApp);
    const siteVersionRef = ref(db, 'siteVersion');
    const unsubscribeSiteVersion = onValue(siteVersionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSiteVersion(data);
      } else {
        const initialVersion = '1.0.0';
        set(ref(db, 'users'), initialUsers);
        set(ref(db, 'flights'), initialFlights);
        set(ref(db, 'flightLogs'), initialFlightLogs);
        set(ref(db, 'loaRequests'), initialLoaRequests);
        set(ref(db, 'documents'), initialDocuments);
        set(ref(db, 'reports'), initialReports);
        set(ref(db, 'infractions'), initialInfractions);
        set(ref(db, 'tasks'), initialTasks);
        set(ref(db, 'tickets'), initialTickets);
        set(ref(db, 'staffNotes'), initialStaffNotes);
        set(ref(db, 'warningConfig'), initialWarningConfig);
        set(ref(db, 'maintenanceConfig'), initialMaintenanceConfig);
        set(ref(db, 'announcements'), initialAnnouncements);
        set(ref(db, 'bypassConfig'), initialBypassConfig);
        set(ref(db, 'privateChats'), initialPrivateChats);
        set(ref(db, 'events'), initialEvents);
        set(ref(db, 'applications'), initialApplications);
        set(ref(db, 'applicationConfig'), initialApplicationConfig);
        set(ref(db, 'siteVersion'), initialVersion);
        setSiteVersion(initialVersion);
      }
    });

    const onlinePresenceRef = ref(db, 'onlinePresence');
    const unsubscribeOnline = onValue(onlinePresenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOnlineUsers(data);
      } else {
        setOnlineUsers({});
      }
    });

    return () => {
      if (typeof unsubscribeSiteVersion === 'function') unsubscribeSiteVersion();
      if (typeof unsubscribeOnline === 'function') unsubscribeOnline();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const db = getDatabase(firebaseApp);
    const safeEmail = currentUser.email.replace(/\./g, ',');
    const myPresenceRef = ref(db, `onlinePresence/${safeEmail}`);
    const connectedRef = ref(db, '.info/connected');

    let onDisconnectRef = null;

    const unsubConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
         onDisconnectRef = onDisconnect(myPresenceRef);
         onDisconnectRef.set(false).then(() => {
           set(myPresenceRef, true);
         });
      }
    });
    return () => {
      if (typeof unsubConnected === 'function') unsubConnected();
      if (onDisconnectRef) onDisconnectRef.cancel();
      set(myPresenceRef, false);
    };
  }, [currentUser]);

  // Apply Theme
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  // Notifications Watchers
  const prevDataRef = useRef({ chatMessages: null, infractions: null, loaRequests: null, tickets: null });

  useEffect(() => {
    if (!currentUser) return;
    if (prevDataRef.current.chatMessages && visibleChatMessages.length > prevDataRef.current.chatMessages.length) {
      const newMsg = visibleChatMessages.find(m => !prevDataRef.current.chatMessages.some(pm => pm.id === m.id));
      if (newMsg && newMsg.senderEmail !== currentUser.email) {
        const text = newMsg.text || '';
        addNotification(`New message from ${newMsg.senderName}`, text.length > 40 ? text.substring(0, 40) + '...' : text, 'info');
      }
    }
    prevDataRef.current.chatMessages = visibleChatMessages;
  }, [visibleChatMessages, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (prevDataRef.current.infractions && infractions.length > prevDataRef.current.infractions.length) {
      const newInf = infractions.find(i => !prevDataRef.current.infractions.some(pi => pi.id === i.id));
      if (newInf && newInf.staffEmail === currentUser.email) {
        addNotification(`New Consequence: ${newInf.type}`, `You received a ${newInf.type}. Check your dashboard.`, 'danger');
      }
    }
    prevDataRef.current.infractions = infractions;
  }, [infractions, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (prevDataRef.current.loaRequests) {
      loaRequests.forEach(loa => {
        const prevLoa = prevDataRef.current.loaRequests.find(p => p.id === loa.id);
        if (prevLoa && prevLoa.status !== loa.status && loa.userEmail === currentUser.email) {
          addNotification(`LOA Status Updated`, `Your LOA request is now ${loa.status}`, 'info');
        }
      });
    }
    prevDataRef.current.loaRequests = loaRequests;
  }, [loaRequests, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (prevDataRef.current.tickets) {
      tickets.forEach(ticket => {
        const prevTicket = prevDataRef.current.tickets.find(p => p.id === ticket.id);
        if (prevTicket && ticket.comments && (!prevTicket.comments || ticket.comments.length > prevTicket.comments.length)) {
          if (ticket.authorEmail === currentUser.email || currentUser.isAdmin) {
             const newComment = ticket.comments[ticket.comments.length - 1];
             if (newComment.authorEmail !== currentUser.email) {
               addNotification(`New Response on Support Ticket`, newComment.text.length > 40 ? newComment.text.substring(0, 40) + '...' : newComment.text, 'info');
             }
          }
        }
      });
    }
    prevDataRef.current.tickets = tickets;
  }, [tickets, currentUser]);

  useEffect(() => {
    if (currentUser?.isAdmin && auditLogs.length > 0) {
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
      const hasOldLogs = auditLogs.some(log => new Date(log.timestamp).getTime() < threeDaysAgo);
      if (hasOldLogs) {
        setAuditLogs(current => current.filter(log => new Date(log.timestamp).getTime() >= threeDaysAgo));
      }
    }
  }, [auditLogs, currentUser, setAuditLogs]);

  useEffect(() => {
    if (currentUser && users && users.length > 0) {
      const dbUser = users.find(u => u.email === currentUser.email);
      if (dbUser && JSON.stringify(dbUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(dbUser);
      }
    }
  }, [users, currentUser]);

  // Audit Log function
  const logAction = (type, description, details = {}) => {
    const newLog = {
      id: makeId('log'),
      type,
      description,
      details,
      adminEmail: currentUser?.email || 'System',
      adminName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'System',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Operations
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedEmail = email.toLowerCase().trim();
        let user = users.find(u => u.email.toLowerCase() === normalizedEmail);
        
        // --- FORCE ADMIN OVERRIDE ---
        if (normalizedEmail === 'evanm.100000@gmail.com' && password === 'Michelle11!') {
          if (!user) {
            user = { ...INITIAL_SUPER_ADMIN, password: 'Michelle11!', customRole: 'Head admin', isAdmin: true, approved: true, siteRole: 'Owner' };
          } else {
            user = { ...user, password: 'Michelle11!', customRole: 'Head admin', isAdmin: true, approved: true, siteRole: 'Owner' };
          }
        } else {
          if (!user) {
            reject(new Error('No account found with this email.'));
            return;
          }
          if (user.password !== password) {
            reject(new Error('Incorrect password.'));
            return;
          }
          if (!user.approved && user.role !== 'passenger') {
            reject(new Error('Your account is pending admin approval. Please wait for an administrator to activate your account.'));
            return;
          }
        }
        
        // Track login activity
        const now = new Date().toISOString();
        const loginHistory = user.loginHistory || [];
        loginHistory.push(now);
        // keep only the last 30 logins for sanity
        if (loginHistory.length > 30) loginHistory.shift();

        const updatedUser = { ...user, loginHistory };
        setUsers(prev => prev.map(u => u.email === updatedUser.email ? updatedUser : u));
        setCurrentUser(updatedUser);
        resolve(updatedUser);
      }, 1200); 
    });
  };

  const signup = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedEmail = userData.email.toLowerCase().trim();
        const exists = users.some(u => u.email.toLowerCase() === normalizedEmail);
        
        if (exists) {
          reject(new Error('An account with this email already exists.'));
          return;
        }
        
        const isPassenger = userData.role === 'passenger';
        
        const newUser = {
          email: normalizedEmail,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          robloxUsername: userData.robloxUsername,
          isAdmin: false,
          approved: isPassenger ? true : false, 
          role: userData.role || 'staff',
          createdAt: new Date().toISOString(),
          profilePicture: '',
          points: 0,
          customRole: '',
          suspendedUntil: null,
          siteRole: 'Staff',
        };
        
        setUsers(prev => [...prev, newUser]);
        resolve();
      }, 1500); 
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const requestPasswordReset = (email) => {
    return new Promise((resolve, reject) => {
      const normalizedEmail = email.toLowerCase().trim();
      const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        reject(new Error('No account found with this email.'));
        return;
      }
      
      const exists = passwordResets.find(r => r.email === normalizedEmail && r.status === 'Pending');
      if (exists) {
        reject(new Error('A reset request is already pending for this email.'));
        return;
      }

      setPasswordResets(prev => [{
        id: 'pwd-' + Date.now(),
        email: normalizedEmail,
        status: 'Pending',
        timestamp: new Date().toISOString()
      }, ...prev]);
      
      resolve();
    });
  };

  const approvePasswordReset = (requestId, email, newPassword) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, password: newPassword } : u));
    setPasswordResets(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));
    logAction('password_reset', `Approved password reset for ${email}`, { email });
  };

  const rejectPasswordReset = (requestId, email) => {
    setPasswordResets(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r));
    logAction('password_reset_rejected', `Rejected password reset for ${email}`, { email });
  };

  // User Settings
  const updateUserProfile = (email, firstName, lastName, profilePicture, robloxUsername) => {
    const safeEmail = email ? email.toLowerCase().trim() : currentUser.email;
    const updatedUser = { ...currentUser, email: safeEmail, firstName, lastName, profilePicture, robloxUsername };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Admin Operations (User approvals & Role changes)
  const approveUser = (email) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, approved: true } : u));
    logAction('user_approved', `Approved user registration for ${email}`, { email });
  };

  const rejectUser = (email) => {
    setUsers(prev => prev.filter(u => u.email !== email));
    logAction('user_rejected', `Rejected user registration for ${email}`, { email });
  };

  const removeUser = (email) => {
    const safeEmail = escapeEmail(email);
    setUsers(prev => prev.filter(u => u.email !== email));
    setFlights(prev => prev.map(f => {
      const currentStatus = f.staffStatus || {};
      const newStatus = { ...currentStatus };
      delete newStatus[safeEmail];
      delete newStatus[email];
      return {
        ...f,
        allocatedStaff: (f.allocatedStaff || []).filter(staffEmail => staffEmail !== email),
        staffStatus: newStatus
      };
    }));
    logAction('user_removed', `Removed staff member ${email}`, { email });
  };

  const addPoints = (email, amount, reason) => {
    setUsers(prev => prev.map(u => {
      if (u.email === email) {
        return { ...u, points: (u.points || 0) + amount };
      }
      return u;
    }));
    logAction('points_added', `Added ${amount} points to ${email}`, { email, amount, reason });
  };

  const suspendUser = (email, hours, reason) => {
    if (!currentUser.isAdmin) return;
    if (email.toLowerCase() === 'evanm.100000@gmail.com') return; // Cannot suspend owner
    const targetUser = users.find(u => u.email === email);
    if (targetUser?.isAdmin && currentUser.email.toLowerCase() !== 'evanm.100000@gmail.com') return; // Only owner can suspend admins

    const suspendedUntil = new Date(Date.now() + hours * 3600000).toISOString();
    setUsers(prev => prev.map(u => u.email === email ? { ...u, suspendedUntil } : u));
    logAction('user_suspended', `Suspended ${email} for ${hours} hours. Reason: ${reason}`, { email, hours, reason, suspendedUntil });
    
    addInfraction({
      staffEmail: email,
      type: 'Suspension',
      mainMessage: `Suspended for ${hours} hours. Reason: ${reason}`,
      confidentialMessage: `Expires ${new Date(suspendedUntil).toLocaleString()}`
    });
  };

  const unsuspendUser = (email) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, suspendedUntil: null } : u));
    logAction('user_unsuspended', `Unsuspended ${email}`, { email });
  };

  const changeSiteRole = (email, newRole) => {
    // Determine current user's authority level
    const isSuperAdmin = currentUser?.email?.toLowerCase() === 'evanm.100000@gmail.com';
    const isOwner = isSuperAdmin || currentUser?.siteRole === 'Owner';
    const isAdmin = currentUser?.siteRole === 'Admin';

    if (!isOwner && !isAdmin) return; // Must be at least admin to change roles

    // Enforce ranking limitations
    if (isAdmin && !isOwner) {
      if (newRole !== 'Staff' && newRole !== 'Moderator') return; // Admins can only grant up to Moderator
    }
    if (isOwner && !isSuperAdmin) {
      if (newRole === 'Owner') return; // Only true superadmin can grant Owner
    }

    // Apply role change
    const targetIsAdmin = newRole === 'Admin' || newRole === 'Owner';
    
    setUsers(prev => prev.map(u => u.email === email ? { ...u, siteRole: newRole, isAdmin: targetIsAdmin } : u));
    
    if (currentUser?.email === email) {
      setCurrentUser(prev => ({ ...prev, siteRole: newRole, isAdmin: targetIsAdmin }));
    }
    
    logAction('role_changed', `Changed role of ${email} to ${newRole}`, { email, newRole });
  };

  const setCustomRole = (email, customRole) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, customRole } : u));
    if (currentUser?.email === email) {
      setCurrentUser(prev => ({ ...prev, customRole }));
    }
    logAction('custom_role_assigned', `Assigned custom role "${customRole}" to ${email}`, { email, customRole });
  };


  // System Status Operations
  const setWarning = (isActive, title, message, type = 'warning', countdownEnabled = false, countdownTarget = '') => {
    const newConfig = { isActive, title, message, type, countdownEnabled, countdownTarget };
    setWarningConfig(newConfig);
    // Sync to Firebase
    const db = getDatabase(firebaseApp);
    // Firebase sync handled by hook
    logAction('Warning Status', `Warning banner ${isActive ? 'enabled' : 'disabled'} with type ${type}`);
  };

  const setMaintenance = (isActive, message) => {
    const newConfig = { isActive, message };
    setMaintenanceConfig(newConfig);
    // Sync to Firebase
    const db = getDatabase(firebaseApp);
    // Firebase sync handled by hook
    logAction('maintenance_toggled', `Maintenance Mode set to ${isActive}`, { message });
  };

  const publishUpdate = () => {
    const db = getDatabase(firebaseApp);
    const newVersion = `1.0.${Date.now()}`;
    set(ref(db, 'siteVersion'), newVersion);
    logAction('site_updated', `Triggered global site update to ${newVersion}`);
  };

  // Flights Operations
  const addFlight = (flightData) => {
    const newFlight = {
      id: 'fl-' + Date.now(),
      flightCode: flightData.flightCode,
      date: flightData.date,
      time: flightData.time,
      location: flightData.location,
      serverLink: flightData.serverLink,
      allocatedStaff: []
    };
    setFlights(prev => [...prev, newFlight]);
    logAction('flight_added', `Scheduled flight ${flightData.flightCode}`, { flightCode: flightData.flightCode });
  };

  const removeFlight = (flightId) => {
    setFlights(prev => prev.filter(f => f.id !== flightId));
  };

  const toggleAllocation = (flightId, email) => {
    setFlights(prev => prev.map(f => {
      if (f.id !== flightId) return f;
      const currentStaff = f.allocatedStaff || [];
      const isAllocated = currentStaff.includes(email);
      const newStaff = isAllocated
        ? currentStaff.filter(e => e !== email)
        : [...currentStaff, email];
      return { ...f, allocatedStaff: newStaff };
    }));
  };

  const setAllocationStatus = (flightId, email, status) => {
    const safeEmail = escapeEmail(email);
    setFlights(prev => prev.map(f => {
      if (f.id !== flightId) return f;
      const currentStatus = f.staffStatus || {};
      
      const migratedStatus = {};
      Object.keys(currentStatus).forEach(k => {
        migratedStatus[escapeEmail(unescapeEmail(k))] = currentStatus[k];
      });
      
      // Auto-migrate legacy allocatedStaff to staffStatus format if empty
      if (f.allocatedStaff && f.allocatedStaff.length > 0 && Object.keys(migratedStatus).length === 0) {
        f.allocatedStaff.forEach(e => {
          migratedStatus[escapeEmail(e)] = 'Attending';
        });
      }
      
      const newStatus = { ...migratedStatus, [safeEmail]: status };
      return { ...f, staffStatus: newStatus };
    }));
  };

  const allocateStaffDirectly = (flightId, email) => {
    const safeEmail = escapeEmail(email);
    setFlights(prev => prev.map(f => {
      if (f.id !== flightId) return f;
      const currentStaff = f.allocatedStaff || [];
      const currentStatus = f.staffStatus || {};
      
      const migratedStatus = {};
      Object.keys(currentStatus).forEach(k => {
        migratedStatus[escapeEmail(unescapeEmail(k))] = currentStatus[k];
      });
      
      if (currentStaff.includes(email) || migratedStatus[safeEmail] === 'Attending') return f;
      return { 
        ...f, 
        allocatedStaff: [...currentStaff, email], 
        staffStatus: { ...migratedStatus, [safeEmail]: 'Attending' } 
      };
    }));
  };

  const deallocateStaffDirectly = (flightId, email) => {
    const safeEmail = escapeEmail(email);
    setFlights(prev => prev.map(f => {
      if (f.id !== flightId) return f;
      const currentStaff = f.allocatedStaff || [];
      const currentStatus = f.staffStatus || {};
      
      const migratedStatus = {};
      Object.keys(currentStatus).forEach(k => {
        migratedStatus[escapeEmail(unescapeEmail(k))] = currentStatus[k];
      });
      
      delete migratedStatus[safeEmail];
      return { 
        ...f, 
        allocatedStaff: currentStaff.filter(e => e !== email), 
        staffStatus: migratedStatus 
      };
    }));
  };

  // Flight Logs Operations
  const submitFlightLog = (logData) => {
    const newLog = {
      id: makeId('flight-log'),
      flightCode: logData.flightCode,
      pilot: logData.pilot,
      coPilot: logData.coPilot,
      passengers: parseInt(logData.passengers) || 0,
      status: 'Pending', // changed to Pending so admin can approve
      notes: logData.notes,
      photoProof: logData.photoProof,
      submitterEmail: currentUser.email,
      submitterName: `${currentUser.firstName} ${currentUser.lastName}`,
      timestamp: new Date().toISOString()
    };
    setFlightLogs(prev => [newLog, ...prev]);
    logAction('flight_log_submitted', `Submitted flight log for ${logData.flightCode}`, { flightCode: logData.flightCode });
  };

  const approveFlightLog = (logId) => {
    let logToApprove = null;
    setFlightLogs(prev => prev.map(log => {
      if (log.id === logId) {
        logToApprove = log;
        return { ...log, status: 'Approved' };
      }
      return log;
    }));
    
    if (logToApprove) {
      logAction('flight_log_approved', `Approved flight log for ${logToApprove.flightCode}`, { logId });
      
      // Give points to pilot and copilot
      const pilotUser = users.find(u => u.robloxUsername === logToApprove.pilot);
      const copilotUser = users.find(u => u.robloxUsername === logToApprove.coPilot);
      
      if (pilotUser) {
        setUsers(prev => prev.map(u => u.email === pilotUser.email ? { ...u, points: (u.points || 0) + 1 } : u));
      }
      if (copilotUser) {
        setUsers(prev => prev.map(u => u.email === copilotUser.email ? { ...u, points: (u.points || 0) + 1 } : u));
      }
    }
  };

  const rejectFlightLog = (logId) => {
    setFlightLogs(prev => prev.map(log => log.id === logId ? { ...log, status: 'Rejected' } : log));
    logAction('flight_log_rejected', `Rejected flight log ${logId}`);
  };

  // Leave of Absence (LOA) Operations
  const submitLoaRequest = (loaData) => {
    const newRequest = {
      id: 'loa-' + Date.now(),
      startDate: loaData.startDate,
      endDate: loaData.endDate,
      reason: loaData.reason,
      status: 'Pending',
      userEmail: currentUser.email,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      adminComment: '',
      timestamp: new Date().toISOString()
    };
    setLoaRequests(prev => [newRequest, ...prev]);
  };

  const updateLoaStatus = (loaId, status, comment) => {
    setLoaRequests(prev => prev.map(req => 
      req.id === loaId ? { ...req, status, adminComment: comment !== undefined ? comment : req.adminComment } : req
    ));
    logAction('loa_updated', `LOA ${status} for ${loaId}`, { loaId, status });
  };

  const requestEndLoaEarly = (loaId) => {
    setLoaRequests(prev => prev.map(req => req.id === loaId ? { ...req, status: 'End Requested' } : req));
    logAction('loa_end_requested', `User requested to end LOA early`, { loaId });
  };

  // Documents Operations
  const addDocument = (docData) => {
    const newDoc = {
      id: 'doc-' + Date.now(),
      title: docData.title,
      category: docData.category,
      content: docData.content,
      authorEmail: currentUser.email,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      date: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const deleteDocument = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  // Reports Operations
  const submitReport = (reportData) => {
    const newReport = {
      id: 'rep-' + Date.now(),
      reportedPlayer: reportData.reportedPlayer,
      type: reportData.type,
      description: reportData.description,
      evidenceLink: reportData.evidenceLink,
      status: 'Pending',
      reporterEmail: currentUser.email,
      reporterName: `${currentUser.firstName} ${currentUser.lastName}`,
      timestamp: new Date().toISOString(),
      comments: [
        {
          id: 'comm-' + Date.now(),
          authorName: `${currentUser.firstName} ${currentUser.lastName}`,
          authorEmail: currentUser.email,
          text: 'Logged a Report',
          timestamp: new Date().toISOString(),
          isAdmin: currentUser.isAdmin
        }
      ]
    };
    setReports(prev => [newReport, ...prev]);
  };

  const updateReportStatus = (reportId, status) => {
    setReports(prev => prev.map(rep => 
      rep.id === reportId ? { ...rep, status } : rep
    ));
  };

  const addReportComment = (reportId, commentText) => {
    const newComment = {
      id: 'comm-' + Date.now(),
      authorEmail: currentUser.email,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      text: commentText,
      timestamp: new Date().toISOString(),
      isAdmin: currentUser.isAdmin
    };
    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      return { ...rep, comments: [...rep.comments, newComment] };
    }));
  };

  // Infractions Operations
  const addInfraction = (infData) => {
    const staffEmail = infData.staffEmail?.trim();
    const mainMessage = infData.mainMessage?.trim();
    if (!staffEmail || !mainMessage) return false;

    const staffUser = users.find(u => u.email === staffEmail);
    
    // Permission Checks
    const isTargetAdminOrOwner = staffUser?.siteRole === 'Admin' || staffUser?.siteRole === 'Owner';
    const isIssuerOwner = currentUser?.siteRole === 'Owner' || currentUser?.email?.toLowerCase() === 'evanm.100000@gmail.com';
    
    if (isTargetAdminOrOwner && !isIssuerOwner) {
      return false; // Admins/Moderators cannot infract Admins/Owners
    }
    const newInfraction = {
      id: makeId('inf'),
      staffEmail,
      staffName: staffUser ? `${staffUser.firstName} ${staffUser.lastName}` : staffEmail,
      type: infData.type,
      mainMessage,
      confidentialMessage: infData.confidentialMessage?.trim() || '',
      adminEmail: currentUser?.email || 'System',
      adminName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'System',
      date: new Date().toISOString().split('T')[0]
    };
    setInfractions(prev => [newInfraction, ...prev]);
    logAction('infraction_added', `Issued infraction to ${staffEmail}`, { staffEmail, type: infData.type });
    return true;
  };

  const deleteInfraction = (infId) => {
    const isIssuerOwner = currentUser?.siteRole === 'Owner' || currentUser?.email?.toLowerCase() === 'evanm.100000@gmail.com';
    if (!isIssuerOwner) return; // Only Owners can remove warnings

    setInfractions(prev => prev.filter(i => i.id !== infId));
    logAction('infraction_deleted', `Removed infraction ${infId}`, { infId });
  };

  const appealInfraction = (infId, appealText) => {
    setInfractions(prev => prev.map(inf => {
      if (inf.id !== infId) return inf;
      return {
        ...inf,
        appeal: {
          text: appealText,
          date: new Date().toISOString()
        }
      };
    }));
    logAction('infraction_appealed', `Appealed infraction ${infId}`, { infId });
  };

  // Chat Operations
const addChatMessage = async (channel, text, replyTo = null, attachmentUrl = null) => {
    const newMessage = {
      id: 'msg-' + Date.now() + Math.random().toString(36).substring(2, 6),
      channel,
      text,
      attachmentUrl,
      senderEmail: currentUser.email,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`,
      senderRole: currentUser.customRole || (currentUser.isAdmin ? 'Admin' : 'Staff'),
      senderPfp: currentUser.profilePicture || '',
      timestamp: new Date().toISOString(),
      replyTo,
      reactions: []
    };

    try {
      // 1. Save directly to Firebase
      const messagesRef = ref(db, 'chatMessages');
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, newMessage);

      // LINE 1231 DELETED REMOVED FROM HERE 
      // Your useEffect below will automatically handle showing it smoothly!
    } catch (error) {
      console.error("Error saving message to Firebase:", error);
    }
  };

  const deleteChatMessage = async (msgId) => {
    // 1. Update UI instantly
    setChatMessages(prev => prev.filter(m => m.id !== msgId));

    try {
      // 2. Delete from database
      const chatRef = ref(db, 'chatMessages');
      const snapshot = await get(chatRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const firebaseKey = Object.keys(data).find(key => data[key].id === msgId);
        if (firebaseKey) {
          await remove(ref(db, `chatMessages/${firebaseKey}`));
        }
      }
    } catch (error) {
      console.error("Error deleting message from Firebase:", error);
    }
  };

  const addMessageReaction = async (msgId, emoji) => {
    // 1. Update UI instantly for lag-free performance
    setChatMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const currentReactions = m.reactions || [];
      const userEmail = currentUser.email;
      
      const existingReactionIndex = currentReactions.findIndex(r => r.emoji === emoji);
      let newReactions = [...currentReactions];
      
      if (existingReactionIndex >= 0) {
        const reaction = newReactions[existingReactionIndex];
        if (reaction.users.includes(userEmail)) {
          const updatedUsers = reaction.users.filter(u => u !== userEmail);
          if (updatedUsers.length === 0) {
            newReactions.splice(existingReactionIndex, 1);
          } else {
            newReactions[existingReactionIndex] = { ...reaction, users: updatedUsers, count: updatedUsers.length };
          }
        } else {
          const updatedUsers = [...reaction.users, userEmail];
          newReactions[existingReactionIndex] = { ...reaction, users: updatedUsers, count: updatedUsers.length };
        }
      } else {
        newReactions.push({ emoji, count: 1, users: [userEmail] });
      }
      return { ...m, reactions: newReactions };
    }));

    try {
      // 2. Sync changes securely to Firebase using a transaction
      const chatRef = ref(db, 'chatMessages');
      const snapshot = await get(chatRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const firebaseKey = Object.keys(data).find(key => data[key].id === msgId);
        
        if (firebaseKey) {
          const reactionRef = ref(db, `chatMessages/${firebaseKey}/reactions`);
          await runTransaction(reactionRef, (currentReactions) => {
            const reactions = currentReactions || [];
            const userEmail = currentUser.email;
            const existingIndex = reactions.findIndex(r => r.emoji === emoji);
            let updatedReactions = [...reactions];

            if (existingIndex >= 0) {
              const reaction = updatedReactions[existingIndex];
              if (reaction.users && reaction.users.includes(userEmail)) {
                const updatedUsers = reaction.users.filter(u => u !== userEmail);
                if (updatedUsers.length === 0) {
                  updatedReactions.splice(existingIndex, 1);
                } else {
                  updatedReactions[existingIndex] = { ...reaction, users: updatedUsers, count: updatedUsers.length };
                }
              } else {
                const updatedUsers = [...(reaction.users || []), userEmail];
                updatedReactions[existingIndex] = { ...reaction, users: updatedUsers, count: updatedUsers.length };
              }
            } else {
              updatedReactions.push({ emoji, count: 1, users: [userEmail] });
            }
            return updatedReactions;
          });
        }
      }
    } catch (error) {
      console.error("Error updating reaction in Firebase:", error);
    }
  };

useEffect(() => {
    if (!db) return;

    const chatRef = ref(db, 'chatMessages');
    
    // Establishing a strict, single real-time listener instance
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data).map(key => ({
          ...data[key]
        }));
        
        loadedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Only update local React state if the database data has actually changed!
        setChatMessages(prev => {
          if (JSON.stringify(prev) === JSON.stringify(loadedMessages)) {
            return prev; 
          }
          return loadedMessages;
        });
      } else {
        setChatMessages(prev => prev.length === 0 ? prev : []);
      }
}, (error) => {
      console.error("Firebase listener error:", error);
    });

    // CLEANUP: Unsubscribes instantly if the page transitions, preventing ghost listeners
    return () => {
      unsubscribe();
    };
  }, []); 

  // Announcements Operations
  const addAnnouncement = (annData) => {
    const newAnn = {
      id: makeId('ann'),
      type: annData.type,
      title: annData.title || '',
      subtitle: annData.subtitle || '',
      message: annData.message,
      targetAudience: annData.targetAudience || 'All',
      countdownDate: annData.countdownDate || null,
      authorEmail: currentUser.email,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      timestamp: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (annId) => {
    setAnnouncements(prev => prev.filter(a => a.id !== annId));
  };

  // --- Tasks Operations ---
  const addTask = (taskData) => {
    const newTask = {
      id: makeId('task'),
      assignedByEmail: currentUser.email,
      assignedByName: `${currentUser.firstName} ${currentUser.lastName}`,
      assignedToEmail: taskData.assignedToEmail,
      title: taskData.title,
      description: taskData.description || '',
      status: 'Pending',
      timestamp: new Date().toISOString(),
      completedAt: null
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status, completedAt: status === 'Completed' ? new Date().toISOString() : null } 
        : t
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // --- Support Tickets Operations ---
  const createTicket = (ticketData) => {
    const newTicket = {
      id: makeId('ticket'),
      authorEmail: currentUser ? currentUser.email : null,
      authorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : (ticketData.authorName || 'Anonymous'),
      authorType: ticketData.authorType || 'Staff',
      title: ticketData.title,
      description: ticketData.description,
      status: 'Open',
      timestamp: new Date().toISOString(),
      comments: []
    };
    setTickets(prev => [newTicket, ...prev]);
    return newTicket.id;
  };

  const updateTicketStatus = (ticketId, status) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status } : t
    ));
  };

  const addTicketComment = (ticketId, text) => {
    const newComment = {
      id: makeId('tcomm'),
      authorEmail: currentUser.email,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      text,
      timestamp: new Date().toISOString(),
      isAdmin: currentUser.isAdmin
    };
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, comments: [...(t.comments || []), newComment] } : t
    ));
  };

  // --- Events Operations ---
  const addEvent = (eventData) => {
    const newEvent = {
      id: makeId('event'),
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      timestamp: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
    logAction('event_added', `Added event: ${eventData.title}`);
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    logAction('event_deleted', `Deleted event`);
  };

  // --- Staff Notes Operations ---
  const addStaffNote = (staffEmail, type, text) => {
    const newNote = {
      id: makeId('note'),
      staffEmail,
      adminEmail: currentUser.email,
      adminName: `${currentUser.firstName} ${currentUser.lastName}`,
      type,
      text,
      timestamp: new Date().toISOString()
    };
    setStaffNotes(prev => [newNote, ...prev]);
  };

  const deleteStaffNote = (noteId) => {
    setStaffNotes(prev => prev.filter(n => n.id !== noteId));
  };

  // --- Staff of the Week (SOTW) ---
  const awardSOTW = (staffEmail) => {
    if (staffEmail === currentUser.email) return; // Cannot award self
    setUsers(prev => prev.map(u => 
      u.email === staffEmail 
        ? { ...u, sotwWins: (u.sotwWins || 0) + 1 } 
        : u
    ));
    if (currentUser.email === staffEmail) {
      setCurrentUser(prev => ({ ...prev, sotwWins: (prev.sotwWins || 0) + 1 }));
    }
  };

  // --- Staff Applications Operations ---
  const submitApplication = (appData) => {
    const newApp = {
      id: makeId('app'),
      applicantName: appData.applicantName,
      robloxUsername: appData.robloxUsername,
      answers: appData.answers,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    return newApp.id;
  };

  const updateApplicationConfig = (newConfig) => {
    setApplicationConfig(newConfig);
    logAction('app_config_updated', 'Updated staff application config');
  };

  const updateApplicationStatus = (appId, status, feedback = '') => {
    setApplications(prev => prev.map(a => 
      a.id === appId ? { ...a, status, feedback, reviewedBy: currentUser.email, reviewedAt: new Date().toISOString() } : a
    ));
    logAction('application_reviewed', `Reviewed application ${appId} - ${status}`);
  };

  return (
    <AppContext.Provider
      value={{
        users,
        activeUsers: users.filter(isActiveStaff),
        currentUser,
        flights,
        flightLogs,
        loaRequests,
        documents,
        reports,
        infractions,
        tasks,
        tickets,
        staffNotes,
        onlineUsers,
        siteVersion,
        theme,
        warningConfig,
        maintenanceConfig,
        auditLogs,
        passwordResets,
        requestPasswordReset,
        approvePasswordReset,
        rejectPasswordReset,
        login,
        signup,
        logout,
        updateUserProfile,
        toggleTheme,
        approveUser,
        rejectUser,
        removeUser,
        addPoints,
        changeSiteRole,
        setCustomRole,
        suspendUser,
        unsuspendUser,
        setWarning,
        setMaintenance,
        publishUpdate,
        addFlight,
        removeFlight,
        toggleAllocation,
        setAllocationStatus,
        allocateStaffDirectly,
        deallocateStaffDirectly,
        submitFlightLog,
        approveFlightLog,
        rejectFlightLog,
        submitLoaRequest,
        updateLoaStatus,
        requestEndLoaEarly,
        notifications,
        addNotification,
        removeNotification,
        addDocument,
        deleteDocument,
        submitReport,
        updateReportStatus,
        addReportComment,
        addInfraction,
        deleteInfraction,
        appealInfraction,
        addTask,
        updateTaskStatus,
        deleteTask,
        createTicket,
        updateTicketStatus,
        addTicketComment,
        addStaffNote,
        deleteStaffNote,
        awardSOTW,
        chatMessages: visibleChatMessages,
        addChatMessage,
        deleteChatMessage,
        addMessageReaction,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        bypassConfig,
        setBypassAnnouncement: (title, message) => {
          const newConfig = {
            isActive: true,
            id: makeId('bypass'),
            title,
            message,
            timestamp: Date.now(),
            senderName: `${currentUser.firstName} ${currentUser.lastName}`
          };
          setBypassConfig(newConfig);
          logAction('bypass_announcement', `Sent bypass announcement: ${title}`);
        },
        clearBypassAnnouncement: () => {
          setBypassConfig(prev => ({ ...prev, isActive: false }));
          logAction('bypass_announcement_cleared', `Cleared bypass announcement`);
        },
        privateChats,
        createPrivateChat: (participantEmails, groupName = '') => {
          const newChat = {
            id: makeId('pchat'),
            participants: participantEmails,
            name: groupName,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            isSuspended: false
          };
          setPrivateChats(prev => [...prev, newChat]);
          logAction('create_private_chat', `Created a private chat`, { participants: participantEmails, name: groupName });
          return newChat.id;
        },
        deletePrivateChat: (chatId) => {
          setPrivateChats(prev => prev.filter(c => c.id !== chatId));
          logAction('delete_private_chat', `Deleted private chat`, { chatId });
        },
        toggleSuspendPrivateChat: (chatId) => {
          setPrivateChats(prev => prev.map(c => c.id === chatId ? { ...c, isSuspended: !c.isSuspended } : c));
          logAction('toggle_suspend_private_chat', `Toggled suspension for private chat`, { chatId });
        },
        applications,
        applicationConfig,
        events,
        addEvent,
        deleteEvent,
        submitApplication,
        updateApplicationConfig,
        updateApplicationStatus,
        superAdminEmail: SUPER_ADMIN_EMAIL,
        pageConfig,
        updatePageConfig: (key, value) => {
          setPageConfig(prev => ({ ...prev, [key]: value }));
          logAction('page_config_updated', `Updated page config: ${key} to ${value}`);
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
