/**
 * Google Search Console — weekly snapshot fetcher
 *
 * Pulls the last 28 days of Performance data (pages + queries) via the
 * Search Console API and writes it into _audit/gsc/YYYY-MM-DD/ in the same
 * CSV shape as the manual GSC UI exports already stored there, so existing
 * tooling (diff.mjs, seo-auditor agent) doesn't care which way the data
 * arrived.
 *
 * Usage: node fetch.mjs
 * Requires: ../../service-account.json with Search Console read access
 *   (already granted to indexing-bot@reiz-indexing.iam.gserviceaccount.com)
 */

import { google } from "googleapis";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const KEY_PATH = resolve(import.meta.dirname, "../../service-account.json");
const SC_SITE_URL = "sc-domain:reiz.com.ua";
const ROW_LIMIT = 5000;
// GSC data is incomplete for the most recent 2-3 days — end the window there.
const LAG_DAYS = 3;
const WINDOW_DAYS = 28;

function fmtDate(d) {
	return d.toISOString().slice(0, 10);
}

async function getAuthClient() {
	const key = JSON.parse(readFileSync(KEY_PATH, "utf-8"));
	const auth = new google.auth.GoogleAuth({
		credentials: key,
		scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
	});
	return auth.getClient();
}

async function fetchDimension(authClient, dimension, startDate, endDate) {
	const searchconsole = google.searchconsole({ version: "v1", auth: authClient });
	const res = await searchconsole.searchanalytics.query({
		siteUrl: SC_SITE_URL,
		requestBody: {
			startDate,
			endDate,
			dimensions: [dimension],
			rowLimit: ROW_LIMIT,
		},
	});
	return (res.data.rows ?? []).map((r) => ({
		key: r.keys?.[0] ?? "",
		clicks: r.clicks ?? 0,
		impressions: r.impressions ?? 0,
		ctr: r.ctr ?? 0,
		position: r.position ?? 0,
	}));
}

function toCsv(header, rows) {
	const lines = [header];
	for (const r of rows) {
		lines.push(
			[r.key, r.clicks, r.impressions, `${(r.ctr * 100).toFixed(2)}%`, r.position.toFixed(2)].join(","),
		);
	}
	return `${lines.join("\n")}\n`;
}

async function main() {
	const end = new Date();
	end.setDate(end.getDate() - LAG_DAYS);
	const start = new Date(end);
	start.setDate(start.getDate() - (WINDOW_DAYS - 1));

	const startDate = fmtDate(start);
	const endDate = fmtDate(end);
	console.log(`Fetching GSC data for ${startDate}..${endDate} (${WINDOW_DAYS}d window)`);

	const authClient = await getAuthClient();
	const [pages, queries] = await Promise.all([
		fetchDimension(authClient, "page", startDate, endDate),
		fetchDimension(authClient, "query", startDate, endDate),
	]);

	const today = fmtDate(new Date());
	const outDir = resolve(import.meta.dirname, `../../_audit/gsc/${today}`);
	mkdirSync(outDir, { recursive: true });

	writeFileSync(resolve(outDir, "pages.csv"), toCsv("page,clicks,impressions,ctr,position", pages));
	writeFileSync(resolve(outDir, "queries.csv"), toCsv("query,clicks,impressions,ctr,position", queries));
	writeFileSync(
		resolve(outDir, "meta.json"),
		`${JSON.stringify(
			{ startDate, endDate, windowDays: WINDOW_DAYS, fetchedAt: new Date().toISOString(), source: "api" },
			null,
			2,
		)}\n`,
	);

	console.log(`Wrote ${pages.length} pages, ${queries.length} queries -> ${outDir}`);

	if (!existsSync(outDir)) {
		throw new Error("output dir missing after write — unexpected");
	}
}

main().catch((err) => {
	console.error("FAILED:", err?.response?.data || err.message || err);
	process.exit(1);
});
