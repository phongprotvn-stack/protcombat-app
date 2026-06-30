import { Target, Footprints, Shield, Brain } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../i18n';

export default function Insights() {
  const { matches, stats, settings } = useApp();
  const lang = settings.lang;

  const getAdvice = () => {
    if (matches.length < 5) {
      return {
        title: lang === 'vi' ? '📊 Cần thêm dữ liệu' : '📊 Need More Data',
        desc: lang === 'vi' ? 'Hãy ghi ít nhất 5 trận để nhận phân tích chi tiết từ AI.' : 'Record at least 5 matches to get detailed AI analysis.',
      };
    }
    const wr = stats.winRate;
    if (wr >= 70) return { title: lang === 'vi' ? '🏆 Phong độ xuất sắc!' : '🏆 Excellent Form!', desc: lang === 'vi' ? `Bạn đang có phong độ rất tốt với ${wr}% tỷ lệ thắng. Hãy duy trì chiến thuật hiện tại.` : `You're in great form with ${wr}% win rate. Maintain your current strategy.` };
    if (wr >= 50) return { title: lang === 'vi' ? '📈 Đang đi đúng hướng' : '📈 On the Right Track', desc: lang === 'vi' ? `Tỷ lệ thắng ${wr}% cho thấy nền tảng tốt. Hãy cải thiện giao bóng và trả bóng.` : `A ${wr}% win rate shows a solid foundation. Focus on serve and return.` };
    return { title: lang === 'vi' ? '💪 Cần cải thiện' : '💪 Room for Improvement', desc: lang === 'vi' ? `Tỷ lệ thắng ${wr}% - đừng nản lòng! Tập trung vào kỹ thuật cơ bản.` : `${wr}% win rate - don't be discouraged! Focus on fundamentals.` };
  };
  const advice = getAdvice();

  const tips = [
    { Icon: Target, title: lang === 'vi' ? 'Giao bóng' : 'Serve', desc: lang === 'vi' ? 'Tập trung vào giao bóng chính xác thay vì mạnh.' : 'Focus on accurate serving over power.' },
    { Icon: Footprints, title: lang === 'vi' ? 'Di chuyển' : 'Footwork', desc: lang === 'vi' ? 'Cải thiện footwork: bước ngắn, nhanh, sẵn sàng.' : 'Improve footwork: short, quick steps.' },
    { Icon: Shield, title: lang === 'vi' ? 'Phòng thủ' : 'Defense', desc: lang === 'vi' ? 'Tập trung vào blocking và reset.' : 'Work on blocking and reset skills.' },
    { Icon: Brain, title: lang === 'vi' ? 'Chiến thuật' : 'Strategy', desc: lang === 'vi' ? 'Nhắm vào backhand và khoảng trống.' : 'Target backhand and open court.' },
  ];

  return (
    <div className="screen screen-enter" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}>
      <div style={{ padding: '0 var(--space-page-x)', display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)' }}>

        <div className="h2">{t('insightsTitle', lang).replace('💡 ', '')}</div>

        <div className="card-hero" style={{ padding: 'var(--space-card-inner)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('aiAnalysis', lang)}</div>
          <p style={{ fontSize: 16, fontWeight: 800, marginTop: 10 }}>{advice.title}</p>
          <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 6, opacity: 0.92 }}>{advice.desc}</p>
        </div>

        <div className="card" style={{ display: 'flex', gap: 16, justifyContent: 'space-around' }}>
          <MiniStat label={t('totalMatches', lang)} value={stats.totalMatches} />
          <div style={{ width: 1, background: '#F1F1F4' }} />
          <MiniStat label={t('winRate', lang)} value={`${stats.winRate}%`} accent />
          <div style={{ width: 1, background: '#F1F1F4' }} />
          <MiniStat label={t('winStreak', lang)} value={stats.bestStreak.current} />
        </div>

        <div>
          <div className="title" style={{ marginBottom: 12 }}>{t('improvementTips', lang).replace('🌱 ', '')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {tips.map((tip, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div className="icon-badge" style={{ width: 36, height: 36, background: 'rgba(230,0,45,0.08)', marginBottom: 10 }}>
                  <tip.Icon size={18} color="var(--color-primary)" strokeWidth={2} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{tip.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.4 }}>{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {matches.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>🎾</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {lang === 'vi' ? 'Bắt đầu hành trình!' : 'Start Your Journey!'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.5 }}>
              {lang === 'vi' ? 'Ghi trận đấu đầu tiên để nhận phân tích.' : 'Record your first match to get analysis.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="caption">{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{value}</div>
    </div>
  );
}
