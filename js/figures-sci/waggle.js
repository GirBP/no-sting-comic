/* НЕ ЖАЛЬ — схема-«доказ»: waggle. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function waggle() {
    var A = 40; // кут між напрямком на сонце і на квітку
    var s = frame(T('Доказ №1 · мова координат', 'Exhibit 1 · language of coordinates'));

    // --- ЛІВА ПОЛОВИНА: зовнішній світ, вигляд згори ---
    s += tag(24, 44, T('Що бачить бджола надворі', 'What the bee sees outside'), { fill: 'var(--paper-dim)' });
    var hx = 92, hy = 218;               // вулик
    s += sun(46, 80, 14);
    s += tag(16, 116, T('Сонце', 'Sun'), { fill: 'var(--amber)' });

    // напрямок на сонце (від вулика)
    var sunDir = -15;                     // градусів від вертикалі (вліво)
    var pSun = pol(hx, hy, 128, sunDir);
    s += line(hx, hy, pSun.x, pSun.y, { stroke: 'var(--amber)', w: 1.8, dash: '6 5', cls: 'draw' });

    // напрямок на квітку
    var flwDir = sunDir + A;
    var pF = pol(hx, hy, 118, flwDir);
    s += line(hx, hy, pF.x, pF.y, { stroke: 'var(--amber)', w: 2.6, marker: 'arrow', cls: 'draw' });
    s += flower(pF.x + 5, pF.y - 12, 11);

    // кут α
    s += arc(hx, hy, 46, sunDir, flwDir, { stroke: 'var(--amber)', w: 2, cls: 'draw' });
    var pMid = pol(hx, hy, 64, sunDir + A / 2);
    s += txt(pMid.x, pMid.y + 4, 'α = ' + A + '°', { fill: 'var(--amber)', size: 14, weight: 700, anchor: 'middle' });

    s += hiveBox(hx, hy, 40, 28);
    s += tag(hx, hy + 42, T('Вулик', 'Hive'), { anchor: 'middle' });

    // роздільник
    s += '<path d="M240 40V254" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="4 6"/>';

    // --- ПРАВА ПОЛОВИНА: стільник у темряві ---
    s += tag(262, 44, T('Що вона танцює всередині', 'What she dances inside'), { fill: 'var(--paper-dim)' });
    s += '<g transform="translate(252 58)">' + hexes(6, 6, 10, 8, 15, 0.10) + '</g>';

    var cx = 368, cy = 166;
    // вертикаль = напрямок на сонце
    s += line(cx, cy - 92, cx, cy + 84, { stroke: 'var(--paper-dim)', w: 1.4, dash: '5 5' });
    s += tag(cx, cy - 100, T('Вгору = на сонце', 'Up = toward the sun'), { anchor: 'middle', fill: 'var(--amber)' });

    // гравітація
    s += line(272, 108, 272, 148, { stroke: 'var(--paper-dim)', w: 1.6, marker: 'arrow-paper' });
    s += tag(266, 102, T('Гравітація', 'Gravity'), { anchor: 'start' });

    // вісімка танцю під кутом α
    var runLen = 96, loopW = 40;
    var pTop = pol(cx, cy, runLen / 2, A);
    var pBot = pol(cx, cy, runLen / 2, A + 180);
    // петлі чіпляються НЕ на кінцях пробігу, а ближче до центру — тоді пробіг
    // виступає за них і читається як «пробіг + повернення», а не як овал
    var lTop = pol(cx, cy, runLen * 0.34, A);
    var lBot = pol(cx, cy, runLen * 0.34, A + 180);
    var perpL = pol(0, 0, loopW, A - 90), perpR = pol(0, 0, loopW, A + 90);
    [perpL, perpR].forEach(function (perp) {
      s += '<path class="draw" d="M' + lTop.x.toFixed(1) + ' ' + lTop.y.toFixed(1) +
        'C' + (lTop.x + perp.x) + ' ' + (lTop.y + perp.y) + ',' +
              (lBot.x + perp.x) + ' ' + (lBot.y + perp.y) + ',' + lBot.x.toFixed(1) + ' ' + lBot.y.toFixed(1) +
        '" fill="none" stroke="var(--amber)" stroke-opacity="0.40" stroke-width="1.8" stroke-dasharray="5 5"/>';
    });
    // виляючий пробіг — жирний
    s += line(pBot.x, pBot.y, pTop.x, pTop.y, { stroke: 'var(--amber)', w: 5, marker: 'arrow', cls: 'draw' });
    // «виляння» — зигзаг уздовж пробігу
    var zig = 'M' + pBot.x.toFixed(1) + ' ' + pBot.y.toFixed(1);
    for (var i = 1; i <= 9; i++) {
      var p = pol(cx, cy, -runLen / 2 + (runLen * i / 9), A);
      var off = (i % 2 ? 7 : -7);
      var perp = pol(0, 0, off, A + 90);
      zig += 'L' + (p.x + perp.x).toFixed(1) + ' ' + (p.y + perp.y).toFixed(1);
    }
    s += '<path class="draw" d="' + zig + '" fill="none" stroke="var(--paper)" stroke-width="1.6" opacity="0.8"/>';

    // кут α: тонкий продовжувач напрямку пробігу + дуга назовні від стрілки
    var pExt = pol(cx, cy, 78, A);
    s += '<path d="M' + cx + ' ' + cy + 'L' + pExt.x.toFixed(1) + ' ' + pExt.y.toFixed(1) +
      '" stroke="var(--amber)" stroke-width="1" stroke-dasharray="3 4" opacity="0.55" fill="none"/>';
    s += arc(cx, cy, 64, 0, A, { stroke: 'var(--amber)', w: 2, cls: 'draw' });
    var pM2 = pol(cx, cy, 82, A / 2);
    s += txt(pM2.x + 6, pM2.y - 4, 'α = ' + A + '°', { fill: 'var(--amber)', size: 14, weight: 700, anchor: 'start' });

    // --- НИЖНІЙ РЯДОК: тривалість = відстань ---
    s += '<path d="M24 264h432" stroke="var(--line)" stroke-width="1"/>';
    s += tag(24, 282, T('Тривалість виляння → відстань до квітки  ·  ~1 с ≈ 1 км',
                        'Waggle duration → distance to the flower  ·  ~1 s ≈ 1 km'),
      { fill: 'var(--paper-dim)' });
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.waggle = waggle;
})();
