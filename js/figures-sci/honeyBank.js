/* НЕ ЖАЛЬ — схема-«доказ»: honeyBank. Частина js/figures-sci/, дивись primitives.js. */
(function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var T = P.T, t = P.t, esc = P.esc, txt = P.txt, tag = P.tag, line = P.line,
      arc = P.arc, pol = P.pol, hexes = P.hexes, beeIcon = P.beeIcon, flower = P.flower,
      sun = P.sun, hiveBox = P.hiveBox, wrap2 = P.wrap2, frame = P.frame;
  function honeyBank() {
    var s = frame(T('Доказ №12 · банк, не десерт', 'Exhibit 12 · a bank, not a dessert'));
    // календар сезону
    var months = [T('кві', 'Apr'), T('тра', 'May'), T('чер', 'Jun'), T('лип', 'Jul'), T('сер', 'Aug'),
                  T('вер', 'Sep'), T('жов', 'Oct'), T('лис', 'Nov'), T('гру', 'Dec'), T('січ', 'Jan'),
                  T('лют', 'Feb'), T('бер', 'Mar')];
    var vals = [30, 62, 92, 100, 74, 46, 26, 14, 8, 6, 10, 18];
    s += tag(40, 54, T('Скільки квітів доступно протягом року', 'Forage available through the year'), { fill: 'var(--paper)' });
    s += '<g transform="translate(40 64)">';
    // зона зими — під стовпчиками
    s += '<rect x="198" y="0" width="165" height="110" fill="#0d1420" opacity="0.38"/>';
    s += tag(280, 18, T('нема квітів', 'no forage'), { anchor: 'middle', fill: '#8fb4d9' });
    months.forEach(function (m, i) {
      var h = vals[i] * 0.8, x = i * 33;
      var cold = i >= 6 && i <= 10;
      s += '<rect class="grow-y" x="' + x + '" y="' + (110 - h) + '" width="24" height="' + h + '" ' +
        'fill="' + (cold ? 'var(--line)' : 'var(--amber)') + '" opacity="' + (cold ? 0.7 : 0.85) + '"/>';
      s += tag(x + 12, 126, m, { anchor: 'middle', fill: cold ? 'var(--paper-dim)' : 'var(--paper)', size: 8 });
    });
    s += '</g>';
    // банка + висновок
    s += '<g transform="translate(56 236)">';
    s += '<rect x="0" y="-22" width="42" height="40" rx="3" fill="var(--honey)" stroke="var(--ink)" stroke-width="2"/>';
    s += '<rect x="-4" y="-28" width="50" height="9" fill="var(--amber)" stroke="var(--ink)" stroke-width="1.6"/>';
    s += tag(64, -8, T('Мед = запас енергії на зиму', 'Honey = the winter energy store'), { fill: 'var(--amber)' });
    s += txt(64, 12, T('сім’я з’їдає більшість сама · людина забирає надлишок',
                      'the colony eats most of it · humans take the surplus'), { size: 10, fill: 'var(--paper-dim)' });
    s += '</g>';
    return s;
  }

  window.NZ_SCI_FIGS = window.NZ_SCI_FIGS || {};
  window.NZ_SCI_FIGS.honeyBank = honeyBank;
})();
