import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';

const AppContext = createContext();

const STORAGE_KEY = 'protcombat_matches';
const SETTINGS_KEY = 'protcombat_settings';

const defaultSettings = {
  lang: 'vi',
  theme: 'light',
  loggedIn: false,
  displayName: '',
};

export function AppProvider({ children }) {
  const [matches, setMatches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [activeTab, setActiveTab] = useState('home');
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          const fbMatches = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          if (fbMatches.length > 0) {
            setMatches(fbMatches);
          }
        }
        setFirebaseReady(true);
      }, (err) => {
        console.warn('Firestore sync unavailable (offline or no permission):', err.message);
        setFirebaseReady(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase not configured yet');
      setFirebaseReady(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
    } catch (e) {
      console.error('Failed to save matches:', e);
    }
  }, [matches]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const addMatch = useCallback(async (match) => {
    const newMatch = {
      ...match,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
    };
    try {
      await addDoc(collection(db, 'matches'), newMatch);
    } catch (e) {
      console.warn('Firestore add failed, saving locally:', e.message);
    }
    setMatches(prev => [newMatch, ...prev]);
  }, []);

  const updateMatch = useCallback(async (id, updates) => {
    try {
      await updateDoc(doc(db, 'matches', id), updates);
    } catch (e) {
      console.warn('Firestore update failed:', e.message);
    }
    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const deleteMatch = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'matches', id));
    } catch (e) {
      console.warn('Firestore delete failed:', e.message);
    }
    setMatches(prev => prev.filter(m => m.id !== id));
  }, []);

  const toggleLang = useCallback(() => {
    setSettings(prev => ({ ...prev, lang: prev.lang === 'vi' ? 'en' : 'vi' }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  }, []);

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
        if (m.result === 'win') {
          current++;
          best = Math.max(best, current);
        } else {
          current = 0;
        }
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
    addMatch,
    updateMatch,
    deleteMatch,
    setActiveTab,
    toggleLang,
    toggleTheme,
    setSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
