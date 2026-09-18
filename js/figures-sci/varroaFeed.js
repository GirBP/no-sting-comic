/* НЕ ЖАЛЬ — схема-«доказ»: varroaFeed. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function varroaFeed() {
    var s = frame(T('Доказ №3 · наука виправила себе, 2019', 'Exhibit 3 · science corrected itself, 2019'));
    // --- ЛІВОРУЧ: черевце бджоли в розрізі ---
    s += '<g transform="translate(24 62)">';
    var body = 'M18 88C18 36,58 8,110 8C162 8,202 36,202 88C202 140,162 172,110 172C58 172,18 140,18 88Z';
    s += '<defs><clipPath id="vf-clip"><path d="' + body + '"/></clipPath></defs>';
    s += '<path d="' + body + '" fill="url(#amber-vol)" stroke="var(--ink)" stroke-width="2.6"/>';
    // смуги — щоб читалось як черевце бджоли, а не як яйце
    for (var b = 0; b < 3; b++) {
      s += '<g clip-path="url(#vf-clip)"><rect x="0" y="' + (24 + b * 46) + '" width="220" height="17" fill="var(--ink)" opacity="0.85"/></g>';
    }
    s += '<g clip-path="url(#vf-clip)" opacity="0.14"><rect x="0" y="0" width="220" height="180" fill="url(#ht-mid)"/></g>';
    // жирове тіло — цільовий орган
    s += '<g clip-path="url(#vf-clip)">' +
      '<path class="pulse" d="M44 100C44 72,76 56,110 56C144 56,176 72,176 100C176 126,144 142,110 142C76 142,44 126,44 100Z" ' +
      'fill="var(--honey)" stroke="var(--paper)" stroke-width="1.6" stroke-dasharray="5 4"/></g>';
    s += tag(110, 100, T('жирове тіло', 'fat body'), { anchor: 'middle', fill: 'var(--paper)' });
    s += tag(110, 114, T('орган як печінка', 'a liver-like organ'), { anchor: 'middle', fill: 'var(--paper-dim)', size: 8 });
    // кліщ — крупно, на краю черевця
    s += '<g transform="translate(152 26)">';
    for (var i = 0; i < 4; i++) {
      var ly = -13 + i * 9;
      s += '<path d="M-28 ' + ly + 'q-12 ' + (i < 2 ? -6 : 6) + ',-20 ' + (i < 2 ? -10 : 10) + '" stroke="var(--blood)" stroke-width="3" fill="none" stroke-linecap="round"/>';
      s += '<path d="M28 ' + ly + 'q12 ' + (i < 2 ? -6 : 6) + ',20 ' + (i < 2 ? -10 : 10) + '" stroke="var(--blood)" stroke-width="3" fill="none" stroke-linecap="round"/>';
    }
    s += '<ellipse cx="0" cy="0" rx="31" ry="22" fill="url(#blood-vol)" stroke="var(--ink)" stroke-width="2.6"/>';
    s += '<ellipse cx="0" cy="0" rx="31" ry="22" fill="url(#ht-blood)" opacity="0.34"/>';
    s += '<path d="M-6 21l-3 9M6 21l3 9" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>';
    s += '</g>';
    // прокол → у жирове тіло
    s += line(152, 58, 132, 88, { stroke: 'var(--blood)', w: 2.6, marker: 'arrow-blood', cls: 'draw' });
    s += '</g>';

    // --- ПРАВОРУЧ: спростування + DWV ---
    s += '<g transform="translate(264 66)">';
    s += tag(0, 0, T('Було в підручниках', 'What textbooks said'), { fill: 'var(--paper-dim)' });
    s += '<path d="M0 8h186" stroke="var(--line)" stroke-width="1"/>';
    s += txt(0, 32, T('«п’є гемолімфу»', '“drinks hemolymph”'), { size: 14, fill: 'var(--paper-dim)' });
    s += line(-2, 27, 172, 27, { stroke: 'var(--blood)', w: 2.4 });
    s += tag(0, 62, 'Ramsey 2019, PNAS', { fill: 'var(--amber)' });
    s += txt(0, 88, T('їсть жирове тіло', 'eats the fat body'), { size: 17, weight: 700, fill: 'var(--amber)' });
    s += txt(0, 106, T('орган імунітету й зимових запасів', 'organ of immunity and winter reserves'), { size: 9.5, fill: 'var(--paper-dim)' });

    // DWV
    s += '<g transform="translate(0 126)">';
    s += '<rect x="0" y="0" width="186" height="78" fill="var(--ink-3)" stroke="var(--blood)" stroke-width="1.6"/>';
    s += tag(12, 20, T('+ заносить вірус DWV', '+ injects DWV virus'), { fill: 'var(--blood)' });
    s += beeIcon(36, 48, 0.85, 0, 'var(--paper-dim)');
    s += line(54, 48, 86, 48, { stroke: 'var(--blood)', w: 1.8, marker: 'arrow-blood' });
    s += '<g transform="translate(110 48)">' + beeIcon(0, 0, 0.85, 0, 'var(--paper-dim)') +
      '<path d="M4 -5q11 -3,14 4q-9 1,-14 -1" fill="var(--blood)" opacity="0.9"/></g>';
    s += tag(174, 68, T('деформовані крила', 'deformed wings'), { anchor: 'end', fill: 'var(--blood)', size: 8 });
    s += '</g></g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.varroaFeed = varroaFeed;
})();
