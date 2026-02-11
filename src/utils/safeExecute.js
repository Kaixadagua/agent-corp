// Melhora tratamento de erro
// Generated: 2026-02-11T17:45:02.492Z

function safeExecute(fn, fallback) {
  try {
    return fn();
  } catch (e) {
    console.error('Error:', e.message);
    return fallback;
  }
}

module.exports = { safeExecute };
