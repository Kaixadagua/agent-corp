// Melhora tratamento de erro
// Generated: 2026-02-11T18:00:02.464Z

function safeExecute(fn, fallback) {
  try {
    return fn();
  } catch (e) {
    console.error('Error:', e.message);
    return fallback;
  }
}

module.exports = { safeExecute };
