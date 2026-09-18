/* НЕ ЖАЛЬ — схема-«доказ»: honeyPreserve. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function honeyPreserve() {
    var s = frame(T('Доказ №6 · три замки', 'Exhibit 6 · three locks'));
    var locks = [
      { x: 86, v: T('17–18 %', '17–18 %'), k: T('вологість', 'moisture'), d: T('мікробам нема води', 'no water for microbes') },
      { x: 240, v: 'pH 3,2–4,5', k: T('кислотність', 'acidity'), d: T('кисле середовище', 'acidic environment') },
      { x: 394, v: 'H₂O₂', k: T('перекис', 'peroxide'), d: T('фермент бджоли', 'the bee’s enzyme') }
    ];
    locks.forEach(function (l) {
      s += '<g transform="translate(' + l.x + ' 76)">';
      s += '<circle class="pop" cx="0" cy="0" r="34" fill="var(--ink-3)" stroke="var(--amber)" stroke-width="2.4"/>';
      s += '<circle cx="0" cy="0" r="34" fill="url(#ht-mid)" opacity="0.28"/>';
      s += txt(0, 5, l.v, { anchor: 'middle', size: 14, weight: 700, fill: 'var(--amber)', mono: true });
      s += tag(0, 52, l.k, { anchor: 'middle', fill: 'var(--paper)' });
      s += txt(0, 68, l.d, { anchor: 'middle', size: 9, fill: 'var(--paper-dim)' });
      s += '</g>';
    });
    // шкала вологості з порогом бродіння
    s += '<g transform="translate(60 194)">';
    s += tag(0, -28, T('Але якщо тара відкрита — мед тягне воду з повітря',
                       'But in an open jar honey pulls water from the air'), { fill: 'var(--paper-dim)' });
    s += '<rect x="0" y="0" width="360" height="26" fill="var(--ink-3)" stroke="var(--line)" stroke-width="1.4"/>';
    s += '<rect class="grow-x" x="0" y="0" width="216" height="26" fill="var(--amber)" opacity="0.55"/>';
    s += '<rect class="grow-x" x="216" y="0" width="144" height="26" fill="var(--blood)" opacity="0.6"/>';
    s += line(216, -4, 216, 32, { stroke: 'var(--paper)', w: 2 });
    s += txt(216, -9, '19 %', { anchor: 'middle', size: 12, weight: 700, fill: 'var(--paper)', mono: true });
    s += tag(8, 44, T('стабільний — тисячоліття', 'stable — for millennia'), { fill: 'var(--amber)' });
    s += tag(352, 44, T('бродить', 'ferments'), { anchor: 'end', fill: 'var(--blood)' });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.honeyPreserve = honeyPreserve;
})();
