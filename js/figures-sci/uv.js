/* НЕ ЖАЛЬ — схема-«доказ»: uv. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function uv() {
    var s = frame(T('Доказ №2 · інший спектр', 'Exhibit 2 · a different spectrum'));
    var x0 = 34, w = 274, yH = 80, yB = 158, h = 26;
    function nm(v) { return x0 + (v - 280) / (760 - 280) * w; }

    // підкладка спектру (те, що фізично існує)
    s += '<rect x="' + x0 + '" y="' + yH + '" width="' + w + '" height="' + h + '" fill="url(#spectrum)" opacity="0.22"/>';
    s += '<rect x="' + x0 + '" y="' + yB + '" width="' + w + '" height="' + h + '" fill="url(#spectrum)" opacity="0.22"/>';

    // --- ЛЮДИНА ---
    s += tag(x0, yH - 10, T('Людина · 390–750 нм', 'Human · 390–750 nm'), { fill: 'var(--paper)' });
    s += '<rect class="grow-x" x="' + nm(390) + '" y="' + yH + '" width="' + (nm(750) - nm(390)) + '" height="' + h + '" fill="url(#spectrum)"/>';
    s += '<rect x="' + x0 + '" y="' + yH + '" width="' + (nm(390) - x0) + '" height="' + h + '" fill="var(--ink)" opacity="0.8"/>';
    s += line(x0 + 2, yH + h + 6, nm(390) - 2, yH + h + 6, { stroke: 'var(--paper-dim)', w: 1.2 });
    s += tag((x0 + nm(390)) / 2, yH + h + 20, T('нам не видно', 'invisible to us'), { anchor: 'middle', fill: 'var(--paper-dim)', size: 8 });

    // --- БДЖОЛА ---
    s += tag(x0, yB - 10, T('Бджола · 300–650 нм', 'Bee · 300–650 nm'), { fill: 'var(--amber)' });
    s += '<rect class="grow-x" x="' + nm(300) + '" y="' + yB + '" width="' + (nm(650) - nm(300)) + '" height="' + h + '" fill="url(#spectrum)"/>';
    s += '<rect x="' + nm(650) + '" y="' + yB + '" width="' + (nm(760) - nm(650)) + '" height="' + h + '" fill="var(--ink)" opacity="0.82"/>';
    s += line(nm(650) + 2, yB + h + 6, nm(760) - 2, yB + h + 6, { stroke: 'var(--blood)', w: 1.2 });
    s += tag((nm(650) + nm(760)) / 2, yB + h + 20, T('сліпа до червоного', 'blind to red'), { anchor: 'middle', fill: 'var(--blood)', size: 8 });

    // рецептори — під шкалою, щоб не сперечалися із заголовком рядка
    [[344, 'УФ', 'UV'], [436, 'синій', 'blue'], [544, 'зелений', 'green']].forEach(function (r) {
      s += line(nm(r[0]), yB + h, nm(r[0]), yB + h + 6, { stroke: 'var(--amber)', w: 1.6 });
      s += '<circle cx="' + nm(r[0]).toFixed(1) + '" cy="' + (yB + h + 9) + '" r="2.6" fill="var(--amber)"/>';
      s += tag(nm(r[0]), yB + h + 22, T(r[1], r[2]), { anchor: 'middle', fill: 'var(--amber)', size: 8 });
    });
    s += tag(x0, yB + h + 22, T('рецептори:', 'receptors:'), { fill: 'var(--paper-dim)', size: 8 });

    // --- вісь довжини хвилі ---
    var yAx = 232;
    s += line(x0, yAx, x0 + w, yAx, { stroke: 'var(--paper-dim)', w: 1.2 });
    [300, 400, 500, 600, 700].forEach(function (v) {
      s += line(nm(v), yAx, nm(v), yAx + 5, { stroke: 'var(--paper-dim)', w: 1.2 });
      s += txt(nm(v), yAx + 17, String(v), { anchor: 'middle', size: 9, mono: true, fill: 'var(--paper-dim)' });
    });
    s += tag(x0, yAx + 34, T('довжина хвилі, нм', 'wavelength, nm'), { fill: 'var(--paper-dim)', size: 8 });

    // --- квітка: у нашому світлі vs в УФ ---
    s += '<g transform="translate(392 96)">';
    s += flower(0, 0, 21, 'var(--paper-dim)');
    s += tag(0, 42, T('як бачимо ми', 'as we see it'), { anchor: 'middle' });
    s += '</g>';
    s += '<g transform="translate(392 196)">';
    s += flower(0, 0, 21, 'var(--amber)');
    for (var i = 0; i < 6; i++) {
      var a = i * 60 * Math.PI / 180;
      s += '<path d="M0 0L' + (Math.cos(a) * 18).toFixed(1) + ' ' + (Math.sin(a) * 18).toFixed(1) +
        '" stroke="var(--ink)" stroke-width="3.4" opacity="0.8"/>';
    }
    s += '<circle cx="0" cy="0" r="7.5" fill="var(--ink)"/>';
    s += tag(0, 42, T('як бачить бджола', 'as the bee sees it'), { anchor: 'middle', fill: 'var(--amber)' });
    s += tag(0, 54, T('УФ-«посадкові смуги»', 'UV “landing strips”'), { anchor: 'middle', fill: 'var(--paper-dim)', size: 8 });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.uv = uv;
})();
