import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, auth, googleProvider } from '../firebase/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext();

const STORAGE_KEY = 'protcombat_matches';
const SETTINGS_KEY = 'protcombat_settings';
const LISTS_KEY = 'protcombat_lists';

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

  // Auth state listener
  useEffect(() => {
    let unsub;
    try {
      unsub = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const u = { uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User' };
          setUser(u);
          setSettings(prev => ({ ...prev, loggedIn: true, displayName: u.displayName }));
          setLists(loadLists(u.uid));
        } else {
          setUser(null);
          setSettings(prev => ({ ...prev, loggedIn: false }));
          setLists(loadLists(null));
        }
      });
    } catch (e) { console.warn('Auth initialization failed:', e.message); }
    return () => { if (unsub) unsub(); };
  }, []);

  // Firestore sync
  useEffect(() => {
    try {
      const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          const fbMatches = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          if (fbMatches.length > 0) setMatches(fbMatches);
        }
        setFirebaseReady(true);
      }, (err) => {
        console.warn('Firestore sync unavailable:', err.message);
        setFirebaseReady(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase not configured yet');
      setFirebaseReady(false);
    }
  }, []);

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

  const addMatch = useCallback(async (match) => {
    const newMatch = {
      ...match,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      userId: user?.uid || 'guest',
    };
    try { await addDoc(collection(db, 'matches'), newMatch); }
    catch (e) { console.warn('Firestore add failed:', e.message); }
    setMatches(prev => [newMatch, ...prev]);
  }, [user]);

  const updateMatch = useCallback(async (id, updates) => {
    try { await updateDoc(doc(db, 'matches', id), updates); }
    catch (e) { console.warn('Firestore update failed:', e.message); }
    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const deleteMatch = useCallback(async (id) => {
    try { await deleteDoc(doc(db, 'matches', id)); }
    catch (e) { console.warn('Firestore delete failed:', e.message); }
    setMatches(prev => prev.filter(m => m.id !== id));
  }, []);

  const toggleLang = useCallback(() => {
    setSettings(prev => ({ ...prev, lang: prev.lang === 'vi' ? 'en' : 'vi' }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  }, []);

  // Auth
  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) { console.warn('Google sign-in failed:', e.message); }
  }, []);

  const signOutUser = useCallback(async () => {
    try {
      await fbSignOut(auth);
    } catch (e) { console.warn('Sign out failed:', e.message); }
  }, []);

  // Lists management
  const updateLists = useCallback((newLists) => {
    setLists(newLists);
    saveLists(user?.uid || 'guest', newLists);
  }, [user]);

  const addTeammate = useCallback((name) => {
    if (lists.teammates.includes(name)) return;
    const newLists = { ...lists, teammates: [...lists.teammates, name] };
    updateLists(newLists);
  }, [lists, updateLists]);

  const removeTeammate = useCallback((name) => {
    const newLists = { ...lists, teammates: lists.teammates.filter(t => t !== name) };
    updateLists(newLists);
  }, [lists, updateLists]);

  const renameTeammate = useCallback((oldName, newName) => {
    if (!newName) return;
    const newLists = { ...lists, teammates: lists.teammates.map(t => t === oldName ? newName : t) };
    updateLists(newLists);
  }, [lists, updateLists]);

  const addOpponent = useCallback((name) => {
    if (lists.opponents.includes(name)) return;
    const newLists = { ...lists, opponents: [...lists.opponents, name] };
    updateLists(newLists);
  }, [lists, updateLists]);

  const removeOpponent = useCallback((name) => {
    const newLists = { ...lists, opponents: lists.opponents.filter(o => o !== name) };
    updateLists(newLists);
  }, [lists, updateLists]);

  const renameOpponent = useCallback((oldName, newName) => {
    if (!newName) return;
    const newLists = { ...lists, opponents: lists.opponents.map(o => o === oldName ? newName : o) };
    updateLists(newLists);
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

  const value = {
    matches,
    settings,
    activeTab,
    stats,
    firebaseReady,
    user,
    lists,
    addMatch, updateMatch, deleteMatch,
    setActiveTab,
    toggleLang, toggleTheme,
    setSettings,
    signInWithGoogle, signOutUser,
    addTeammate, removeTeammate, renameTeammate,
    addOpponent, removeOpponent, renameOpponent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
