// Generates assets/game-card.svg: an off-road racer (from the Rutwater game)
// beside real achievements. Run: node github-profile/build-assets.mjs
// The truck follows the scrolling terrain exactly: its height and tilt are
// sampled from the same function that draws the ground.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "assets");
mkdirSync(out, { recursive: true });

const C = { bg: "#0d1020", panel: "#151a33", edge: "#2b3563", ink: "#e8ecff", mute: "#8892bf", ok: "#4ade80", tag: "#fb923c", yellow: "#fde047", blue: "#60a5fa", pink: "#f472b6" };
const font = `font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"`;
const f = (v) => v.toFixed(1);

const W = 900, H = 360, GX = 24, GY = 64, GW = 420, GH = 256;
const P = 420, T = 4, BASE = GY + 196, A1 = 22, A2 = 7; // terrain period, seconds per period, ground level, amplitudes
const ground = (x) => BASE + A1 * Math.sin((2 * Math.PI * x) / P) + A2 * Math.sin((4 * Math.PI * x) / P + 1);
const slope = (x) => A1 * ((2 * Math.PI) / P) * Math.cos((2 * Math.PI * x) / P) + A2 * ((4 * Math.PI) / P) * Math.cos((4 * Math.PI * x) / P + 1);

const sprite = (rows, s, map) => rows.flatMap((r, y) => [...r].map((ch, x) => (map[ch] ? `<rect x="${x * s}" y="${y * s}" width="${s}" height="${s}" fill="${map[ch]}"/>` : ""))).join("");

// ---- sky ----
const bands = ["#1f2347", "#3a2a5c", "#74396e", "#c9607a", "#f19a5c"];
const sky = bands.map((c, i) => `<rect x="${GX}" y="${GY + i * 36}" width="${GW}" height="${i === 4 ? GH - 4 * 36 : 36}" fill="${c}"/>`).join("");
const sun = `<circle cx="${GX + 310}" cy="${GY + 118}" r="30" fill="#ffd27a"/><g fill="#c9607a"><rect x="${GX + 280}" y="${GY + 110}" width="60" height="3"/><rect x="${GX + 280}" y="${GY + 120}" width="60" height="4"/><rect x="${GX + 280}" y="${GY + 131}" width="60" height="5"/></g>`;

// ---- parallax mountains: seamless because shape repeats every P px ----
const ridge = (amp, baseY, phase, fill, dur) => {
  let pts = `${GX},${GY + GH} `;
  for (let x = 0; x <= 2 * P; x += 14) pts += `${f(GX + x)},${f(baseY - amp * (0.5 + 0.5 * Math.sin((2 * Math.PI * x) / P + phase)) - (amp / 3) * Math.abs(Math.sin((6 * Math.PI * x) / P + phase)))} `;
  pts += `${GX + 2 * P},${GY + GH}`;
  return `<g><animateTransform attributeName="transform" type="translate" from="0 0" to="-${P} 0" dur="${dur}s" repeatCount="indefinite"/><polygon points="${pts}" fill="${fill}"/></g>`;
};
const mountains = ridge(70, GY + 175, 0.5, "#4a2d63", 16) + ridge(48, GY + 190, 2.2, "#34214f", 9);

// ---- terrain (scrolls one period per T seconds) ----
let pts = "", top = "";
for (let x = -P / 2; x <= 2 * P + P / 2; x += 10) {
  const p = `${f(GX + x)},${f(ground(x))} `;
  pts += p; top += p;
}
const dirt = `<g><animateTransform attributeName="transform" type="translate" from="0 0" to="-${P} 0" dur="${T}s" repeatCount="indefinite"/>
<polygon points="${GX - P / 2},${GY + GH + 10} ${pts}${GX + 2.5 * P},${GY + GH + 10}" fill="#7a4a24"/>
<polyline points="${top}" fill="none" stroke="#4ade80" stroke-width="4"/>
<polyline points="${top}" fill="none" stroke="#2f9e5a" stroke-width="2" transform="translate(0 5)"/></g>`;

// ---- realistic lifted 4x4: vector art, both wheels track the terrain ----
const X0 = 70;          // rear-wheel terrain x (relative to screen left)
const WB = 110;         // wheel base in px
const RW = 26;          // tire radius
const N = 64;
let ty = "", ang = "";
for (let i = 0; i <= N; i++) {
  const xr = X0 + (i / N) * P, xf = xr + WB;
  const gR = ground(xr), gF = ground(xf);
  const th = Math.atan2(gF - gR, WB);
  const my = (gR + gF) / 2 - RW / Math.cos(th);
  ty += `${f(GX + X0 + WB / 2 - 95)} ${f(my - 100)};`;
  ang += `${f((th * 180) / Math.PI)} 95 100;`;
}
ty = ty.slice(0, -1); ang = ang.slice(0, -1);

const truckDefs = `<linearGradient id="paint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a52"/><stop offset=".45" stop-color="#d81f26"/><stop offset="1" stop-color="#7d0c14"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fd0f2"/><stop offset=".55" stop-color="#3d6a99"/><stop offset="1" stop-color="#14233b"/></linearGradient>
<linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6fb"/><stop offset=".5" stop-color="#8a93a8"/><stop offset="1" stop-color="#d9dde8"/></linearGradient>
<radialGradient id="tire" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#2b2b30"/><stop offset="1" stop-color="#08080b"/></radialGradient>
<radialGradient id="rim" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#a9b1c6"/><stop offset="1" stop-color="#5b6379"/></radialGradient>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="soft2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`;

const wheelAt = (cx) => {
  let blocks = "";
  for (let k = 0; k < 16; k++) blocks += `<rect x="-3.5" y="-27" width="7" height="6" rx="1" fill="#050507" transform="rotate(${k * 22.5})"/>`;
  let spokes = "";
  for (let k = 0; k < 6; k++) spokes += `<rect x="-1.6" y="-13" width="3.2" height="13" fill="#3c4357" transform="rotate(${k * 60})"/>`;
  let lugs = "";
  for (let k = 0; k < 6; k++) lugs += `<circle cx="${(Math.cos((k * Math.PI) / 3) * 6.5).toFixed(2)}" cy="${(Math.sin((k * Math.PI) / 3) * 6.5).toFixed(2)}" r="1.4" fill="#e8ebf4"/>`;
  return `<g transform="translate(${cx} 100)"><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur=".6s" repeatCount="indefinite"/>${blocks}<circle r="25" fill="url(#tire)"/><circle r="22" fill="none" stroke="#17171c" stroke-width="2"/><circle r="15.5" fill="url(#rim)"/><circle r="12" fill="#262a38"/>${spokes}<circle r="8.5" fill="url(#rim)"/>${lugs}<circle r="2.6" fill="#c3281f"/></g></g>`;
};
const smoke = [0, 0.5].map((b) => `<circle cx="88" cy="4" r="3" fill="#aab2c0" opacity="0" filter="url(#soft2)"><animate attributeName="cy" values="4;-36" dur="1s" begin="${b}s" repeatCount="indefinite"/><animate attributeName="r" values="3;9" dur="1s" begin="${b}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".6;0" dur="1s" begin="${b}s" repeatCount="indefinite"/></circle>`).join("");
const dust = [0, 1, 2, 3].map((i) => `<circle cx="14" cy="122" r="6" fill="#d8bd96" opacity="0" filter="url(#soft)"><animate attributeName="cx" values="14;-40" dur="1.1s" begin="${i * 0.27}s" repeatCount="indefinite"/><animate attributeName="cy" values="122;92" dur="1.1s" begin="${i * 0.27}s" repeatCount="indefinite"/><animate attributeName="r" values="5;14" dur="1.1s" begin="${i * 0.27}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0" dur="1.1s" begin="${i * 0.27}s" repeatCount="indefinite"/></circle>`).join("");

const bodyPath = "M8,84 L8,54 Q8,50 12,50 L82,50 L82,36 Q84,26 94,25 L130,25 Q137,25 142,31 L158,50 L184,56 Q192,58 192,66 L192,84 Z";
const truck = `<g><animateTransform attributeName="transform" type="translate" values="${ty}" dur="${T}s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="rotate" values="${ang}" dur="${T}s" repeatCount="indefinite"/>
<ellipse cx="95" cy="127" rx="104" ry="7" fill="#000" opacity=".4" filter="url(#soft)"/>
${dust}
<rect x="86" y="4" width="5" height="48" rx="2" fill="url(#chrome)"/><rect x="86" y="2" width="5" height="4" rx="1" fill="#3a3f52"/>${smoke}
<rect x="22" y="82" width="150" height="9" rx="2" fill="#17181f"/>
<rect x="64" y="76" width="4" height="22" fill="#e0b020"/><rect x="124" y="76" width="4" height="22" fill="#e0b020"/>
<path d="${bodyPath}" fill="url(#paint)"/>
<path d="M12,52 L82,52 M158,52 L184,58" stroke="#ffb0aa" stroke-width="1.4" opacity=".7" fill="none"/>
<rect x="8" y="73" width="184" height="11" fill="#3a090e"/>
<rect x="8" y="73" width="184" height="1.5" fill="#ff7d75" opacity=".35"/>
<path d="M96,29 L129,29 Q134,29 138,34 L150,50 L96,50 Z" fill="url(#glass)"/>
<path d="M99,31 L112,31 L100,49 L99,49 Z" fill="#fff" opacity=".28"/>
<path d="M116,29 L116,50" stroke="#220a0d" stroke-width="2.4"/>
<path d="M96,50 L96,76" stroke="#7a0c14" stroke-width="1.6"/><rect x="104" y="56" width="9" height="2.4" rx="1" fill="#e9ecf5"/>
<path d="M148,44 L156,46 L155,51 L149,50 Z" fill="#1a1c24"/>
<rect x="100" y="19" width="26" height="6" rx="2" fill="#15161d"/><circle cx="105" cy="22" r="1.7" fill="#ffe27a"/><circle cx="112" cy="22" r="1.7" fill="#ffe27a"/><circle cx="119" cy="22" r="1.7" fill="#ffe27a"/>
<rect x="8" y="56" width="4" height="11" rx="1" fill="#ff3b30"/>
<rect x="183" y="59" width="9" height="10" rx="2" fill="#fff6c9"/><rect x="186" y="71" width="6" height="11" fill="#14151c"/><path d="M186,74 H192 M186,77 H192 M186,80 H192" stroke="#4b4f63" stroke-width="1"/>
<polygon points="192,62 270,48 270,82" fill="#fff6c9" opacity=".14"/>
<rect x="186" y="82" width="16" height="7" rx="2" fill="url(#chrome)"/><rect x="-3" y="82" width="14" height="7" rx="2" fill="url(#chrome)"/>
<circle cx="40" cy="100" r="31" fill="#0a0a0f"/><circle cx="150" cy="100" r="31" fill="#0a0a0f"/>
${wheelAt(40)}${wheelAt(150)}
</g></g>`;

// ---- info panel ----
const star = (x, y, c) => `<g fill="${c}"><rect x="${x + 6}" y="${y}" width="4" height="4"/><rect x="${x + 2}" y="${y + 4}" width="12" height="4"/><rect x="${x}" y="${y + 8}" width="16" height="4"/><rect x="${x + 2}" y="${y + 12}" width="12" height="4"/><rect x="${x + 6}" y="${y + 16}" width="4" height="4"/></g>`;
const ach = [
  [C.yellow, "1st place · TCS AI Hackathon ’26", "EcoSort, team of five, 1st of ~130"],
  [C.ok, "Sergeant · National Cadet Corps", "Lance Corporal to Sergeant in 3 years"],
  [C.blue, "216 tests · Devforge", "Fastify + Prisma developer platform"],
  [C.pink, "Installable · Officer Prep", "Offline exam-prep PWA, CI-gated deploys"],
];
const IX = 468;
const achRows = ach.map(([c, t, s], i) => { const y = 168 + i * 36; return `${star(IX, y - 2, c)}<text x="${IX + 28}" y="${y + 8}" fill="${C.ink}" font-size="14" font-weight="700">${t}</text><text x="${IX + 28}" y="${y + 24}" fill="${C.mute}" font-size="11">${s}</text>`; }).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Game card for Harshdeep Singh: an off-road truck racing over hills, with achievements including 1st at the TCS AI Hackathon.">
<defs><pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000" opacity=".14"/></pattern><clipPath id="screen"><rect x="${GX}" y="${GY}" width="${GW}" height="${GH}"/></clipPath>${truckDefs}</defs>
<rect width="${W}" height="${H}" rx="14" fill="${C.bg}"/>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="13" fill="none" stroke="${C.edge}" stroke-width="2"/>
<g ${font}>
<rect x="24" y="22" width="150" height="24" fill="${C.tag}"/><text x="99" y="39" fill="${C.bg}" font-size="13" font-weight="700" text-anchor="middle">OFF-ROAD RACER</text>
<text x="${W - 24}" y="39" fill="${C.mute}" font-size="12" text-anchor="end">@harshdeepsingh888-ps</text>
<rect x="${GX}" y="${GY}" width="${GW}" height="${GH}" fill="${C.panel}"/>
<g clip-path="url(#screen)">${sky}${sun}${mountains}${dirt}${truck}</g>
<rect x="${GX}" y="${GY}" width="${GW}" height="${GH}" fill="none" stroke="${C.edge}" stroke-width="2"/>
<text x="${GX + 10}" y="${GY + 18}" fill="#fff1e8" font-size="11" font-weight="700">RUTWATER</text>
<text x="${GX + GW - 10}" y="${GY + 18}" fill="#fff1e8" font-size="11" text-anchor="end">4 maps · 8 vehicles</text>

<text x="${IX}" y="86" fill="${C.ink}" font-size="26" font-weight="700">Harshdeep Singh</text>
<text x="${IX}" y="108" fill="${C.tag}" font-size="14">Backend &amp; AI engineer</text>
<text x="${IX}" y="128" fill="${C.mute}" font-size="12">New Delhi · B.Tech IT ’28 · Open to SWE internships</text>
<text x="${IX}" y="156" fill="${C.yellow}" font-size="12" font-weight="700">ACHIEVEMENTS</text>
${achRows}
<line x1="24" y1="${H - 30}" x2="${W - 24}" y2="${H - 30}" stroke="${C.edge}" stroke-width="2"/>
<text x="24" y="${H - 11}" fill="${C.ok}" font-size="12" font-weight="700">QUEST</text>
<text x="80" y="${H - 11}" fill="${C.ink}" font-size="12">Technical intern @ Neubitat — Next.js sites, React Native app, AI content pipeline</text>
</g></svg>`;
writeFileSync(join(out, "game-card.svg"), svg);
console.log("ok", svg.length);
