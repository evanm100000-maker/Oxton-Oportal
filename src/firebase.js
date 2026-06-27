import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDdX5ULboyxYhUGWYVOt0k_C_RlLqhMDH4",
  authDomain: "oportal-ea3b8.firebaseapp.com",
  databaseURL: "https://oportal-ea3b8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oportal-ea3b8",
  storageBucket: "oportal-ea3b8.firebasestorage.app",
  messagingSenderId: "434126091402",
  appId: "1:434126091402:web:c0bc93917c9e771ce7a973",
  measurementId: "G-BKBQV3QJZZ"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(firebaseApp);
}

export { firebaseApp, db, storage, analytics };