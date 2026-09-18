#!/usr/bin/env node
// НЕ ЖАЛЬ — справжні мобільні скріншоти через Chrome DevTools Protocol.
// Headless-прапорець --window-size клампить ширину до 500px; CDP-емуляція — ні.
// usage: node tools/shot-cdp.mjs <url> <out.png> [--w=375] [--h=812] [--dsf=2]
//        [--anchor=ch1] [--dy=0] [--full] [--maxh=6000] [--wait=1500] [--desktop]
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const argv = process.argv.slice(2);
const args = Object.fromEntries(argv.filter(a => a.startsWith('--')).map(a => {
  const [k, v] = a.slice(2).split('='); return [k, v === undefined ? true : v];
}));
const [url, out] = argv.filter(a => !a.startsWith('--'));
if (!url || !out) { console.error('usage: shot-cdp.mjs <url> <out.png> [--w --h --dsf --anchor --full]'); process.exit(1); }
const W = +args.w || 375, H = +args.h || 812, DSF = +args.dsf || 2;
const chrome = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
].find(p => fs.existsSync(p));
if (!chrome) { console.error('Chrome не знайдено'); process.exit(1); }
const port = 9333 + Math.floor(Math.random() * 500);
setTimeout(() => { console.error('timeout'); try { proc.kill(); } catch {} process.exit(2); }, +(args.timeout || 40000)).unref();
const proc = spawn(chrome, ['--headless=new', '--no-first-run', '--no-default-browser-check',
  '--hide-scrollbars', '--disable-gpu', `--remote-debugging-port=${port}`,
  ...(args.desktop ? [`--window-size=${W},${H}`] : []),
  `--user-data-dir=/tmp/nz-cdp-${port}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try { const j = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const t = j.find(x => x.type === 'page'); if (t) return t.webSocketDebuggerUrl; } catch {}
    await sleep(200);
  }
  throw new Error('Chrome не піднявся');
}
const ws = new WebSocket(await wsUrl());
await new Promise(r => (ws.onopen = r));
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else if (m.method) events.push(m); };
const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Runtime.enable');
if (!args.desktop) await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DSF, mobile: true, screenWidth: W, screenHeight: H });
if (!args.desktop) {
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
}
await send('Page.navigate', { url: url + (args.anchor ? '#' + args.anchor : '') });
for (let i = 0; i < 150; i++) { if (events.some(e => e.method === 'Page.loadEventFired')) break; await sleep(100); }
// повторне застосування після load — інакше Chrome інколи лишає ширший visual viewport
if (!args.desktop) await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DSF, mobile: true, screenWidth: W, screenHeight: H });
await sleep(+(args.wait || 1500));
if (args.anchor) {
  await send('Runtime.evaluate', { expression: `(function(){var t=document.getElementById('${args.anchor}'); if(t) t.scrollIntoView({block:'start'}); window.scrollBy(0, ${+(args.dy || 0)});})()` });
  await sleep(1300);
}
const m = await send('Runtime.evaluate', { expression: 'JSON.stringify({vw:innerWidth,vh:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,y:Math.round(scrollY),vv:Math.round(visualViewport.width),scale:+visualViewport.scale.toFixed(3),cw:document.documentElement.clientWidth})', returnByValue: true });
const metrics = JSON.parse(m.result.result.value);
const params = { format: 'png' };
if (args.full) { params.captureBeyondViewport = true; params.clip = { x: 0, y: 0, width: W, height: Math.min(+(args.maxh || 6000), metrics.sh), scale: 1 }; }
const shot = await send('Page.captureScreenshot', params);
fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
console.log(out, JSON.stringify(metrics));
if (args.eval) { const r = await send('Runtime.evaluate', { expression: fs.readFileSync(args.eval, 'utf8'), returnByValue: true }); console.log(r.result.result.value ?? JSON.stringify(r.result)); }
ws.close(); proc.kill();
