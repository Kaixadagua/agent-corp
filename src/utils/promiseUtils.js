// Utilitário de promises
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
}
function allSettled(promises) {
  return Promise.all(promises.map(p =>
    Promise.resolve(p).then(
      value => ({ status: 'fulfilled', value }),
      reason => ({ status: 'rejected', reason })
    )
  ));
}
module.exports = { delay, timeout, allSettled };
