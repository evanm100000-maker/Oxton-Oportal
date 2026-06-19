import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDEZpHFYQz6KJov4ETDWuEoYXZ-6kv3rxE",
  authDomain: "oxton-oportal.firebaseapp.com",
  databaseURL: "https://oxton-oportal-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oxton-oportal",
  storageBucket: "oxton-oportal.firebasestorage.app",
  messagingSenderId: "100648529507",
  appId: "1:100648529507:web:899b33ce57b06596365256",
  measurementId: "G-YTQKHNNW6W"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);

export { getDatabase, ref, onValue, set };
