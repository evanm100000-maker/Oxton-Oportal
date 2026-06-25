import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage"; 

// Fully verified and corrected Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAL9CpDUOiNYK3ny41gK3XM6BrtrU0Nu0", // Fixed key casing!
  authDomain: "oxton-staff.firebaseapp.com",
  databaseURL: "https://oxton-staff-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oxton-staff",
  storageBucket: "oxton-staff.firebasestorage.app",
  messagingSenderId: "88535281205",
  appId: "1:88535281205:web:e506e4a8768e622953b43c",
  measurementId: "G-PP9GD2H3F1"
};

// Initialize services cleanly
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

// Export everything required by your context and components
export { firebaseApp, analytics, db, storage };