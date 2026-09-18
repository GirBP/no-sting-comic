/* НЕ ЖАЛЬ — схема-«доказ»: botulism. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function botulism() {
    var s = frame(T('Застереження · не жарт', 'Warning · not a joke'));
    s += '<rect x="2" y="2" width="476" height="296" fill="none" stroke="var(--blood)" stroke-width="3"/>';
    // вік
    s += '<g transform="translate(40 72)">';
    s += tag(0, 0, T('Вік дитини', 'Child’s age'), { fill: 'var(--paper)' });
    s += '<rect x="0" y="14" width="180" height="24" fill="var(--blood)" opacity="0.75"/>';
    s += '<rect x="180" y="14" width="180" height="24" fill="var(--amber)" opacity="0.45"/>';
    s += line(180, 8, 180, 46, { stroke: 'var(--paper)', w: 2.4 });
    s += txt(180, 4, T('1 рік', '1 year'), { anchor: 'middle', size: 12, weight: 700, fill: 'var(--paper)', mono: true });
    s += tag(8, 58, T('меду не можна', 'no honey'), { fill: 'var(--blood)' });
    s += tag(352, 58, T('можна', 'allowed'), { anchor: 'end', fill: 'var(--amber)' });
    s += '</g>';
    // ланцюг механізму
    var steps = [
      { t: T('спори у меді', 'spores in honey'), c: 'var(--paper-dim)' },
      { t: T('незрілий кишківник', 'immature gut'), c: 'var(--paper-dim)' },
      { t: T('спори проростають', 'spores germinate'), c: 'var(--blood)' },
      { t: T('нейротоксин', 'neurotoxin'), c: 'var(--blood)' }
    ];
    s += '<g transform="translate(40 176)">';
    steps.forEach(function (st, i) {
      var x = i * 108;
      s += '<rect class="pop" x="' + x + '" y="0" width="92" height="52" fill="var(--ink-3)" stroke="' + st.c + '" stroke-width="1.8"/>';
      s += wrap2(x + 46, 24, st.t, { anchor: 'middle', size: 10, mono: true, weight: 700, fill: st.c, lh: 13 });
      if (i < 3) s += line(x + 94, 26, x + 106, 26, { stroke: 'var(--blood)', w: 1.8, marker: 'arrow-blood' });
    });
    s += '</g>';
    s += tag(40, 268, T('CDC і педіатри: жодного меду дітям до 1 року',
                        'CDC and paediatricians: no honey under age 1'), { fill: 'var(--blood)' });
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.botulism = botulism;
})();
