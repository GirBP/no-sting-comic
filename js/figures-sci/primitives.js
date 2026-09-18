/*
 * НЕ ЖАЛЬ — спільні примітиви для схем у js/figures-sci/.
 * Побудова SVG-рядків (текст, лінії, дуги, бджола-піктограма, рамка панелі)
 * і переклад T()/t() з поточною мовою — використовують усі файли-схеми поруч.
 */
window.NZ_SCI_PRIMITIVES = (function () {
  var T = function (uk, en) { return { uk: uk, en: en }; };
  var L = 'uk';
  function setLang(lang) { L = lang || 'uk'; }
  function t(p) { return typeof p === 'string' ? p : (p[L] || p.uk); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function txt(x, y, str, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.fill || 'var(--paper)') + '" ' +
      'font-size="' + (o.size || 12) + '" font-family="' + (o.mono ? 'var(--font-mono)' : 'var(--font-display)') + '" ' +
      'font-weight="' + (o.weight || 400) + '" text-anchor="' + (o.anchor || 'start') + '" ' +
      (o.spacing ? 'letter-spacing="' + o.spacing + '" ' : '') +
      (o.op ? 'opacity="' + o.op + '" ' : '') + '>' + esc(t(str)) + '</text>';
  }
  // підпис-капслок моно (службовий)
  function tag(x, y, str, o) {
    o = o || {};
    return txt(x, y, String(t(str)).toUpperCase(), {
      size: o.size || 9, mono: true, weight: 700, fill: o.fill || 'var(--paper-dim)',
      anchor: o.anchor, spacing: '1.4', op: o.op
    });
  }
  function line(x1, y1, x2, y2, o) {
    o = o || {};
    return '<path class="' + (o.cls || '') + '" d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" ' +
      'stroke="' + (o.stroke || 'var(--amber)') + '" stroke-width="' + (o.w || 2) + '" fill="none" ' +
      (o.dash ? 'stroke-dasharray="' + o.dash + '" ' : '') +
      (o.marker ? 'marker-end="url(#' + o.marker + ')" ' : '') +
      'stroke-linecap="round"/>';
  }
  function arc(cx, cy, r, a1, a2, o) {
    o = o || {};
    var p1 = pol(cx, cy, r, a1), p2 = pol(cx, cy, r, a2);
    var large = Math.abs(a2 - a1) > 180 ? 1 : 0;
    return '<path class="' + (o.cls || '') + '" d="M' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1) +
      'A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1) + '" ' +
      'stroke="' + (o.stroke || 'var(--amber)') + '" stroke-width="' + (o.w || 1.6) + '" fill="none" ' +
      (o.dash ? 'stroke-dasharray="' + o.dash + '" ' : '') +
      (o.marker ? 'marker-end="url(#' + o.marker + ')" ' : '') + '/>';
  }
  // кут відлічуємо від вертикалі вгору, за годинниковою
  function pol(cx, cy, r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }
  function hexes(x0, y0, cols, rows, s, op) {
    var out = '<g opacity="' + (op || 0.16) + '" stroke="var(--amber)" stroke-width="1" fill="none">';
    var h = s * Math.sqrt(3);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cx = x0 + c * s * 1.5;
        var cy = y0 + r * h + (c % 2 ? h / 2 : 0);
        var d = '';
        for (var i = 0; i < 6; i++) {
          var a = (60 * i) * Math.PI / 180;
          d += (i ? 'L' : 'M') + (cx + s * Math.cos(a)).toFixed(1) + ' ' + (cy + s * Math.sin(a)).toFixed(1);
        }
        out += '<path d="' + d + 'Z"/>';
      }
    }
    return out + '</g>';
  }
  // маленька бджола-піктограма (спрощена, для схем)
  function beeIcon(x, y, scale, rot, color) {
    color = color || 'var(--amber)';
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + scale + ')">' +
      '<ellipse cx="0" cy="0" rx="5" ry="9" fill="' + color + '" stroke="var(--ink)" stroke-width="1.4"/>' +
      '<rect x="-5" y="-4" width="10" height="2.6" fill="var(--ink)"/>' +
      '<rect x="-5" y="1.4" width="10" height="2.6" fill="var(--ink)"/>' +
      '<circle cx="0" cy="-10.5" r="3.4" fill="var(--ink)"/>' +
      '<ellipse cx="-6" cy="-4" rx="5" ry="2.6" fill="var(--paper)" opacity="0.5" transform="rotate(-28 -6 -4)"/>' +
      '<ellipse cx="6" cy="-4" rx="5" ry="2.6" fill="var(--paper)" opacity="0.5" transform="rotate(28 6 -4)"/>' +
      '</g>';
  }
  function flower(x, y, s, color) {
    var p = '';
    for (var i = 0; i < 6; i++) {
      var a = i * 60 * Math.PI / 180;
      p += '<ellipse cx="' + (x + Math.cos(a) * s * 0.9).toFixed(1) + '" cy="' + (y + Math.sin(a) * s * 0.9).toFixed(1) +
        '" rx="' + (s * 0.62) + '" ry="' + (s * 0.42) + '" fill="' + (color || 'var(--amber)') +
        '" opacity="0.85" transform="rotate(' + (i * 60) + ' ' + (x + Math.cos(a) * s * 0.9).toFixed(1) + ' ' + (y + Math.sin(a) * s * 0.9).toFixed(1) + ')"/>';
    }
    return p + '<circle cx="' + x + '" cy="' + y + '" r="' + (s * 0.5) + '" fill="var(--honey)" stroke="var(--ink)" stroke-width="1.2"/>';
  }
  function sun(x, y, r) {
    var rays = '';
    for (var i = 0; i < 12; i++) {
      var a = i * 30 * Math.PI / 180;
      rays += '<path d="M' + (x + Math.cos(a) * (r + 4)).toFixed(1) + ' ' + (y + Math.sin(a) * (r + 4)).toFixed(1) +
        'L' + (x + Math.cos(a) * (r + 11)).toFixed(1) + ' ' + (y + Math.sin(a) * (r + 11)).toFixed(1) +
        '" stroke="var(--amber)" stroke-width="2" stroke-linecap="round"/>';
    }
    return rays + '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#amber-vol)" stroke="var(--ink)" stroke-width="2"/>';
  }
  function hiveBox(x, y, w, h) {
    return '<g><rect x="' + (x - w / 2) + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" ' +
      'fill="var(--ink-3)" stroke="var(--amber)" stroke-width="2"/>' +
      '<path d="M' + (x - w / 2) + ' ' + (y + h * 0.38) + 'h' + w + 'M' + (x - w / 2) + ' ' + (y + h * 0.7) + 'h' + w +
      '" stroke="var(--amber)" stroke-width="1.2" opacity="0.6"/>' +
      '<rect x="' + (x - 6) + '" y="' + (y + h - 5) + '" width="12" height="5" fill="var(--ink)"/></g>';
  }
  // текст із переносом на 2 рядки (без foreignObject — він ненадійний у рендерах)
  function wrap2(x, y, str, o) {
    o = o || {};
    var words = String(t(str)).split(' ');
    var l1 = words, l2 = [];
    if (words.length > 1) {
      var half = Math.ceil(words.length / 2);
      l1 = words.slice(0, half); l2 = words.slice(half);
    }
    var out = txt(x, y, l1.join(' '), o);
    if (l2.length) out += txt(x, y + (o.lh || 13), l2.join(' '), o);
    return out;
  }

  function frame(label) {
    // рамка панелі-«доказу» + кутові мітки
    var s = '<rect x="1.5" y="1.5" width="477" height="297" fill="none" stroke="var(--line)" stroke-width="2"/>';
    ['M6 22V6h16', 'M474 22V6h-16', 'M6 278v16h16', 'M474 278v16h-16'].forEach(function (d) {
      s += '<path d="' + d + '" stroke="var(--amber)" stroke-width="2" fill="none" opacity="0.8"/>';
    });
    if (label) s += tag(16, 22, label, { fill: 'var(--amber)' });
    return s;
  }

  return {
    T: T, setLang: setLang, t: t, esc: esc, txt: txt, tag: tag, line: line,
    arc: arc, pol: pol, hexes: hexes, beeIcon: beeIcon, flower: flower, sun: sun,
    hiveBox: hiveBox, wrap2: wrap2, frame: frame
  };
})();
