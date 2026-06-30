import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t, formatDate } from '../i18n';

export default function Statistics() {
  const { matches, stats, settings } = useApp();
  const lang = settings.lang;
  const [timeFilter, setTimeFilter] = useState('all');

  const opponentStats = {};
  matches.forEach(m => {
    const name = m.opponent || t('anonymous', lang);
    if (!opponentStats[name]) opponentStats[name] = { total: 0, wins: 0, losses: 0 };
    opponentStats[name].total++;
    if (m.result === 'win') opponentStats[name].wins++; else opponentStats[name].losses++;
  });
  const opponentList = Object.entries(opponentStats).sort((a, b) => b[1].total - a[1].total).slice(0, 10);

  return (
    <div className="screen screen-enter" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}>
      <div style={{ padding: '0 var(--space-page-x)', display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)' }}>

        <div className="h2">{t('statsTitle', lang).replace('📊 ', '')}</div>

        <div className="segmented">
          <button className={timeFilter === 'all' ? 'active' : ''} onClick={() => setTimeFilter('all')}>{t('all', lang)}</button>
          <button className={timeFilter === 'month' ? 'active' : ''} onClick={() => setTimeFilter('month')}>{t('month', lang)}</button>
          <button className={timeFilter === 'week' ? 'active' : ''} onClick={() => setTimeFilter('week')}>{t('week', lang)}</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-card-gap)' }}>
          <KpiCard label={t('totalMatches', lang)} value={stats.totalMatches} sub={`${t('totalWins', lang).replace('📊 ', '')}: ${stats.totalWins}`} />
          <KpiCard label={t('winRate', lang)} value={`${stats.winRate}%`} sub={`${t('totalLosses', lang).replace('📊 ', '')}: ${stats.totalLosses}`} accent />
          <KpiCard label={t('bestStreak', lang)} value={stats.bestStreak.best} sub={`${t('winStreak', lang)}: ${stats.bestStreak.current}`} />
          <KpiCard label={t('avgScore', lang)} value={stats.avgScore} />
        </div>

        <div>
          <div className="title" style={{ marginBottom: 12 }}>{t('opponentAnalysis', lang).replace('📊 ', '')}</div>
          {opponentList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 20 }}>
              {lang === 'vi' ? 'Chưa có dữ liệu' : 'No data yet'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {opponentList.map(([name, data]) => {
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
