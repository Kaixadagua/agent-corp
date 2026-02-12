// Utilitário de validação avançada
function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}
function isUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}
function isJson(str) {
  try { JSON.parse(str); return true; } catch { return false; }
}
module.exports = { isEmail, isUrl, isJson };
