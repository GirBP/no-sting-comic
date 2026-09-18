/*
 * НЕ ЖАЛЬ — портрети касту v2: нуарні кадри досьє, а не ентомологічна таблиця.
 *
 * Кожен портрет — комікс-панель: стіна з мугшот-лінійкою в РЕАЛЬНИХ міліметрах
 * (науково чесний масштаб: у кадрі матки лінійка дрібніша, ніж у робочої),
 * конус прожектора, тінь персонажа на стіні (spot black), віньєтка,
 * крупне кадрування — персонаж має право виходити за рамку.
 * viewBox 0 0 200 300. Вісь тіла більшості — x=100 до трансформації.
 */
window.NZ_CAST_ART = (function () {
  var CX = 100;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ==========================================================
  // СЦЕНА: стіна + лінійка (мм) + прожектор + віньєтка
  // ==========================================================
  // pxPerMM — масштаб кадру: скільки px в 1 мм. Лінії кожні 5 мм, підписи мм.
  // beamX — куди світить прожектор. tint 'amber' | 'blood'.
  function stage(id, o) {
    o = o || {};
    var px = o.pxPerMM || 14;
    var tint = o.tint === 'blood' ? 'var(--blood)' : 'var(--amber)';
    var s = '';

    // стіна
    s += '<rect x="0" y="0" width="200" height="300" fill="var(--ink-2)"/>';

    // мугшот-лінійка: горизонталі кожні 5 мм, нуль унизу кадру (y=272)
    var y0 = 272, mm = 0, yy;
    s += '<g font-family="var(--font-mono)" font-size="7" fill="var(--paper-dim)">';
    while ((yy = y0 - mm * px) > 16) {
      var major = (mm % 10 === 0);
      s += '<line x1="0" y1="' + yy.toFixed(1) + '" x2="' + (major ? 200 : 14) + '" y2="' + yy.toFixed(1) +
           '" stroke="var(--line)" stroke-width="' + (major ? 1 : 0.7) + '" opacity="' + (major ? 0.55 : 0.8) + '"/>';
      if (major && mm > 0) s += '<text x="4" y="' + (yy - 3).toFixed(1) + '" opacity="0.9">' + mm + '</text>';
      mm += 5;
    }
    s += '<text x="4" y="' + (y0 + 10) + '" opacity="0.7">mm</text>';
    s += '</g>';

    // конус прожектора згори
    var bx = o.beamX != null ? o.beamX : 100;
    s += '<defs><linearGradient id="' + id + '-beam" x1="0" y1="0" x2="0" y2="1">' +
         '<stop offset="0" stop-color="' + tint + '" stop-opacity="0.30"/>' +
         '<stop offset="0.55" stop-color="' + tint + '" stop-opacity="0.10"/>' +
         '<stop offset="1" stop-color="' + tint + '" stop-opacity="0"/></linearGradient>' +
         '<radialGradient id="' + id + '-vig" cx="50%" cy="42%" r="75%">' +
         '<stop offset="0.55" stop-color="#000" stop-opacity="0"/>' +
         '<stop offset="1" stop-color="#000" stop-opacity="0.78"/></radialGradient></defs>';
    s += '<polygon points="' + (bx - 26) + ',0 ' + (bx + 26) + ',0 ' + (bx + 88) + ',300 ' + (bx - 88) + ',300" ' +
         'fill="url(#' + id + '-beam)"/>';
    // світла пляма на «підлозі» кадру
    s += '<ellipse cx="' + bx + '" cy="278" rx="86" ry="20" fill="' + tint + '" opacity="0.07"/>';
    return s;
  }
  function vignette(id) {
    return '<rect x="0" y="0" width="200" height="300" fill="url(#' + id + '-vig)"/>' +
           '<rect x="0" y="0" width="200" height="300" fill="url(#ht-paper)" opacity="0.05"/>';
  }

  // ==========================================================
  // ТІЛО БДЖОЛИ (дорсально). Товсті контури, чисті форми.
  // ==========================================================
  function abdomenPath(top, len, w, shape) {
    if (shape === 'blunt') {
      return 'M' + (CX - w) + ' ' + top +
        'C' + (CX - w) + ' ' + (top + len * 0.72) + ',' + (CX - w * 0.88) + ' ' + (top + len) + ',' + CX + ' ' + (top + len) +
        'C' + (CX + w * 0.88) + ' ' + (top + len) + ',' + (CX + w) + ' ' + (top + len * 0.72) + ',' + (CX + w) + ' ' + top + 'Z';
    }
    return 'M' + (CX - w) + ' ' + top +
      'C' + (CX - w) + ' ' + (top + len * 0.46) + ',' + (CX - w * 0.70) + ' ' + (top + len * 0.84) + ',' + CX + ' ' + (top + len) +
      'C' + (CX + w * 0.70) + ' ' + (top + len * 0.84) + ',' + (CX + w) + ' ' + (top + len * 0.46) + ',' + (CX + w) + ' ' + top + 'Z';
  }
  function stripes(id, top, len, bands) {
    var out = '<g clip-path="url(#' + id + '-clip)">';
    var h = len / (bands * 2 - 0.4);
    for (var i = 0; i < bands; i++) {
      var y = top + h * (i * 2);
      out += '<rect x="0" y="' + y.toFixed(1) + '" width="200" height="' + h.toFixed(1) + '" fill="var(--ink)" opacity="0.92"/>';
    }
    return out + '</g>';
  }

  // Крило: вузьке, прозоре, з чітким світлим контуром і 3 жилками.
  function wing(side, x, y, len, tilt) {
    var s = side, w = len * 0.38;
    var d = 'M' + x + ' ' + y +
      'C' + (x + s * w * 0.9) + ' ' + (y - len * 0.10) + ',' +
            (x + s * w * 1.75) + ' ' + (y + len * 0.22) + ',' +
            (x + s * w * 1.55) + ' ' + (y + len * 0.66) +
      'C' + (x + s * w * 1.38) + ' ' + (y + len * 0.94) + ',' +
            (x + s * w * 0.40) + ' ' + (y + len * 0.62) + ',' +
            (x + s * 3) + ' ' + (y + len * 0.12) + 'Z';
    var veins = '';
    for (var i = 1; i <= 3; i++) {
      var f = i / 4;
      veins += '<path d="M' + (x + s * 5) + ' ' + (y + len * 0.08) +
        'Q' + (x + s * w * (0.85 + f * 0.55)) + ' ' + (y + len * (0.18 + f * 0.26)) + ',' +
              (x + s * w * (1.12 + f * 0.36)) + ' ' + (y + len * (0.46 + f * 0.20)) +
        '" fill="none" stroke="var(--paper)" stroke-opacity="0.5" stroke-width="0.9"/>';
    }
    return '<g transform="rotate(' + (-s * tilt) + ' ' + x + ' ' + y + ')">' +
      '<path d="' + d + '" fill="var(--paper)" fill-opacity="0.10" ' +
      'stroke="var(--paper)" stroke-opacity="0.65" stroke-width="1.3"/>' + veins + '</g>';
  }

  // Нога: три сегменти, товста, з колінами.
  function leg(side, x, y, len, spread, thick) {
    var s = side;
    return '<path d="M' + x + ' ' + y +
      'l' + (s * len * 0.42) + ' ' + (len * 0.20) +
      'l' + (s * len * 0.30) + ' ' + (len * spread) +
      'l' + (s * len * 0.34) + ' ' + (len * 0.16) +
      '" fill="none" stroke="var(--honey)" stroke-width="' + thick + '" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function antenna(side, x, y) {
    var s = side;
    return '<path d="M' + x + ' ' + y +
      'q' + (s * 12) + ' -10,' + (s * 18) + ' -19' +
      'q' + (s * 5) + ' -7,' + (s * 4) + ' -14' +
      '" fill="none" stroke="var(--honey)" stroke-width="3" stroke-linecap="round"/>';
  }

  // Іменовані константи геометрії buildBee() — заміняють магічні числа нижче.
  var STROKE_BODY = 3.4;       // товщина контуру великих частин тіла (черевце/груди/голова)
  var LEG_THICK = 4.4;         // товщина лінії ноги
  var LEG_LEN_HIND = 36;       // довжина задньої ноги (несе кошик), px
  var LEG_LEN_OTHER = 28;      // довжина передньої/середньої ноги, px
  var LEG_SPREAD_HIND = 0.62;  // коефіцієнт вигину задньої ноги (передається в leg())
  var LEG_SPREAD_OTHER = 0.5;  // коефіцієнт вигину передньої/середньої ноги
  var CORBICULA_R = 10;        // радіус кошика для пилку, px
  var CORBICULA_ALONG = 0.72;  // зсув кошика вздовж задньої ноги, частка LEG_LEN_HIND
  var CORBICULA_ACROSS = 0.82; // зсув кошика впоперек задньої ноги, частка LEG_LEN_HIND
  var THORAX_FUZZ_COUNT = 6;   // кількість пасом ворсу на грудях замість «їжачка»

  // ноги (за тілом) + кошик для пилку в робочої
  function buildLegs(cfg) {
    var tw = cfg.thoraxHalf, tt = cfg.thoraxTop, tb = cfg.thoraxBot;
    var s = '';
    var legY = [tt + 8, (tt + tb) / 2, tb - 4];
    for (var i = 0; i < 3; i++) {
      var isHind = i === 2;
      var len = isHind ? LEG_LEN_HIND : LEG_LEN_OTHER;
      var spread = isHind ? LEG_SPREAD_HIND : LEG_SPREAD_OTHER;
      s += leg(-1, CX - tw + 3, legY[i], len, spread, LEG_THICK);
      s += leg(1, CX + tw - 3, legY[i], len, spread, LEG_THICK);
    }
    if (cfg.corbicula) {
      var pxx = CX + tw - 3 + LEG_LEN_HIND * CORBICULA_ALONG, pyy = legY[2] + LEG_LEN_HIND * CORBICULA_ACROSS;
      s += '<circle cx="' + pxx.toFixed(1) + '" cy="' + pyy.toFixed(1) + '" r="' + CORBICULA_R + '" fill="url(#amber-vol)" stroke="var(--ink)" stroke-width="2"/>' +
           '<circle cx="' + pxx.toFixed(1) + '" cy="' + pyy.toFixed(1) + '" r="' + CORBICULA_R + '" fill="url(#ht-fine)" opacity="0.5"/>' +
           '<circle cx="' + (pxx - 3).toFixed(1) + '" cy="' + (pyy - 3).toFixed(1) + '" r="2.8" fill="var(--paper)" opacity="0.4"/>';
    }
    return s;
  }

  // черевце: заливка+контур, смуги, halftone, блік від прожектора
  function buildAbdomen(id, cfg, abd) {
    var at = cfg.abdTop, al = cfg.abdLen, aw = cfg.abdHalf;
    var s = '';
    s += '<path d="' + abd + '" fill="url(#amber-vol)" stroke="var(--ink)" stroke-width="' + STROKE_BODY + '" stroke-linejoin="round"/>';
    s += stripes(id, at, al, cfg.bands);
    s += '<g clip-path="url(#' + id + '-clip)" opacity="0.15">' +
         '<rect x="0" y="' + at + '" width="200" height="' + (al + 4) + '" fill="url(#ht-mid)"/></g>';
    // блік уздовж лівого боку черевця — світло від прожектора
    s += '<g clip-path="url(#' + id + '-clip)"><path d="M' + (CX - aw + 5) + ' ' + (at + 4) +
         'q-4 ' + (al * 0.4) + ',' + (aw * 0.28) + ' ' + (al * 0.9) +
         '" fill="none" stroke="var(--paper)" stroke-opacity="0.22" stroke-width="7" stroke-linecap="round"/></g>';
    return s;
  }

  // жало: гладке (матка) або з зазубринами (робоча)
  function buildSting(cfg) {
    if (!cfg.sting) return '';
    var s = '';
    var sy = cfg.abdTop + cfg.abdLen;
    s += '<path d="M' + CX + ' ' + (sy - 2) + 'l0 ' + cfg.sting + '" stroke="var(--paper)" stroke-width="3.4" stroke-linecap="round"/>';
    if (cfg.stingBarbs) for (var b = 1; b <= 3; b++) {
      var by = sy + cfg.sting * (b / 4);
      s += '<path d="M' + CX + ' ' + by.toFixed(1) + 'l-3.6 -2.8M' + CX + ' ' + by.toFixed(1) + 'l3.6 -2.8" stroke="var(--paper)" stroke-width="1.8" stroke-linecap="round"/>';
    }
    return s;
  }

  // крила ПОВЕРХ черевця, розкриті
  function buildWings(cfg) {
    return wing(-1, CX - 7, cfg.wingY, cfg.wingLen, cfg.wingTilt) +
           wing(1, CX + 7, cfg.wingY, cfg.wingLen, cfg.wingTilt);
  }

  // груди (перекривають корені крил і стик із головою): заливка, ворс, halftone, блік
  function buildThorax(cfg) {
    var tw = cfg.thoraxHalf, tt = cfg.thoraxTop, tb = cfg.thoraxBot;
    var cy = (tt + tb) / 2, ry = (tb - tt) / 2;
    var s = '';
    s += '<ellipse cx="' + CX + '" cy="' + cy + '" rx="' + tw + '" ry="' + ry +
         '" fill="url(#amber-vol)" stroke="var(--ink)" stroke-width="' + STROKE_BODY + '"/>';
    for (var f = 0; f < THORAX_FUZZ_COUNT; f++) {
      var ang = (-135 + f * 54) * Math.PI / 180;
      var ex = CX + Math.cos(ang) * (tw - 2), ey = cy + Math.sin(ang) * (ry - 2);
      s += '<path d="M' + ex.toFixed(1) + ' ' + ey.toFixed(1) +
        ' q' + (Math.cos(ang) * 7).toFixed(1) + ' ' + (Math.sin(ang) * 7).toFixed(1) + ',' +
        (Math.cos(ang) * 9 + 3).toFixed(1) + ' ' + (Math.sin(ang) * 9).toFixed(1) +
        '" fill="none" stroke="var(--honey)" stroke-width="2.6" stroke-linecap="round" opacity="0.9"/>';
    }
    s += '<ellipse cx="' + CX + '" cy="' + cy + '" rx="' + (tw - 4) + '" ry="' + (ry - 4) +
         '" fill="url(#ht-fine)" opacity="0.35"/>';
    // блік на грудях
    s += '<ellipse cx="' + (CX - tw * 0.35) + '" cy="' + (tt + (tb - tt) * 0.3) + '" rx="' + (tw * 0.24) + '" ry="' + ((tb - tt) * 0.12) +
         '" fill="var(--paper)" opacity="0.13" transform="rotate(-18 ' + (CX - tw * 0.35) + ' ' + (tt + (tb - tt) * 0.3) + ')"/>';
    return s;
  }

  // голова (перекриває верх грудей — стик схований): контур, очі, вусики, хоботок
  function buildHead(cfg) {
    var hw = cfg.headHalf, ht = cfg.headTop, hb = cfg.headBot;
    var s = '';
    s += '<path d="M' + (CX - hw) + ' ' + (hb - 4) +
         'C' + (CX - hw) + ' ' + (ht + 4) + ',' + (CX - hw * 0.6) + ' ' + ht + ',' + CX + ' ' + ht +
         'C' + (CX + hw * 0.6) + ' ' + ht + ',' + (CX + hw) + ' ' + (ht + 4) + ',' + (CX + hw) + ' ' + (hb - 4) +
         'Q' + CX + ' ' + (hb + 6) + ',' + (CX - hw) + ' ' + (hb - 4) + 'Z" ' +
         'fill="url(#amber-vol)" stroke="var(--ink)" stroke-width="' + STROKE_BODY + '" stroke-linejoin="round"/>';

    if (cfg.eyes === 'wrap') {
      s += '<path d="M' + (CX - hw + 3) + ' ' + (hb - 7) +
           'C' + (CX - hw + 2) + ' ' + (ht + 6) + ',' + (CX - hw * 0.32) + ' ' + (ht + 1) + ',' + (CX - 1) + ' ' + (ht + 3) +
           'L' + (CX - 1.5) + ' ' + (hb - 11) + 'Z" fill="var(--ink)"/>';
      s += '<path d="M' + (CX + hw - 3) + ' ' + (hb - 7) +
           'C' + (CX + hw - 2) + ' ' + (ht + 6) + ',' + (CX + hw * 0.32) + ' ' + (ht + 1) + ',' + (CX + 1) + ' ' + (ht + 3) +
           'L' + (CX + 1.5) + ' ' + (hb - 11) + 'Z" fill="var(--ink)"/>';
      // бліки прожектора у величезних очах
      s += '<path d="M' + (CX - hw * 0.66) + ' ' + (ht + 13) + 'q7 -6,14 -4" stroke="var(--paper)" stroke-opacity="0.55" stroke-width="3" fill="none" stroke-linecap="round"/>';
      s += '<path d="M' + (CX + hw * 0.40) + ' ' + (ht + 11) + 'q6 -4,11 -2" stroke="var(--paper)" stroke-opacity="0.35" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    } else {
      // краплеподібні бічні очі з бліком
      var eyY = (ht + hb) / 2 - 1, eyR = (hb - ht) * 0.30;
      [[-1], [1]].forEach(function (sd) {
        var sx = sd[0], ex2 = CX + sx * hw * 0.68;
        s += '<path d="M' + (ex2 - sx * hw * 0.24) + ' ' + (eyY - eyR) +
             'Q' + (ex2 + sx * hw * 0.30) + ' ' + (eyY - eyR * 0.7) + ',' + (ex2 + sx * hw * 0.26) + ' ' + eyY +
             'Q' + (ex2 + sx * hw * 0.20) + ' ' + (eyY + eyR) + ',' + (ex2 - sx * hw * 0.16) + ' ' + (eyY + eyR * 0.8) +
             'Q' + (ex2 - sx * hw * 0.36) + ' ' + (eyY + eyR * 0.2) + ',' + (ex2 - sx * hw * 0.24) + ' ' + (eyY - eyR) + 'Z" fill="var(--ink)"/>';
        s += '<circle cx="' + (ex2 - sx * 2) + '" cy="' + (eyY - eyR * 0.45) + '" r="1.8" fill="var(--paper)" opacity="0.6"/>';
      });
    }
    s += '<circle cx="' + CX + '" cy="' + (ht + 7) + '" r="1.8" fill="var(--ink)" opacity="0.8"/>';

    s += antenna(-1, CX - hw * 0.45, ht + 8);
    s += antenna(1, CX + hw * 0.45, ht + 8);
    if (cfg.proboscis) {
      s += '<path d="M' + CX + ' ' + (hb + 1) + 'l0 ' + cfg.proboscis + '" stroke="var(--honey)" stroke-width="2.8" stroke-linecap="round"/>';
    }
    return s;
  }

  function buildBee(id, cfg) {
    var abd = abdomenPath(cfg.abdTop, cfg.abdLen, cfg.abdHalf, cfg.abdShape);
    var s = '';
    s += '<defs><clipPath id="' + id + '-clip"><path d="' + abd + '"/></clipPath></defs>';
    s += buildLegs(cfg);
    s += buildAbdomen(id, cfg, abd);
    s += buildSting(cfg);
    s += buildWings(cfg);
    s += buildThorax(cfg);
    s += buildHead(cfg);
    return s;
  }

  // Спрощений силует для тіні на стіні (3 форми + крила)
  function silhouetteOf(cfg) {
    var s = '<path d="' + abdomenPath(cfg.abdTop, cfg.abdLen, cfg.abdHalf, cfg.abdShape) + '"/>';
    s += '<ellipse cx="' + CX + '" cy="' + ((cfg.thoraxTop + cfg.thoraxBot) / 2) + '" rx="' + cfg.thoraxHalf + '" ry="' + ((cfg.thoraxBot - cfg.thoraxTop) / 2) + '"/>';
    s += '<path d="M' + (CX - cfg.headHalf) + ' ' + (cfg.headBot - 4) +
         'C' + (CX - cfg.headHalf) + ' ' + (cfg.headTop + 4) + ',' + (CX - cfg.headHalf * 0.6) + ' ' + cfg.headTop + ',' + CX + ' ' + cfg.headTop +
         'C' + (CX + cfg.headHalf * 0.6) + ' ' + cfg.headTop + ',' + (CX + cfg.headHalf) + ' ' + (cfg.headTop + 4) + ',' + (CX + cfg.headHalf) + ' ' + (cfg.headBot - 4) +
         'Q' + CX + ' ' + (cfg.headBot + 6) + ',' + (CX - cfg.headHalf) + ' ' + (cfg.headBot - 4) + 'Z"/>';
    return s;
  }
  function wallShadow(cfg, transform, opacity) {
    return '<g transform="' + transform + '" fill="#050505" opacity="' + (opacity || 0.4) + '">' + silhouetteOf(cfg) + '</g>';
  }

  // ==========================================================
  // Конфіги каст (реальні розміри: матка ~20-25мм, трутень ~15-17, робоча ~12-15)
  // ==========================================================
  var CFG = {
    queen: {
      headHalf: 19, headTop: 30, headBot: 60, eyes: 'lateral',
      thoraxHalf: 30, thoraxTop: 62, thoraxBot: 110,
      abdTop: 108, abdLen: 162, abdHalf: 26, abdShape: 'point', bands: 5,
      wingY: 74, wingLen: 108, wingTilt: 20, sting: 10, stingBarbs: false
    },
    drone: {
      headHalf: 30, headTop: 22, headBot: 68, eyes: 'wrap',
      thoraxHalf: 33, thoraxTop: 70, thoraxBot: 124,
      abdTop: 122, abdLen: 106, abdHalf: 32, abdShape: 'blunt', bands: 4,
      wingY: 84, wingLen: 122, wingTilt: 22, sting: 0
    },
    worker: {
      headHalf: 20, headTop: 30, headBot: 60, eyes: 'lateral',
      thoraxHalf: 27, thoraxTop: 62, thoraxBot: 110,
      abdTop: 108, abdLen: 112, abdHalf: 24, abdShape: 'point', bands: 4,
      wingY: 74, wingLen: 100, wingTilt: 20, sting: 14, stingBarbs: true,
      corbicula: true, proboscis: 15
    }
  };

  // ==========================================================
  // Портрети-панелі
  // ==========================================================
  function queen() {
    // Трон під прожектором. Черевце йде ЗА нижній край кадру — вона більша за кадр.
    // Реальний зріст ~20-25 мм → лінійка 11 px/мм.
    var s = stage('stq', { pxPerMM: 11, beamX: 100 });
    s += wallShadow(CFG.queen, 'translate(30 6) scale(1.06) rotate(4 100 150)', 0.38);
    // почет: два силуети на межі світла, дивляться на неї
    s += '<g fill="#0a0908">' +
      '<ellipse cx="26" cy="262" rx="14" ry="20" transform="rotate(24 26 262)"/>' +
      '<circle cx="35" cy="247" r="8" transform="rotate(24 26 262)"/>' +
      '<ellipse cx="176" cy="266" rx="14" ry="20" transform="rotate(-22 176 266)"/>' +
      '<circle cx="167" cy="250" r="8" transform="rotate(-22 176 266)"/></g>';
    s += '<g stroke="var(--amber)" stroke-opacity="0.5" stroke-width="1.4" fill="none">' +
      '<path d="M14 250q14 -8,26 -2"/><path d="M188 254q-14 -8,-26 -2"/></g>';
    // феромонні дуги
    for (var w = 1; w <= 2; w++) {
      s += '<ellipse cx="100" cy="160" rx="' + (58 + w * 26) + '" ry="' + (80 + w * 32) +
        '" fill="none" stroke="var(--amber)" stroke-opacity="' + (0.16 - w * 0.05).toFixed(2) +
        '" stroke-width="1.3" stroke-dasharray="2 8"/>';
    }
    // сама матка: масштаб 1.18, черевце обрізається нижнім краєм
    s += '<g transform="translate(-19 -6) scale(1.19)">' + buildBee('queen', CFG.queen) + '</g>';
    return s + vignette('stq');
  }

  function drone() {
    // Мугшот під стіною: нахил, величезні очі ловлять світло. ~16 мм → 15 px/мм.
    var s = stage('std', { pxPerMM: 15, beamX: 86 });
    s += wallShadow(CFG.drone, 'translate(34 14) scale(1.02) rotate(-2 100 150)', 0.42);
    s += '<g transform="translate(-8 22) rotate(-6 100 150) scale(1.06)">' + buildBee('drone', CFG.drone) + '</g>';
    return s + vignette('std');
  }

  function worker() {
    // Діагональ праці: йде вгору-вправо, за нею пунктир маршруту, кошик світиться.
    // ~13 мм → 18 px/мм.
    var s = stage('stw', { pxPerMM: 18, beamX: 116 });
    // маршрут за спиною
    s += '<path d="M-8 286 C40 236,26 176,74 148" fill="none" stroke="var(--amber)" ' +
         'stroke-opacity="0.4" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/>';
    s += wallShadow(CFG.worker, 'translate(40 26) scale(1.0) rotate(16 100 150)', 0.4);
    s += '<g transform="translate(6 16) rotate(11 100 150) scale(1.1)">' + buildBee('worker', CFG.worker) + '</g>';
    return s + vignette('stw');
  }

  function scout() {
    // Операція «вісімка»: динамічний нахил, слід світиться, на стіні — крейдяна схема.
    var s = stage('sts', { pxPerMM: 18, beamX: 92 });
    // крейдяна вісімка на стіні — «план операції», накреслений розвідницею
    s += '<g transform="translate(154 226) rotate(9) scale(1.35)" stroke="var(--paper)" stroke-opacity="0.5" fill="none" stroke-linecap="round">' +
      '<path d="M0 34C-15 27,-15 8,0 2C15 8,15 27,0 34Z" stroke-width="1.6" stroke-dasharray="4 3"/>' +
      '<path d="M0 34V2" stroke-width="2.6"/>' +
      '<path d="M-5 8l5 -6l5 6" stroke-width="1.8"/>' +
      '<circle cx="0" cy="-9" r="2.6" stroke-width="1.2"/></g>';
    s += wallShadow(CFG.worker, 'translate(48 -8) scale(0.98) rotate(-24 100 150)', 0.38);
    // швидкісні дуги
    s += '<g stroke="var(--amber)" stroke-opacity="0.5" stroke-width="2.2" fill="none" stroke-linecap="round">' +
      '<path d="M34 96q-13 9,-8 22"/><path d="M46 84q-16 10,-12 26"/></g>';
    s += '<g transform="translate(2 -26) rotate(-16 100 150) scale(1.02)">' + buildBee('scout', CFG.worker) + '</g>';
    return s + vignette('sts');
  }

  function varroa() {
    // Нуар-хоррор: величезна ТІНЬ кліща на стіні; сам кліщ — на спині бджоли,
    // в кривавому світлі. Найстрашніше в кадрі — тінь.
    var s = stage('stv', { pxPerMM: 0, beamX: 108, tint: 'blood' });

    // гігантська тінь кліща на стіні
    s += '<g transform="translate(96 96) scale(1.9)" fill="#070505" opacity="0.6">';
    s += '<ellipse cx="0" cy="0" rx="34" ry="25"/>';
    for (var i = 0; i < 4; i++) {
      var ly = -16 + i * 11, dr = i < 2 ? -1 : 1;
      s += '<path d="M-30 ' + ly + 'q-12 ' + (dr * 6) + ',-22 ' + (dr * 11) + '" stroke="#070505" stroke-width="6" fill="none" stroke-linecap="round"/>';
      s += '<path d="M30 ' + ly + 'q12 ' + (dr * 6) + ',22 ' + (dr * 11) + '" stroke="#070505" stroke-width="6" fill="none" stroke-linecap="round"/>';
    }
    s += '</g>';

    // спина бджоли знизу кадру (жертва, крупно)
    s += '<defs><clipPath id="stv-host"><path d="M-4 258C24 196,64 178,100 178C136 178,176 196,204 258L204 300L-4 300Z"/></clipPath></defs>';
    s += '<path d="M-4 258C24 196,64 178,100 178C136 178,176 196,204 258L204 300L-4 300Z" ' +
         'fill="url(#amber-vol)" stroke="var(--ink)" stroke-width="3.4"/>';
    for (var b = 0; b < 3; b++) {
      s += '<g clip-path="url(#stv-host)"><rect x="-4" y="' + (196 + b * 34) + '" width="212" height="16" fill="var(--ink)" opacity="0.9"/></g>';
    }
    s += '<g clip-path="url(#stv-host)" opacity="0.15"><rect x="-4" y="174" width="212" height="130" fill="url(#ht-mid)"/></g>';

    // кліщ на спині — той самий силует, що й тінь: звʼязок читається
    var mx = 100, my = 196, rx = 40, ry = 29;
    for (var j = 0; j < 4; j++) {
      var ay = my - 16 + j * 11;
      var reach = 26 + (j === 0 || j === 3 ? 4 : 8);
      // коліно вгору, кінчик униз — лапа ЧІПЛЯЄТЬСЯ за спину бджоли
      s += '<path d="M' + (mx - rx + 8) + ' ' + ay +
           ' q-' + (reach * 0.6) + ' -10,-' + reach + ' -2 q-7 6,-9 16" ' +
           'stroke="var(--blood)" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      s += '<path d="M' + (mx + rx - 8) + ' ' + ay +
           ' q' + (reach * 0.6) + ' -10,' + reach + ' -2 q7 6,9 16" ' +
           'stroke="var(--blood)" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    s += '<ellipse cx="' + mx + '" cy="' + my + '" rx="' + rx + '" ry="' + ry + '" fill="url(#blood-vol)" stroke="var(--ink)" stroke-width="3.4"/>';
    s += '<path d="M' + (mx - 27) + ' ' + (my - 11) + 'q27 -9,54 0M' + (mx - 31) + ' ' + my + 'q31 -7,62 0M' + (mx - 27) + ' ' + (my + 11) + 'q27 7,54 0" ' +
         'stroke="var(--ink)" stroke-opacity="0.4" stroke-width="1.7" fill="none"/>';
    s += '<ellipse cx="' + mx + '" cy="' + my + '" rx="' + rx + '" ry="' + ry + '" fill="url(#ht-blood)" opacity="0.32"/>';
    // криваво-червоний rim light зверху
    s += '<path d="M' + (mx - rx * 0.8) + ' ' + (my - ry * 0.72) + 'Q' + mx + ' ' + (my - ry * 1.18) + ',' + (mx + rx * 0.8) + ' ' + (my - ry * 0.72) +
         '" fill="none" stroke="#ff7a5e" stroke-opacity="0.65" stroke-width="2.6" stroke-linecap="round"/>';
    // хеліцери в тіло
    s += '<path d="M' + (mx - 9) + ' ' + (my + ry - 4) + 'l-4 13M' + (mx + 9) + ' ' + (my + ry - 4) + 'l4 13" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>';
    return s + vignette('stv');
  }

  var ART = { queen: queen, drone: drone, worker: worker, scout: scout, varroa: varroa };

  function render(key, title) {
    var fn = ART[key];
    if (!fn) return '';
    return '<svg class="cast-art" viewBox="0 0 200 300" role="img" aria-label="' + esc(title || key) + '">' +
      '<title>' + esc(title || key) + '</title>' + fn() + '</svg>';
  }

  return { render: render, keys: Object.keys(ART) };
})();
