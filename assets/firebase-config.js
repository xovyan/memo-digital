// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Konfigurasi Firebase (GANTI dengan milik kamu)
const firebaseConfig = {
  apiKey: "AIzaSyCaPM6CNaiK-VZYR0-dkrrYMANiWi8pUGw",
  authDomain: "memodigital-57c0c.firebaseapp.com",
  projectId: "memodigital-57c0c",
  storageBucket: "memodigital-57c0c.firebasestorage.app",
  messagingSenderId: "612241421208",
  appId: "1:612241421208:web:119b13353da40aa51871ed",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
