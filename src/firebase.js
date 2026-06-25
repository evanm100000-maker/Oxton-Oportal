import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Need this for the chat!

// Your brand-new web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAL9CpDUOiNYK3ny41gK3XM6BrtrU0Nu0",
  authDomain: "oxton-staff.firebaseapp.com",
  databaseURL: "https://oxton-staff-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oxton-staff",
  storageBucket: "oxton-staff.firebasestorage.app",
  messagingSenderId: "88535281205",
  appId: "1:88535281205:web:e506e4a8768e622953b43c",
  measurementId: "G-PP9GD2H3F1"
};

// Initialize Firebase services
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getDatabase(firebaseApp);

// Export them exactly how your AppContext expects them
export { firebaseApp, analytics, db };