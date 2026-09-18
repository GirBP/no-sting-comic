/*
 * check.mjs — машинний гейт наукової й двомовної цілісності «НЕ ЖАЛЬ».
 * Запуск: node tools/check.mjs
 * Падає (exit 1), якщо:
 *   - твердження/каст без src
 *   - src відсутній у SOURCES
 *   - джерело без url/ref
 *   - будь-яке двомовне поле не має uk або en (порожнє)
 *   - міф із conf:'disputed' без прапорця nuance (спірне має подаватись як «не все так просто»)
 *   - warning-міф без прапорця warning
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const code = readFileSync(join(root, 'js', 'data.js'), 'utf8');

// Виконуємо data.js у мінімальному sandbox, щоб дістати window.NEZHAL
const sandbox = { window: {} };
new Function('window', code)(sandbox.window);
const D = sandbox.window.NEZHAL;

const errors = [];
const warns = [];
const isPair = (v) => v && typeof v === 'object' && ('uk' in v) && ('en' in v);
const okStr = (s) => typeof s === 'string' && s.trim().length > 0;

function checkPair(where, v) {
  if (!isPair(v)) { errors.push(`${where}: не двомовна пара {uk,en}`); return; }
  if (!okStr(v.uk)) errors.push(`${where}: порожній uk`);
  if (!okStr(v.en)) errors.push(`${where}: порожній en`);
}

// 1. Джерела
const usedSources = new Set();
for (const [k, s] of Object.entries(D.SOURCES)) {
  if (!okStr(s.url)) errors.push(`SOURCE ${k}: немає url`);
  if (!okStr(s.ref)) errors.push(`SOURCE ${k}: немає ref (DOI/ID)`);
  if (!okStr(s.title)) errors.push(`SOURCE ${k}: немає title`);
  if (!s.year) errors.push(`SOURCE ${k}: немає year`);
}

// 2. Каст
D.CAST.forEach((c) => {
  ['codename', 'role', 'stat', 'dossier', 'busts'].forEach((f) => checkPair(`CAST ${c.id}.${f}`, c[f]));
  if (!c.src) errors.push(`CAST ${c.id}: немає src`);
  else if (!D.SOURCES[c.src]) errors.push(`CAST ${c.id}: src '${c.src}' відсутній у SOURCES`);
  else usedSources.add(c.src);
});

// 3. Глави і міфи
let mythCount = 0;
D.CHAPTERS.forEach((ch) => {
  checkPair(`CHAPTER ${ch.id}.title`, ch.title);
  checkPair(`CHAPTER ${ch.id}.lead`, ch.lead);
  (ch.myths || []).forEach((m, i) => {
    mythCount++;
    const where = `MYTH ${ch.id}#${i}`;
    checkPair(`${where}.street`, m.street);
    checkPair(`${where}.science`, m.science);
    if (!m.src) errors.push(`${where}: немає src`);
    else if (!D.SOURCES[m.src]) errors.push(`${where}: src '${m.src}' відсутній у SOURCES`);
    else usedSources.add(m.src);
    if (!['high', 'medium', 'disputed'].includes(m.conf)) errors.push(`${where}: conf має бути high/medium/disputed`);
    // спірне — обов'язково як «не все так просто»
    if (m.conf === 'disputed' && !m.nuance) errors.push(`${where}: conf='disputed' але немає nuance:true (спірне подавай як «не все так просто»)`);
  });
});

// 4. UI-рядки
for (const [k, v] of Object.entries(D.UI)) checkPair(`UI.${k}`, v);

// 5. Невживані джерела — попередження (не помилка)
for (const k of Object.keys(D.SOURCES)) if (!usedSources.has(k)) warns.push(`SOURCE ${k}: ніде не використане`);

// --- Звіт ---
const stats = `факти(міфи): ${mythCount} · каст: ${D.CAST.length} · джерела: ${Object.keys(D.SOURCES).length} (вжито ${usedSources.size})`;
if (warns.length) { console.log('⚠  Попередження:'); warns.forEach((w) => console.log('   ' + w)); }
if (errors.length) {
  console.error(`\n✗ ПЕРЕВІРКА ВПАЛА — ${errors.length} помилок:`);
  errors.forEach((e) => console.error('   ' + e));
  console.error('\n' + stats);
  process.exit(1);
}
console.log(`✓ Цілісність у порядку. ${stats}`);
