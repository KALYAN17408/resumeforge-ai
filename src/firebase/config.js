import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLQgyYhp0M2_yg6lGVdtIVRDvP2EFVZ0g",
  authDomain: "resumeforge-ai-d442d.firebaseapp.com",
  projectId: "resumeforge-ai-d442d",
  storageBucket: "resumeforge-ai-d442d.firebasestorage.app",
  messagingSenderId: "1040959052817",
  appId: "1:1040959052817:web:cd80bcd57c44f1ede8e5b0",
  measurementId: "G-7CG2VSPTZ7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);