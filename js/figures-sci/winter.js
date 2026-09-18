/* НЕ ЖАЛЬ — схема-«доказ»: winter. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function winter() {
    var s = frame(T('Доказ №5 · зима без сплячки', 'Exhibit 5 · winter without hibernation'));
    var cx = 150, cy = 176;
    // мороз навколо
    s += '<rect x="16" y="42" width="270" height="242" fill="#0d1420" opacity="0.55"/>';
    for (var i = 0; i < 7; i++) {
      var fx = 30 + i * 38;
      s += '<path d="M' + fx + ' 58l0 12M' + (fx - 5) + ' 61l10 6M' + (fx - 5) + ' 67l10 -6" stroke="#8fb4d9" stroke-width="1.2" opacity="0.5"/>';
    }
    s += tag(26, 88, T('−20 °C надворі', '−20 °C outside'), { fill: '#8fb4d9' });

    // клуб: концентричні шари
    s += '<circle class="pulse" cx="' + cx + '" cy="' + cy + '" r="78" fill="url(#thermal)" opacity="0.6"/>';
    [[78, '#241a10'], [58, 'var(--honey)'], [38, 'var(--amber-deep)'], [20, '#ffd24a']].forEach(function (r) {
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r[0] + '" fill="none" stroke="' + r[1] + '" stroke-width="1.6" opacity="0.85"/>';
    });
    // бджоли в клубі
    for (var ring = 0; ring < 3; ring++) {
      var rr = 31 + ring * 22, n = 8 + ring * 5;
      for (var k = 0; k < n; k++) {
        var a = (k / n) * 360 + ring * 12;
        var p = pol(cx, cy, rr, a);
        s += beeIcon(p.x, p.y, 0.40, a, ring === 0 ? '#ffd24a' : 'var(--amber-deep)');
      }
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="var(--amber)" stroke="var(--ink)" stroke-width="1.6"/>';
    s += tag(cx, cy + 4, T('матка', 'queen'), { anchor: 'middle', fill: 'var(--ink)', size: 8 });

    // шкала температур — вертикальний лінійний градієнт (не радіальний)
    s += '<defs><linearGradient id="thermo-bar" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#ffd24a"/><stop offset="0.45" stop-color="var(--amber-deep)"/>' +
      '<stop offset="1" stop-color="#26364a"/></linearGradient></defs>';
    s += '<g transform="translate(306 70)">';
    s += tag(0, 0, T('Температура в клубі', 'Temperature in the cluster'), { fill: 'var(--paper)' });
    s += '<rect x="0" y="14" width="26" height="170" fill="url(#thermo-bar)" stroke="var(--line)" stroke-width="1"/>';
    [['~35 °C', 26, T('ядро', 'core')], ['~20 °C', 100, T('середина', 'middle')], ['~10 °C', 172, T('мантія', 'mantle')]].forEach(function (m) {
      s += line(26, m[1], 36, m[1], { stroke: 'var(--paper-dim)', w: 1.2 });
      s += txt(42, m[1] + 4, m[0], { size: 11, fill: 'var(--paper)', mono: true });
      s += tag(42, m[1] + 17, m[2], { fill: 'var(--paper-dim)', size: 8 });
    });
    s += '</g>';
    s += tag(26, 274, T('Тепло — від тремтіння літальних м’язів. Пальне — мед.',
                        'Heat comes from shivering flight muscles. Fuel: honey.'), { fill: 'var(--amber)' });
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.winter = winter;
})();
