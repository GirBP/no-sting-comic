# Розгортання «НЕ ЖАЛЬ»

Сайт — чиста статика без білд-кроку. Розгортання = віддати теку як є.

## Крок 0. Підставити домен (обов'язково перед публікацією)
У трьох файлах є заповнювач `REPLACE-WITH-DOMAIN` — рядок, який ще не є справжнім
доменом і його треба замінити перед публікацією. Заміни його на реальний домен
(без `https://`), напр. `nezhal.pages.dev` або власний:

```bash
DOMAIN="nezhal.pages.dev"
sed -i '' "s#REPLACE-WITH-DOMAIN#${DOMAIN}#g" index.html sitemap.xml robots.txt
```

Файли, де це вживається: `index.html` (canonical, og:image, twitter:image),
`sitemap.xml` (`<loc>` + hreflang), `robots.txt` (Sitemap).

## Крок 1. Згенерувати растровий OG (якщо ще нема `assets/og.png`)
Соцмережі (Threads/Twitter/Facebook) НЕ рендерять SVG у прев'ю — потрібен PNG 1200×630.
Варіанти (будь-який):

```bash
# А) rsvg-convert (Homebrew: brew install librsvg)
rsvg-convert -w 1200 -h 630 assets/og.svg -o assets/og.png

# Б) Python cairosvg (pip install cairosvg)
python3 -c "import cairosvg; cairosvg.svg2png(url='assets/og.svg', write_to='assets/og.png', output_width=1200, output_height=630)"

# В) macOS QuickLook (без встановлень, якість гірша)
qlmanage -t -s 1200 -o assets assets/og.svg && mv assets/og.svg.png assets/og.png
```

Перевір, що `assets/og.png` існує і важить < 1 МБ.

## Крок 2. Розгортання

### Cloudflare Pages (рекомендовано)
1. Створи git-репозиторій і відправ його (див. нижче).
2. Cloudflare Dashboard → Pages → Create → Connect to Git → обери репо.
3. Build command: **порожньо**. Build output directory: **/** (корінь).
4. Deploy. Отримаєш `*.pages.dev` — це і є домен для Кроку 0.

### GitHub Pages
1. Відправ у GitHub (гілка `main`).
2. Repo → Settings → Pages → Source: **Deploy from a branch** → `main` / `root`.
3. Файл `.nojekyll` уже є (щоб Pages віддавав усе як статику).

### Відправлення в git (спільне для обох)
```bash
git remote add origin git@github.com:<user>/nezhal.git
git push -u origin main
```

## Крок 3. Перевірка після публікації
- Відкрий домен: сайт вантажиться, перемикач UK/EN і тумблер руху працюють.
- Попередній перегляд посилання: встав URL у Threads-чернетку або https://www.opengraph.xyz/
  — має показати OG-картку.
- `https://<домен>/sitemap.xml` і `/robots.txt` віддаються.
- `node tools/check.mjs` локально — зелений.

## Крок 4. Дистрибуція (Threads / @dont_sting)
- Публікація нарізкою: одна міф-картка = один допис, з посиланням на відповідну главу
  (`https://<домен>/#ch3`).
- UTM-мітки для відстеження джерела трафіку:
  `https://<домен>/?utm_source=threads&utm_medium=social&utm_campaign=launch#ch3`
- Заклик до дії у футері веде на «Вулик знань» — переконайся, що він уже розгорнутий.

## Аналітика (опційно, privacy-first)
Свідомо не вбудовано жодного засобу стеження (принцип «без зовнішніх CDN» + privacy-by-default).
Якщо потрібна статистика — додай один рядок перед `</body>` (self-host Umami/Plausible
або хмарний Plausible; це єдиний дозволений виняток щодо зовнішнього скрипта):
```html
<!-- <script defer data-domain="ТВІЙ-ДОМЕН" src="https://plausible.io/js/script.js"></script> -->
```
