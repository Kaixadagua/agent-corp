// Melhora tratamento de erro
// Generated: 2026-02-11T11:20:02.965Z

function safeExecute(fn, fallback) {
  try {
    return fn();
  } catch (e) {
    console.error('Error:', e.message);
    return fallback;
  }
}

module.exports = { safeExecute };
