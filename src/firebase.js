import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// TODO: Replace the below config with your Firebase project credentials
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Realtime Database instance
export const db = getDatabase(firebaseApp);

// Export helpers for convenience
export { getDatabase, ref, onValue, set };
