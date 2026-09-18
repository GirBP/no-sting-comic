// Збирає самодостатній однофайловий бандл для Artifact (шрифти base64, все inline).
// Запуск: node tools/build-artifact.mjs <out.html>
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] || join(root, '.figs', 'nezhal-artifact.html');
const P = (f) => join(root, f);
const b64 = (f) => readFileSync(P('assets/fonts/' + f)).toString('base64');
const font = (f) => `url(data:font/woff2;base64,${b64(f)}) format('woff2')`;

let tokens = readFileSync(P('styles/tokens.css'), 'utf8');
for (const f of ['oswald-cyrillic', 'oswald-latin', 'jbmono-cyrillic', 'jbmono-latin'])
  tokens = tokens.replace(`url('../assets/fonts/${f}.woff2') format('woff2')`, font(f + '.woff2'));

const css = [tokens, ...['base', 'components', 'figures', 'animations', 'responsive']
  .map(f => readFileSync(P('styles/' + f + '.css'), 'utf8'))].join('\n\n');

let html = readFileSync(P('index.html'), 'utf8');
let body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
body = body.replace(/\s*<script src="[^"]+"><\/script>/g, '').trim();

const SCI_FILES = ['primitives', 'waggle', 'uv', 'varroaFeed', 'sting', 'winter',
  'honeyPreserve', 'botulism', 'managedWild', 'smoke', 'hotBall', 'allergy',
  'dialects', 'honeyBank', 'castes', 'index'].map(f => 'figures-sci/' + f);

const js = ['data', 'figures-defs', 'figures-cast', ...SCI_FILES, 'main']
  .map(f => readFileSync(P('js/' + f + '.js'), 'utf8'));

// Панелі в бандл — полегшені копії (q66, ≤1024px), щоб артефакт не роздувся:
// збираємо з оригіналів _art-src/*.png (якщо є), інакше з assets/panels/*.webp як є.
import { existsSync, readdirSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
function buildPanelMap() {
  const src = P('_art-src'), lite = P('.figs/panels-lite');
  const map = {};
  if (existsSync(src)) {
    mkdirSync(lite, { recursive: true });
    for (const f of readdirSync(src)) {
      if (!/^(cast-|fig-|ch[1-5]\.|hero\.)/.test(f) || !f.endsWith('.png')) continue;
      const name = f.replace(/\.png$/, '.webp'), outf = join(lite, name);
      if (!existsSync(outf)) {
        try { execSync(`cwebp -quiet -q 66 -m 6 -resize 1024 0 "${join(src, f)}" -o "${outf}"`); }
        catch (e) { continue; }
      }
      map[name] = 'data:image/webp;base64,' + readFileSync(outf).toString('base64');
    }
  } else if (existsSync(P('assets/panels'))) {
    for (const f of readdirSync(P('assets/panels'))) if (f.endsWith('.webp'))
      map[f] = 'data:image/webp;base64,' + readFileSync(P('assets/panels/' + f)).toString('base64');
  }
  return map;
}
const panelMap = buildPanelMap();
const panelScript = '<script>window.NZ_PANELS=' + JSON.stringify(panelMap) + ';</script>\n';
console.log('панелей у бандлі:', Object.keys(panelMap).length);
const inlinePanels = (h) => h;

writeFileSync(out, inlinePanels(`<title>НЕ ЖАЛЬ</title>\n<style>\n${css}\n</style>\n${body}\n` + panelScript +
  js.map(src => '<script>\n' + src + '\n</script>').join('\n') + '\n'));
console.log('written', out);
