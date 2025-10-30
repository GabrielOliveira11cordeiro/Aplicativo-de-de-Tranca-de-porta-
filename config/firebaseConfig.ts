import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBq6BX_0qV5I2gFdhcOnpatD8L1SfYlHBM",
  authDomain: "projetopo-14a17.firebaseapp.com",
  projectId: "projetopo-14a17",
  storageBucket: "projetopo-14a17.firebasestorage.app",
  messagingSenderId: "1007472858002",
  appId: "1:1007472858002:web:b0ac921124c9fdfacae74b",
  measurementId: "G-C72SJT2KTR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

