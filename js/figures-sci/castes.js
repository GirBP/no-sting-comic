/* НЕ ЖАЛЬ — схема-«доказ»: castes. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function castes() {
    var s = frame(T('Доказ №13 · хто ким народжується', 'Exhibit 13 · who is born as what'));
    // яйце запліднене / незапліднене
    s += '<g transform="translate(56 78)">';
    s += tag(0, -14, T('Незапліднене яйце', 'Unfertilised egg'), { fill: 'var(--paper)' });
    s += '<ellipse cx="26" cy="20" rx="16" ry="24" fill="var(--ink-3)" stroke="var(--paper-dim)" stroke-width="2"/>';
    s += txt(26, 25, '16', { anchor: 'middle', size: 14, weight: 700, fill: 'var(--paper-dim)', mono: true });
    s += tag(26, 60, T('хромосом', 'chromosomes'), { anchor: 'middle', fill: 'var(--paper-dim)', size: 8 });
    s += line(48, 20, 84, 20, { stroke: 'var(--paper-dim)', w: 2, marker: 'arrow-paper' });
    s += '<g transform="translate(112 20)">' + beeIcon(0, 0, 1.5, 0, 'var(--paper-dim)') + '</g>';
    s += tag(112, 54, T('ТРУТЕНЬ', 'DRONE'), { anchor: 'middle', fill: 'var(--paper)' });
    s += '</g>';

    s += '<path d="M240 60V262" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="4 6"/>';

    s += '<g transform="translate(266 78)">';
    s += tag(0, -14, T('Запліднене яйце', 'Fertilised egg'), { fill: 'var(--amber)' });
    s += '<ellipse cx="26" cy="20" rx="16" ry="24" fill="var(--ink-3)" stroke="var(--amber)" stroke-width="2"/>';
    s += txt(26, 25, '32', { anchor: 'middle', size: 14, weight: 700, fill: 'var(--amber)', mono: true });
    s += tag(26, 60, T('хромосоми', 'chromosomes'), { anchor: 'middle', fill: 'var(--paper-dim)', size: 8 });
    // розвилка годування
    s += line(48, 16, 86, 16, { stroke: 'var(--amber)', w: 2, marker: 'arrow' });
    s += line(48, 30, 86, 76, { stroke: 'var(--amber)', w: 2, marker: 'arrow' });
    s += '<g transform="translate(118 16)">' + beeIcon(0, 0, 1.7, 0, 'var(--amber)') + '</g>';
    s += tag(118, 48, T('МАТКА', 'QUEEN'), { anchor: 'middle', fill: 'var(--amber)' });
    s += '<g transform="translate(118 84)">' + beeIcon(0, 0, 1.3, 0, 'var(--amber)') + '</g>';
    s += tag(118, 112, T('РОБОЧА', 'WORKER'), { anchor: 'middle', fill: 'var(--amber)' });
    s += '</g>';

    // пояснення молочка
    s += '<g transform="translate(40 216)">';
    s += '<rect x="0" y="0" width="400" height="62" fill="var(--ink-3)" stroke="var(--amber)" stroke-width="1.4"/>';
    s += tag(12, 22, T('Різниця між маткою і робочою — не в генах, а в годуванні',
                       'Queen vs worker is not genetics — it’s diet'), { fill: 'var(--amber)' });
    s += txt(12, 42, T('маточне молочко змінює метилювання ДНК  ·  Kucharski et al., Science 2008',
                       'royal jelly alters DNA methylation  ·  Kucharski et al., Science 2008'),
      { size: 10, fill: 'var(--paper-dim)' });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.castes = castes;
})();
