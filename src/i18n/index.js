import vi from './vi.json';
import en from './en.json';

const translations = { vi, en };

export function t(key, lang = 'vi') {
  const keys = key.split('.');
  let value = translations[lang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value !== undefined ? value : key;
}

export function getRankInfo(matches, lang) {
  const ranks = [
    { min: 0, max: 19, level: 0 },
    { min: 20, max: 49, level: 1 },
    { min: 50, max: 99, level: 2 },
    { min: 100, max: 199, level: 3 },
    { min: 200, max: Infinity, level: 4 },
  ];

  let currentRank = ranks[0];
  let nextRank = ranks[1];
  for (let i = 0; i < ranks.length; i++) {
    if (matches >= ranks[i].min && matches <= ranks[i].max) {
      currentRank = ranks[i];
      nextRank = ranks[i + 1] || ranks[i];
      break;
    }
  }

  const title = t(`rankTitles.${currentRank.level}`, lang);
  const emoji = t(`rankEmojis.${currentRank.level}`, lang);
  const progress = currentRank.level === 4
    ? 100
    : ((matches - currentRank.min) / (nextRank.max - currentRank.min)) * 100;
  const nextTitle = currentRank.level < 4
    ? t(`rankTitles.${nextRank.level}`, lang)
    : null;
  const remaining = currentRank.level < 4
    ? nextRank.min - matches
    : 0;

  return { title, emoji, progress, nextTitle, remaining, level: currentRank.level };
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}
