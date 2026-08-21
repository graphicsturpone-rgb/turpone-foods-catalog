import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzNSZ-Ah9M2yyFNFQupht1vHNkR2dacbA",
  authDomain: "turpone-foods-catalog.firebaseapp.com",
  projectId: "turpone-foods-catalog",
  storageBucket: "turpone-foods-catalog.firebasestorage.app",
  messagingSenderId: "382749807114",
  appId: "1:382749807114:web:1831a372deb4ab38fd45f3",
  measurementId: "G-JJYVL3JKDK"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
