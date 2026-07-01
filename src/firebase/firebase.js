import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDxCnR5LG3sdNf5bxgtzaQGge0maoz34xo",
  authDomain: "protcombat.firebaseapp.com",
  projectId: "protcombat",
  storageBucket: "protcombat.firebasestorage.app",
  messagingSenderId: "518272307510",
  appId: "1:518272307510:web:ca6ce8a01dbfe1d950a397"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
