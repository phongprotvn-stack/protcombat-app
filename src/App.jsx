import { useRef, useEffect } from 'react';
import { Home as HomeIcon, PlusCircle, BarChart3, Lightbulb, User } from 'lucide-react';
import { useApp } from './contexts/AppContext';
import { t } from './i18n';
import Home from './screens/Home';
import RecordMatch from './screens/RecordMatch';
import Statistics from './screens/Statistics';
import Insights from './screens/Insights';
import Account from './screens/Account';

const navItems = [
  { id: 'home', Icon: HomeIcon, labelKey: 'home' },
  { id: 'record', Icon: PlusCircle, labelKey: 'record' },
  { id: 'stats', Icon: BarChart3, labelKey: 'stats' },
  { id: 'insights', Icon: Lightbulb, labelKey: 'insights' },
  { id: 'account', Icon: User, labelKey: 'account' },
];

export default function App() {
  const { activeTab, setActiveTab, settings } = useApp();
  const lang = settings.lang;
  const appRef = useRef(null);

  useEffect(() => {
    const el = appRef.current;
    if (!el) return;
    const prevent = (e) => {
      if (e.cancelable) e.preventDefault();
    };
    el.addEventListener('touchmove', prevent, { passive: false });
    return () => el.removeEventListener('touchmove', prevent);
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'record': return <RecordMatch />;
      case 'stats': return <Statistics />;
      case 'insights': return <Insights />;
      case 'account': return <Account />;
      default: return <Home />;
    }
  };

  return (
    <div
      ref={appRef}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#F8F8FA',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {renderScreen()}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="floating-nav">
        {navItems.map(({ id, Icon, labelKey }) => {
          const isActive = activeTab === id;
          return (
            <div
              key={id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <span className="nav-icon">
                <Icon size={24} strokeWidth={isActive ? 2.4 : 2} fill={isActive ? 'currentColor' : 'none'} fillOpacity={isActive ? 0.15 : 0} />
              </span>
              <span className="nav-label">{t(labelKey, lang)}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
