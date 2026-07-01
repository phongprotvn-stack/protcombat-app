import { useState, useRef, useEffect } from 'react';
import {
  Calendar, User, Users, Trophy, NotebookPen,
  ChevronLeft, ChevronRight, ArrowLeftRight,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t, getDayName, getMonthName } from '../i18n';

const TEAMMATES = ['PROT', 'Phong', 'Huy', 'Long', 'Minh', 'Anh', 'Tuấn', 'Hùng', 'Dũng'];

const SKILL_LEVELS = ['level6m', 'level6m1y', 'level1y'];

export default function RecordMatch() {
  const { addMatch, settings } = useApp();
  const lang = settings.lang;

  const today = new Date();
  const todayStr = dateToStr(today);

  const [doubles, setDoubles] = useState(false);
  const [opponentType, setOpponentType] = useState('maleMale');
  const [date, setDate] = useState(todayStr);
  const [serve, setServe] = useState('before');
  const [myScore, setMyScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [opponent, setOpponent] = useState('');
  const [teammate, setTeammate] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [note, setNote] = useState('');
  const [toast, setToast] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTeammatePicker, setShowTeammatePicker] = useState(false);

  const dateInputRef = useRef(null);

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
      teammate: teammate || '',
      skillLevel: skillLevel || '',
      note, result,
    });
    showToast(t('saveSuccess', lang));
    setMyScore(0); setOpScore(0); setOpponent('');
    setTeammate(''); setSkillLevel(''); setNote('');
    setServe('before');
    setDate(todayStr);
  };

  return (
    <div className="screen screen-enter" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}>
      <div style={{ padding: '0 var(--space-page-x)', display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)' }}>

        <div className="h2">{t('recordMatch', lang)}</div>

        {/* ===== MODE SELECTOR ===== */}
        <div className="card">
          <div className="segmented">
            <button className={!doubles ? 'active' : ''} onClick={() => setDoubles(false)}>
              {t('singles', lang)}
            </button>
            <button className={doubles ? 'active' : ''} onClick={() => setDoubles(true)}>
              {t('doubles', lang)}
            </button>
          </div>
          {doubles && (
            <div className="segmented" style={{ marginTop: 10 }}>
              <button className={opponentType === 'maleMale' ? 'active' : ''} onClick={() => setOpponentType('maleMale')}>
                {t('maleMale', lang)}
              </button>
              <button className={opponentType === 'femaleFemale' ? 'active' : ''} onClick={() => setOpponentType('femaleFemale')}>
                {t('femaleFemale', lang)}
              </button>
              <button className={opponentType === 'maleFemale' ? 'active' : ''} onClick={() => setOpponentType('maleFemale')}>
                {t('maleFemale', lang)}
              </button>
            </div>
          )}
        </div>

        {/* ===== ĐỒNG ĐỘI ===== */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 10 }}>
            <Users size={13} style={{ verticalAlign: -2, marginRight: 6 }} />
            {t('teammate', lang)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TEAMMATES.map(name => (
              <Chip
                key={name}
                active={teammate === name}
                label={name}
                onClick={() => setTeammate(teammate === name ? '' : name)}
              />
            ))}
          </div>
        </div>

        {/* ===== ĐỐI THỦ ===== */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 10 }}>
            <User size={13} style={{ verticalAlign: -2, marginRight: 6 }} />
            {t('opponent', lang)}
          </p>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            placeholder={t('anonymous', lang)}
            className="input-pill"
          />
        </div>

        {/* ===== TRÌNH ĐỘ ===== */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 10 }}>
            <Trophy size={13} style={{ verticalAlign: -2, marginRight: 6 }} />
            {t('skillLevel', lang)}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {SKILL_LEVELS.map(sk => (
              <SelectChip
                key={sk}
                active={skillLevel === sk}
                label={t(sk, lang)}
                onClick={() => setSkillLevel(skillLevel === sk ? '' : sk)}
              />
            ))}
          </div>
        </div>

        {/* ===== NGÀY ===== */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 10 }}>
            <Calendar size={13} style={{ verticalAlign: -2, marginRight: 6 }} />
            {t('date', lang)}
          </p>
          <div
            onClick={() => setShowDatePicker(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F4F4F6',
              borderRadius: 16,
              padding: '14px 18px',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {formatDateDisplay(date, lang)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                {getDayName(date, lang)}, {dateDisplay(date, lang)}
              </span>
            </div>
            <Calendar size={20} color="var(--color-text-muted)" />
          </div>

          {/* iOS-style Calendar Modal */}
          {showDatePicker && (
            <DatePickerModal
              selected={date}
              lang={lang}
              onSelect={(d) => { setDate(d); setShowDatePicker(false); }}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </div>

        {/* ===== GIAO BÓNG ===== */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 10 }}>
            <span style={{ marginRight: 6 }}>🎾</span>
            {t('serve', lang)}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <SelectChip
              active={serve === 'before'}
              label={t('before', lang)}
              onClick={() => setServe('before')}
              style={{ flex: 1 }}
            />
            <button
              onClick={() => {
                setServe(prev => prev === 'before' ? 'after' : 'before');
                showToast('🔄 ' + (lang === 'vi' ? 'Đã đảo giao bóng!' : 'Serve swapped!'));
              }}
              className="swap-btn"
            >
              <ArrowLeftRight size={14} />
            </button>
            <SelectChip
              active={serve === 'after'}
              label={t('after', lang)}
              onClick={() => setServe('after')}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* ===== TỶ SỐ ===== */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 10 }}>
            <Trophy size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
            {t('score', lang)}
          </p>
          <div className="merged-input">
            <div className="field">
              <label>{t('me', lang)}</label>
              <div
                className="value"
                onClick={() => {
                  const v = prompt(lang === 'vi' ? 'Điểm của tôi:' : 'My score:', myScore);
                  if (v !== null) setMyScore(Math.max(0, parseInt(v) || 0));
                }}
              >
                {myScore}
              </div>
            </div>
            <div className="divider" />
            <button
              className="swap-btn"
              onClick={() => { setMyScore(opScore); setOpScore(myScore); }}
            >
              <ArrowLeftRight size={14} />
            </button>
            <div className="divider" />
            <div className="field">
              <label>{t('opponent', lang)}</label>
              <div
                className="value"
                onClick={() => {
                  const v = prompt(lang === 'vi' ? 'Điểm đối thủ:' : 'Opponent score:', opScore);
                  if (v !== null) setOpScore(Math.max(0, parseInt(v) || 0));
                }}
              >
                {opScore}
              </div>
            </div>
          </div>

          <div className="result-dropdown">
            <div
              className={`result-btn win ${myScore > opScore ? 'active' : ''}`}
              onClick={() => {
                if (myScore <= opScore) {
                  if (myScore === opScore) setOpScore(myScore - 2);
                  else { const tmp = myScore; setMyScore(myScore + 2); setOpScore(tmp); }
                }
              }}
            >
              {t('win', lang)}
            </div>
            <div
              className={`result-btn loss ${opScore > myScore ? 'active' : ''}`}
              onClick={() => {
                if (opScore <= myScore) {
                  if (myScore === opScore) setMyScore(opScore - 2);
                  else { const tmp = opScore; setOpScore(opScore + 2); setMyScore(tmp); }
                }
              }}
            >
              {t('loss', lang)}
            </div>
          </div>
        </div>

        {/* ===== GHI CHÚ ===== */}
        <div className="card">
          <p className="caption" style={{ marginBottom: 8 }}>
            <NotebookPen size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
            {t('note', lang)}
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={lang === 'vi' ? 'Thêm ghi chú (không bắt buộc)...' : 'Add a note (optional)...'}
            style={{
              width: '100%', border: 'none', background: '#F4F4F6',
              borderRadius: 16, padding: '12px 14px', fontSize: 13,
              color: 'var(--color-text-primary)', resize: 'none',
              outline: 'none', fontFamily: 'inherit', minHeight: 64,
            }}
          />
        </div>

        {/* ===== LƯU ===== */}
        <button className="btn-primary" onClick={handleSave} style={{ marginBottom: 8 }}>
          {t('saveRecord', lang)}
        </button>
      </div>

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

/* ===== CHIP COMPONENTS ===== */

function Chip({ active, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 18px',
        borderRadius: 999,
        background: active ? 'rgba(230,0,45,0.08)' : '#F4F4F6',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--color-primary)' : 'var(--color-text-primary)',
        userSelect: 'none',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </div>
  );
}

function SelectChip({ active, label, onClick, style }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        textAlign: 'center',
        padding: '12px 8px',
        borderRadius: 18,
        background: active ? 'var(--grad-primary)' : '#F4F4F6',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 700,
        color: active ? 'white' : 'var(--color-text-primary)',
        userSelect: 'none',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 6px 16px rgba(230,0,45,0.25)' : 'none',
        ...(style || {}),
      }}
    >
      {label}
    </div>
  );
}

/* ===== DATE UTILITIES ===== */

function dateToStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateDisplay(dateStr, lang) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const month = lang === 'vi'
    ? `Tháng ${d.getMonth() + 1}`
    : getMonthName(d.getMonth(), lang);
  const year = d.getFullYear();
  return lang === 'vi' ? `${getDayName(dateStr, lang)}, ${day} ${month}, ${year}` : `${getDayName(dateStr, lang)}, ${month} ${day}, ${year}`;
}

function dateDisplay(dateStr, lang) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const month = lang === 'vi' ? `Tháng ${d.getMonth() + 1}` : getMonthName(d.getMonth(), lang);
  return `${day} ${month}`;
}

/* ===== iOS STYLE CALENDAR MODAL ===== */

function DatePickerModal({ selected, lang, onSelect, onClose }) {
  const initialDate = new Date(selected + 'T00:00:00');
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const weekdays = lang === 'vi'
    ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-card)',
          borderRadius: '28px 28px 0 0',
          width: '100%',
          maxWidth: 420,
          padding: '20px var(--space-page-x)',
          paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 20px)`,
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <button onClick={prevMonth} style={{
            border: 'none', background: '#F4F4F6', borderRadius: 12,
            width: 36, height: 36, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
            color: 'var(--color-text-primary)',
          }}>
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <div style={{ fontSize: 17, fontWeight: 700 }}>
            {getMonthName(viewMonth, lang)} {viewYear}
          </div>
          <button onClick={nextMonth} style={{
            border: 'none', background: '#F4F4F6', borderRadius: 12,
            width: 36, height: 36, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
            color: 'var(--color-text-primary)',
          }}>
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Weekday headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 2,
          marginBottom: 8,
        }}>
          {weekdays.map((wd, i) => (
            <div key={i} style={{
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: i === 0 || i === 6 ? '#E6002D' : 'var(--color-text-muted)',
              padding: '6px 0',
            }}>
              {wd}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 2,
        }}>
          {days.map((d, i) => {
            if (d === null) return <div key={`e${i}`} />;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = dateStr === selected;
            const isToday = dateStr === dateToStr(new Date());

            return (
              <button
                key={i}
                onClick={() => onSelect(dateStr)}
                style={{
                  aspectRatio: '1',
                  border: 'none',
                  background: isSelected ? 'var(--grad-primary)' : 'transparent',
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: isSelected ? 700 : (isToday ? 700 : 500),
                  color: isSelected ? 'white' : (isToday ? 'var(--color-primary)' : 'var(--color-text-primary)'),
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  boxShadow: isSelected ? '0 4px 12px rgba(230,0,45,0.3)' : 'none',
                  position: 'relative',
                }}
              >
                {d}
                {isToday && !isSelected && (
                  <div style={{
                    position: 'absolute',
                    bottom: 4,
                    width: 4, height: 4,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button
            onClick={() => {
              const d = new Date();
              onSelect(dateToStr(d));
            }}
            className="btn-secondary"
            style={{ flex: 1, borderRadius: 18 }}
          >
            {lang === 'vi' ? 'Hôm nay' : 'Today'}
          </button>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{
              flex: 1, borderRadius: 18, padding: '12px 18px',
              boxShadow: '0 6px 16px rgba(230,0,45,0.25)',
            }}
          >
            {lang === 'vi' ? 'Xong' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
