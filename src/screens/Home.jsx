import { useState } from 'react';
import { Trophy, Search, Swords, ChevronRight, Pencil, Trash2, Flame, BarChart3, Check, X, Calendar, User, Users, Trophy as TrophyIcon, Volleyball, NotebookPen } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t, formatDate } from '../i18n';

export default function Home() {
  const { matches, stats, settings, setActiveTab, toggleLang, lists, setEditingMatch, deleteMatch } = useApp();
  const lang = settings.lang;
  const greetName = settings.displayName || 'Prot';
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [detailMatch, setDetailMatch] = useState(null);

  const [showOpponentSearch, setShowOpponentSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const uniqueOpponents = [...new Set([
    ...matches
      .filter(m => m.opponent && m.opponent !== t('anonymous', lang))
      .map(m => m.opponent),
    ...(lists?.opponents || [])
  ])];

  const filteredOpponents = searchQuery
    ? uniqueOpponents.filter(o => o.toLowerCase().includes(searchQuery.toLowerCase()))
    : uniqueOpponents;

  const handleEdit = (match) => {
    setEditingMatch(match);
    setActiveTab('record');
  };

  const handleDelete = (matchId) => {
    deleteMatch(matchId);
    setConfirmDelete(null);
  };

  return (
    <div className="screen screen-enter" style={{ paddingTop: 0 }}>
      {/* ========== GRADIENT HEADER ========== */}
      <div
        className="card-hero"
        style={{
          borderRadius: '0 0 36px 36px',
          padding: `calc(env(safe-area-inset-top, 0px) + 20px) var(--space-page-x) 32px`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: -60, right: -40, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', top: 40, right: 10, width: 100, height: 100,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>⚔️</span>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.2, color: 'white', opacity: 0.95 }}>
              {t('appName', lang)}
            </span>
          </div>
          <button
            onClick={toggleLang}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
          >
            {lang === 'vi' ? 'VI' : 'EN'}
          </button>
        </div>

        <div style={{ marginTop: 24, position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 34, fontWeight: 800, letterSpacing: -0.5,
            lineHeight: 1.1, color: 'white',
          }}>
            {t('greeting', lang, { name: greetName })}
          </div>
          <div style={{
            fontSize: 16, fontWeight: 600, opacity: 0.9, marginTop: 6,
            color: 'white', letterSpacing: 0.2,
          }}>
            {t('todayQuestion', lang)}
          </div>
        </div>
      </div>

      <div style={{
        padding: '0 var(--space-page-x)',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)',
        marginTop: 0,
      }}>
        <div style={{ height: 10 }} />

        {/* ===== FIND OPPONENT CARD ===== */}
        <div className="card"
          style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
          onClick={() => setShowOpponentSearch(!showOpponentSearch)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="icon-badge" style={{ width: 48, height: 48, background: 'rgba(230,0,45,0.08)' }}>
              <Search size={22} color="var(--color-primary)" strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {t('findOpponent', lang)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {t('findOpponentDesc', lang)}
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" style={{
              transition: 'transform 0.3s ease',
              transform: showOpponentSearch ? 'rotate(90deg)' : 'rotate(0deg)',
            }} />
          </div>

          {showOpponentSearch && (
            <div style={{ marginTop: 14, animation: 'fadeIn 0.25s ease' }}>
              <input type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'vi' ? 'Tìm tên đối thủ...' : 'Search opponent name...'}
                className="input-pill" autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredOpponents.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: 8 }}>
                    {lang === 'vi'
                      ? (searchQuery ? 'Không tìm thấy' : 'Chưa có đối thủ nào')
                      : (searchQuery ? 'No opponents found' : 'No opponents yet')}
                  </div>
                ) : (
                  filteredOpponents.slice(0, 5).map(name => (
                    <div key={name}
                      onClick={(e) => { e.stopPropagation(); setActiveTab('stats'); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', borderRadius: 14,
                        background: '#F8F8FA', cursor: 'pointer',
                      }}
                    >
                      <div className="icon-badge" style={{ width: 28, height: 28, background: 'rgba(230,0,45,0.06)', borderRadius: 10 }}>
                        <span style={{ fontSize: 12 }}>🎯</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>{name}</span>
                      <ChevronRight size={14} color="var(--color-text-muted)" />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===== BẮT ĐẦU GHI TRẬN ===== */}
        <button className="btn-primary" onClick={() => { setEditingMatch(null); setActiveTab('record'); }}>
          <Swords size={20} strokeWidth={2.4} />
          {t('startMatch', lang)}
        </button>

        {/* ===== OVERVIEW CARD ===== */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className="icon-badge" style={{ width: 30, height: 30, background: 'rgba(230,0,45,0.08)' }}>
              <BarChart3 size={16} color="var(--color-primary)" strokeWidth={2.2} />
            </div>
            <span className="title" style={{ fontSize: 17 }}>
              {lang === 'vi' ? 'Tổng quan' : 'Overview'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <StatBlock value={stats.totalMatches} label={t('totalMatches', lang)} />
            <StatBlock value={`${stats.winRate}%`} label={t('winRate', lang)} accent />
            <StatBlock value={stats.bestStreak.current} label={t('winStreak', lang)}
              icon={<Flame size={14} color="#E6002D" fill="#FF8A5B" strokeWidth={1.2} />} />
          </div>
        </div>

        {/* ===== WIN/LOSS BAR ===== */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>
              {lang === 'vi' ? 'Thắng / Thua' : 'Win / Loss'}
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-primary)' }}>
              {stats.totalWins}W - {stats.totalLosses}L
            </span>
          </div>
          <div style={{ height: 10, background: '#F1F1F4', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              width: `${stats.totalMatches > 0 ? (stats.totalWins / stats.totalMatches) * 100 : 0}%`,
              height: '100%', background: 'var(--grad-primary)', borderRadius: 999,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>

        {/* ===== RECENT MATCHES ===== */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="title" style={{ fontSize: 17 }}>{t('recentMatches', lang)}</span>
            {matches.length > 0 && (
              <button onClick={() => setActiveTab('stats')}
                style={{
                  border: 'none', background: 'transparent',
                  color: 'var(--color-primary)', fontSize: 13, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                }}
              >
                {lang === 'vi' ? 'Xem tất cả' : 'See all'} <ChevronRight size={16} />
              </button>
            )}
          </div>

          {matches.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '36px 16px' }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>🎾</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {lang === 'vi' ? 'Chưa có trận đấu nào' : 'No matches yet'}
              </div>
              <div style={{ fontSize: 12, marginTop: 6 }}>
                {lang === 'vi' ? 'Ghi trận đầu tiên để bắt đầu hành trình!' : 'Record your first match to start!'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {matches.slice(0, 5).map((match) => (
                <div key={match.id} className="card" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px',
                }}>
                  <div onClick={() => setDetailMatch(match)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0, cursor: 'pointer' }}>
                    <div className="icon-badge" style={{
                      width: 12, height: 12, borderRadius: '50%',
                      background: match.result === 'win' ? 'var(--grad-primary)' : '#D1D5DB', flexShrink: 0,
                    }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        vs {match.opponent || t('anonymous', lang)}
                        <span style={{
                          fontWeight: 800,
                          color: match.result === 'win' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          marginLeft: 8,
                        }}>
                          {match.myScore || 0}-{match.opScore || 0}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {formatDate(match.date)}
                        {match.teammate && <span> · với {match.teammate}</span>}
                      </div>
                    </div>
                  </div>

                  {confirmDelete === match.id ? (
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleDelete(match.id)}
                        style={{
                          border: 'none', background: 'var(--color-primary)', borderRadius: 8,
                          padding: '6px 10px', cursor: 'pointer', color: 'white',
                          display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700,
                        }}
                      >
                        <Check size={14} />
                        {lang === 'vi' ? 'Xóa' : 'Delete'}
                      </button>
                      <button onClick={() => setConfirmDelete(null)}
                        style={{
                          border: 'none', background: '#F4F4F6', borderRadius: 8,
                          padding: '6px 10px', cursor: 'pointer', color: 'var(--color-text-muted)',
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleEdit(match)}
                        style={{
                          border: 'none', background: '#F4F4F6', borderRadius: 8,
                          padding: '6px 10px', cursor: 'pointer', color: 'var(--color-text-secondary)',
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setConfirmDelete(match.id)}
                        style={{
                          border: 'none', background: '#FEE2E2', borderRadius: 8,
                          padding: '6px 10px', cursor: 'pointer', color: '#DC2626',
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: 20 }} />
      </div>

      {/* ===== MATCH DETAIL MODAL ===== */}
      {detailMatch && (
        <MatchDetailModal match={detailMatch} lang={lang}
          onClose={() => setDetailMatch(null)}
          onEdit={(m) => { setDetailMatch(null); handleEdit(m); }}
          onDelete={(id) => { handleDelete(id); setDetailMatch(null); }}
        />
      )}
    </div>
  );
}

function MatchDetailModal({ match, lang, onClose, onEdit, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const dayNames = lang === 'vi'
      ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = dayNames[d.getDay()];
    const dd = d.getDate();
    const mm = d.getMonth() + 1;
    const yyyy = d.getFullYear();
    if (lang === 'vi') return `${day}, ${dd} thg ${mm}, ${yyyy}`;
    return `${day}, ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]} ${dd}, ${yyyy}`;
  };

  const mixTypeLabels = {
    'male-male': lang === 'vi' ? 'Nam-Nam' : 'Male-Male',
    'male-female': lang === 'vi' ? 'Nam-Nữ' : 'Male-Female',
    'female-female': lang === 'vi' ? 'Nữ-Nữ' : 'Female-Female',
  };

  const serveLabel = match.serve === 'before'
    ? (lang === 'vi' ? 'Trước' : 'Before')
    : (lang === 'vi' ? 'Sau' : 'After');

  return (
    <div onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-card)', borderRadius: '28px 28px 0 0',
          width: '100%', maxWidth: 420, maxHeight: '80vh', overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #F1F1F4',
        }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            {lang === 'vi' ? 'Chi tiết trận đấu' : 'Match Details'}
          </div>
          <button onClick={onClose}
            style={{
              border: 'none', background: '#F4F4F6', borderRadius: 12,
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-muted)',
            }}
          ><X size={18} /></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
          {/* Mode + Result badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{
              padding: '4px 12px', borderRadius: 999,
              background: match.doubles ? 'rgba(90,200,250,0.12)' : 'rgba(90,200,250,0.12)',
              fontSize: 12, fontWeight: 700,
              color: match.doubles ? '#0A84FF' : '#0A84FF',
            }}>
              {match.doubles
                ? (lang === 'vi' ? 'Đánh Đôi' : 'Doubles')
                : (lang === 'vi' ? 'Đánh Đơn' : 'Singles')}
            </div>
            <div style={{
              padding: '4px 14px', borderRadius: 999,
              background: match.result === 'win' ? 'rgba(230,0,45,0.1)' : '#F4F4F6',
              fontSize: 13, fontWeight: 800,
              color: match.result === 'win' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            }}>
              {match.result === 'win'
                ? (lang === 'vi' ? 'THẮNG' : 'WIN')
                : (lang === 'vi' ? 'THUA' : 'LOSS')}
            </div>
          </div>

          {/* Score big */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: 4 }}>
              <span style={{ color: match.result === 'win' ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                {match.myScore || 0}
              </span>
              <span style={{ color: '#D1D5DB', margin: '0 8px' }}>:</span>
              <span style={{ color: match.result === 'win' ? 'var(--color-text-secondary)' : 'var(--color-primary)' }}>
                {match.opScore || 0}
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: 6 }}>
              vs <strong>{match.opponent || (lang === 'vi' ? 'Vô danh' : 'Anonymous')}</strong>
            </div>
          </div>

          {/* Info rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="detail-row">
              <Calendar size={16} color="var(--color-text-muted)" />
              <span style={dlStyle}>{lang === 'vi' ? 'Ngày' : 'Date'}</span>
              <span style={dvStyle}>{formatDate(match.date)}</span>
            </div>

            {match.doubles && match.teammate && (
              <div className="detail-row">
                <Users size={16} color="var(--color-text-muted)" />
                <span style={dlStyle}>{lang === 'vi' ? 'Đồng đội' : 'Teammate'}</span>
                <span style={dvStyle}>{match.teammate}</span>
              </div>
            )}

            {match.doubles && match.mixType && (
              <div className="detail-row">
                <User size={16} color="var(--color-text-muted)" />
                <span style={dlStyle}>{lang === 'vi' ? 'Hỗn hợp' : 'Mixed'}</span>
                <span style={dvStyle}>{mixTypeLabels[match.mixType] || match.mixType}</span>
              </div>
            )}

            {match.skillLevel && (
              <div className="detail-row">
                <TrophyIcon size={16} color="var(--color-text-muted)" />
                <span style={dlStyle}>{lang === 'vi' ? 'Trình độ' : 'Skill Level'}</span>
                <span style={dvStyle}>{t('level' + match.skillLevel.replace('level', ''), lang) || match.skillLevel}</span>
              </div>
            )}

            <div className="detail-row">
              <Volleyball size={16} color="var(--color-text-muted)" />
              <span style={dlStyle}>{lang === 'vi' ? 'Giao bóng' : 'Serve'}</span>
              <span style={dvStyle}>{serveLabel}</span>
            </div>

            {match.note && (
              <div className="detail-row" style={{ alignItems: 'flex-start' }}>
                <NotebookPen size={16} color="var(--color-text-muted)" style={{ marginTop: 2 }} />
                <span style={dlStyle}>{lang === 'vi' ? 'Ghi chú' : 'Note'}</span>
                <span style={{ ...dvStyle, color: 'var(--color-text-primary)' }}>{match.note}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            <button onClick={() => onEdit(match)}
              style={{
                flex: 1, padding: '14px', borderRadius: 18, border: '1.5px solid var(--color-primary)',
                background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 800,
                color: 'var(--color-primary)',
              }}
            >
              {lang === 'vi' ? '✏️ CHỈNH SỬA' : '✏️ EDIT'}
            </button>
            {!confirmDel ? (
              <button onClick={() => setConfirmDel(true)}
                style={{
                  padding: '14px 20px', borderRadius: 18, border: 'none',
                  background: '#FEE2E2', cursor: 'pointer', fontSize: 14, fontWeight: 800,
                  color: '#DC2626',
                }}
              >
                <Trash2 size={18} />
              </button>
            ) : (
              <button onClick={() => onDelete(match.id)}
                style={{
                  padding: '14px 20px', borderRadius: 18, border: 'none',
                  background: 'var(--color-primary)', cursor: 'pointer', fontSize: 14, fontWeight: 800,
                  color: 'white',
                }}
              >
                {lang === 'vi' ? 'XÓA' : 'DELETE'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const dlStyle = {
  fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)',
  minWidth: 80, flexShrink: 0,
};
const dvStyle = {
  fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)',
  flex: 1, textAlign: 'right',
};

function StatBlock({ value, label, accent, icon }) {
  return (
    <div style={{
      background: accent ? 'rgba(230,0,45,0.06)' : '#F8F8FA',
      borderRadius: 18, padding: '12px 8px', textAlign: 'center',
    }}>
      <div style={{
        fontSize: 22, fontWeight: 800,
        color: accent ? 'var(--color-primary)' : 'var(--color-text-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
      }}>
        {value}
        {icon && icon}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}
