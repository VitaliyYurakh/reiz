/**
 * Week-over-week GSC diff report.
 *
 * Compares the two most recent (or two explicitly given) dated snapshots
 * under _audit/gsc/ and reports position/click/impression deltas grouped
 * by city, plus top query movers. Position is "lower = better", so a
 * negative delta means the page/query improved.
 *
 * Usage:
 *   node diff.mjs                    # latest two snapshots
 *   node diff.mjs 2026-04-23 2026-05-04
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const GSC_DIR = resolve(import.meta.dirname, "../../_audit/gsc");
// Impressions threshold below which position deltas are noise, not signal.
const MIN_IMPRESSIONS = 15;
const TOP_N = 12;

function parseCsv(path) {
	const map = new Map();
	if (!existsSync(path)) return map;
	const lines = readFileSync(path, "utf-8").trim().split("\n");
	// Skip header (line 0) — column order is fixed regardless of RU/EN label.
	for (const line of lines.slice(1)) {
		const cols = line.split(",");
		if (cols.length < 5) continue;
		const key = cols[0];
		const clicks = Number(cols[1]) || 0;
		const impressions = Number(cols[2]) || 0;
		const ctr = Number.parseFloat(cols[3]) || 0;
		const position = Number.parseFloat(cols[4]) || 0;
		map.set(key, { key, clicks, impressions, ctr, position });
	}
	return map;
}

function loadSnapshot(date) {
	const dir = resolve(GSC_DIR, date);
	const metaPath = resolve(dir, "meta.json");
	const windowDays = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf-8")).windowDays : undefined;
	return {
		date,
		pages: parseCsv(resolve(dir, "pages.csv")),
		queries: parseCsv(resolve(dir, "queries.csv")),
		windowDays,
	};
}

function pickLatestTwo() {
	const dates = readdirSync(GSC_DIR, { withFileTypes: true })
		.filter((d) => d.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(d.name))
		.map((d) => d.name)
		.sort();
	if (dates.length < 2) {
		throw new Error(`Need at least 2 dated snapshots under ${GSC_DIR}, found ${dates.length}`);
	}
	return [dates[dates.length - 2], dates[dates.length - 1]];
}

// / and /{locale} both mean the Lviv pillar page (home = Lviv, by design).
function cityOf(url) {
	let path;
	try {
		path = new URL(url).pathname;
	} catch {
		path = url;
	}
	path = path.replace(/^\/(ru|en|pl|ro)(?=\/|$)/, "") || "/";
	const m = path.match(/^\/rental\/([a-z-]+)\/?$/);
	if (m) return m[1];
	if (path === "/") return "lviv";
	return null;
}

function diffMaps(oldMap, newMap) {
	const keys = new Set([...oldMap.keys(), ...newMap.keys()]);
	const out = [];
	for (const key of keys) {
		const o = oldMap.get(key);
		const n = newMap.get(key);
		if (o && n) {
			if (Math.max(o.impressions, n.impressions) < MIN_IMPRESSIONS) continue;
			out.push({
				key,
				oldPos: o.position,
				newPos: n.position,
				delta: n.position - o.position,
				oldImpr: o.impressions,
				newImpr: n.impressions,
				oldClicks: o.clicks,
				newClicks: n.clicks,
				status: "moved",
			});
		} else if (n && !o) {
			if (n.impressions < MIN_IMPRESSIONS) continue;
			out.push({
				key,
				oldPos: 0,
				newPos: n.position,
				delta: -Infinity,
				oldImpr: 0,
				newImpr: n.impressions,
				oldClicks: 0,
				newClicks: n.clicks,
				status: "new",
			});
		} else if (o && !n) {
			if (o.impressions < MIN_IMPRESSIONS) continue;
			out.push({
				key,
				oldPos: o.position,
				newPos: 0,
				delta: Infinity,
				oldImpr: o.impressions,
				newImpr: 0,
				oldClicks: o.clicks,
				newClicks: 0,
				status: "dropped",
			});
		}
	}
	return out;
}

function fmtDelta(d) {
	if (d.status === "new") return `NEW @ ${d.newPos.toFixed(1)} (${d.newImpr} impr)`;
	if (d.status === "dropped") return `DROPPED OUT (was ${d.oldPos.toFixed(1)}, ${d.oldImpr} impr)`;
	const arrow = d.delta < 0 ? "▲ improved" : d.delta > 0 ? "▼ declined" : "= flat";
	return `${d.oldPos.toFixed(1)} -> ${d.newPos.toFixed(1)} (${arrow} ${Math.abs(d.delta).toFixed(1)})`;
}

function main() {
	const args = process.argv.slice(2);
	const [oldDate, newDate] = args.length === 2 ? args : pickLatestTwo();

	const oldSnap = loadSnapshot(oldDate);
	const newSnap = loadSnapshot(newDate);

	const lines = [];
	lines.push(`# GSC diff: ${oldDate} -> ${newDate}`);
	lines.push("");

	if (oldSnap.windowDays && newSnap.windowDays && oldSnap.windowDays !== newSnap.windowDays) {
		lines.push(
			`> ⚠️ Window mismatch: ${oldDate} covers ${oldSnap.windowDays}d, ${newDate} covers ${newSnap.windowDays}d. Deltas below are not apples-to-apples.`,
		);
		lines.push("");
	} else if (!oldSnap.windowDays || !newSnap.windowDays) {
		lines.push(
			"> ⚠️ At least one snapshot has no meta.json (manual CSV export) — window size unverified. Confirm both exports used the same GSC date range before trusting deltas.",
		);
		lines.push("");
	}

	// --- Pages, grouped by city ---
	const pageDeltas = diffMaps(oldSnap.pages, newSnap.pages);
	const byCity = new Map();
	const nonCity = [];
	for (const d of pageDeltas) {
		const city = cityOf(d.key);
		if (city) {
			if (!byCity.has(city)) byCity.set(city, []);
			byCity.get(city).push(d);
		} else {
			nonCity.push(d);
		}
	}

	lines.push("## Pages by city");
	lines.push("");
	const cities = [...byCity.keys()].sort();
	for (const city of cities) {
		const rows = byCity.get(city).sort((a, b) => a.delta - b.delta);
		lines.push(`### ${city}`);
		for (const r of rows) {
			lines.push(`- \`${r.key}\` — ${fmtDelta(r)}, clicks ${r.oldClicks}->${r.newClicks}`);
		}
		lines.push("");
	}

	if (nonCity.length > 0) {
		lines.push("### other pages (blog/cars/static)");
		const sorted = nonCity
			.filter((d) => Number.isFinite(d.delta))
			.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
			.slice(0, TOP_N);
		for (const r of sorted) {
			lines.push(`- \`${r.key}\` — ${fmtDelta(r)}, clicks ${r.oldClicks}->${r.newClicks}`);
		}
		lines.push("");
	}

	// --- Queries: top movers overall ---
	const queryDeltas = diffMaps(oldSnap.queries, newSnap.queries);
	const improved = queryDeltas
		.filter((d) => d.status === "moved" && d.delta < 0)
		.sort((a, b) => a.delta - b.delta)
		.slice(0, TOP_N);
	const declined = queryDeltas
		.filter((d) => d.status === "moved" && d.delta > 0)
		.sort((a, b) => b.delta - a.delta)
		.slice(0, TOP_N);
	const newQueries = queryDeltas
		.filter((d) => d.status === "new")
		.sort((a, b) => b.newImpr - a.newImpr)
		.slice(0, TOP_N);
	const droppedQueries = queryDeltas
		.filter((d) => d.status === "dropped")
		.sort((a, b) => b.oldImpr - a.oldImpr)
		.slice(0, TOP_N);

	lines.push("## Top improved queries");
	for (const r of improved) lines.push(`- **${r.key}** — ${fmtDelta(r)}, clicks ${r.oldClicks}->${r.newClicks}`);
	lines.push("");

	lines.push("## Top declined queries");
	for (const r of declined) lines.push(`- **${r.key}** — ${fmtDelta(r)}, clicks ${r.oldClicks}->${r.newClicks}`);
	lines.push("");

	if (newQueries.length > 0) {
		lines.push("## New queries (weren't showing before)");
		for (const r of newQueries) lines.push(`- **${r.key}** — ${fmtDelta(r)}`);
		lines.push("");
	}

	if (droppedQueries.length > 0) {
		lines.push("## Dropped queries (no longer showing)");
		for (const r of droppedQueries) lines.push(`- **${r.key}** — ${fmtDelta(r)}`);
		lines.push("");
	}

	const report = lines.join("\n");
	console.log(report);

	const outPath = resolve(GSC_DIR, newDate, "diff-report.md");
	writeFileSync(outPath, report);
	console.error(`\n(also written to ${outPath})`);
}

main();
