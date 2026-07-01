import { useState } from 'react';
import { Trophy, Search, Swords, ChevronRight, Pencil, Flame, BarChart3 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t, formatDate } from '../i18n';

const TEAMMATES_LIST = ['PROT', 'Phong', 'Huy', 'Long', 'Minh', 'Anh', 'Tuấn', 'Hùng', 'Dũng'];

export default function Home() {
  const { matches, stats, settings, setActiveTab } = useApp();
  const lang = settings.lang;
  const greetName = settings.displayName || 'Prot';

  const [showOpponentSearch, setShowOpponentSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const uniqueOpponents = [...new Set(matches
    .filter(m => m.opponent && m.opponent !== t('anonymous', lang))
    .map(m => m.opponent)
  )];

  const filteredOpponents = searchQuery
    ? uniqueOpponents.filter(o => o.toLowerCase().includes(searchQuery.toLowerCase()))
    : uniqueOpponents;

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
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -60, right: -40, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', top: 40, right: 10, width: 100, height: 100,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
        }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>⚔️</span>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.2, color: 'white', opacity: 0.95 }}>
              {t('appName', lang)}
            </span>
          </div>
          <button
            onClick={() => {/* lang toggle */}}
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

        {/* Greeting */}
        <div style={{ marginTop: 24, position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: -0.5,
            lineHeight: 1.1,
            color: 'white',
          }}>
            {t('greeting', lang, { name: greetName })}
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            opacity: 0.9,
            marginTop: 6,
            color: 'white',
            letterSpacing: 0.2,
          }}>
            {t('todayQuestion', lang)}
          </div>
        </div>
      </div>

      {/* ========== CONTENT ========== */}
      <div style={{
        padding: '0 var(--space-page-x)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-card-gap)',
        marginTop: -12,
      }}>

        {/* ===== FIND OPPONENT CARD ===== */}
        <div
          className="card"
          style={{
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
          }}
          onClick={() => setShowOpponentSearch(!showOpponentSearch)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="icon-badge" style={{
              width: 48, height: 48,
              background: 'rgba(230,0,45,0.08)',
            }}>
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

          {/* Expanded search */}
          {showOpponentSearch && (
            <div style={{ marginTop: 14, animation: 'fadeIn 0.25s ease' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'vi' ? 'Tìm tên đối thủ...' : 'Search opponent name...'}
                className="input-pill"
                autoFocus
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
                    <div
                      key={name}
                      onClick={(e) => { e.stopPropagation(); setActiveTab('stats'); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', borderRadius: 14,
                        background: '#F8F8FA', cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div className="icon-badge" style={{
                        width: 28, height: 28,
                        background: 'rgba(230,0,45,0.06)', borderRadius: 10,
                      }}>
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
        <button className="btn-primary" onClick={() => setActiveTab('record')}>
          <Swords size={20} strokeWidth={2.4} />
          {t('startMatch', lang)}
        </button>

        {/* ===== OVERVIEW CARD ===== */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className="icon-badge" style={{
              width: 30, height: 30,
              background: 'rgba(230,0,45,0.08)',
            }}>
              <BarChart3 size={16} color="var(--color-primary)" strokeWidth={2.2} />
            </div>
            <span className="title" style={{ fontSize: 17 }}>
              {lang === 'vi' ? 'Tổng quan' : 'Overview'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <StatBlock value={stats.totalMatches} label={t('totalMatches', lang)} />
            <StatBlock
              value={`${stats.winRate}%`}
              label={t('winRate', lang)}
              accent
            />
            <StatBlock
              value={stats.bestStreak.current}
              label={t('winStreak', lang)}
              icon={<Flame size={14} color="#E6002D" fill="#FF8A5B" strokeWidth={1.2} />}
            />
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
              height: '100%',
              background: 'var(--grad-primary)',
              borderRadius: 999,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>

        {/* ===== RECENT MATCHES ===== */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="title" style={{ fontSize: 17 }}>
              {t('recentMatches', lang)}
            </span>
            {matches.length > 0 && (
              <button
                onClick={() => setActiveTab('stats')}
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="icon-badge" style={{
                      width: 12, height: 12, borderRadius: '50%',
                      background: match.result === 'win' ? 'var(--grad-primary)' : '#D1D5DB',
                    }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
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
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 6 }}>
                    <Pencil size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom spacer for nav */}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

function StatBlock({ value, label, accent, icon }) {
  return (
    <div style={{
      background: accent ? 'rgba(230,0,45,0.06)' : '#F8F8FA',
      borderRadius: 18,
      padding: '12px 8px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 22,
        fontWeight: 800,
        color: accent ? 'var(--color-primary)' : 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
        {value}
        {icon && icon}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}
