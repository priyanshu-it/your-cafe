// Firebase client SDK setup
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

import { getFirestore, collection, addDoc, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';


// ✅ Use REACT_APP_ prefix — required in Create React App
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ✅ Export everything you need
export {
  auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, db,
  collection, addDoc, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc
};