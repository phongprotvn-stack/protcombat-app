import { Trophy, Globe, Moon, Sun, BookOpen, Mail, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../i18n';

export default function Account() {
  const { settings, toggleLang, toggleTheme, stats } = useApp();
  const lang = settings.lang;

  return (
    <div className="screen screen-enter" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}>
      <div style={{ padding: '0 var(--space-page-x)', display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)' }}>

        <div className="h2">{t('accountTitle', lang).replace('👤 ', '')}</div>

        {/* Profile Card */}
        <div className="card-hero" style={{ textAlign: 'center', padding: '28px 16px' }}>
          <div className="icon-badge" style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.2)', margin: '0 auto 12px' }}>
            <Trophy size={28} color="white" fill="rgba(255,255,255,0.5)" strokeWidth={1.4} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{t('appName', lang)}</div>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, marginTop: 4 }}>{t('slogan', lang)}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 10 }}>
            {stats.totalMatches} {t('totalMatches', lang).toLowerCase()} · {stats.winRate}% {t('winRate', lang).toLowerCase()}
          </div>
        </div>

        {/* Login Card */}
        <div className="card">
          <div className="title" style={{ marginBottom: 14 }}>{t('login', lang)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="email" placeholder={t('email', lang)} className="input-pill" style={{ borderRadius: 16, background: '#F4F4F6' }} />
            <input type="password" placeholder={t('password', lang)} className="input-pill" style={{ borderRadius: 16, background: '#F4F4F6' }} />
            <button className="btn-primary" style={{ marginTop: 4 }}>{t('loginBtn', lang).replace('🔑 ', '')}</button>
          </div>
        </div>

        {/* Settings Card */}
        <div className="card">
          <div className="title" style={{ marginBottom: 14 }}>{t('settings', lang).replace('⚙️ ', '')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Globe size={18} color="var(--color-text-secondary)" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t('language', lang)}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{lang === 'vi' ? 'Tiếng Việt' : 'English'}</div>
                </div>
              </div>
              <button onClick={toggleLang} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: 999, background: '#F4F4F6' }}>
                {lang === 'vi' ? 'EN' : 'VI'}
              </button>
            </div>
            <div style={{ height: 1, background: '#F1F1F4' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {settings.theme === 'light' ? <Sun size={18} color="var(--color-text-secondary)" /> : <Moon size={18} color="var(--color-text-secondary)" />}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t('theme', lang)}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{settings.theme === 'light' ? t('light', lang) : t('dark', lang)}</div>
                </div>
              </div>
              <button onClick={toggleTheme} style={{
                width: 46, height: 26, borderRadius: 999, border: 'none',
                background: settings.theme === 'light' ? '#E5E7EB' : 'var(--grad-primary)',
                cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute',
                  top: 3, left: settings.theme === 'light' ? 3 : 23, transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="card">
          <div className="title" style={{ marginBottom: 10 }}>{t('support', lang).replace('🆘 ', '')}</div>
          <div className="action-field">
            <span className="af-label"><BookOpen size={17} color="var(--color-text-secondary)" /> {t('helpGuide', lang).replace('📖 ', '')}</span>
          </div>
          <div style={{ height: 1, background: '#F1F1F4' }} />
          <div className="action-field" style={{ borderBottom: 'none' }}>
            <span className="af-label"><Mail size={17} color="var(--color-text-secondary)" /> {t('contact', lang).replace('📧 ', '')}</span>
          </div>
        </div>

        {/* App Info Card */}
        <div className="card">
          <div className="title" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={18} color="var(--color-text-secondary)" /> {t('appInfo', lang).replace('ℹ️ ', '')}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {t('appName', lang)} · {t('version', lang)} 1.0.0
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>© 2026 PROT COMBAT</div>
        </div>

        <div style={{ height: 10 }} />
      </div>
    </div>
  );
}
