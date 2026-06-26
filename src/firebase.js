import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage"; 

// Fully verified and corrected Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrQ3vLhIUfTzxzJ5gFDMFIkct9ZoBTB8w",
  authDomain: "oxton-database-1.firebaseapp.com",
  databaseURL: "https://oxton-database-1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oxton-database-1",
  storageBucket: "oxton-database-1.firebasestorage.app",
  messagingSenderId: "1067871820561",
  appId: "1:1067871820561:web:618b0559ba94c1fce88ab0",
  measurementId: "G-H7781ZR4M3"
};

// Initialize services cleanly
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

// Export everything required by your context and components
export { firebaseApp, analytics, db, storage };