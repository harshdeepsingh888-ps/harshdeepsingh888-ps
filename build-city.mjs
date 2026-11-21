// Generates assets/city.svg: an isometric city where each building is one day
// of the past year's real contributions (contributions.json from the GitHub API).
// Days are laid out in date order, row by row, so the city reads like a block map.
// Refresh data: gh api graphql ... > github-profile/contributions.json, then re-run.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "assets");
mkdirSync(out, { recursive: true });
const cal = JSON.parse(readFileSync(join(here, "contributions.json"), "utf8"));
const year = cal.weeks.flatMap((w) => w.contributionDays);
const startIdx = year.findIndex((d) => d.contributionCount > 0); // city starts at the first active day
const all = year.slice(startIdx);
const total = cal.totalContributions;
const active = all.filter((d) => d.contributionCount > 0).length;
let streak = 0, cur = 0;
for (const d of all) { cur = d.contributionCount ? cur + 1 : 0; streak = Math.max(streak, cur); }
const busiest = all.reduce((a, b) => (b.contributionCount > a.contributionCount ? b : a));
const fmt = (iso) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const COLS = 15, ROWS = Math.ceil(all.length / COLS);
const W = 900, H = 360, cw = 17, ch = 8.5, OX = 24 + ROWS * cw + cw, OY = 82, unit = 3.6;
const K = { bg: "#0d1020", tile: "#151a33", edge: "#222a52", ink: "#e8ecff", mute: "#8892bf" };
const tier = (c) => (c >= 10 ? "#f472b6" : c >= 6 ? "#a78bfa" : c >= 3 ? "#60a5fa" : "#2dd4bf");
const shade = (hex, f) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * f).toString(16).padStart(2, "0")).join("");
const f = (v) => v.toFixed(1);
const font = `font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"`;

let flat = "";
const towers = [];
all.forEach((d, i) => {
  const col = i % COLS, row = Math.floor(i / COLS), c = d.contributionCount;
  const sx = OX + (col - row) * cw, sy = OY + (col + row) * ch;
  if (!c) {
    flat += `<polygon points="${f(sx)},${f(sy)} ${f(sx + cw)},${f(sy + ch)} ${f(sx)},${f(sy + 2 * ch)} ${f(sx - cw)},${f(sy + ch)}" fill="${K.tile}" stroke="${K.edge}" stroke-width=".6"/>`;
    return;
  }
  const isTop = d === busiest;
  const base = isTop ? "#fde047" : tier(c);
  const h = 4 + Math.min(c, 20) * unit;
  const yT = sy - h;
  const top = `${f(sx)},${f(yT)} ${f(sx + cw)},${f(yT + ch)} ${f(sx)},${f(yT + 2 * ch)} ${f(sx - cw)},${f(yT + ch)}`;
  const left = `${f(sx - cw)},${f(yT + ch)} ${f(sx)},${f(yT + 2 * ch)} ${f(sx)},${f(sy + 2 * ch)} ${f(sx - cw)},${f(sy + ch)}`;
  const right = `${f(sx + cw)},${f(yT + ch)} ${f(sx)},${f(yT + 2 * ch)} ${f(sx)},${f(sy + 2 * ch)} ${f(sx + cw)},${f(sy + ch)}`;
  const delay = ((col + row) * 0.09).toFixed(2);
  towers.push({ order: col + row, svg: `<g><title>${fmt(d.date)}: ${c} contribution${c > 1 ? "s" : ""}</title><polygon points="${left}" fill="${shade(base, 0.62)}"/><polygon points="${right}" fill="${shade(base, 0.42)}"/><polygon points="${top}" fill="${base}"/><animate attributeName="opacity" values=".72;1;.72" dur="3.2s" begin="-${delay}s" repeatCount="indefinite"/></g>` });
});
towers.sort((a, b) => a.order - b.order);
const tw = towers.map((t) => t.svg).join("");

const stat = (x, y, v, l, col) => `<text x="${x}" y="${y}" fill="${col}" font-size="28" font-weight="700">${v}</text><text x="${x}" y="${y + 17}" fill="${K.mute}" font-size="11">${l}</text>`;
const leg = [["#2dd4bf", "1–2"], ["#60a5fa", "3–5"], ["#a78bfa", "6–9"], ["#f472b6", "10+"], ["#fde047", "busiest"]]
  .map(([c, l], i) => `<rect x="${600 + i * 54}" y="316" width="10" height="10" fill="${c}"/><text x="${614 + i * 54}" y="325" fill="${K.mute}" font-size="10">${l}</text>`).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Isometric city of ${total} contributions over the past year, one building per day; ${active} active days, longest streak ${streak} days.">
<rect width="${W}" height="${H}" rx="14" fill="${K.bg}"/>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="13" fill="none" stroke="${K.edge}" stroke-width="2"/>
${flat}${tw}
<g ${font}>
<text x="600" y="62" fill="${K.ink}" font-size="24" font-weight="700">${total}</text>
<text x="600" y="82" fill="${K.ink}" font-size="13" letter-spacing="1">CONTRIBUTIONS, 1 YEAR</text>
<text x="600" y="102" fill="${K.mute}" font-size="11">one building per day since ${fmt(all[0].date)}</text>
${stat(600, 160, active, "ACTIVE DAYS", "#2dd4bf")}${stat(740, 160, streak, "DAY LONGEST STREAK", "#a78bfa")}${stat(600, 224, busiest.contributionCount, "BUSIEST DAY · " + fmt(busiest.date).toUpperCase(), "#fde047")}
<text x="600" y="306" fill="${K.mute}" font-size="10">HEIGHT = CONTRIBUTIONS THAT DAY</text>${leg}
</g></svg>`;
writeFileSync(join(out, "city.svg"), svg);
console.log({ total, active, streak, busiest: busiest.date + " " + busiest.contributionCount, buildings: towers.length, bytes: svg.length });
