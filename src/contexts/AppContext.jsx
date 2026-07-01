import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, auth, googleProvider } from '../firebase/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext();

const STORAGE_KEY = 'protcombat_matches';
const SETTINGS_KEY = 'protcombat_settings';
const LISTS_KEY = 'protcombat_lists';

const ADMIN_EMAIL = 'phongprotvn@gmail.com';

const defaultSettings = {
  lang: 'vi',
  theme: 'light',
  loggedIn: false,
  displayName: '',
};

function loadLists(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(LISTS_KEY) || '{}');
    return all[userId || 'guest'] || { teammates: ['PROT', 'Phong', 'Huy', 'Long', 'Minh', 'Anh', 'Tuấn', 'Hùng', 'Dũng'], opponents: [] };
  } catch { return { teammates: [], opponents: [] }; }
}

function saveLists(userId, lists) {
  try {
    const all = JSON.parse(localStorage.getItem(LISTS_KEY) || '{}');
    all[userId || 'guest'] = lists;
    localStorage.setItem(LISTS_KEY, JSON.stringify(all));
  } catch (e) { console.error('Failed to save lists:', e); }
}

export function AppProvider({ children }) {
  const [matches, setMatches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch { return defaultSettings; }
  });

  const [activeTab, setActiveTab] = useState('home');
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState(() => loadLists(null));
  const [editingMatch, setEditingMatch] = useState(null);

  // Auth state listener
  useEffect(() => {
    let unsub;
    try {
      unsub = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser && fbUser.email === ADMIN_EMAIL) {
          const u = { uid: fbUser.uid, email: fbUser.email, displayName: 'PROT' };
          setUser(u);
          setSettings(prev => ({ ...prev, loggedIn: true, displayName: u.displayName }));
          setLists(loadLists(u.uid));
        } else if (fbUser && fbUser.email !== ADMIN_EMAIL) {
          fbSignOut(auth);
          setUser(null);
          setSettings(prev => ({ ...prev, loggedIn: false }));
          setLists(loadLists(null));
        } else {
          setUser(null);
          setSettings(prev => ({ ...prev, loggedIn: false }));
          setLists(loadLists(null));
        }
      });
    } catch (e) { console.warn('Auth initialization failed:', e.message); }
    return () => { if (unsub) unsub(); };
  }, []);

  // ─── Firestore real-time sync ─────────────────────────────────
  // SINGLE source of truth: onSnapshot updates matches from Firestore.
  // addMatch/updateMatch/deleteMatch do NOT manually update local state
  // on success — the onSnapshot callback handles it, which:
  //   1) Prevents duplicate records (critical fix for "tạo 2 bản ghi")
  //   2) Ensures cross-device sync works seamlessly
  useEffect(() => {
    let unsubscribe;
    let retryTimer;

    const startSync = () => {
      if (unsubscribe) return;
      try {
        const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
        unsubscribe = onSnapshot(q, (snapshot) => {
          const fbMatches = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          // Always update — even when empty (handles "delete all" case)
          setMatches(fbMatches);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fbMatches));
          setFirebaseReady(true);
        }, (err) => {
          console.warn('Firestore sync unavailable:', err.message);
          setFirebaseReady(false);
        });
      } catch (e) {
        console.warn('Firebase not configured yet');
        setFirebaseReady(false);
      }
    };

    const stopSync = () => {
      if (unsubscribe) { unsubscribe(); unsubscribe = null; }
      if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
    };

    startSync();

    // Re-sync when tab becomes active (cross-device: Mobile ↔ PC)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        stopSync();
        retryTimer = setTimeout(startSync, 200);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopSync();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Backup matches to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(matches)); }
    catch (e) { console.error('Failed to save matches:', e); }
  }, [matches]);

  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
    catch (e) { console.error('Failed to save settings:', e); }
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  // ─── CRUD: do NOT manually setMatches on success ─────────────
  // onSnapshot fires automatically after Firestore writes.
  // Manual updates cause duplicates ("tạo 2 bản ghi giống hệt nhau").
  const addMatch = useCallback(async (match) => {
    const matchData = {
      ...match,
      createdAt: new Date().toISOString(),
      userId: user?.uid || 'guest',
    };
    try {
      const docRef = await addDoc(collection(db, 'matches'), matchData);
      return { id: docRef.id, ...matchData };
    } catch (e) {
      console.warn('Firestore add failed:', e.message);
      // Fallback: only add locally if Firestore unavailable
      const fallback = { id: 'local_' + Date.now(), ...matchData };
      setMatches(prev => [fallback, ...prev]);
    }
  }, [user]);

  const updateMatch = useCallback(async (id, updates) => {
    try { await updateDoc(doc(db, 'matches', id), updates); }
    catch (e) { console.warn('Firestore update failed:', e.message); }
    // No local setMatches — onSnapshot handles it
  }, []);

  const deleteMatch = useCallback(async (id) => {
    try { await deleteDoc(doc(db, 'matches', id)); }
    catch (e) { console.warn('Firestore delete failed:', e.message); }
    // No local setMatches — onSnapshot handles it
  }, []);

  const toggleLang = useCallback(() => {
    setSettings(prev => ({ ...prev, lang: prev.lang === 'vi' ? 'en' : 'vi' }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  }, []);

  // Auth - PROT admin only
  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ADMIN_EMAIL) {
        await fbSignOut(auth);
        alert('Chỉ PROT mới có quyền đăng nhập. / Only PROT can sign in.');
      }
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        console.warn('Google sign-in failed:', e.message);
      }
    }
  }, []);

  const signOutUser = useCallback(async () => {
    try { await fbSignOut(auth); }
    catch (e) { console.warn('Sign out failed:', e.message); }
  }, []);

  // Lists management
  const updateLists = useCallback((newLists) => {
    setLists(newLists);
    saveLists(user?.uid || 'guest', newLists);
  }, [user]);

  const addTeammate = useCallback((name) => {
    if (!name || lists.teammates.includes(name)) return;
    updateLists({ ...lists, teammates: [...lists.teammates, name] });
  }, [lists, updateLists]);

  const removeTeammate = useCallback((name) => {
    updateLists({ ...lists, teammates: lists.teammates.filter(t => t !== name) });
  }, [lists, updateLists]);

  const renameTeammate = useCallback((oldName, newName) => {
    if (!newName) return;
    updateLists({ ...lists, teammates: lists.teammates.map(t => t === oldName ? newName : t) });
  }, [lists, updateLists]);

  const addOpponent = useCallback((name) => {
    if (!name || lists.opponents.includes(name)) return;
    updateLists({ ...lists, opponents: [...lists.opponents, name] });
  }, [lists, updateLists]);

  const removeOpponent = useCallback((name) => {
    updateLists({ ...lists, opponents: lists.opponents.filter(o => o !== name) });
  }, [lists, updateLists]);

  const renameOpponent = useCallback((oldName, newName) => {
    if (!newName) return;
    updateLists({ ...lists, opponents: lists.opponents.map(o => o === oldName ? newName : o) });
  }, [lists, updateLists]);

  const stats = {
    totalMatches: matches.length,
    totalWins: matches.filter(m => m.result === 'win').length,
    totalLosses: matches.filter(m => m.result === 'loss').length,
    winRate: matches.length > 0
      ? Math.round((matches.filter(m => m.result === 'win').length / matches.length) * 100)
      : 0,
    bestStreak: (() => {
      let current = 0, best = 0;
      for (const m of matches) {
        if (m.result === 'win') { current++; best = Math.max(best, current); }
        else current = 0;
      }
      let curStr = 0;
      for (const m of matches) {
        if (m.result === 'win') curStr++;
        else curStr = 0;
      }
      return { best, current: curStr };
    })(),
    avgScore: matches.length > 0
      ? Math.round((matches.reduce((s, m) => s + (m.myScore || 0), 0) / matches.length) * 10) / 10
      : 0,
  };

  // Export helpers
  const exportCSV = useCallback(() => {
    if (matches.length === 0) { alert('No matches to export'); return; }
    const headers = 'date,doubles,serve,myScore,opScore,opponent,teammate,skillLevel,note,result,createdAt';
    const rows = matches.map(m =>
      `"${m.date}","${m.doubles}","${m.serve}","${m.myScore}","${m.opScore}","${m.opponent || ''}","${m.teammate || ''}","${m.skillLevel || ''}","${(m.note || '').replace(/"/g,'""')}","${m.result}","${m.createdAt || ''}"`
    );
    const csv = `${headers}\n${rows.join('\n')}`;
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'protcombat_export.csv'; a.click();
    URL.revokeObjectURL(url);
  }, [matches]);

  const exportPDF = useCallback(() => {
    if (matches.length === 0) { alert('No matches to export'); return; }
    window.print();
  }, [matches]);

  const value = {
    matches, settings, activeTab, stats, firebaseReady, user, lists,
    editingMatch, setEditingMatch,
    addMatch, updateMatch, deleteMatch,
    setActiveTab, toggleLang, toggleTheme, setSettings,
    signInWithGoogle, signOutUser,
    addTeammate, removeTeammate, renameTeammate,
    addOpponent, removeOpponent, renameOpponent,
    exportCSV, exportPDF,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
