// Generates the designed sections of the profile README:
// assets/cards/*.svg (project cards), now.svg, stack.svg, h-*.svg (headers), btn-*.svg (links).
// Run: node github-profile/build-site.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "assets");
mkdirSync(join(out, "cards"), { recursive: true });

const C = { bg: "#0d1020", panel: "#151a33", edge: "#2b3563", ink: "#e8ecff", mute: "#8892bf", orange: "#fb923c", green: "#4ade80", yellow: "#fde047", blue: "#60a5fa", pink: "#f472b6", purple: "#a78bfa", teal: "#2dd4bf" };
const font = `font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const svgWrap = (w, h, label, body, defs = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}"><defs>${defs}</defs><g ${font}>${body}</g></svg>`;
const save = (name, s) => writeFileSync(join(out, name), s);

// ---------- icons (drawn in a 100x100 box, placed at card right) ----------
const A = (attrs, inner = "") => inner;
const icons = {
  devforge: (c) => `<path d="M30 12 V88" stroke="${c}" stroke-width="3" fill="none"/><path id="br" d="M30 34 Q70 36 70 62" stroke="${c}" stroke-width="3" fill="none"/>
<circle cx="30" cy="12" r="6" fill="${C.panel}" stroke="${c}" stroke-width="3"/><circle cx="30" cy="50" r="6" fill="${C.panel}" stroke="${c}" stroke-width="3"/><circle cx="30" cy="88" r="6" fill="${C.panel}" stroke="${c}" stroke-width="3"/><circle cx="70" cy="66" r="6" fill="${C.panel}" stroke="${c}" stroke-width="3"/>
<circle r="3.5" fill="#fff"><animateMotion dur="3s" repeatCount="indefinite" path="M30 12 V88"/></circle><circle r="3.5" fill="#fff"><animateMotion dur="3s" begin="-1.5s" repeatCount="indefinite" path="M30 34 Q70 36 70 62"/></circle>`,
  gatepulse: (c) => `<rect x="12" y="20" width="9" height="62" fill="${c}"/><rect x="79" y="20" width="9" height="62" fill="${c}"/><rect x="12" y="20" width="76" height="6" fill="${c}" opacity=".5"/>
<polyline points="2,56 24,56 32,36 42,76 52,30 60,66 68,56 98,56" fill="none" stroke="#fff" stroke-width="2.6" stroke-dasharray="40 160"><animate attributeName="stroke-dashoffset" from="0" to="-200" dur="2.2s" repeatCount="indefinite"/></polyline>`,
  syncroom: (c) => `<rect x="8" y="14" width="84" height="54" rx="6" fill="none" stroke="${c}" stroke-width="3"/><polygon points="42,28 42,56 66,42" fill="${c}"/>
<circle cx="34" cy="84" r="5" fill="${c}"><animate attributeName="opacity" values="1;.25;1" dur="1.6s" repeatCount="indefinite"/></circle><circle cx="66" cy="84" r="5" fill="${c}"><animate attributeName="opacity" values=".25;1;.25" dur="1.6s" repeatCount="indefinite"/></circle><path d="M42 84 H58" stroke="${c}" stroke-width="2" stroke-dasharray="3 3"/>`,
  voice: (c) => [14, 26, 38, 50, 62, 74, 86].map((x, i) => { const hs = [16, 40, 62, 30, 56, 24, 14][i]; return `<rect x="${x - 4}" y="${50 - hs / 2}" width="8" height="${hs}" rx="3" fill="${c}"><animate attributeName="height" values="${hs};${Math.max(10, 70 - hs)};${hs}" dur="${1.1 + i * 0.12}s" repeatCount="indefinite"/><animate attributeName="y" values="${50 - hs / 2};${50 - Math.max(10, 70 - hs) / 2};${50 - hs / 2}" dur="${1.1 + i * 0.12}s" repeatCount="indefinite"/></rect>`; }).join(""),
  officer: (c) => `<path d="M50 8 L88 22 V52 Q88 78 50 94 Q12 78 12 52 V22 Z" fill="none" stroke="${c}" stroke-width="3.5"/><polygon points="50,30 56,46 73,46 59,56 64,72 50,62 36,72 41,56 27,46 44,46" fill="${c}"><animate attributeName="opacity" values="1;.55;1" dur="2.4s" repeatCount="indefinite"/></polygon>`,
  dsa: (c) => `<path d="M8 70 H40 L56 36 H92" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<g fill="${C.panel}" stroke="#fff" stroke-width="2.5"><circle cx="8" cy="70" r="5"/><circle cx="40" cy="70" r="5"/><circle cx="56" cy="36" r="5"/><circle cx="92" cy="36" r="5"/></g>
<circle r="4.5" fill="#fff"><animateMotion dur="3.4s" repeatCount="indefinite" path="M8 70 H40 L56 36 H92"/></circle>`,
  rutwater: (c) => `<g transform="translate(50 50)"><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2.4s" repeatCount="indefinite"/>${Array.from({ length: 12 }, (_, k) => `<rect x="-4" y="-44" width="8" height="12" rx="2" fill="${c}" transform="rotate(${k * 30})"/>`).join("")}<circle r="32" fill="none" stroke="${c}" stroke-width="4"/><circle r="12" fill="${c}"/><path d="M0 -28 V28 M-28 0 H28" stroke="${c}" stroke-width="3"/></g></g>`,
  needle: (c) => `<ellipse cx="62" cy="50" rx="12" ry="36" fill="none" stroke="${c}" stroke-width="4"><animate attributeName="rx" values="12;3;12" dur="2.4s" repeatCount="indefinite"/></ellipse>
<g><animateTransform attributeName="transform" type="translate" values="-6 6;-6 -6;-6 6" dur="2.4s" repeatCount="indefinite"/><polygon points="8,50 40,38 40,62" fill="#fff"/><polygon points="8,50 -2,42 -2,58" fill="${c}"/></g>`,
};

// ---------- project cards ----------
const chipsSvg = (chips, x, y, col) => {
  let cx = x;
  return chips.map((t) => { const w = Math.round(t.length * 6.7 + 16); const s = `<rect x="${cx}" y="${y}" width="${w}" height="22" rx="11" fill="${col}" opacity=".16"/><text x="${cx + w / 2}" y="${y + 15}" fill="${col}" font-size="11" text-anchor="middle">${esc(t)}</text>`; cx += w + 8; return s; }).join("");
};
const projects = [
  { f: "devforge", name: "Devforge", tag: "DEVELOPER PLATFORM", col: C.blue, ic: "devforge", d: ["Developer operating system: work items,", "ADRs, commits and deploys in one model."], chips: ["Fastify", "Prisma", "PostgreSQL", "React"], fact: "216 tests" },
  { f: "gatepulse", name: "GatePulse", tag: "API GATEWAY", col: C.purple, ic: "gatepulse", d: ["API keys, token-bucket rate limiting and", "traffic analytics in front of your services."], chips: ["Express", "Prisma", "PostgreSQL", "Docker"] },
  { f: "syncroom", name: "SyncRoom", tag: "REAL-TIME", col: C.teal, ic: "syncroom", d: ["A watch party where the server owns", "playback, so everyone stays in lockstep."], chips: ["React 19", "Express 5", "Socket.IO"] },
  { f: "ai-voice-agent", name: "AI Voice Agent", tag: "AI AGENT", col: C.pink, ic: "voice", d: ["Speak a request and it acts on it:", "Whisper, Gemini tool planning, Edge TTS."], chips: ["Python", "FastAPI", "Gemini"] },
  { f: "officer-prep", name: "Officer Prep", tag: "INSTALLABLE PWA", col: C.green, ic: "officer", d: ["Study app for India’s officer exams;", "tests gate every deploy."], chips: ["React", "IndexedDB", "Playwright"] },
  { f: "dsa-metro", name: "DSA Metro", tag: "EDUCATION", col: C.orange, ic: "dsa", d: ["Data structures taught as a metro map,", "from Big-O to dynamic programming."], chips: ["Next.js", "TypeScript"] },
  { f: "rutwater", name: "Rutwater", tag: "BROWSER GAME", col: C.yellow, ic: "rutwater", d: ["Off-road driving in the browser: 4 maps,", "8 vehicles, soft-body damage."], chips: ["three.js", "JavaScript"] },
  { f: "needle-run", name: "Needle Run", tag: "BROWSER GAME", col: C.blue, ic: "needle", d: ["A deep-space arcade game: thread a", "rocket through spinning gates."], chips: ["three.js", "Web Audio"] },
];
for (const p of projects) {
  const W = 440, H = 190;
  const body = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="${C.panel}" stroke="${C.edge}" stroke-width="2"/>
<path d="M14 1 H${W - 14}" stroke="${p.col}" stroke-width="4" stroke-linecap="round"/>
<text x="24" y="38" fill="${p.col}" font-size="10" letter-spacing="2" font-weight="700">${p.tag}</text>
<text x="24" y="72" fill="${C.ink}" font-size="26" font-weight="700">${esc(p.name)}</text>
<text x="24" y="100" fill="${C.mute}" font-size="12">${esc(p.d[0])}</text><text x="24" y="118" fill="${C.mute}" font-size="12">${esc(p.d[1])}</text>
${chipsSvg(p.chips, 24, 140, p.col)}
${p.fact ? `<text x="${W - 24}" y="${H - 22}" fill="${p.col}" font-size="12" font-weight="700" text-anchor="end">${p.fact}</text>` : ""}
<g transform="translate(${W - 130} 26) scale(.95)">${icons[p.ic](p.col)}</g>`;
  save(`cards/${p.f}.svg`, svgWrap(W, H, `${p.name}: ${p.d.join(" ")}`, body));
}

// ---------- section headers ----------
const header = (id, label, col) => {
  const tw = label.length * 8.2 + 28;
  save(`h-${id}.svg`, svgWrap(900, 40, label, `<rect x="0" y="8" width="${tw}" height="24" fill="${col}"/><text x="${tw / 2}" y="25" fill="${C.bg}" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1">${label}</text><path d="M${tw + 14} 20 H900" stroke="${C.edge}" stroke-width="2"/><rect x="${tw + 14}" y="17" width="40" height="6" fill="${col}"><animate attributeName="x" values="${tw + 14};860;${tw + 14}" dur="5s" repeatCount="indefinite"/></rect>`));
};
header("now", "NOW", C.green);
header("activity", "ACTIVITY", C.purple);
header("work", "SELECTED WORK", C.orange);
header("stack", "STACK", C.blue);

// ---------- now panel ----------
const cols = [
  { tag: "NOW", col: C.green, title: "Technical intern, Neubitat", lines: ["Production Next.js sites, a React", "Native (Expo) app, and an AI content", "pipeline built on Claude."] },
  { tag: "BEFORE", col: C.blue, title: "Sole engineer, Zeber", lines: ["AI voice agent: speech recognition,", "LLM tool planning and speech synthesis", "as separate FastAPI services."] },
  { tag: "WON", col: C.yellow, title: "1st, TCS AI Hackathon", lines: ["EcoSort, built with a team of five:", "photograph waste, get its disposal", "stream. 1st of about 130 teams."] },
];
const cw = 284, gap = 24;
const nowBody = cols.map((c, i) => `<g transform="translate(${i * (cw + gap)} 0)"><rect x="1" y="1" width="${cw - 2}" height="158" rx="14" fill="${C.panel}" stroke="${C.edge}" stroke-width="2"/>
<rect x="20" y="20" width="${c.tag.length * 8 + 18}" height="20" fill="${c.col}"/><text x="${20 + (c.tag.length * 8 + 18) / 2}" y="34" fill="${C.bg}" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1">${c.tag}</text>
<text x="20" y="68" fill="${C.ink}" font-size="15" font-weight="700">${esc(c.title)}</text>
${c.lines.map((l, k) => `<text x="20" y="${92 + k * 18}" fill="${C.mute}" font-size="12">${esc(l)}</text>`).join("")}
${i === 0 ? `<circle cx="${cw - 26}" cy="30" r="5" fill="${c.col}"><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></circle>` : ""}</g>`).join("");
save("now.svg", svgWrap(900, 160, "Now: technical intern at Neubitat. Before: sole engineer on the Zeber AI voice agent. Won 1st at the TCS AI Hackathon.", nowBody));

// ---------- stack panel ----------
const rows = [
  ["LANGUAGES", C.blue, ["TypeScript", "Python", "JavaScript", "Dart"]],
  ["BACKEND", C.purple, ["Node.js", "Express", "Fastify", "FastAPI", "Prisma", "PostgreSQL", "MongoDB", "Socket.IO"]],
  ["FRONTEND", C.pink, ["React", "Next.js", "React Native"]],
  ["TOOLING", C.green, ["Docker", "GitHub Actions", "Vitest", "Playwright", "Terraform"]],
];
const stackBody = `<rect x="1" y="1" width="898" height="178" rx="14" fill="${C.panel}" stroke="${C.edge}" stroke-width="2"/>` + rows.map(([l, col, chips], i) => `<text x="24" y="${40 + i * 40}" fill="${col}" font-size="11" font-weight="700" letter-spacing="2">${l}</text>${chipsSvg(chips, 150, 24 + i * 40, col)}`).join("");
save("stack.svg", svgWrap(900, 180, "Stack: " + rows.map((r) => r[0] + " " + r[2].join(", ")).join(". "), stackBody));

// ---------- link buttons ----------
const btn = (id, label, col, d) => save(`btn-${id}.svg`, svgWrap(170, 44, label, `<rect x="1" y="1" width="168" height="42" rx="21" fill="${C.panel}" stroke="${col}" stroke-width="2"/><g transform="translate(20 12)" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</g><text x="52" y="27" fill="${C.ink}" font-size="13" font-weight="700">${label}</text>`));
btn("portfolio", "Portfolio", C.orange, `<circle cx="10" cy="10" r="9"/><path d="M1 10 H19 M10 1 Q4 10 10 19 M10 1 Q16 10 10 19"/>`);
btn("linkedin", "LinkedIn", C.blue, `<rect x="1" y="1" width="18" height="18" rx="3"/><path d="M6 9 V15 M6 6 V6.5 M10 15 V9 M10 11 Q10 9 13 9 Q15 9 15 12 V15"/>`);
btn("resume", "Résumé", C.green, `<path d="M4 1 H12 L17 6 V19 H4 Z M12 1 V6 H17 M7 11 H14 M7 15 H14"/>`);
console.log("ok");
