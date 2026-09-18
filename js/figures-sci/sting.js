/* НЕ ЖАЛЬ — схема-«доказ»: sting. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function sting() {
    var s = frame(T('Доказ №4 · чому гине не завжди', 'Exhibit 4 · why she doesn’t always die'));
    // ЛІВОРУЧ: шкіра ссавця
    s += '<g transform="translate(24 62)">';
    s += tag(0, 0, T('Шкіра ссавця — еластична', 'Mammal skin — elastic'), { fill: 'var(--paper)' });
    s += '<rect x="0" y="18" width="196" height="52" fill="var(--honey)" opacity="0.35"/>';
    // волокна
    for (var i = 0; i < 9; i++) {
      s += '<path d="M' + (10 + i * 22) + ' 18q6 26,0 52" stroke="var(--paper-dim)" stroke-width="1.2" fill="none" opacity="0.5"/>';
    }
    // жало з зазубринами, застрягло
    s += '<g transform="translate(98 4)">';
    s += '<path d="M0 0v78" stroke="var(--paper)" stroke-width="5" stroke-linecap="round"/>';
    for (var b = 0; b < 5; b++) {
      var by = 26 + b * 11;
      s += '<path d="M0 ' + by + 'l-7 -6M0 ' + by + 'l7 -6" stroke="var(--paper)" stroke-width="2.8" stroke-linecap="round"/>';
    }
    s += '</g>';
    s += tag(98, 92, T('зазубрини чіпляються', 'barbs catch'), { anchor: 'middle', fill: 'var(--blood)' });
    s += tag(98, 106, T('апарат відривається', 'the sting tears free'), { anchor: 'middle', fill: 'var(--blood)' });
    s += '</g>';

    // роздільник
    s += '<path d="M240 56V254" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="4 6"/>';

    // ПРАВОРУЧ: кутикула комахи
    s += '<g transform="translate(262 62)">';
    s += tag(0, 0, T('Кутикула комахи — тверда', 'Insect cuticle — rigid'), { fill: 'var(--paper)' });
    s += '<rect x="0" y="18" width="196" height="52" fill="var(--ink-3)" stroke="var(--paper-dim)" stroke-width="1.4"/>';
    for (var j = 0; j < 5; j++) {
      s += '<path d="M0 ' + (26 + j * 11) + 'h196" stroke="var(--paper-dim)" stroke-width="0.8" opacity="0.35"/>';
    }
    s += '<g transform="translate(98 4)">';
    s += '<path d="M0 0v58" stroke="var(--paper)" stroke-width="5" stroke-linecap="round"/>';
    for (var b2 = 0; b2 < 3; b2++) {
      var by2 = 26 + b2 * 11;
      s += '<path d="M0 ' + by2 + 'l-7 -6M0 ' + by2 + 'l7 -6" stroke="var(--paper)" stroke-width="2.8" stroke-linecap="round"/>';
    }
    s += '</g>';
    // стрілка «виходить назад» — уздовж жала, вгору
    s += line(122, 66, 122, 24, { stroke: 'var(--amber)', w: 2.2, marker: 'arrow' });
    s += tag(98, 92, T('ковзає й виходить', 'slides back out'), { anchor: 'middle', fill: 'var(--amber)' });
    s += tag(98, 106, T('бджола виживає', 'the bee survives'), { anchor: 'middle', fill: 'var(--amber)' });
    s += '</g>';

    // низ: матка
    s += '<g transform="translate(24 196)">';
    s += '<rect x="0" y="0" width="432" height="54" fill="var(--ink-3)" stroke="var(--amber)" stroke-width="1.4"/>';
    s += '<g transform="translate(40 27)"><path d="M0 -16v32" stroke="var(--amber)" stroke-width="5" stroke-linecap="round"/></g>';
    s += tag(70, 22, T('Жало матки — гладке, без зазубрин', 'The queen’s sting — smooth, no barbs'), { fill: 'var(--amber)' });
    s += txt(70, 40, T('вона жалить багато разів і не гине', 'she can sting many times and survive'), { size: 11, fill: 'var(--paper-dim)' });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.sting = sting;
})();
