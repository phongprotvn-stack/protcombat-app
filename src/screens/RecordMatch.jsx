import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar, User, Users, Trophy, NotebookPen, Volleyball,
  ChevronLeft, ChevronRight, Plus, Minus, Check, X,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t, getDayName, getMonthName } from '../i18n';

const SKILL_LEVELS = ['level6m', 'level6m1y', 'level1y'];

export default function RecordMatch() {
  const { addMatch, updateMatch, editingMatch, setEditingMatch } = useApp();
  const { settings, lists } = useApp();
  const lang = settings.lang;

  const today = new Date();
  const todayStr = dateToStr(today);

  const [doubles, setDoubles] = useState(false);
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
  const [showOpponentPicker, setShowOpponentPicker] = useState(false);
  const dateRef = useRef(null);

  // Load editing match data
  useEffect(() => {
    if (editingMatch) {
      setDate(editingMatch.date || todayStr);
      setDoubles(editingMatch.doubles || false);
      setServe(editingMatch.serve || 'before');
      setMyScore(editingMatch.myScore || 0);
      setOpScore(editingMatch.opScore || 0);
      setOpponent(editingMatch.opponent || '');
      setTeammate(editingMatch.teammate || '');
      setSkillLevel(editingMatch.skillLevel || '');
      setNote(editingMatch.note || '');
    }
  }, [editingMatch]);

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
    const finalOpponent = opponent || t('anonymous', lang);

    if (editingMatch) {
      // Update existing match
      updateMatch(editingMatch.id, {
        date, doubles, serve, myScore, opScore,
        opponent: finalOpponent,
        teammate: teammate || '',
        skillLevel: skillLevel || '',
        note, result,
      });
      showToast(lang === 'vi' ? '✅ Đã cập nhật trận đấu!' : '✅ Match updated!');
      setEditingMatch(null);
    } else {
      // Add new match
      addMatch({
        date, doubles, serve, myScore, opScore,
        opponent: finalOpponent,
        teammate: teammate || '',
        skillLevel: skillLevel || '',
        note, result,
      });
      showToast(t('saveSuccess', lang));
    }

    setMyScore(0); setOpScore(0);
    setOpponent(''); setTeammate(''); setSkillLevel('');
    setNote(''); setServe('before'); setDate(todayStr);
  };

  return (
    <div className="screen screen-enter" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}>
      <div style={{ padding: '0 var(--space-page-x)', display: 'flex', flexDirection: 'column', gap: 'var(--space-card-gap)' }}>

        <div className="h2">
          {editingMatch
            ? (lang === 'vi' ? 'Chỉnh sửa trận đấu' : 'Edit Match')
            : t('recordMatch', lang)}
        </div>

        {/* ===== MODE SELECTOR ===== */}
        <div className="card" style={{ padding: '10px 14px' }}>
          <div className="segmented">
            <button className={!doubles ? 'active' : ''} onClick={() => { setDoubles(false); setTeammate(''); }}>
              {t('singles', lang)}
            </button>
            <button className={doubles ? 'active' : ''} onClick={() => setDoubles(true)}>
              {t('doubles', lang)}
            </button>
          </div>
        </div>

        {/* ===== ĐỒNG ĐỘI (flight-booking style) ===== */}
        {doubles && (
          <div className="card" style={{ padding: 0 }}>
            <div onClick={() => setShowTeammatePicker(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 18px', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Users size={18} color="var(--color-primary)" strokeWidth={1.8} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 2 }}>
                    {t('teammate', lang)}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: teammate ? 'var(--color-text-primary)' : '#B0B0B0' }}>
                    {teammate || (lang === 'vi' ? 'Chọn đồng đội...' : 'Select teammate...')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {teammate && (
                  <X size={16} color="var(--color-text-muted)" onClick={(e) => { e.stopPropagation(); setTeammate(''); }}
                    style={{ cursor: 'pointer' }} />
                )}
                <ChevronRight size={16} color="var(--color-text-muted)" strokeWidth={2} />
              </div>
            </div>
          </div>
        )}

        {/* ===== ĐỐI THỦ (flight-booking style) ===== */}
        <div className="card" style={{ padding: 0 }}>
          <div onClick={() => setShowOpponentPicker(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <User size={18} color="var(--color-primary)" strokeWidth={1.8} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 2 }}>
                  {t('opponent', lang)}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: opponent ? 'var(--color-text-primary)' : '#B0B0B0' }}>
                  {opponent || (lang === 'vi' ? 'Chọn đối thủ...' : 'Select opponent...')}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {opponent && (
                <X size={16} color="var(--color-text-muted)" onClick={(e) => { e.stopPropagation(); setOpponent(''); }}
                  style={{ cursor: 'pointer' }} />
              )}
              <ChevronRight size={16} color="var(--color-text-muted)" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* ===== TRÌNH ĐỘ ===== */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Trophy size={16} color="var(--color-primary)" strokeWidth={1.8} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>
              {t('skillLevel', lang)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {SKILL_LEVELS.map(sk => (
              <SelectChip key={sk} active={skillLevel === sk} label={t(sk, lang)}
                onClick={() => setSkillLevel(skillLevel === sk ? '' : sk)} />
            ))}
          </div>
        </div>

        {/* ===== NGÀY (flight-booking style) ===== */}
        <div className="card" style={{ position: 'relative', padding: 0 }}>
          <div
            ref={dateRef}
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Calendar size={18} color="var(--color-primary)" strokeWidth={1.8} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 2 }}>
                  {t('date', lang)}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {formatFlightDate(date, lang)}
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="var(--color-text-muted)" strokeWidth={2} />
          </div>

          {/* Calendar popover ABOVE-LEFT */}
          {showDatePicker && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              right: 0,
              zIndex: 300,
              marginBottom: 8,
              animation: 'fadeIn 0.18s ease',
            }}>
              <DatePickerPopup selected={date} lang={lang}
                onSelect={(d) => { setDate(d); setShowDatePicker(false); }}
                onClose={() => setShowDatePicker(false)}
              />
            </div>
          )}
        </div>

        {/* ===== GIAO BÓNG ===== */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Volleyball size={16} color="var(--color-primary)" strokeWidth={1.8} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('serve', lang)}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <SelectChip active={serve === 'before'} label={t('before', lang)}
              onClick={() => setServe('before')} style={{ flex: 1 }} />
            <SelectChip active={serve === 'after'} label={t('after', lang)}
              onClick={() => setServe('after')} style={{ flex: 1 }} />
          </div>
        </div>

        {/* ===== TỶ SỐ ===== */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Trophy size={16} color="var(--color-primary)" strokeWidth={1.8} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('score', lang)}</span>
          </div>
          <div className="stepper-score">
            <div className="ss-side">
              <label>{t('me', lang)}</label>
              <div className="ss-row">
                <button className="ss-btn" onClick={() => setMyScore(Math.max(0, myScore - 1))}>
                  <Minus size={16} color="white" />
                </button>
                <div className="ss-value">{myScore}</div>
                <button className="ss-btn" onClick={() => setMyScore(Math.min(99, myScore + 1))}>
                  <Plus size={16} color="white" />
                </button>
              </div>
            </div>
            <div className="ss-divider"><span>:</span></div>
            <div className="ss-side">
              <label>{t('opponent', lang)}</label>
              <div className="ss-row">
                <button className="ss-btn" onClick={() => setOpScore(Math.max(0, opScore - 1))}>
                  <Minus size={16} color="white" />
                </button>
                <div className="ss-value">{opScore}</div>
                <button className="ss-btn" onClick={() => setOpScore(Math.min(99, opScore + 1))}>
                  <Plus size={16} color="white" />
                </button>
              </div>
            </div>
          </div>

          <div className="result-dropdown">
            <div className={`result-btn win ${myScore > opScore ? 'active' : ''}`}
              onClick={() => { if (myScore <= opScore) { setMyScore(opScore); setOpScore(Math.max(0, opScore - 1)); } }}
            >{t('win', lang)}</div>
            <div className={`result-btn loss ${opScore > myScore ? 'active' : ''}`}
              onClick={() => { if (opScore <= myScore) { setOpScore(myScore); setMyScore(Math.max(0, myScore - 1)); } }}
            >{t('loss', lang)}</div>
          </div>
        </div>

        {/* ===== GHI CHÚ ===== */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <NotebookPen size={16} color="var(--color-primary)" strokeWidth={1.8} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('note', lang)}</span>
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder={lang === 'vi' ? 'Thêm ghi chú (không bắt buộc)...' : 'Add a note (optional)...'}
            style={{
              width: '100%', border: 'none', background: '#F4F4F6',
              borderRadius: 16, padding: '12px 14px', fontSize: 13,
              color: 'var(--color-text-primary)', resize: 'none',
              outline: 'none', fontFamily: 'inherit', minHeight: 64,
            }}
          />
        </div>

        {/* ===== LƯU / CẬP NHẬT ===== */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          {editingMatch && (
            <button onClick={() => { setEditingMatch(null); setMyScore(0); setOpScore(0); setOpponent(''); setTeammate(''); setSkillLevel(''); setNote(''); setServe('before'); setDate(todayStr); }}
              style={{
                flex: 1, padding: '16px', borderRadius: 18, border: '1px solid #F1F1F4',
                background: 'transparent', cursor: 'pointer', fontSize: 15, fontWeight: 800,
                color: 'var(--color-text-secondary)',
              }}
            >
              {lang === 'vi' ? 'HỦY' : 'CANCEL'}
            </button>
          )}
          <button className="btn-primary" onClick={handleSave} style={{ flex: editingMatch ? 2 : 1 }}>
            {editingMatch
              ? (lang === 'vi' ? 'CẬP NHẬT' : 'UPDATE')
              : t('saveRecord', lang)}
          </button>
        </div>
      </div>

      {/* ===== TEAMMATE PICKER MODAL ===== */}
      {showTeammatePicker && (
        <ListPickerModal title={t('teammate', lang)} items={lists.teammates}
          selected={teammate} lang={lang}
          onSelect={(name) => { setTeammate(name); setShowTeammatePicker(false); }}
          onClose={() => setShowTeammatePicker(false)}
        />
      )}

      {/* ===== OPPONENT PICKER MODAL ===== */}
      {showOpponentPicker && (
        <ListPickerModal title={t('opponent', lang)} items={lists.opponents}
          selected={opponent} lang={lang}
          onSelect={(name) => { setOpponent(name); setShowOpponentPicker(false); }}
          onClose={() => setShowOpponentPicker(false)}
        />
      )}

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

/* ===== COMPONENTS ===== */

function SelectChip({ active, label, onClick, style }) {
  return (
    <div onClick={onClick}
      style={{
        flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 18,
        background: active ? 'var(--grad-primary)' : '#F4F4F6',
        cursor: 'pointer', fontSize: 13, fontWeight: 700,
        color: active ? 'white' : 'var(--color-text-primary)',
        userSelect: 'none', transition: 'all 0.2s ease',
        boxShadow: active ? '0 6px 16px rgba(230,0,45,0.25)' : 'none',
        ...(style || {}),
      }}
    >{label}</div>
  );
}

/* ===== LIST PICKER MODAL (flight "Hạng ghế" style) ===== */
function ListPickerModal({ title, items, selected, lang, onSelect, onClose }) {
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
          width: '100%', maxWidth: 420, maxHeight: '70vh', overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #F1F1F4',
        }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
          <button onClick={onClose}
            style={{
              border: 'none', background: '#F4F4F6', borderRadius: 12,
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-muted)',
            }}
          ><X size={18} /></button>
        </div>

        <div style={{ overflowY: 'auto', padding: '4px 0', flex: 1 }}>
          {items.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 32, color: 'var(--color-text-muted)', fontSize: 14,
            }}>
              {lang === 'vi' ? 'Chưa có dữ liệu. Thêm ở trang Tài khoản.' : 'No items yet. Add in Account page.'}
            </div>
          ) : items.map((name) => (
            <div key={name} onClick={() => onSelect(name)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px', cursor: 'pointer',
                background: name === selected ? 'rgba(230,0,45,0.06)' : 'transparent',
                borderBottom: '1px solid #F8F8FA',
              }}
            >
              <span style={{
                fontSize: 15, fontWeight: name === selected ? 700 : 500,
                color: 'var(--color-text-primary)',
              }}>{name}</span>

              {/* Radio check on RIGHT */}
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: name === selected ? '5px solid var(--color-primary)' : '2px solid #D1D5DB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
              }}>
                {name === selected && <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: 'var(--color-primary)',
                }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== DATE UTILITIES ===== */

function dateToStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatFlightDate(dateStr, lang) {
  const d = new Date(dateStr + 'T00:00:00');
  const dayName = getDayName(dateStr, lang);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  if (lang === 'vi') return `${dayName}, ${day} thg ${month}`;
  const monthAbbrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${dayName}, ${monthAbbrs[d.getMonth()]} ${day}`;
}

/* ===== iOS STYLE CALENDAR POPOVER ===== */

function DatePickerPopup({ selected, lang, onSelect, onClose }) {
  const initialDate = new Date(selected + 'T00:00:00');
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
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
    <div style={{
      background: 'var(--color-card)',
      borderRadius: 20, padding: '14px 14px 10px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10,
      }}>
        <button onClick={prevMonth} style={{
          border: 'none', background: '#F4F4F6', borderRadius: 10,
          width: 30, height: 30, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
          color: 'var(--color-text-primary)',
        }}>
          <ChevronLeft size={14} strokeWidth={2.5} />
        </button>
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          {getMonthName(viewMonth, lang)} {viewYear}
        </div>
        <button onClick={nextMonth} style={{
          border: 'none', background: '#F4F4F6', borderRadius: 10,
          width: 30, height: 30, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
          color: 'var(--color-text-primary)',
        }}>
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 3 }}>
        {weekdays.map((wd, i) => (
          <div key={i} style={{
            textAlign: 'center', fontSize: 10, fontWeight: 700,
            color: i === 0 || i === 6 ? '#E6002D' : 'var(--color-text-muted)',
            padding: '3px 0',
          }}>{wd}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {days.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isSelected = dateStr === selected;
          const isToday = dateStr === dateToStr(new Date());
          return (
            <button key={i} onClick={() => onSelect(dateStr)}
              style={{
                aspectRatio: '1', border: 'none',
                background: isSelected ? 'var(--color-primary)' : 'transparent',
                borderRadius: 10, fontSize: 12, fontWeight: isSelected ? 700 : (isToday ? 700 : 500),
                color: isSelected ? 'white' : (isToday ? 'var(--color-primary)' : 'var(--color-text-primary)'),
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.12s', position: 'relative',
              }}
            >
              {d}
              {isToday && !isSelected && (
                <div style={{
                  position: 'absolute', bottom: 2, width: 3, height: 3,
                  borderRadius: '50%', background: 'var(--color-primary)',
                }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <button onClick={() => onSelect(dateToStr(new Date()))}
          style={{
            border: 'none', background: '#F4F4F6', borderRadius: 12,
            padding: '6px 16px', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', color: 'var(--color-primary)',
          }}
        >{lang === 'vi' ? '📅 Hôm nay' : '📅 Today'}</button>
      </div>
    </div>
  );
}
