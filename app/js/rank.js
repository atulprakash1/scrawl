/* Fractional ranking: string keys that sort with plain `<`, so moving a card rewrites only that card. */
(function () {
  const S = window.Scrawl;
  const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
  const BASE = DIGITS.length;

  // A key strictly between a and b. a = '' means "start", b = null means "end".
  function between(a, b) {
    a = a || '';
    let out = '';
    for (let i = 0; ; i++) {
      const lo = i < a.length ? DIGITS.indexOf(a[i]) : 0;
      const hi = b != null && i < b.length ? DIGITS.indexOf(b[i]) : BASE;
      if (hi - lo > 1) return out + DIGITS[Math.floor((lo + hi) / 2)];
      out += DIGITS[lo];
      // Once we're below b's prefix, everything after is free.
      if (hi - lo === 1) b = null;
    }
  }

  // n evenly spaced keys, for re-ranking a whole column when neighbours have no usable rank.
  function spread(n) {
    const keys = [];
    for (let k = 1; k <= n; k++) {
      const slot = Math.floor((k * BASE * BASE) / (n + 1));
      const key = DIGITS[Math.floor(slot / BASE)] + DIGITS[slot % BASE];
      // Keys never end in '0' so there is always room below them ("a0" < "a0i" < "a1").
      keys.push(key.endsWith('0') ? key + 'i' : key);
    }
    return keys;
  }

  S.rank = { between, spread };
})();
