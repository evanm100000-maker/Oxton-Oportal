import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { firebaseApp, getDatabase, ref, onValue, set } from '../firebase';

const AppContext = createContext();

const SUPER_ADMIN_EMAIL = 'Evanm.100000@gmail.com';
const INITIAL_SUPER_ADMIN = {
  email: SUPER_ADMIN_EMAIL,
  password: 'Michelle11.',
  firstName: 'Evan',
  lastName: 'Oxton',
  robloxUsername: 'Happyevbev',
  isAdmin: true,
  approved: true,
  createdAt: '2026-06-10T12:00:00Z',
  profilePicture: '',
  points: 0,
  customRole: 'Owner',
  suspendedUntil: null,
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
  }
];

const initialWarningConfig = {
  isActive: false,
  title: 'Goalbound Outfits Issue',
  message: 'Goalbound Outfits are temporarily disabled due to a partying issue, you may need to unequip.',
  type: 'warning'
};

const initialMaintenanceConfig = {
  isActive: false,
  message: 'The system is currently undergoing scheduled maintenance. Please check back later.'
};

const initialFlights = [
  {
    id: 'fl-101',
    flightCode: 'OX-902',
    date: '2026-06-18',
    time: '18:00',
    location: 'Oxton International Airport',
    serverLink: 'https://www.roblox.com/games/123456/Oxton-Airport-V2',
    allocatedStaff: ['staff@oxton.com']
  },
  {
    id: 'fl-102',
    flightCode: 'OX-104',
    date: '2026-06-20',
    time: '15:00',
    location: 'Oxton Regional HQ',
    serverLink: 'https://www.roblox.com/games/123456/Oxton-Airport-V2',
    allocatedStaff: []
  }
];

const initialFlightLogs = [
  {
    id: 'log-1',
    flightCode: 'OX-902',
    pilot: 'DavidOxton',
    coPilot: 'SarahOxton',
    passengers: 12,
    status: 'Completed',
    notes: 'Smooth flight, no disturbances. Arrived 5 minutes ahead of schedule.',
    submitterEmail: 'staff@oxton.com',
    submitterName: 'David Miller',
    timestamp: '2026-06-14T19:30:00Z'
  }
];

const initialLoaRequests = [
  {
    id: 'loa-1',
    startDate: '2026-06-22',
    endDate: '2026-06-29',
    reason: 'Family vacation out of town. Will not have stable internet connection.',
    status: 'Approved',
    userEmail: 'staff@oxton.com',
    userName: 'David Miller',
    adminComment: 'Approved. Enjoy your vacation!',
    timestamp: '2026-06-13T10:00:00Z'
  }
];

const initialDocuments = [
  {
    id: 'doc-1',
    title: 'Standard Operating Procedures V1.4',
    category: 'Protocol',
    content: `## Oxton Aviation Staff Operating Procedures

Welcome to the official Oxton Roblox staff training manual. Below are the basic regulations all staff must follow:

### 1. Attendance & Punctuality
* Staff must arrive at the designated airport server at least 15 minutes before the scheduled flight time.
* If you cannot make your shift, you must log a Leave of Absence (LOA) request or find a cover in the Allocation Requests panel at least 12 hours in advance.

### 2. Player Moderation
* Be polite to all passengers, including difficult players.
* For toxic behavior, issue one warning. If behavior persists, submit a report in the Staff Portal under the Reports tab.
* In case of severe exploiters, take a video clip, log the player report, and notify a server admin immediately.
`,
    authorEmail: 'Evanm.100000@gmail.com',
    authorName: 'Evan Oxton',
    date: '2026-06-10'
  }
];

const initialReports = [
  {
    id: 'rep-1',
    reportedPlayer: 'RobloxGamer999',
    type: 'Exploiting',
    description: 'Player was flying around the gate lobby and bypassing terminal doors.',
    evidenceLink: 'https://imgur.com/example-evidence',
    status: 'Under Review',
    reporterEmail: 'staff@oxton.com',
    reporterName: 'David Miller',
    timestamp: '2026-06-15T15:20:00Z',
    comments: [
      {
        id: 'comm-1',
        authorName: 'Sarah Conner',
        authorEmail: 'admin@oxton.com',
        text: 'Checking the server logs for this timestamp. Did you manage to grab a video file?',
        timestamp: '2026-06-15T16:00:00Z',
        isAdmin: true
      },
      {
        id: 'comm-2',
        authorName: 'David Miller',
        authorEmail: 'staff@oxton.com',
        text: 'Yes, the Imgur link has a short video clip showing the flight exploit.',
        timestamp: '2026-06-15T16:15:00Z',
        isAdmin: false
      }
    ]
  }
];

const initialInfractions = [];
const initialTasks = [];
const initialTickets = [];
const initialStaffNotes = [];
const initialAnnouncements = [
  {
    id: 'ann-1',
    type: 'Normal',
    message: 'Welcome to the new Oxton Staff Portal. Please check the documents for updated operating procedures.',
    authorName: 'System',
    authorEmail: 'System',
    timestamp: '2026-06-10T12:00:00Z'
  }
];

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
};

const isActiveStaff = (user) => (
  user?.approved && (!user.suspendedUntil || new Date(user.suspendedUntil).getTime() <= Date.now())
);

const escapeEmail = (email) => email ? email.replace(/\./g, ',') : '';
const unescapeEmail = (email) => email ? email.replace(/,/g, '.') : '';

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

export const AppProvider = ({ children }) => {
  // Helper to load localStorage with seed fallback
  const getStoredData = (key, initialVal) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : initialVal;
    } catch (e) {
      console.error('Error reading localStorage', e);
      return initialVal;
    }
  };

  const getSessionData = (key, initialVal) => {
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : initialVal;
    } catch (e) {
      console.error('Error reading sessionStorage', e);
      return initialVal;
    }
  };

  const [users, setUsers] = useState(() => getStoredData(STORAGE_KEYS.users, initialUsers));
  const [flights, setFlights] = useState(() => getStoredData(STORAGE_KEYS.flights, initialFlights));
  const [flightLogs, setFlightLogs] = useState(() => getStoredData(STORAGE_KEYS.flightLogs, initialFlightLogs));
  const [loaRequests, setLoaRequests] = useState(() => getStoredData(STORAGE_KEYS.loaRequests, initialLoaRequests));
  const [documents, setDocuments] = useState(() => getStoredData(STORAGE_KEYS.documents, initialDocuments));
  const [reports, setReports] = useState(() => getStoredData(STORAGE_KEYS.reports, initialReports));
  const [infractions, setInfractions] = useState(() => getStoredData(STORAGE_KEYS.infractions, initialInfractions));
  const [tasks, setTasks] = useState(() => getStoredData(STORAGE_KEYS.tasks, initialTasks));
  const [tickets, setTickets] = useState(() => getStoredData(STORAGE_KEYS.tickets, initialTickets));
  const [staffNotes, setStaffNotes] = useState(() => getStoredData(STORAGE_KEYS.staffNotes, initialStaffNotes));
  const [currentUser, setCurrentUser] = useState(() => getSessionData(STORAGE_KEYS.currentUser, null));

  // New States
  const [theme, setTheme] = useState(() => getStoredData(STORAGE_KEYS.theme, 'dark'));
  const [warningConfig, setWarningConfig] = useState(() => getStoredData(STORAGE_KEYS.warningConfig, initialWarningConfig));
  const [maintenanceConfig, setMaintenanceConfig] = useState(() => getStoredData(STORAGE_KEYS.maintenanceConfig, initialMaintenanceConfig));
  const [auditLogs, setAuditLogs] = useState(() => getStoredData(STORAGE_KEYS.auditLogs, []));
  const [passwordResets, setPasswordResets] = useState(() => getStoredData(STORAGE_KEYS.passwordResets, []));
  const [chatMessages, setChatMessages] = useState(() => getStoredData(STORAGE_KEYS.chatMessages, []));
  const [announcements, setAnnouncements] = useState(() => getStoredData(STORAGE_KEYS.announcements, initialAnnouncements));
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [siteVersion, setSiteVersion] = useState(null);

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


  // Sync state to LocalStorage
  const persistData = (key, value) => {
    try {
      const stringifiedValue = JSON.stringify(value);
      if (localStorage.getItem(key) === stringifiedValue) return;
      localStorage.setItem(key, stringifiedValue);
      const channel = new BroadcastChannel('oxton_staff_portal');
      channel.postMessage({ key, value });
      channel.close();
    } catch (err) {
      console.error(`Unable to save ${key}`, err);
    }
  };

  useEffect(() => { persistData(STORAGE_KEYS.users, users); }, [users]);
  useEffect(() => { persistData(STORAGE_KEYS.flights, flights); }, [flights]);
  useEffect(() => { persistData(STORAGE_KEYS.flightLogs, flightLogs); }, [flightLogs]);
  useEffect(() => { persistData(STORAGE_KEYS.loaRequests, loaRequests); }, [loaRequests]);
  useEffect(() => { persistData(STORAGE_KEYS.documents, documents); }, [documents]);
  useEffect(() => { persistData(STORAGE_KEYS.reports, reports); }, [reports]);
  useEffect(() => { persistData(STORAGE_KEYS.infractions, infractions); }, [infractions]);
  useEffect(() => { persistData(STORAGE_KEYS.tasks, tasks); }, [tasks]);
  useEffect(() => { persistData(STORAGE_KEYS.tickets, tickets); }, [tickets]);
  useEffect(() => { persistData(STORAGE_KEYS.staffNotes, staffNotes); }, [staffNotes]);
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.currentUser);
    }
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }, [currentUser]);
  useEffect(() => { persistData(STORAGE_KEYS.theme, theme); }, [theme]);
  useEffect(() => { persistData(STORAGE_KEYS.warningConfig, warningConfig); }, [warningConfig]);
  useEffect(() => { persistData(STORAGE_KEYS.maintenanceConfig, maintenanceConfig); }, [maintenanceConfig]);
  useEffect(() => { persistData(STORAGE_KEYS.auditLogs, auditLogs); }, [auditLogs]);
  useEffect(() => { persistData(STORAGE_KEYS.passwordResets, passwordResets); }, [passwordResets]);
  useEffect(() => { persistData(STORAGE_KEYS.chatMessages, chatMessages); }, [chatMessages]);
  useEffect(() => { persistData(STORAGE_KEYS.announcements, announcements); }, [announcements]);

  useEffect(() => {
      if (!currentUser) return;
      const latestUser = users.find(u => u.email === currentUser.email);
      if (!latestUser || !latestUser.approved) {
        setCurrentUser(null);
        return;
      }
      if (JSON.stringify(latestUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(latestUser);
      }
    }, [users, currentUser]);

    useEffect(() => {
      const db = getDatabase(firebaseApp);
      const warningRef = ref(db, 'warningConfig');
      const maintenanceRef = ref(db, 'maintenanceConfig');
      const unsubscribeWarning = onValue(warningRef, (snapshot) => {
        const data = snapshot.val();
        skipSyncRef.current['warningConfig'] = true;
        if (data) {
          setWarningConfig(data);
        } else {
          setWarningConfig(initialWarningConfig);
        }
        hasLoadedRef.current['warningConfig'] = true;
      });
      const unsubscribeMaintenance = onValue(maintenanceRef, (snapshot) => {
        const data = snapshot.val();
        skipSyncRef.current['maintenanceConfig'] = true;
        if (data) {
          setMaintenanceConfig(data);
        } else {
          setMaintenanceConfig(initialMaintenanceConfig);
        }
        hasLoadedRef.current['maintenanceConfig'] = true;
      });
      const siteVersionRef = ref(db, 'siteVersion');
      const unsubscribeSiteVersion = onValue(siteVersionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSiteVersion(data);
        } else {
          // Bootstrap brand new empty database
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
        if (typeof unsubscribeWarning === 'function') unsubscribeWarning();
        if (typeof unsubscribeMaintenance === 'function') unsubscribeMaintenance();
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
          import('firebase/database').then(({ onDisconnect, set }) => {
             onDisconnectRef = onDisconnect(myPresenceRef);
             onDisconnectRef.set(false).then(() => {
               set(myPresenceRef, true);
             });
          });
        }
      });
      return () => {
        if (typeof unsubConnected === 'function') unsubConnected();
        if (onDisconnectRef) onDisconnectRef.cancel();
        set(myPresenceRef, false);
      };
    }, [currentUser]);

    const skipSyncRef = useRef({
      users: false, flights: false, flightLogs: false, loaRequests: false, 
      documents: false, reports: false, infractions: false, tasks: false, tickets: false, staffNotes: false, auditLogs: false, 
      passwordResets: false, chatMessages: false, theme: false, announcements: false,
      warningConfig: false, maintenanceConfig: false
    });
    
    const hasLoadedRef = useRef({
      users: false, flights: false, flightLogs: false, loaRequests: false, 
      documents: false, reports: false, infractions: false, tasks: false, tickets: false, staffNotes: false, auditLogs: false, 
      passwordResets: false, chatMessages: false, theme: false, announcements: false,
      warningConfig: false, maintenanceConfig: false
    });

    // Add Firebase listeners for other data collections
    useEffect(() => {
      const db = getDatabase(firebaseApp);
      
      const setupListener = (path, setFn, fallbackValue = []) => {
        return onValue(ref(db, path), snapshot => {
          const data = snapshot.val();
          skipSyncRef.current[path] = true;
          if (data) {
            let normalizedData = data;
            if (Array.isArray(fallbackValue)) {
              // Firebase converts arrays with holes into objects, so we normalize back to an array
              if (typeof data === 'object' && !Array.isArray(data)) {
                normalizedData = Object.values(data);
              }
              // Filter out any null/undefined elements
              if (Array.isArray(normalizedData)) {
                normalizedData = normalizedData.filter(item => item !== null && item !== undefined);
              }
            }
            setFn(normalizedData);
          } else {
            setFn(fallbackValue);
          }
          hasLoadedRef.current[path] = true;
        });
      };

      const unsubUsers = setupListener('users', setUsers);
      const unsubFlights = setupListener('flights', setFlights);
      const unsubFlightLogs = setupListener('flightLogs', setFlightLogs);
      const unsubLoas = setupListener('loaRequests', setLoaRequests);
      const unsubDocs = setupListener('documents', setDocuments);
      const unsubReports = setupListener('reports', setReports);
      const unsubInfractions = setupListener('infractions', setInfractions);
      const unsubTasks = setupListener('tasks', setTasks);
      const unsubTickets = setupListener('tickets', setTickets);
      const unsubStaffNotes = setupListener('staffNotes', setStaffNotes);
      const unsubAudit = setupListener('auditLogs', setAuditLogs);
      const unsubPwdResets = setupListener('passwordResets', setPasswordResets);
      const unsubChat = setupListener('chatMessages', setChatMessages);
      const unsubAnnouncements = setupListener('announcements', setAnnouncements, []);
      const unsubTheme = setupListener('theme', setTheme, 'dark');

      return () => {
        if (typeof unsubLoas === 'function') unsubLoas();
        if (typeof unsubDocs === 'function') unsubDocs();
        if (typeof unsubUsers === 'function') unsubUsers();
        if (typeof unsubFlights === 'function') unsubFlights();
        if (typeof unsubFlightLogs === 'function') unsubFlightLogs();
        if (typeof unsubReports === 'function') unsubReports();
        if (typeof unsubInfractions === 'function') unsubInfractions();
        if (typeof unsubTasks === 'function') unsubTasks();
        if (typeof unsubTickets === 'function') unsubTickets();
        if (typeof unsubStaffNotes === 'function') unsubStaffNotes();
        if (typeof unsubAudit === 'function') unsubAudit();
        if (typeof unsubPwdResets === 'function') unsubPwdResets();
        if (typeof unsubChat === 'function') unsubChat();
        if (typeof unsubAnnouncements === 'function') unsubAnnouncements();
        if (typeof unsubTheme === 'function') unsubTheme();
      };
    }, []);

    // Sync state changes back to Firebase
    const syncToFirebase = (path, stateValue) => {
      if (!hasLoadedRef.current[path]) {
        // Prevent syncing before the initial load completes
        return;
      }
      if (skipSyncRef.current[path]) {
        skipSyncRef.current[path] = false;
        return;
      }
      const db = getDatabase(firebaseApp);
      set(ref(db, path), stateValue);
    };

    useEffect(() => { syncToFirebase('users', users); }, [users]);
    useEffect(() => { syncToFirebase('flights', flights); }, [flights]);
    useEffect(() => { syncToFirebase('flightLogs', flightLogs); }, [flightLogs]);
    useEffect(() => { syncToFirebase('loaRequests', loaRequests); }, [loaRequests]);
    useEffect(() => { syncToFirebase('documents', documents); }, [documents]);
    useEffect(() => { syncToFirebase('reports', reports); }, [reports]);
    useEffect(() => { syncToFirebase('infractions', infractions); }, [infractions]);
    useEffect(() => { syncToFirebase('tasks', tasks); }, [tasks]);
    useEffect(() => { syncToFirebase('tickets', tickets); }, [tickets]);
    useEffect(() => { syncToFirebase('staffNotes', staffNotes); }, [staffNotes]);
    useEffect(() => { syncToFirebase('auditLogs', auditLogs); }, [auditLogs]);
    useEffect(() => { syncToFirebase('passwordResets', passwordResets); }, [passwordResets]);
    useEffect(() => { syncToFirebase('chatMessages', chatMessages); }, [chatMessages]);
    useEffect(() => { syncToFirebase('announcements', announcements); }, [announcements]);
    useEffect(() => { syncToFirebase('theme', theme); }, [theme]);

  // Sync state across tabs automatically
  useEffect(() => {
    const applySyncedValue = (key, value) => {
      if (key === STORAGE_KEYS.warningConfig) setWarningConfig(value);
      if (key === STORAGE_KEYS.maintenanceConfig) setMaintenanceConfig(value);
      if (key === STORAGE_KEYS.users) setUsers(value);
      if (key === STORAGE_KEYS.chatMessages) setChatMessages(value);
      if (key === STORAGE_KEYS.flights) setFlights(value);
      if (key === STORAGE_KEYS.flightLogs) setFlightLogs(value);
      if (key === STORAGE_KEYS.infractions) setInfractions(value);
      if (key === STORAGE_KEYS.tasks) setTasks(value);
      if (key === STORAGE_KEYS.tickets) setTickets(value);
      if (key === STORAGE_KEYS.staffNotes) setStaffNotes(value);
      if (key === STORAGE_KEYS.reports) setReports(value);
      if (key === STORAGE_KEYS.loaRequests) setLoaRequests(value);
      if (key === STORAGE_KEYS.documents) setDocuments(value);
      if (key === STORAGE_KEYS.auditLogs) setAuditLogs(value);
      if (key === STORAGE_KEYS.passwordResets) setPasswordResets(value);
      if (key === STORAGE_KEYS.announcements) setAnnouncements(value);
      if (key === STORAGE_KEYS.theme) setTheme(value);
    };

    const handleStorage = (e) => {
      try {
        if (e.key && e.newValue !== null) applySyncedValue(e.key, JSON.parse(e.newValue));
      } catch (err) {
        console.error('Error syncing state', err);
      }
    };

    let channel;
    try {
      channel = new BroadcastChannel('oxton_staff_portal');
      channel.onmessage = (e) => applySyncedValue(e.data.key, e.data.value);
    } catch (err) {
      channel = null;
    }

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      channel?.close();
    };
  }, []);

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
    if (prevDataRef.current.chatMessages && chatMessages.length > prevDataRef.current.chatMessages.length) {
      const newMsg = chatMessages.find(m => !prevDataRef.current.chatMessages.some(pm => pm.id === m.id));
      if (newMsg && newMsg.senderEmail !== currentUser.email) {
        addNotification(`New message from ${newMsg.senderName}`, newMsg.text.length > 40 ? newMsg.text.substring(0, 40) + '...' : newMsg.text, 'info');
      }
    }
    prevDataRef.current.chatMessages = chatMessages;
  }, [chatMessages, currentUser]);

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
        const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
        
        if (!user) {
          reject(new Error('No account found with this email.'));
          return;
        }
        if (user.password !== password) {
          reject(new Error('Incorrect password.'));
          return;
        }
        if (!user.approved) {
          reject(new Error('Your account is pending admin approval. Please wait for an administrator to activate your account.'));
          return;
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
        
        const newUser = {
          email: normalizedEmail,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          robloxUsername: userData.robloxUsername,
          isAdmin: false,
          approved: false, 
          createdAt: new Date().toISOString(),
          profilePicture: '',
          points: 0,
          customRole: '',
          suspendedUntil: null,
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

  const promoteToAdmin = (email) => {
    if (currentUser?.email !== SUPER_ADMIN_EMAIL) return;
    setUsers(prev => prev.map(u => u.email === email ? { ...u, isAdmin: true } : u));
    if (currentUser?.email === email) {
      setCurrentUser(prev => ({ ...prev, isAdmin: true }));
    }
    logAction('role_changed', `Promoted ${email} to Admin`, { email, newRole: 'Admin' });
  };

  const demoteFromAdmin = (email) => {
    if (currentUser?.email !== SUPER_ADMIN_EMAIL || email === SUPER_ADMIN_EMAIL) return;
    setUsers(prev => prev.map(u => u.email === email ? { ...u, isAdmin: false } : u));
    if (currentUser?.email === email) {
      setCurrentUser(prev => ({ ...prev, isAdmin: false }));
    }
    logAction('role_changed', `Demoted ${email} from Admin`, { email, newRole: 'Staff' });
  };

  const setCustomRole = (email, customRole) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, customRole } : u));
    if (currentUser?.email === email) {
      setCurrentUser(prev => ({ ...prev, customRole }));
    }
    logAction('custom_role_assigned', `Assigned custom role "${customRole}" to ${email}`, { email, customRole });
  };


  // System Status Operations
  const setWarning = (isActive, title, message, type = 'warning') => {
    const newConfig = { isActive, title, message, type };
    setWarningConfig(newConfig);
    // Sync to Firebase
    const db = getDatabase(firebaseApp);
    set(ref(db, 'warningConfig'), newConfig);
    logAction('Warning Status', `Warning banner ${isActive ? 'enabled' : 'disabled'} with type ${type}`);
  };

  const setMaintenance = (isActive, message) => {
    const newConfig = { isActive, message };
    setMaintenanceConfig(newConfig);
    // Sync to Firebase
    const db = getDatabase(firebaseApp);
    set(ref(db, 'maintenanceConfig'), newConfig);
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
  const addChatMessage = (channel, text, replyTo = null) => {
    const newMessage = {
      id: 'msg-' + Date.now() + Math.random().toString(36).substring(2, 6),
      channel,
      text,
      senderEmail: currentUser.email,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`,
      senderRole: currentUser.customRole || (currentUser.isAdmin ? 'Admin' : 'Staff'),
      senderPfp: currentUser.profilePicture || '',
      timestamp: new Date().toISOString(),
      replyTo,
      reactions: []
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const deleteChatMessage = (msgId) => {
    setChatMessages(prev => prev.filter(m => m.id !== msgId));
  };

  const addMessageReaction = (msgId, emoji) => {
    setChatMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const currentReactions = m.reactions || [];
      const userEmail = currentUser.email;
      
      const existingReactionIndex = currentReactions.findIndex(r => r.emoji === emoji);
      let newReactions = [...currentReactions];
      
      if (existingReactionIndex >= 0) {
        const reaction = newReactions[existingReactionIndex];
        if (reaction.users.includes(userEmail)) {
          // Remove user's reaction
          const updatedUsers = reaction.users.filter(u => u !== userEmail);
          if (updatedUsers.length === 0) {
            newReactions.splice(existingReactionIndex, 1);
          } else {
            newReactions[existingReactionIndex] = { ...reaction, users: updatedUsers, count: updatedUsers.length };
          }
        } else {
          // Add user's reaction
          const updatedUsers = [...reaction.users, userEmail];
          newReactions[existingReactionIndex] = { ...reaction, users: updatedUsers, count: updatedUsers.length };
        }
      } else {
        // Add new reaction
        newReactions.push({ emoji, count: 1, users: [userEmail] });
      }
      return { ...m, reactions: newReactions };
    }));
  };

  // Announcements Operations
  const addAnnouncement = (annData) => {
    const newAnn = {
      id: makeId('ann'),
      type: annData.type,
      message: annData.message,
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
      authorEmail: currentUser.email,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      title: ticketData.title,
      description: ticketData.description,
      status: 'Open',
      timestamp: new Date().toISOString(),
      comments: []
    };
    setTickets(prev => [newTicket, ...prev]);
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
    setUsers(prev => prev.map(u => 
      u.email === staffEmail 
        ? { ...u, sotwWins: (u.sotwWins || 0) + 1 } 
        : u
    ));
    if (currentUser.email === staffEmail) {
      setCurrentUser(prev => ({ ...prev, sotwWins: (prev.sotwWins || 0) + 1 }));
    }
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
        login,
        signup,
        logout,
        updateUserProfile,
        toggleTheme,
        approveUser,
        rejectUser,
        removeUser,
        addPoints,
        promoteToAdmin,
        demoteFromAdmin,
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
        chatMessages,
        addChatMessage,
        deleteChatMessage,
        addMessageReaction,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        requestPasswordReset,
        approvePasswordReset,
        rejectPasswordReset,
        superAdminEmail: SUPER_ADMIN_EMAIL,
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
