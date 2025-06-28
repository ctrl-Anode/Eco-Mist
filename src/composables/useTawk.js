// composables/useTawk.js
import { auth, db } from '../firebase';
import { getDoc, doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

let tawkInitialized = false;
let tawkLoadTimeout = null;

export function useTawk() {
  const excludedRoutes = ['/', '/auth'];
  const shouldLoadTawk = (path) => !excludedRoutes.includes(path);

  // 🔐 Get user role from Firestore
  async function getUserRole() {
    const user = auth.currentUser;
    if (!user) return null;

    const snap = await getDoc(doc(db, 'users', user.uid));
    return snap.exists() ? snap.data().role : null;
  }

  // 📝 Log events to Firestore (optional)
  async function logTawkEvent(message, data = {}) {
    console.info('[TAWK EVENT]', message, data);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      await addDoc(collection(db, 'tawkLogs'), {
        userId: user.uid,
        email: user.email || 'unknown',
        message,
        data,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      if (err.code === 'permission-denied') {
        console.warn('[TAWK LOG ERROR] Permission denied. Check Firestore rules.', err.message);
      } else {
        console.warn('[TAWK LOG ERROR]', err.message);
      }
    }
  }

  // ✅ Load Tawk only if user role = "user"
  const loadTawk = async () => {
    if (tawkInitialized || !auth.currentUser) return;

    const role = await getUserRole();
    if (role !== 'user') {
      logTawkEvent('Tawk skipped due to role restriction', { role });
      return;
    }

    unloadTawk(); // full cleanup

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.visitor = {
      name: auth.currentUser.displayName || 'Vue User',
      email: auth.currentUser.email,
    };

    tawkLoadTimeout = setTimeout(() => {
      window.Tawk_LoadStart = new Date();
      const script = document.createElement('script');
      script.id = 'tawk-script';
      script.src = 'https://embed.tawk.to/68526eaba1bfba190de860f7/1iu100jkv';
      script.async = true;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');

      script.onload = () => {
        logTawkEvent('✅ Tawk script loaded');
        //setTimeout(() => window.Tawk_API?.maximize?.(), 300);
      };

      script.onerror = () => {
        logTawkEvent('❌ Tawk script failed to load', { src: script.src });
      };

      document.body.appendChild(script);
      tawkInitialized = true;
    }, 300);
  };

  const unloadTawk = () => {
  if (!tawkInitialized) return;

  clearTimeout(tawkLoadTimeout);

  try {
    // End active chat session first
    if (window.Tawk_API?.endChat) {
      window.Tawk_API.endChat();
    }

    // Logout current visitor from Tawk
    if (window.Tawk_API?.logout) {
      window.Tawk_API.logout();
    }

    // Hide widget
    if (window.Tawk_API?.hideWidget) {
      window.Tawk_API.hideWidget();
    }

    logTawkEvent('Tawk fully unloaded and session ended');
  } catch (e) {
    console.warn('[TAWK] API teardown failed:', e);
  }

  // Remove <script> tag
  document.getElementById('tawk-script')?.remove();

  // Remove all injected DOM
  document.querySelectorAll('[id^="tawk-"], [class*="tawk-"]').forEach(el => el.remove());

  // Reset API globals
  delete window.Tawk_API;
  delete window.Tawk_LoadStart;
  tawkInitialized = false;

  // ❌ Clear Tawk cookies
  document.cookie.split(';').forEach(c => {
    if (c.trim().startsWith('Tawk_')) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    }
  });

  // ❌ Clear localStorage and sessionStorage keys used by Tawk
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('tawk_')) localStorage.removeItem(key);
  });
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('tawk_')) sessionStorage.removeItem(key);
  });
};


  return { loadTawk, unloadTawk, shouldLoadTawk };
}


