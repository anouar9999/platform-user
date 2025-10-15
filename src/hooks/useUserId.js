"use client";
import { useState, useEffect } from 'react';

function getUserIdFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    // common direct keys
    const keys = ['userId', 'user_id', 'id', 'uid'];
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v) return v;
    }

    // look for authData or user JSON objects
    const auth = localStorage.getItem('authData') || localStorage.getItem('user');
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        if (parsed?.userId) return parsed.userId;
        if (parsed?.id) return parsed.id;
        if (parsed?.user?.id) return parsed.user.id;
      } catch (e) {
        // not JSON, ignore
      }
    }

    // fallback: scan other localStorage entries for JSON containing id/userId
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const val = localStorage.getItem(k);
      if (!val) continue;
      try {
        const parsed = JSON.parse(val);
        if (parsed && (parsed.userId || parsed.id)) return parsed.userId ?? parsed.id;
      } catch (e) {
        // not JSON
      }
    }
  } catch (e) {
    // ignore errors accessing localStorage
  }
  return null;
}

export default function useUserId() {
  const [userId, setUserId] = useState(() => {
    if (typeof window === 'undefined') return null;
    return getUserIdFromStorage();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onStorage = (e) => {
      // update when keys we care about change or when authData/user changes
      const watched = ['userId', 'user_id', 'id', 'authData', 'user', 'uid'];
      if (!e) {
        setUserId(getUserIdFromStorage());
        return;
      }
      if (watched.includes(e.key)) {
        setUserId(getUserIdFromStorage());
      }
    };

    // listen to storage events (other tabs) and also set on mount
    window.addEventListener('storage', onStorage);
    setUserId(getUserIdFromStorage());
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return userId;
}
