/* НЕ ЖАЛЬ — схема-«доказ»: allergy. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function allergy() {
    var s = frame(T('Доказ №10 · не той пилок', 'Exhibit 10 · the wrong pollen'));
    // вітрозапильний
    s += '<g transform="translate(40 72)">';
    s += tag(0, 0, T('Вітрозапильний пилок', 'Wind-borne pollen'), { fill: 'var(--blood)' });
    s += txt(0, 18, T('трави, дерева — це він спричиняє поліноз', 'grasses, trees — this causes hay fever'), { size: 10, fill: 'var(--paper-dim)' });
    // дерево + вітер
    s += '<path d="M30 130v-40" stroke="var(--honey)" stroke-width="5"/>';
    s += '<circle cx="30" cy="78" r="20" fill="var(--honey)" opacity="0.6"/>';
    for (var i = 0; i < 12; i++) {
      s += '<circle class="drift" cx="' + (56 + i * 12) + '" cy="' + (60 + (i % 4) * 14) + '" r="2.6" fill="var(--blood)" opacity="0.7"/>';
    }
    s += line(52, 52, 186, 44, { stroke: 'var(--paper-dim)', w: 1.4, dash: '4 4', marker: 'arrow-paper' });
    s += tag(120, 36, T('у повітря', 'into the air'), { anchor: 'middle', fill: 'var(--paper-dim)' });
    s += '</g>';
    s += '<path d="M240 56V250" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="4 6"/>';
    // комахозапильний
    s += '<g transform="translate(262 72)">';
    s += tag(0, 0, T('Комахозапильний пилок', 'Insect-borne pollen'), { fill: 'var(--amber)' });
    s += txt(0, 18, T('це те, що носять бджоли — і що в меді', 'this is what bees carry — and what’s in honey'), { size: 10, fill: 'var(--paper-dim)' });
    s += flower(50, 88, 20, 'var(--amber)');
    s += beeIcon(110, 78, 1.2, 24, 'var(--amber)');
    s += line(74, 84, 96, 80, { stroke: 'var(--amber)', w: 1.6, marker: 'arrow' });
    s += '<g transform="translate(150 96)"><rect x="0" y="-16" width="34" height="32" rx="3" fill="var(--honey)" stroke="var(--ink)" stroke-width="1.6"/>' +
      '<rect x="-3" y="-20" width="40" height="7" fill="var(--amber)" stroke="var(--ink)" stroke-width="1.4"/></g>';
    s += tag(167, 128, T('мед', 'honey'), { anchor: 'middle', fill: 'var(--paper-dim)' });
    s += '</g>';
    // висновок
    s += '<g transform="translate(40 216)">';
    s += '<rect x="0" y="0" width="400" height="60" fill="var(--ink-3)" stroke="var(--conf-disputed, #b98cff)" stroke-width="1.6"/>';
    s += tag(12, 22, T('Тому теорія хитка біологічно', 'So the theory is biologically shaky'), { fill: '#b98cff' });
    s += txt(12, 42, T('одні RCT показали полегшення, інші — жодної переваги над плацебо',
                       'some RCTs showed relief, others found no benefit over placebo'), { size: 10, fill: 'var(--paper-dim)' });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.allergy = allergy;
})();
