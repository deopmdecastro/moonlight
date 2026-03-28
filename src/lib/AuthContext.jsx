import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

const LAST_ACTIVE_KEY = 'zana_last_active_at';
const MAX_IDLE_MS = 5 * 60 * 60 * 1000; // 5h

function readLastActiveMs() {
  try {
    const raw = window?.localStorage?.getItem?.(LAST_ACTIVE_KEY);
    const value = Number.parseInt(String(raw ?? ''), 10);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function writeLastActiveMs(valueMs) {
  try {
    if (!window?.localStorage?.setItem) return;
    window.localStorage.setItem(LAST_ACTIVE_KEY, String(valueMs));
  } catch {}
}

function clearLastActiveMs() {
  try {
    window?.localStorage?.removeItem?.(LAST_ACTIVE_KEY);
  } catch {}
}

export const AuthProvider = ({ children }) => {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError] = useState(null);
  const [user, setUser] = useState(null);

  const setAuthUser = (nextUser) => {
    setUser(nextUser ?? null);
    if (nextUser) writeLastActiveMs(Date.now());
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoadingAuth(true);
      try {
        const lastActive = readLastActiveMs();
        if (lastActive && Date.now() - lastActive > MAX_IDLE_MS) {
          base44.auth.logout();
          clearLastActiveMs();
          if (!cancelled) setAuthUser(null);
          return;
        }
        const me = await base44.auth.me();
        if (!cancelled) setAuthUser(me);
      } finally {
        if (!cancelled) setIsLoadingAuth(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isAuthenticated = !!user;

  const logout = () => {
    base44.auth.logout();
    clearLastActiveMs();
    setAuthUser(null);
  };

  const navigateToLogin = () => {
    base44.auth.redirectToLogin();
  };

  const checkAppState = () => {};

  // Auto logout after 5 hours of inactivity.
  useEffect(() => {
    if (!user) return;

    let lastTouch = 0;
    const touch = () => {
      const now = Date.now();
      if (now - lastTouch < 30_000) return;
      lastTouch = now;
      writeLastActiveMs(now);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    for (const evt of events) window.addEventListener(evt, touch, { passive: true });

    const interval = window.setInterval(() => {
      const lastActive = readLastActiveMs();
      if (!lastActive) return;
      if (Date.now() - lastActive > MAX_IDLE_MS) {
        logout();
        window.location.assign('/conta');
      }
    }, 60_000);

    return () => {
      for (const evt of events) window.removeEventListener(evt, touch);
      window.clearInterval(interval);
    };
  }, [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    appPublicSettings: {},
    setAuthUser,
    logout,
    navigateToLogin,
    checkAppState,
  }), [user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

