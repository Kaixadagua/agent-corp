// Utilitário de matemática
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
function round(num, decimals = 0) {
  return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = { clamp, round, randomInt };
