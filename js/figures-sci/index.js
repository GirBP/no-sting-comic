/* НЕ ЖАЛЬ — диспетчер схем. Агрегує window.NZ_SCI_FIGS у публічний window.NZ_SCI.render(). */
window.NZ_SCI = (function () {
  var P = window.NZ_SCI_PRIMITIVES;
  var FIGS = window.NZ_SCI_FIGS || {};

  function render(key, lang, title) {
    var fn = FIGS[key];
    if (!fn) return '';
    P.setLang(lang);
    return '<svg class="sci-fig" viewBox="0 0 480 300" role="img" aria-label="' + P.esc(title || key) + '">' +
      '<title>' + P.esc(title || key) + '</title>' + fn() + '</svg>';
  }

  return { render: render, keys: Object.keys(FIGS) };
})();
