/* НЕ ЖАЛЬ — схема-«доказ»: dialects. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function dialects() {
    var s = frame(T('Доказ №11 · танцю вчаться', 'Exhibit 11 · the dance is learned'));
    // з наставницею
    s += '<g transform="translate(40 76)">';
    s += tag(0, 0, T('Молода бачила досвідчених', 'Young bee watched experienced dancers'), { fill: 'var(--amber)' });
    s += beeIcon(40, 60, 1.5, -15, 'var(--amber)');
    s += beeIcon(96, 60, 1.1, -15, 'var(--paper-dim)');
    s += line(58, 60, 82, 60, { stroke: 'var(--amber)', w: 1.6, marker: 'arrow' });
    s += '<g transform="translate(150 60)">' +
      '<path d="M0 26C-22 14,-22 -10,0 -20C22 -10,22 14,0 26Z" fill="none" stroke="var(--amber)" stroke-width="2"/>' +
      '<path d="M0 26V-20" stroke="var(--amber)" stroke-width="3.4"/></g>';
    s += tag(150, 104, T('точне кодування', 'accurate coding'), { anchor: 'middle', fill: 'var(--amber)' });
    s += '</g>';
    s += '<path d="M240 60V254" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="4 6"/>';
    // без наставниці
    s += '<g transform="translate(262 76)">';
    s += tag(0, 0, T('Виросла без наставниць', 'Grew up with no teachers'), { fill: 'var(--blood)' });
    s += beeIcon(50, 60, 1.1, -15, 'var(--paper-dim)');
    s += '<g transform="translate(150 60)">' +
      '<path d="M0 26C-26 10,-16 -14,0 -20C26 -6,14 18,0 26Z" fill="none" stroke="var(--blood)" stroke-width="2" stroke-dasharray="4 4"/>' +
      '<path d="M-6 26L4 -20" stroke="var(--blood)" stroke-width="3.4"/></g>';
    s += tag(150, 104, T('стійка помилка відстані', 'lasting distance error'), { anchor: 'middle', fill: 'var(--blood)' });
    s += '</g>';
    s += '<g transform="translate(40 214)">';
    s += '<rect x="0" y="0" width="400" height="60" fill="var(--ink-3)" stroke="var(--amber)" stroke-width="1.4"/>';
    s += tag(12, 22, T('Основа вроджена — але точність приходить із соціальним навчанням',
                       'The basics are innate — accuracy comes from social learning'), { fill: 'var(--amber)' });
    s += txt(12, 42, T('звідси й локальні «діалекти» танцю  ·  Dong et al., Science 2023',
                       'hence local dance “dialects”  ·  Dong et al., Science 2023'), { size: 10, fill: 'var(--paper-dim)' });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.dialects = dialects;
})();
