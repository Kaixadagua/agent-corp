/**
 * arrayUtils
 * Refatorado em: 2026-02-12
 * @module src/utils/arrayUtils
 */

// Utilitário de arrays
function unique(arr) {
  return [...new Set(arr)];
}
function chunk(arr, size) {
  return Array.from({length: Math.ceil(arr.length / size)}, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
module.exports = { unique, chunk };
