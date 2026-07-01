import { useState } from 'react';
import { Trophy, Globe, Moon, Sun, BookOpen, Mail, Info, LogIn, LogOut, Trash2, Edit3, Plus, Check, X, UserPlus, Users, FileDown, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../i18n';

export default function Account() {
  const { settings, toggleLang, toggleTheme, stats, user, signInWithGoogle, signOutUser, lists, addTeammate, removeTeammate, renameTeammate, addOpponent, removeOpponent, renameOpponent, exportCSV, exportPDF, clearAllMatches } = useApp();
  const lang = settings.lang;

  const [editingTeammate, setEditingTeammate] = useState(null);
  const [newTeammateName, setNewTeammateName] = useState('');
  const [showAddTeammate, setShowAddTeammate] = useState(false);
  const [editTeammateName, setEditTeammateName] = useState('');

  const [editingOpponent, setEditingOpponent] = useState(null);
  const [newOpponentName, setNewOpponentName] = useState('');
  const [showAddOpponent, setShowAddOpponent] = useState(false);
  const [editOpponentName, setEditOpponentName] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="screen screen-enter" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}>
      <div style={{ padding: '0 var(--space-page-x)', display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)' }}>

        <div className="h2">{t('accountTitle', lang)}</div>

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

        {/* Login / User Card */}
        <div className="card">
          <div className="title" style={{ marginBottom: 14 }}>{user ? (lang === 'vi' ? 'Đã đăng nhập' : 'Signed In') : t('login', lang)}</div>
          {user ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: 18,
                }}>
                  P
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>PROT</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Admin</div>
                </div>
              </div>
              <button onClick={signOutUser} style={{
                width: '100%', padding: '12px', borderRadius: 16,
                border: '1px solid #F1F1F4', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, fontSize: 14, fontWeight: 700,
                color: 'var(--color-text-secondary)', cursor: 'pointer',
              }}>
                <LogOut size={16} /> {lang === 'vi' ? 'Đăng xuất' : 'Sign Out'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={signInWithGoogle} style={{
                  width: '100%', padding: '14px', borderRadius: 16,
                  background: '#E6002D', color: 'white', border: 'none',
                  fontSize: 15, fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 6px 16px rgba(230,0,45,0.25)',
                }}>
                  <LogIn size={18} />
                  {lang === 'vi' ? 'Đăng nhập với tư cách PROT' : 'Login as PROT'}
                </button>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  {lang === 'vi' ? 'Chỉ PROT mới có quyền quản lý' : 'Only PROT can manage'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== SETTINGS CARD ===== */}
        <div className="card">
          <div className="title" style={{ marginBottom: 14 }}>{t('settings', lang)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Language */}
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

            {/* Theme */}
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
            <div style={{ height: 1, background: '#F1F1F4' }} />

            {/* ===== EXPORT SECTION ===== */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <FileDown size={18} color="var(--color-text-secondary)" />
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {lang === 'vi' ? 'Xuất dữ liệu' : 'Export Data'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={exportCSV}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 14,
                    border: '1px solid #F1F1F4', background: '#F8F8FA',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <FileText size={16} /> CSV
                </button>
                <button onClick={exportPDF}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 14,
                    border: '1px solid #F1F1F4', background: '#F8F8FA',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <FileDown size={16} /> PDF
                </button>
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 6, textAlign: 'center' }}>
                {lang === 'vi' ? 'Xuất toàn bộ trận đấu đã ghi' : 'Export all recorded matches'}
              </div>
            </div>
          </div>
        </div>

        {/* ===== TEAMMATES LIST MANAGEMENT ===== */}
        <div className="card">
          <div className="title" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="var(--color-primary)" /> {lang === 'vi' ? 'Danh sách Đồng đội' : 'Teammates List'}
          </div>

          {lists.teammates.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: 16 }}>
              {lang === 'vi' ? 'Chưa có đồng đội nào' : 'No teammates'}
            </div>
          ) : lists.teammates.map((name, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0', borderBottom: idx < lists.teammates.length - 1 ? '1px solid #F1F1F4' : 'none',
            }}>
              {editingTeammate === name ? (
                <>
                  <input type="text" value={editTeammateName} onChange={(e) => setEditTeammateName(e.target.value)}
                    className="input-pill" style={{ flex: 1, padding: '8px 12px', fontSize: 13, borderRadius: 12 }} autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') { renameTeammate(name, editTeammateName.trim()); setEditingTeammate(null); } }} />
                  <button onClick={() => { renameTeammate(name, editTeammateName.trim()); setEditingTeammate(null); }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-primary)' }}><Check size={18} /></button>
                  <button onClick={() => setEditingTeammate(null)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={18} /></button>
                </>
              ) : (
                <>
                  <div style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(230,0,45,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: 'var(--color-primary)' }}>{idx + 1}</div>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{name}</span>
                  <button onClick={() => { setEditingTeammate(name); setEditTeammateName(name); }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Edit3 size={14} /></button>
                  <button onClick={() => removeTeammate(name)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Trash2 size={14} /></button>
                </>
              )}
            </div>
          ))}

          {showAddTeammate ? (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input type="text" value={newTeammateName} onChange={(e) => setNewTeammateName(e.target.value)}
                placeholder={lang === 'vi' ? 'Tên đồng đội...' : 'Teammate name...'}
                className="input-pill" style={{ flex: 1, padding: '10px 14px', fontSize: 13, borderRadius: 14 }} autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter' && newTeammateName.trim()) { addTeammate(newTeammateName.trim()); setNewTeammateName(''); setShowAddTeammate(false); } }} />
              <button onClick={() => { if (newTeammateName.trim()) { addTeammate(newTeammateName.trim()); setNewTeammateName(''); setShowAddTeammate(false); } }}
                style={{ border: 'none', background: 'var(--grad-primary)', borderRadius: 14, padding: '10px 14px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
              <button onClick={() => { setShowAddTeammate(false); setNewTeammateName(''); }}
                style={{ border: 'none', background: '#F4F4F6', borderRadius: 14, padding: '10px 14px', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}><X size={16} /></button>
            </div>
          ) : (
            <button onClick={() => setShowAddTeammate(true)}
              style={{
                width: '100%', marginTop: 12, padding: '10px', borderRadius: 14,
                border: '1px dashed #D1D5DB', background: 'transparent',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
              <UserPlus size={14} /> {lang === 'vi' ? 'Thêm đồng đội' : 'Add teammate'}
            </button>
          )}
        </div>

        {/* ===== OPPONENTS LIST MANAGEMENT ===== */}
        <div className="card">
          <div className="title" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserPlus size={18} color="var(--color-primary)" /> {lang === 'vi' ? 'Danh sách Đối thủ' : 'Opponents List'}
          </div>

          {lists.opponents.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: 16 }}>
              {lang === 'vi' ? 'Chưa có đối thủ nào. Thêm từ trận đấu hoặc nhập tên.' : 'No opponents yet. Add from matches or type name.'}
            </div>
          ) : lists.opponents.map((name, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0', borderBottom: idx < lists.opponents.length - 1 ? '1px solid #F1F1F4' : 'none',
            }}>
              {editingOpponent === name ? (
                <>
                  <input type="text" value={editOpponentName} onChange={(e) => setEditOpponentName(e.target.value)}
                    className="input-pill" style={{ flex: 1, padding: '8px 12px', fontSize: 13, borderRadius: 12 }} autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') { renameOpponent(name, editOpponentName.trim()); setEditingOpponent(null); } }} />
                  <button onClick={() => { renameOpponent(name, editOpponentName.trim()); setEditingOpponent(null); }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-primary)' }}><Check size={18} /></button>
                  <button onClick={() => setEditingOpponent(null)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={18} /></button>
                </>
              ) : (
                <>
                  <div style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(230,0,45,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: 'var(--color-primary)' }}>{idx + 1}</div>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{name}</span>
                  <button onClick={() => { setEditingOpponent(name); setEditOpponentName(name); }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Edit3 size={14} /></button>
                  <button onClick={() => removeOpponent(name)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Trash2 size={14} /></button>
                </>
              )}
            </div>
          ))}

          {showAddOpponent ? (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input type="text" value={newOpponentName} onChange={(e) => setNewOpponentName(e.target.value)}
                placeholder={lang === 'vi' ? 'Tên đối thủ...' : 'Opponent name...'}
                className="input-pill" style={{ flex: 1, padding: '10px 14px', fontSize: 13, borderRadius: 14 }} autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter' && newOpponentName.trim()) { addOpponent(newOpponentName.trim()); setNewOpponentName(''); setShowAddOpponent(false); } }} />
              <button onClick={() => { if (newOpponentName.trim()) { addOpponent(newOpponentName.trim()); setNewOpponentName(''); setShowAddOpponent(false); } }}
                style={{ border: 'none', background: 'var(--grad-primary)', borderRadius: 14, padding: '10px 14px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
              <button onClick={() => { setShowAddOpponent(false); setNewOpponentName(''); }}
                style={{ border: 'none', background: '#F4F4F6', borderRadius: 14, padding: '10px 14px', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}><X size={16} /></button>
            </div>
          ) : (
            <button onClick={() => setShowAddOpponent(true)}
              style={{
                width: '100%', marginTop: 12, padding: '10px', borderRadius: 14,
                border: '1px dashed #D1D5DB', background: 'transparent',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
              <UserPlus size={14} /> {lang === 'vi' ? 'Thêm đối thủ' : 'Add opponent'}
            </button>
          )}
        </div>

        {/* Support Card */}
        <div className="card">
          <div className="title" style={{ marginBottom: 10 }}>{t('support', lang)}</div>
          <div className="action-field">
            <span className="af-label"><BookOpen size={17} color="var(--color-text-secondary)" /> {t('helpGuide', lang)}</span>
          </div>
          <div style={{ height: 1, background: '#F1F1F4' }} />
          <div className="action-field" style={{ borderBottom: 'none' }}>
            <span className="af-label"><Mail size={17} color="var(--color-text-secondary)" /> {t('contact', lang)}</span>
          </div>
        </div>

        {/* App Info */}
        <div className="card">
          <div className="title" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={18} color="var(--color-text-secondary)" /> {t('appInfo', lang)}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {t('appName', lang)} · {t('version', lang)} 1.0.0
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>© 2026 PROT COMBAT</div>
        </div>

        {/* Clear All Data (PROT only) */}
        {user && (
          <div className="card">
            {!confirmClear ? (
              <div className="action-field" onClick={() => setConfirmClear(true)}
                style={{ cursor: 'pointer', color: '#E6002D' }}>
                <Trash2 size={17} color="#E6002D" />
                <span style={{ marginLeft: 8, fontWeight: 700, fontSize: 13 }}>
                  {lang === 'vi' ? '🗑️ Xóa tất cả dữ liệu' : '🗑️ Clear All Data'}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                  {lang === 'vi' ? 'Chắc chắn xóa toàn bộ dữ liệu trận đấu?' : 'Delete all match records?'}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => setConfirmClear(false)}
                    style={{
                      padding: '8px 24px', borderRadius: 18, border: '1px solid #F1F1F4',
                      background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                    }}>
                    {lang === 'vi' ? 'Hủy' : 'Cancel'}
                  </button>
                  <button onClick={() => { clearAllMatches(); setConfirmClear(false); }}
                    style={{
                      padding: '8px 24px', borderRadius: 18, border: 'none',
                      background: '#E6002D', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                      color: 'white',
                    }}>
                    {lang === 'vi' ? 'Xóa' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ height: 10 }} />
      </div>
    </div>
  );
}
