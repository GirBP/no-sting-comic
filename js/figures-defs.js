/*
 * НЕ ЖАЛЬ — спільні SVG-визначення (defs) для всіх ілюстрацій.
 * Один інлайновий <svg> у DOM, який усі фігури референсять через url(#id).
 * Так фільтри/патерни існують в одному екземплярі — не вбиває GPU.
 */
window.NZ_DEFS = (function () {
  // Halftone різної щільності: r — радіус крапки, s — крок сітки.
  // Кут растру 45° — класика Ben-Day: сітка не збігається з піксельною і не муарить.
  function dots(id, r, s, color) {
    return '<pattern id="' + id + '" width="' + s + '" height="' + s +
      '" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<circle cx="' + (s / 2) + '" cy="' + (s / 2) + '" r="' + r + '" fill="' + color + '"/>' +
      '</pattern>';
  }

  var svg =
    '<svg id="nz-defs" width="0" height="0" aria-hidden="true" focusable="false" ' +
    'style="position:absolute;width:0;height:0;overflow:hidden">' +
    '<defs>' +

      // --- Halftone-сітки (бурштин) ---
      dots('ht-fine', 0.9, 4, 'var(--amber)') +
      dots('ht-mid', 1.3, 6, 'var(--amber)') +
      dots('ht-coarse', 2.0, 9, 'var(--amber)') +
      // --- Halftone (загроза) ---
      dots('ht-blood', 1.3, 6, 'var(--blood)') +
      // --- Halftone (приглушений папір) ---
      dots('ht-paper', 1.1, 5, 'var(--paper-dim)') +

      // --- Градієнтний halftone: маска, крізь яку крапки згасають ---
      '<linearGradient id="fade-down" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#fff" stop-opacity="1"/>' +
        '<stop offset="1" stop-color="#fff" stop-opacity="0"/>' +
      '</linearGradient>' +
      '<linearGradient id="fade-right" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#fff" stop-opacity="1"/>' +
        '<stop offset="1" stop-color="#fff" stop-opacity="0"/>' +
      '</linearGradient>' +
      '<mask id="mask-fade-down"><rect width="100%" height="100%" fill="url(#fade-down)"/></mask>' +
      '<mask id="mask-fade-right"><rect width="100%" height="100%" fill="url(#fade-right)"/></mask>' +

      // --- Обʼємні заливки в дуотоні ---
      '<radialGradient id="amber-vol" cx="35%" cy="30%" r="75%">' +
        '<stop offset="0" stop-color="var(--amber)"/>' +
        '<stop offset="0.55" stop-color="var(--amber-deep)"/>' +
        '<stop offset="1" stop-color="var(--honey)"/>' +
      '</radialGradient>' +
      '<radialGradient id="blood-vol" cx="35%" cy="30%" r="75%">' +
        '<stop offset="0" stop-color="#e8543b"/>' +
        '<stop offset="1" stop-color="var(--blood)"/>' +
      '</radialGradient>' +

      // --- Спектр для схеми зору (УФ → червоний) ---
      '<linearGradient id="spectrum" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0.00" stop-color="#6b3fa0"/>' +   /* УФ (умовно) */
        '<stop offset="0.18" stop-color="#4b3fd0"/>' +   /* фіолет */
        '<stop offset="0.34" stop-color="#2f7fe0"/>' +   /* синій */
        '<stop offset="0.52" stop-color="#2fb56a"/>' +   /* зелений */
        '<stop offset="0.70" stop-color="#e0c22f"/>' +   /* жовтий */
        '<stop offset="0.85" stop-color="#e07b2f"/>' +   /* оранж */
        '<stop offset="1.00" stop-color="#d1381f"/>' +   /* червоний */
      '</linearGradient>' +

      // --- Температурний градієнт (зимовий клуб / гарячий мʼяч) ---
      '<radialGradient id="thermal" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0" stop-color="#ffd24a"/>' +
        '<stop offset="0.45" stop-color="var(--amber-deep)"/>' +
        '<stop offset="0.75" stop-color="var(--honey)"/>' +
        '<stop offset="1" stop-color="#241a10"/>' +
      '</radialGradient>' +

      // --- «Жива» лінія: легкий зсув, щоб контур не був стерильно-машинним ---
      '<filter id="ink" x="-8%" y="-8%" width="116%" height="116%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="7" result="n"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" ' +
          'xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>' +

      // --- Стрілка для схем ---
      '<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" ' +
        'orient="auto-start-reverse">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--amber)"/>' +
      '</marker>' +
      '<marker id="arrow-paper" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" ' +
        'orient="auto-start-reverse">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--paper-dim)"/>' +
      '</marker>' +
      '<marker id="arrow-blood" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" ' +
        'orient="auto-start-reverse">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--blood)"/>' +
      '</marker>' +

    '</defs></svg>';

  function inject() {
    if (document.getElementById('nz-defs')) return;
    var holder = document.createElement('div');
    holder.innerHTML = svg;
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }

  return { inject: inject, markup: svg };
})();
