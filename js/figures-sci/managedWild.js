/* НЕ ЖАЛЬ — схема-«доказ»: managedWild. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function managedWild() {
    var s = frame(T('Доказ №7 · свійська тварина', 'Exhibit 7 · livestock'));
    // ліворуч: щільна пасіка
    s += tag(24, 62, T('Багато вуликів на малій площі', 'Many hives on a small area'), { fill: 'var(--paper)' });
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) {
      s += hiveBox(38 + c * 38, 78 + r * 46, 28, 22);
    }
    // праворуч: дикі
    s += tag(300, 62, T('Дикі й поодинокі бджоли', 'Wild and solitary bees'), { fill: 'var(--paper)' });
    var kinds = [[318, 96], [382, 88], [438, 104], [340, 156], [408, 162]];
    kinds.forEach(function (k, i) {
      s += beeIcon(k[0], k[1], 0.9 + (i % 3) * 0.18, (i * 27) % 40 - 20, 'var(--paper-dim)');
    });
    s += tag(300, 196, T('~20 000 видів у світі', '~20,000 species worldwide'), { fill: 'var(--paper-dim)' });

    // центр: спірний ресурс
    s += '<g transform="translate(240 128)">';
    s += flower(0, 0, 21, 'var(--amber)');
    s += tag(0, 46, T('обмежений ресурс', 'a limited resource'), { anchor: 'middle', fill: 'var(--paper-dim)' });
    s += '</g>';
    // стрілки конкуренції — з обох боків у квітку
    s += line(186, 128, 212, 128, { stroke: 'var(--amber)', w: 2.6, marker: 'arrow', cls: 'draw' });
    s += line(296, 128, 270, 128, { stroke: 'var(--paper-dim)', w: 2.6, marker: 'arrow-paper', cls: 'draw' });
    // + перенесення патогенів — окремим рівнем нижче, щоб не сперечалось із підписом
    s += line(146, 202, 300, 202, { stroke: 'var(--blood)', w: 1.8, dash: '5 4', marker: 'arrow-blood' });
    s += tag(146, 194, T('+ перенесення патогенів', '+ pathogen spillover'), { fill: 'var(--blood)', size: 8 });

    // низ
    s += '<g transform="translate(24 222)">';
    s += '<rect x="0" y="0" width="432" height="56" fill="var(--ink-3)" stroke="var(--amber)" stroke-width="1.4"/>';
    s += tag(14, 22, T('Медоносна — як корова: свійська, керована людиною',
                       'The honey bee is livestock — like a cow'), { fill: 'var(--amber)' });
    s += txt(14, 42, T('Рятувати запилення = зберігати ДИКИХ бджіл, а не лише ставити вулики',
                       'Saving pollination means conserving WILD bees, not just adding hives'),
      { size: 10, fill: 'var(--paper-dim)' });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.managedWild = managedWild;
})();
