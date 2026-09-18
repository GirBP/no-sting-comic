// Рендер усіх ілюстрацій у PNG для візуальної перевірки очима.
// Запуск: node tools/render-figs.mjs [outDir]   (потрібен rsvg-convert)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = (process.argv[2] || join(root, '.figs')) + '/';
mkdirSync(OUT, { recursive: true });

const C = {
  '--ink': '#0b0a08', '--ink-2': '#141210', '--ink-3': '#1e1a15',
  '--paper': '#e9dcc3', '--paper-dim': '#b6a888',
  '--amber': '#f0a81e', '--amber-deep': '#c9821a', '--honey': '#7a5a1c',
  '--blood': '#d1381f', '--hazard': '#f0c419',
  '--line': '#3a3226', '--line-soft': '#2a2419',
  '--conf-disputed': '#b98cff',
  '--font-display': 'Oswald, sans-serif', '--font-mono': 'monospace',
};
function resolve(s) {
  let out = s;
  for (let i = 0; i < 6; i++) {
    out = out.replace(/var\(([^),]+)(?:,\s*([^)]+))?\)/g, (m, name, fb) => {
      const k = name.trim();
      return C[k] !== undefined ? C[k] : (fb ? fb.trim() : '#888');
    });
  }
  return out;
}

const SCI_FILES = ['primitives', 'waggle', 'uv', 'varroaFeed', 'sting', 'winter',
  'honeyPreserve', 'botulism', 'managedWild', 'smoke', 'hotBall', 'allergy',
  'dialects', 'honeyBank', 'castes', 'index'].map(f => 'figures-sci/' + f + '.js');

const win = {};
for (const f of ['figures-defs.js', 'figures-cast.js', ...SCI_FILES])
  new Function('window', readFileSync(join(root, 'js', f), 'utf8'))(win);

const defs = resolve(win.NZ_DEFS.markup)
  .replace('<svg id="nz-defs" width="0" height="0"', '<svg id="nz-defs"')
  .replace(/style="[^"]*"/, '');

function page(inner, vb, w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}">
<rect width="100%" height="100%" fill="#0b0a08"/>
${defs.replace('<svg', '<g').replace('</svg>', '</g>')}
${inner}
</svg>`;
}
const strip = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

const jobs = [];
for (const k of win.NZ_CAST_ART.keys)
  jobs.push([`cast-${k}`, page(strip(resolve(win.NZ_CAST_ART.render(k, k))), '0 0 200 300', 400, 600)]);
for (const k of win.NZ_SCI.keys)
  jobs.push([`sci-${k}`, page(strip(resolve(win.NZ_SCI.render(k, 'uk', k))), '0 0 480 300', 960, 600)]);

let fail = 0;
for (const [name, content] of jobs) {
  writeFileSync(OUT + name + '.svg', content);
  try { execSync(`rsvg-convert "${OUT}${name}.svg" -o "${OUT}${name}.png"`, { stdio: 'pipe' }); }
  catch (e) { fail++; console.log('FAIL', name, String(e.stderr || e).slice(0, 160)); }
}
console.log(`rendered ${jobs.length - fail}/${jobs.length} → ${OUT}`);
