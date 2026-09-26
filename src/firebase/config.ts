import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAoIQjQRoHjFyu7wJgis7AHjHdbxcPrWNE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hack2-d317b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hack2-d317b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hack2-d317b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "247891488047",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:247891488047:web:42c18d9fd4c8bb155305da",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8DL4T6LDP0",
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID || "hack2-d317b"}-default-rtdb.firebaseio.com`
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
