// Utilitário de strings avançado
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function truncate(str, length) {
  return str.length > length ? str.substring(0, length) + '...' : str;
}
function camelCase(str) {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}
module.exports = { slugify, truncate, camelCase };
