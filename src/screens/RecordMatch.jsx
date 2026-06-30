import { useState } from 'react';
import { Calendar, User, ArrowLeftRight, Trophy, NotebookPen } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../i18n';

export default function RecordMatch() {
  const { addMatch, settings } = useApp();
  const lang = settings.lang;

  const [doubles, setDoubles] = useState(false);
  const [opponentType, setOpponentType] = useState('maleMale');
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [serve, setServe] = useState('before');
  const [myScore, setMyScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [opponent, setOpponent] = useState('');
  const [note, setNote] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSave = () => {
    if (myScore === opScore) {
      showToast(lang === 'vi' ? '⚠️ Tỷ số không được hòa' : '⚠️ Score cannot be tied');
      return;
    }
    const result = myScore > opScore ? 'win' : 'loss';
    addMatch({
      date, doubles, opponentType, serve, myScore, opScore,
      opponent: opponent.trim() || t('anonymous', lang),
      note, result,
    });
    showToast(t('saveSuccess', lang));
    setMyScore(0); setOpScore(0); setOpponent(''); setNote(''); setServe('before');
    const d = new Date();
    setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  return (
    <div className="screen screen-enter" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}>
      <div style={{ padding: '0 var(--space-page-x)', display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)' }}>

        <div className="h2">{t('recordMatch', lang)}</div>

        {/* Mode Selector */}
        <div className="card">
          <div className="segmented">
            <button className={!doubles ? 'active' : ''} onClick={() => setDoubles(false)}>{t('singles', lang)}</button>
            <button className={doubles ? 'active' : ''} onClick={() => setDoubles(true)}>{t('doubles', lang)}</button>
          </div>
          {doubles && (
            <div className="segmented" style={{ marginTop: 10 }}>
              <button className={opponentType === 'maleMale' ? 'active' : ''} onClick={() => setOpponentType('maleMale')}>{t('maleMale', lang)}</button>
              <button className={opponentType === 'femaleFemale' ? 'active' : ''} onClick={() => setOpponentType('femaleFemale')}>{t('femaleFemale', lang)}</button>
              <button className={opponentType === 'maleFemale' ? 'active' : ''} onClick={() => setOpponentType('maleFemale')}>{t('maleFemale', lang)}</button>
            </div>
          )}
        </div>

        {/* Opponent + Date */}
        <div className="card">
          <div className="action-field">
            <span className="af-label"><User size={17} color="var(--color-text-secondary)" /> {t('opponent', lang)}</span>
            <input
              type="text" value={opponent} onChange={(e) => setOpponent(e.target.value)}
              placeholder={t('anonymous', lang)}
              style={{ border: 'none', background: '#F4F4F6', borderRadius: 14, padding: '8px 14px', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'right', maxWidth: '55%', outline: 'none' }}
            />
          </div>
          <div style={{ height: 1, background: '#F1F1F4', margin: '4px 0' }} />
          <div className="action-field" style={{ borderBottom: 'none' }}>
            <span className="af-label"><Calendar size={17} color="var(--color-text-secondary)" /> {t('date', lang).replace('📅 ', '')}</span>
            <input
              type="date" value={date} onChange={(e) => setDate(e.target.value)}
              style={{ border: 'none', background: '#F4F4F6', borderRadius: 14, padding: '8px 14px', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', outline: 'none', colorScheme: settings.theme === 'dark' ? 'dark' : 'light' }}
            />
          </div>
        </div>

        {/* Serve */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 12 }}>{t('serve', lang).replace('🎾 ', '')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ServeChip active={serve === 'before'} label={t('before', lang)} onClick={() => setServe('before')} />
            <button
              onClick={() => { setServe(prev => prev === 'before' ? 'after' : 'before'); showToast('🔄 ' + (lang === 'vi' ? 'Đã đảo giao bóng!' : 'Serve swapped!')); }}
              className="swap-btn"
            >
              <ArrowLeftRight size={14} />
            </button>
            <ServeChip active={serve === 'after'} label={t('after', lang)} onClick={() => setServe('after')} />
          </div>
        </div>

        {/* Score */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 10 }}><Trophy size={13} style={{ verticalAlign: -2, marginRight: 4 }} />{t('score', lang).replace('🏆 ', '')}</p>
          <div className="merged-input">
            <div className="field">
              <label>{t('me', lang)}</label>
              <div className="value" onClick={() => { const v = prompt(lang === 'vi' ? 'Điểm của tôi:' : 'My score:', myScore); if (v !== null) setMyScore(Math.max(0, parseInt(v) || 0)); }}>{myScore}</div>
            </div>
            <div className="divider"></div>
            <button className="swap-btn" onClick={() => { setMyScore(opScore); setOpScore(myScore); }}><ArrowLeftRight size={14} /></button>
            <div className="divider"></div>
            <div className="field">
              <label>{t('opponent', lang)}</label>
              <div className="value" onClick={() => { const v = prompt(lang === 'vi' ? 'Điểm đối thủ:' : 'Opponent score:', opScore); if (v !== null) setOpScore(Math.max(0, parseInt(v) || 0)); }}>{opScore}</div>
            </div>
          </div>

          <div className="result-dropdown">
            <div className={`result-btn win ${myScore > opScore ? 'active' : ''}`} onClick={() => { if (myScore <= opScore) { if (myScore === opScore) setOpScore(myScore - 2); else { const tmp = myScore; setMyScore(myScore + 2); setOpScore(tmp); } } }}>
              {t('win', lang)}
            </div>
            <div className={`result-btn loss ${opScore > myScore ? 'active' : ''}`} onClick={() => { if (opScore <= myScore) { if (myScore === opScore) setMyScore(opScore - 2); else { const tmp = opScore; setOpScore(opScore + 2); setMyScore(tmp); } } }}>
              {t('loss', lang)}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 8 }}><NotebookPen size={13} style={{ verticalAlign: -2, marginRight: 4 }} />{t('note', lang).replace('📝 ', '')}</p>
          <textarea
            value={note} onChange={(e) => setNote(e.target.value)}
            placeholder={lang === 'vi' ? 'Thêm ghi chú (không bắt buộc)...' : 'Add a note (optional)...'}
            style={{ width: '100%', border: 'none', background: '#F4F4F6', borderRadius: 16, padding: '12px 14px', fontSize: 13, color: 'var(--color-text-primary)', resize: 'none', outline: 'none', fontFamily: 'inherit', minHeight: 64 }}
          />
        </div>

        <button className="btn-primary" onClick={handleSave} style={{ marginBottom: 8 }}>
          {t('saveRecord', lang).replace('💾 ', '')}
        </button>
      </div>

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

function ServeChip({ active, label, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: '8px 20px',
      borderRadius: 999,
      background: active ? 'rgba(230,0,45,0.1)' : '#F4F4F6',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: active ? 700 : 500,
      color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
      userSelect: 'none',
      minWidth: 80,
      textAlign: 'center',
      transition: 'all 0.2s',
    }}>
      {label}
    </div>
  );
}
