import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t, formatDate } from '../i18n';
import { ChevronDown, ChevronUp, Users, User } from 'lucide-react';

export default function Statistics() {
  const { matches, stats, settings } = useApp();
  const lang = settings.lang;
  const [timeFilter, setTimeFilter] = useState('all');
  const [showAllTeammate, setShowAllTeammate] = useState(false);
  const [showAllOpponent, setShowAllOpponent] = useState(false);

  // Opponent stats
  const opponentStats = {};
  matches.forEach(m => {
    const name = m.opponent || t('anonymous', lang);
    if (!opponentStats[name]) opponentStats[name] = { total: 0, wins: 0, losses: 0 };
    opponentStats[name].total++;
    if (m.result === 'win') opponentStats[name].wins++; else opponentStats[name].losses++;
  });
  const opponentList = Object.entries(opponentStats)
    .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))
    .slice(0, 10);

  // Teammate stats
  const teammateStats = {};
  matches.forEach(m => {
    if (!m.teammate) return;
    const name = m.teammate;
    if (!teammateStats[name]) teammateStats[name] = { total: 0, wins: 0, losses: 0 };
    teammateStats[name].total++;
    if (m.result === 'win') teammateStats[name].wins++; else teammateStats[name].losses++;
  });
  const teammateList = Object.entries(teammateStats)
    .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total));

  const displayedTeammate = showAllTeammate ? teammateList : teammateList.slice(0, 1);
  const displayedOpponent = showAllOpponent ? opponentList : opponentList.slice(0, 1);

  return (
    <div className="screen screen-enter" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}>
      <div style={{ padding: '0 var(--space-page-x)', display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)' }}>

        <div className="h2">{t('statsTitle', lang)}</div>

        <div className="segmented">
          <button className={timeFilter === 'all' ? 'active' : ''} onClick={() => setTimeFilter('all')}>{t('all', lang)}</button>
          <button className={timeFilter === 'month' ? 'active' : ''} onClick={() => setTimeFilter('month')}>{t('month', lang)}</button>
          <button className={timeFilter === 'week' ? 'active' : ''} onClick={() => setTimeFilter('week')}>{t('week', lang)}</button>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-card-gap)' }}>
          <KpiCard label={t('totalMatches', lang)} value={stats.totalMatches} sub={`${lang === 'vi' ? 'Thắng' : 'Wins'}: ${stats.totalWins}`} />
          <KpiCard label={t('winRate', lang)} value={`${stats.winRate}%`} sub={`${lang === 'vi' ? 'Thua' : 'Losses'}: ${stats.totalLosses}`} accent />
          <KpiCard label={t('bestStreak', lang)} value={stats.bestStreak.best} sub={`${t('winStreak', lang)}: ${stats.bestStreak.current}`} />
          <KpiCard label={t('avgScore', lang)} value={stats.avgScore} />
        </div>

        {/* Win Rate by Teammate */}
        {teammateList.length > 0 && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
            }}>
              <div className="title" style={{ marginBottom: 0 }}>{lang === 'vi' ? 'Tỷ lệ thắng theo Đồng đội' : 'Win Rate by Teammate'}</div>
              {teammateList.length > 1 && (
                <button
                  onClick={() => setShowAllTeammate(!showAllTeammate)}
                  style={{
                    border: 'none', background: '#F4F4F6', borderRadius: 999,
                    padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                    color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  {showAllTeammate ? (lang === 'vi' ? 'Thu gọn' : 'Collapse') : (lang === 'vi' ? 'Xem tất cả' : 'See all')}
                  {showAllTeammate ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayedTeammate.map(([name, data]) => {
                const wr = data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0;
                return (
                  <div key={name} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {data.total} {t('totalMatches', lang).toLowerCase()} · {data.wins}W - {data.losses}L
                      </div>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: wr >= 50 ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>{wr}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Win Rate by Opponent */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
          }}>
            <div className="title" style={{ marginBottom: 0 }}>{lang === 'vi' ? 'Tỷ lệ thắng theo Đối thủ' : 'Win Rate by Opponent'}</div>
            {opponentList.length > 1 && (
              <button
                onClick={() => setShowAllOpponent(!showAllOpponent)}
                style={{
                  border: 'none', background: '#F4F4F6', borderRadius: 999,
                  padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                  color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                {showAllOpponent ? (lang === 'vi' ? 'Thu gọn' : 'Collapse') : (lang === 'vi' ? 'Xem tất cả' : 'See all')}
                {showAllOpponent ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
          {opponentList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 20 }}>
              {lang === 'vi' ? 'Chưa có dữ liệu' : 'No data yet'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayedOpponent.map(([name, data]) => {
                const wr = data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0;
                return (
                  <div key={name} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {data.total} {t('totalMatches', lang).toLowerCase()} · {data.wins}W - {data.losses}L
                      </div>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: wr >= 50 ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>{wr}%</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Match History */}
        {matches.length > 0 && (
          <div>
            <div className="title" style={{ marginBottom: 12 }}>{lang === 'vi' ? 'Lịch sử trận đấu' : 'Match History'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {matches.map((m) => (
                <div key={m.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: m.result === 'win' ? 'var(--grad-primary)' : '#D1D5DB', flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>
                    {m.myScore || 0} – {m.opScore || 0}
                    <span style={{ fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: 8 }}>vs {m.opponent || t('anonymous', lang)}</span>
                    {m.teammate && <span style={{ fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: 4 }}>· {lang === 'vi' ? 'với' : 'w/'} {m.teammate}</span>}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 600 }}>{formatDate(m.date)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, accent }) {
  return (
    <div className="card">
      <div className="caption">{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: accent ? 'var(--color-primary)' : 'var(--color-text-primary)', marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}
