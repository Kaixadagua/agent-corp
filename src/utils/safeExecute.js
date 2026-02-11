// Melhora tratamento de erro
// Generated: 2026-02-11T05:35:02.434Z

function safeExecute(fn, fallback) {
  try {
    return fn();
  } catch (e) {
    console.error('Error:', e.message);
    return fallback;
  }
}

module.exports = { safeExecute };
