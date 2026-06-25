// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAL9CpDUOinYK3ny41gK3XM6BrtrU0Nu0",
  authDomain: "oxton-staff.firebaseapp.com",
  databaseURL: "https://oxton-staff-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oxton-staff",
  storageBucket: "oxton-staff.firebasestorage.app",
  messagingSenderId: "885352281205",
  appId: "1:885352281205:web:e506e4a8768e622953b43c",
  measurementId: "G-PP9GD2H3F1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);