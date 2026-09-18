/* НЕ ЖАЛЬ — схема-«доказ»: hotBall. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function hotBall() {
    var s = frame(T('Доказ №9 · уміння, якого в нашої немає', 'Exhibit 9 · a skill ours lacks'));
    // ліворуч: cerana
    s += '<g transform="translate(120 148)">';
    s += tag(0, -96, T('Apis cerana (Азія)', 'Apis cerana (Asia)'), { anchor: 'middle', fill: 'var(--amber)' });
    s += '<circle class="pulse" cx="0" cy="0" r="66" fill="url(#thermal)" opacity="0.75"/>';
    for (var k = 0; k < 26; k++) {
      var a = (k / 26) * 360;
      var rr = 42 + (k % 3) * 11;
      var p = pol(0, 0, rr, a);
      s += beeIcon(p.x, p.y, 0.42, a, '#ffd24a');
    }
    s += '<ellipse cx="0" cy="0" rx="18" ry="12" fill="var(--ink)" opacity="0.9"/>';
    s += txt(0, 4, '46 °C', { anchor: 'middle', size: 12, weight: 700, fill: '#ffd24a', mono: true });
    s += tag(0, 88, T('шершень гине', 'the hornet dies'), { anchor: 'middle', fill: 'var(--amber)' });
    s += tag(0, 102, T('46 °C + CO₂', '46 °C + CO₂'), { anchor: 'middle', fill: 'var(--paper-dim)' });
    s += '</g>';
    s += '<path d="M240 60V262" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="4 6"/>';
    // праворуч: mellifera
    s += '<g transform="translate(360 148)">';
    s += tag(0, -96, T('Apis mellifera (наша)', 'Apis mellifera (ours)'), { anchor: 'middle', fill: 'var(--blood)' });
    s += '<circle cx="0" cy="0" r="66" fill="var(--ink-3)" stroke="var(--line)" stroke-width="1.4" stroke-dasharray="5 6"/>';
    for (var k2 = 0; k2 < 10; k2++) {
      var a2 = (k2 / 10) * 360;
      var p2 = pol(0, 0, 50, a2);
      s += beeIcon(p2.x, p2.y, 0.42, a2, 'var(--paper-dim)');
    }
    // шершень
    s += '<g transform="translate(0 0)">';
    s += '<ellipse cx="0" cy="0" rx="22" ry="13" fill="var(--blood)" stroke="var(--ink)" stroke-width="2"/>';
    s += '<rect x="-22" y="-4" width="44" height="3" fill="var(--ink)"/>';
    s += '<rect x="-22" y="2" width="44" height="3" fill="var(--ink)"/>';
    s += '</g>';
    s += tag(0, 88, T('прийом значно слабший', 'the move is far weaker'), { anchor: 'middle', fill: 'var(--blood)' });
    s += tag(0, 102, T('тому чужий шершень — загроза', 'so an alien hornet is a real threat'), { anchor: 'middle', fill: 'var(--paper-dim)' });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.hotBall = hotBall;
})();
