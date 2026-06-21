import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCAb1-Cth-6UOQs8qXJuoIRRnEsEJjX6k",
  authDomain: "oxton-oportal-v2.firebaseapp.com",
  databaseURL: "https://oxton-oportal-v2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oxton-oportal-v2",
  storageBucket: "oxton-oportal-v2.firebasestorage.app",
  messagingSenderId: "836838921694",
  appId: "1:836838921694:web:568ca42581c24a6752f94f",
  measurementId: "G-VWPWJBL7S6"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

export { getDatabase, ref, onValue, set, storageRef, uploadBytes, getDownloadURL };
