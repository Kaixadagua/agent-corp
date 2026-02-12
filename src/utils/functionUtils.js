// Utilitário de funções
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
function pipe(...fns) {
  return (x) => fns.reduce((v, f) => f(v), x);
}
function compose(...fns) {
  return (x) => fns.reduceRight((v, f) => f(v), x);
}
module.exports = { memoize, pipe, compose };
