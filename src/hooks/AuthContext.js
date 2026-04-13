import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState('free');
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, 'users', cred.user.uid), {
      name, email, plan: 'free', createdAt: new Date().toISOString()
    });
    return cred;
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return signOut(auth);
  }

  async function fetchUserPlan(uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) setUserPlan(snap.data().plan || 'free');
    } catch { setUserPlan('free'); }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await fetchUserPlan(u.uid);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userPlan, loading, signup, login, logout, fetchUserPlan }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
