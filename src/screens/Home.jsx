import { Trophy, Flame, Swords, ChevronRight, Pencil } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t, getRankInfo, formatDate } from '../i18n';

export default function Home() {
  const { matches, stats, settings, setActiveTab } = useApp();
  const lang = settings.lang;
  const rank = getRankInfo(matches.length, lang);
  const greetName = settings.displayName || (lang === 'vi' ? 'bạn' : 'there');

  return (
    <div className="screen screen-enter" style={{ paddingTop: 0 }}>
      {/* Big gradient header */}
      <div
        className="card-hero"
        style={{
          borderRadius: '0 0 36px 36px',
          padding: `calc(env(safe-area-inset-top, 0px) + 20px) ${'var(--space-page-x)'} 28px`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🔥</span>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.2 }}>{t('appName', lang).replace('🔥 ', '')}</span>
          </div>
          <button
            onClick={() => { /* lang toggle could go here */ }}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {lang === 'vi' ? 'VI' : 'EN'}
          </button>
        </div>

        <div style={{ marginTop: 22 }}>
          <div className="h2" style={{ color: 'white' }}>
            {lang === 'vi' ? `Xin chào, ${greetName}` : `Hello, ${greetName}`}
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, opacity: 0.88, marginTop: 4, color: 'white' }}>
            {lang === 'vi' ? 'Hôm nay đã đánh chưa?' : 'Played a match today?'}
          </div>
        </div>
      </div>

      <div style={{ padding: `0 var(--space-page-x)`, display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)', marginTop: -16 }}>

        {/* Primary CTA */}
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setActiveTab('record')}>
          <Swords size={20} strokeWidth={2.4} />
          {t('startMatch', lang).replace('➕ ', '')}
        </button>

        {/* Overview card */}
        <div className="card">
          <div className="title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span className="icon-badge" style={{ width: 30, height: 30, background: 'rgba(230,0,45,0.08)' }}>
              <BarIcon />
            </span>
            {lang === 'vi' ? 'Tổng quan' : 'Overview'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <StatBlock value={stats.totalMatches} label={t('totalMatches', lang)} />
            <StatBlock value={`${stats.winRate}%`} label={t('winRate', lang)} accent />
            <div style={{
              background: 'linear-gradient(135deg,#FFF4DA,#FFE7BD)',
              borderRadius: 18,
              padding: '12px 8px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}>
              <Trophy size={20} color="#B97A14" fill="#F5B942" strokeWidth={1.5} />
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8A5A0E' }}>{rank.title}</div>
            </div>
          </div>

          {stats.bestStreak.current > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
              <Flame size={18} color="#E6002D" fill="#FF8A5B" strokeWidth={1.2} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {lang === 'vi' ? `Chuỗi thắng: ${stats.bestStreak.current} trận` : `Win streak: ${stats.bestStreak.current}`}
              </span>
            </div>
          )}
        </div>

        {/* Win/Loss bar */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span className="title" style={{ fontSize: 16 }}>{lang === 'vi' ? 'Thắng / Thua' : 'Win / Loss'}</span>
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

        {/* Fighter Rank Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="icon-badge" style={{
            width: 52, height: 52,
            background: 'linear-gradient(135deg,#FFE9B8,#FFCE7A)',
          }}>
            <Trophy size={26} color="#8A5A0E" fill="#F5B942" strokeWidth={1.2} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="caption">{t('fighterRank', lang)}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-primary)' }}>{rank.title}</div>
            {rank.level < 4 && (
              <div style={{ marginTop: 6 }}>
                <div style={{ height: 6, background: '#F1F1F4', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(rank.progress, 100)}%`,
                    height: '100%',
                    background: 'var(--grad-primary)',
                    borderRadius: 999,
                  }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, fontWeight: 600 }}>
                  {matches.length} / {matches.length + rank.remaining} {lang === 'vi' ? 'trận' : 'matches'} → {rank.nextTitle}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Matches */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="title">{t('recentMatches', lang)}</span>
            {matches.length > 0 && (
              <button
                onClick={() => setActiveTab('stats')}
                style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
              >
                {lang === 'vi' ? 'Xem tất cả' : 'See all'} <ChevronRight size={16} />
              </button>
            )}
          </div>

          {matches.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px 16px' }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>🎾</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {lang === 'vi' ? 'Chưa có trận đấu nào' : 'No matches yet'}
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                {lang === 'vi' ? 'Hãy ghi trận đấu đầu tiên!' : 'Record your first match!'}
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
                        <span style={{ fontWeight: 800, color: match.result === 'win' ? 'var(--color-primary)' : 'var(--color-text-secondary)', marginLeft: 8 }}>
                          {match.myScore || 0}-{match.opScore || 0}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {formatDate(match.date)}
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
      </div>
    </div>
  );
}

function StatBlock({ value, label, accent }) {
  return (
    <div style={{
      background: accent ? 'rgba(230,0,45,0.06)' : '#F8F8FA',
      borderRadius: 18,
      padding: '12px 8px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function BarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="12" width="4" height="9" rx="1.5" fill="#E6002D" />
      <rect x="10" y="7" width="4" height="14" rx="1.5" fill="#E6002D" />
      <rect x="17" y="3" width="4" height="18" rx="1.5" fill="#E6002D" />
    </svg>
  );
}
