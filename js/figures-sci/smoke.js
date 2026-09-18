/* НЕ ЖАЛЬ — схема-«доказ»: smoke. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function smoke() {
    var s = frame(T('Доказ №8 · що робить дим', 'Exhibit 8 · what smoke does'));
    var yMid = 128;

    // --- 1. джерело тривоги ---
    s += tag(26, 62, T('Тривожний феромон', 'Alarm pheromone'), { fill: 'var(--blood)' });
    for (var m = 0; m < 4; m++) {
      s += '<circle class="pop" cx="' + (34 + m * 22) + '" cy="' + (yMid + (m % 2 ? -8 : 8)) + '" r="5.4" ' +
        'fill="var(--blood)" opacity="' + (0.9 - m * 0.1) + '"/>';
    }
    s += line(128, yMid, 158, yMid, { stroke: 'var(--blood)', w: 2, marker: 'arrow-blood' });

    // --- 2. димова завіса ---
    s += tag(176, 62, T('Дим', 'Smoke'), { fill: 'var(--paper-dim)' });
    s += '<rect x="168" y="74" width="112" height="120" fill="var(--paper-dim)" opacity="0.06"/>';
    for (var w = 0; w < 5; w++) {
      s += '<path d="M172 ' + (88 + w * 26) + 'q28 -13,54 2q26 15,52 -1" stroke="var(--paper-dim)" stroke-width="' + (6 - w * 0.7) + '" ' +
        'fill="none" opacity="' + (0.5 - w * 0.06) + '" stroke-linecap="round"/>';
    }
    // молекули не проходять — стоп-мітка
    s += '<circle cx="224" cy="' + yMid + '" r="15" fill="none" stroke="var(--blood)" stroke-width="2.4"/>';
    s += line(214, yMid - 10, 234, yMid + 10, { stroke: 'var(--blood)', w: 2.4 });

    // --- 3. вусик із рецепторами, які «не чують» ---
    s += tag(300, 62, T('Рецептори на вусику', 'Receptors on the antenna'), { fill: 'var(--paper)' });
    s += '<g transform="translate(300 84)">';
    s += '<path d="M8 104q34 -26,60 -42q22 -13,34 -34" stroke="var(--honey)" stroke-width="5" fill="none" stroke-linecap="round"/>';
    for (var i = 0; i < 6; i++) {
      var px = 16 + i * 15, py = 96 - i * 13;
      s += '<circle class="pop" cx="' + px + '" cy="' + py + '" r="4.8" fill="var(--paper-dim)" opacity="0.45" stroke="var(--line)" stroke-width="1.2"/>';
    }
    s += '</g>';
    s += tag(300, 208, T('сигнал не доходить', 'the signal never arrives'), { fill: 'var(--paper-dim)' });

    // --- висновок ---
    s += '<g transform="translate(26 224)">';
    s += '<rect x="0" y="0" width="428" height="54" fill="var(--ink-3)" stroke="var(--amber)" stroke-width="1.6"/>';
    s += tag(14, 22, T('Не паніка, а хімія: дим притуплює нюх — оборотно за 10–20 хв',
                       'Not panic but chemistry: smoke dulls smell — reversible in 10–20 min'), { fill: 'var(--amber)' });
    s += txt(14, 42, T('«думають про пожежу й наїдаються» — другорядне, не головний механізм',
                       '“they think of fire and gorge” — secondary, not the main mechanism'),
      { size: 10, fill: 'var(--paper-dim)' });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.smoke = smoke;
})();
