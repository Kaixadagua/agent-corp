/**
 * dateFormat
 * Refatorado em: 2026-02-12
 * @module src/utils/dateFormat
 */

// Utilitário de formatação de data
// Provides: formatDate, formatRelative, parseDate

function formatDate(date, format = 'DD/MM/YYYY') {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const pad = (n) => n.toString().padStart(2, '0');
  
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()));
}

function formatRelative(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return 'agora';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min atrás`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d atrás`;
  return formatDate(date);
}

function parseDate(str, format = 'DD/MM/YYYY') {
  // Parse simples - pode ser expandido
  const parts = str.match(/(d+)/g);
  if (!parts || parts.length < 3) return null;
  
  if (format === 'DD/MM/YYYY') {
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  return new Date(str);
}

module.exports = { formatDate, formatRelative, parseDate };
