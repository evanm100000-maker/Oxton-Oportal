// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoh6QtKpZpsO4Y4apZ96lYo2x4blxlfrM",
  authDomain: "oxton-database.firebaseapp.com",
  databaseURL: "https://oxton-database-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oxton-database",
  storageBucket: "oxton-database.firebasestorage.app",
  messagingSenderId: "549469601889",
  appId: "1:549469601889:web:686537f4c08dea73e2ea20",
  measurementId: "G-ZQLDXES5SS"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(firebaseApp);
}

export { firebaseApp, db, storage, analytics };