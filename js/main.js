/* НЕ ЖАЛЬ — рушій. Рендер з даних, i18n, reveal, шухляди джерел, тумблер руху. */
(function () {
  'use strict';
  var D = window.NEZHAL;
  var root = document.documentElement;

  // ---------- Стан ----------
  // localStorage може бути недоступний (напр. у пісочниці Artifact) — доступ через try/catch
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  var lang = lsGet('nz-lang') || 'uk';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stored = lsGet('nz-motion');
  var motion = stored ? stored === 'on' : !prefersReduced;

  function t(pair) { return pair ? (pair[lang] || pair.uk) : ''; }
  // Шлях до растрової панелі. В однофайловому бандлі window.NZ_PANELS містить data:URI.
  function panel(name) {
    var m = window.NZ_PANELS;
    return (m && m[name]) ? m[name] : 'assets/panels/' + name;
  }
  // Атрибути растрової панелі з адаптивними варіантами (sm 720px / md 1080px / повний).
  // У бандлі (NZ_PANELS) — лише data:URI без srcset.
  function panelAttrs(name, sizes, fullW) {
    var m = window.NZ_PANELS;
    if (m && m[name]) return 'src="' + m[name] + '"';
    var base = 'assets/panels/';
    var set = base + 'sm/' + name + ' 720w';
    if (fullW > 1080) set += ', ' + base + 'md/' + name + ' 1080w';
    set += ', ' + base + name + ' ' + fullW + 'w';
    return 'src="' + base + name + '" srcset="' + set + '" sizes="' + sizes + '"';
  }
  var SIZES_PORTRAIT = '(max-width: 720px) calc(100vw - 2.2rem), (max-width: 1024px) 46vw, 344px';
  var SIZES_FIG = '(max-width: 720px) calc(100vw - 2rem), 590px';
  var SIZES_WIDE = '(max-width: 1180px) calc(100vw - 2rem), 1180px';
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Порядок джерел для стіни (у порядку першої появи)
  var sourceOrder = [];
  function sourceIndex(key) {
    var i = sourceOrder.indexOf(key);
    if (i === -1) { sourceOrder.push(key); i = sourceOrder.length - 1; }
    return i + 1;
  }
  function confClass(c) { return c === 'high' ? 'high' : c === 'medium' ? 'medium' : 'disputed'; }
  function confLabel(c) { return c === 'high' ? t(D.UI.confHigh) : c === 'medium' ? t(D.UI.confMedium) : t(D.UI.confDisputed); }

  // ---------- Чип-джерело + шухляда ----------
  function sourceChip(srcKey) {
    var s = D.SOURCES[srcKey];
    var wrap = el('div', 'src-wrap');
    var id = 'src-' + srcKey + '-' + Math.random().toString(36).slice(2, 7);
    var chip = el('button', 'src-chip');
    chip.type = 'button';
    chip.setAttribute('aria-expanded', 'false');
    chip.setAttribute('aria-controls', id);
    chip.innerHTML = '<span class="caret">▸</span> ' + esc(t(D.UI.sourceChip));
    var drawer = el('div', 'src-drawer');
    drawer.id = id; drawer.hidden = true;
    drawer.innerHTML =
      '<div class="st">' + esc(s.title) + '</div>' +
      '<div class="meta">' + esc(s.authors) + ' · ' + esc(s.venue) + ' · ' + s.year + '</div>' +
      '<div class="doi"><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.ref) + ' ↗</a></div>';
    chip.addEventListener('click', function () {
      var open = chip.getAttribute('aria-expanded') === 'true';
      chip.setAttribute('aria-expanded', String(!open));
      drawer.hidden = open;
    });
    wrap.appendChild(chip);
    wrap.appendChild(drawer);
    return wrap;
  }

  // ---------- Картка касту ----------
  function castCard(c) {
    var card = el('article', 'dossier reveal' + (c.enemy ? ' enemy' : ''));
    sourceIndex(c.src);
    card.innerHTML =
      '<div class="filetag">' + esc(t(D.UI.dossier)) + '</div>' +
      '<div class="portrait">' +
        '<img class="poster" ' + panelAttrs('cast-' + (c.art || c.id) + '.webp', SIZES_PORTRAIT, 1024) + ' alt="" ' +
          'loading="lazy" decoding="async" onerror="this.remove()">' +
        window.NZ_CAST_ART.render(c.art || c.id, t(c.codename)) + '</div>' +
      '<div class="stamp">' + esc(t(c.codename)) + '</div>' +
      '<div class="role">' + esc(t(c.role)) + '</div>' +
      '<div class="filestat">' + esc(t(c.stat)) + '</div>' +
      '<p class="desc">' + esc(t(c.dossier)) + '</p>' +
      '<div class="busts"><b>' + esc(t(D.UI.busts)) + '</b>' +
        '<s>' + esc(t(c.busts)) + '</s></div>';
    // чип джерела під досьє
    var foot = el('div', 'myth-badges');
    foot.style.marginTop = '0.7rem';
    foot.appendChild(sourceChip(c.src));
    card.appendChild(foot);
    return card;
  }

  // ---------- Схема-«доказ» ----------
  function figurePanel(key, wide) {
    if (!key || !window.NZ_SCI) return null;
    var svg = window.NZ_SCI.render(key, lang, t(D.UI.exhibit) + ' · ' + key);
    if (!svg) return null;
    var fig = el('figure', 'sci-panel reveal');
    fig.innerHTML =
      '<img class="poster" ' + panelAttrs('fig-' + key + '.webp', wide ? SIZES_WIDE : SIZES_FIG, 1536) + ' alt="" ' +
        'loading="lazy" decoding="async" onerror="this.remove()">' + svg;
    return fig;
  }

  // ---------- Міф-картка ----------
  function mythCard(m) {
    sourceIndex(m.src);
    var card = el('article', 'myth reveal' + (m.nuance ? ' nuance' : '') + (m.warning ? ' warning' : ''));
    var badges = '<span class="conf ' + confClass(m.conf) + '">' + esc(confLabel(m.conf)) + '</span>';
    if (m.nuance) badges = '<span class="tag nuance">' + esc(t(D.UI.nuanceTag)) + '</span>' + badges;
    if (m.warning) badges = '<span class="tag warn">' + esc(t(D.UI.warnTag)) + '</span>' + badges;
    card.innerHTML =
      '<div class="myth-street"><span class="lbl">' + esc(t(D.UI.street)) + '</span>' +
        '<p>' + esc(t(m.street)) + '</p></div>' +
      '<div class="myth-truth"><span class="lbl">' + esc(t(D.UI.scienceLbl)) + '</span>' +
        '<p>' + esc(t(m.science)) + '</p>' +
        '<div class="myth-badges">' + badges + '</div></div>';
    card.querySelector('.myth-badges').appendChild(sourceChip(m.src));
    // схема-доказ під твердженням, якщо є
    var fig = figurePanel(m.fig);
    if (fig) {
      var wrap = el('div', 'myth-with-fig' + (m.warning ? ' warning' : '') + (m.nuance ? ' nuance' : ''));
      wrap.appendChild(card);
      wrap.appendChild(fig);
      return wrap;
    }
    return card;
  }

  // ---------- Глава ----------
  function chapterSection(ch) {
    var sec = el('section', 'wrap');
    sec.id = ch.id;
    var head = el('div', 'chapter-head reveal');
    head.innerHTML =
      '<div class="chapter-num">' + esc(t(D.UI.caseFile)) + ch.num + '</div>' +
      '<h2 class="chapter-title">' + esc(t(ch.title)) + '</h2>' +
      '<p class="chapter-lead narrator">' + esc(t(ch.lead)) + '</p>';
    sec.appendChild(head);

    // заставка глави — сплеш-панель (assets/panels/<chId>.webp), без файлу просто зникає
    var cover = el('figure', 'chapter-cover reveal');
    cover.innerHTML = '<img ' + panelAttrs(ch.id + '.webp', SIZES_WIDE, 1536) + ' alt="" loading="lazy" ' +
      'decoding="async" onerror="this.parentNode.remove()">';
    sec.appendChild(cover);

    if (ch.kind === 'cast') {
      var grid = el('div', 'cast-grid');
      D.CAST.forEach(function (c, i) { var card = castCard(c); card.classList.add('d' + ((i % 3) + 1)); grid.appendChild(card); });
      sec.appendChild(grid);
      var chFig = figurePanel(ch.fig, true);
      if (chFig) sec.appendChild(chFig);
    } else if (ch.kind === 'montage') {
      var mg = el('div', 'montage');
      ch.myths.forEach(function (m) { mg.appendChild(mythCard(m)); });
      sec.appendChild(mg);
    } else {
      var wrapM = el('div', 'myths narrow');
      ch.myths.forEach(function (m) { wrapM.appendChild(mythCard(m)); });
      sec.appendChild(wrapM);
    }
    return sec;
  }

  // ---------- Швидкий вердикт (TL;DR) ----------
  function verdictBlock() {
    var sec = el('section', 'wrap'); sec.id = 'verdict';
    var head = el('div', 'chapter-head reveal');
    head.innerHTML =
      '<div class="chapter-num">TL;DR</div>' +
      '<h2 class="chapter-title">' + esc(t(D.UI.verdictTitle)) + '</h2>' +
      '<p class="chapter-lead narrator">' + esc(t(D.UI.verdictLead)) + '</p>';
    sec.appendChild(head);
    var grid = el('div', 'verdict-grid reveal');
    // збираємо по одному ключовому міфу з кожної глави, плюс касти
    var pairs = [];
    D.CAST.forEach(function (c) { pairs.push({ street: c.busts, truth: c.role, anchor: 'ch1' }); });
    D.CHAPTERS.forEach(function (ch) {
      if (ch.myths) ch.myths.forEach(function (m) { pairs.push({ street: m.street, truth: null, science: m.science, anchor: ch.id }); });
    });
    pairs.forEach(function (p) {
      var a = el('a', 'verdict-row');
      a.href = '#' + p.anchor;
      var truthText = p.truth ? t(p.truth) : shorten(t(p.science));
      a.innerHTML =
        '<div class="street" data-lbl="' + esc(t(D.UI.street)) + '">' + esc(shorten(t(p.street))) + '</div>' +
        '<div class="vs">VS</div>' +
        '<div class="truth" data-lbl="' + esc(t(D.UI.scienceLbl)) + '">' + esc(truthText) + '</div>';
      grid.appendChild(a);
    });
    sec.appendChild(grid);
    return sec;
  }
  function shorten(s) { s = String(s); return s.length > 90 ? s.slice(0, 88).replace(/\s+\S*$/, '') + '…' : s; }

  // ---------- Стіна джерел ----------
  function sourcesSection() {
    var sec = el('section', 'wrap'); sec.id = 'sources';
    var head = el('div', 'chapter-head reveal');
    head.innerHTML =
      '<div class="chapter-num">' + esc(t(D.UI.caseFile)) + '∞</div>' +
      '<h2 class="chapter-title">' + esc(t(D.UI.sourcesTitle)) + '</h2>' +
      '<p class="chapter-lead narrator">' + esc(t(D.UI.sourcesLead)) + '</p>';
    sec.appendChild(head);
    var wall = el('div', 'sources-wall reveal');
    sourceOrder.forEach(function (key, i) {
      var s = D.SOURCES[key];
      var item = el('div', 'source-item');
      item.innerHTML =
        '<div class="idx">[' + (i + 1) + ']</div>' +
        '<div class="cite"><b>' + esc(s.authors) + '</b> — ' + esc(s.title) + '. ' +
        '<span class="meta">' + esc(s.venue) + ', ' + s.year + '.</span> ' +
        '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.ref) + ' ↗</a></div>';
      wall.appendChild(item);
    });
    sec.appendChild(wall);
    return sec;
  }

  // ---------- HERO ----------
  function renderHero() {
    var hero = document.getElementById('hero');
    hero.innerHTML =
      '<img class="hero-bg" src="' + panel('hero.webp') + '" alt="" fetchpriority="high" decoding="async" onerror="this.remove()">' +
      '<p class="hero-kicker">' + esc(t(D.UI.caseFile)) + '001 · Apis mellifera</p>' +
      '<h1 class="hero-title"><span class="stroke">НЕ</span> <span class="amber">ЖАЛЬ</span></h1>' +
      '<p class="hero-tagline">' + esc(t(D.UI.tagline)) + '</p>' +
      '<p class="hero-sub">' + esc(t(D.UI.subtitle)) + '</p>' +
      '<a class="scroll-hint" href="#verdict">' + esc(t(D.UI.scroll)) + ' <span class="arrow">↓</span></a>';
    // hero стартує одразу після монтажу — не чекає скролу
    requestAnimationFrame(function () { hero.classList.add('ready'); });
  }

  // ---------- Топбар ----------
  function renderTopbar() {
    var langUk = document.getElementById('lang-uk');
    var langEn = document.getElementById('lang-en');
    langUk.classList.toggle('is-active', lang === 'uk');
    langEn.classList.toggle('is-active', lang === 'en');
    langUk.setAttribute('aria-pressed', String(lang === 'uk'));
    langEn.setAttribute('aria-pressed', String(lang === 'en'));
    var mb = document.getElementById('motion-btn');
    var full = motion ? t(D.UI.motionOn) : t(D.UI.motionOff);
    // на вузьких екранах — короткий підпис (стан видно кольором), щоб шапка не переповнювалась
    // навіть із системним fallback-шрифтом до завантаження webfont
    var narrow = window.matchMedia && window.matchMedia('(max-width: 480px)').matches;
    mb.textContent = narrow ? t(D.UI.motionShort) : full;
    mb.setAttribute('aria-label', full);
    mb.setAttribute('title', full);
    mb.setAttribute('aria-pressed', String(motion));
  }

  // ---------- Футер ----------
  function renderFooter() {
    var f = document.getElementById('credits');
    f.innerHTML =
      '<div class="wrap narrow" style="margin-inline:auto">' +
      '<div class="end">' + esc(t(D.UI.credits)) + '</div>' +
      '<p class="cta reveal">' + esc(t(D.UI.footerCta)) + '</p>' +
      '<p class="fine">© 2026 · «НЕ ЖАЛЬ» / “NO STING” · CC BY 4.0 texts · ' + sourceOrder.length + ' sources cited</p>' +
      '</div>';
  }

  // ---------- Reveal (IntersectionObserver) ----------
  var io = null;

  // Готує схему до анімації: довжина кожної лінії + послідовність розкриття,
  // щоб малюнок з'являвся в тому порядку, у якому читається сенс.
  function prepareFigure(panel) {
    var draws = panel.querySelectorAll('.draw');
    for (var i = 0; i < draws.length; i++) {
      var p = draws[i], len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 0; }
      if (!len) continue;
      p.style.setProperty('--len', len.toFixed(1));
      p.style.setProperty('--draw-delay', (200 + i * 160) + 'ms');
    }
    ['.pop', '.grow-x', '.grow-y'].forEach(function (sel) {
      var els = panel.querySelectorAll(sel);
      for (var k = 0; k < els.length; k++) {
        els[k].style.setProperty('--pop-delay', (180 + k * 90) + 'ms');
      }
    });
  }

  // Гарантія видимості: якщо IO з будь-якої причини не позначив елементи
  // у в'юпорті (deep-link, bfcache, енергоощадний режим) — показуємо примусово.
  function forceRevealVisible() {
    var vh = window.innerHeight || 800;
    document.querySelectorAll('.pre').forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < vh * 1.15 && r.bottom > -vh * 0.15) {
        n.classList.add('in');
        n.classList.remove('pre');
        if (io) io.unobserve(n);
      }
    });
    var hero = document.querySelector('.hero');
    if (hero) hero.classList.add('ready');
  }
  function scheduleRevealSafety() {
    setTimeout(forceRevealVisible, 900);
    setTimeout(forceRevealVisible, 2200);
  }

  function setupReveal() {
    if (io) io.disconnect();
    var panels = document.querySelectorAll('.sci-panel');
    if (!motion || !('IntersectionObserver' in window)) return;
    for (var i = 0; i < panels.length; i++) prepareFigure(panels[i]);
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          e.target.classList.remove('pre');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    // Ховаємо (.pre) ЛИШЕ те, що зараз нижче в'юпорту, і лише його спостерігаємо.
    var vh0 = window.innerHeight || 800;
    document.querySelectorAll('.reveal, .dossier, .chapter-head, .myth, .sci-panel')
      .forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.top > vh0 * 0.9) { n.classList.add('pre'); io.observe(n); }
      });
  }

  // ---------- Рендер усього ----------
  function render() {
    sourceOrder = [];
    root.setAttribute('lang', lang);
    root.classList.toggle('motion-on', motion);
    root.classList.toggle('motion-off', !motion);
    renderHero();

    var main = document.getElementById('story');
    main.innerHTML = '';
    main.appendChild(verdictBlock());
    D.CHAPTERS.forEach(function (ch) { main.appendChild(chapterSection(ch)); });
    main.appendChild(sourcesSection()); // будує стіну з накопиченого sourceOrder
    renderFooter();
    renderTopbar();
    jumpToHash();          // стрибок ДО observe: якірні елементи одразу у в'юпорті
    setupReveal();
    scheduleRevealSafety();
  }

  // Deep-link: контент рендериться JS-ом, тож стрибок на #anchor робимо після рендеру
  function jumpToHash() {
    var h = location.hash;
    if (!h || h.length < 2) return;
    var target = document.getElementById(h.slice(1));
    if (!target) return;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start' });
    root.style.scrollBehavior = prev;
  }

  // ---------- Події ----------
  function announce(msg) { var n = document.getElementById('a11y-live'); if (n) n.textContent = msg; }
  function setLang(l) {
    lang = l; lsSet('nz-lang', l); render();
    announce(l === 'uk' ? 'Мова: українська' : 'Language: English');
  }
  function toggleMotion() {
    motion = !motion; lsSet('nz-motion', motion ? 'on' : 'off'); render();
    announce(motion ? t(D.UI.motionOn) : t(D.UI.motionOff));
  }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function init() {
    if (/[?&]compact\b/.test(location.search)) root.classList.add('compact');
    if (window.NZ_DEFS) window.NZ_DEFS.inject();
    document.getElementById('lang-uk').addEventListener('click', function () { setLang('uk'); });
    document.getElementById('lang-en').addEventListener('click', function () { setLang('en'); });
    document.getElementById('motion-btn').addEventListener('click', toggleMotion);
    render();
  }
  // Стійко до того, що скрипт може стартувати вже після побудови DOM (напр. в Artifact)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  // Повтор стрибка після повного завантаження (шрифти зсувають розкладку) і на зміну хеша
  if (window.matchMedia) {
    var mq = window.matchMedia('(max-width: 480px)');
    (mq.addEventListener ? mq.addEventListener('change', renderTopbar) : mq.addListener(renderTopbar));
  }
  window.addEventListener('load', function () { jumpToHash(); forceRevealVisible(); });
  window.addEventListener('hashchange', function () { jumpToHash(); forceRevealVisible(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) forceRevealVisible(); });
})();
