// Utilitário de objetos
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}
function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
module.exports = { pick, omit, deepClone };
