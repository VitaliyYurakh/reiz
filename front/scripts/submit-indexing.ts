/**
 * Google Indexing Script
 *
 * Fetches sitemap, checks indexing status via Search Console API,
 * and submits unindexed URLs via Indexing API.
 *
 * Usage: npx tsx scripts/submit-indexing.ts
 *
 * Requires: ../service-account.json with access to Search Console
 */

import { google } from "googleapis";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_URL = "https://reiz.com.ua";
// For Search Console API: use "sc-domain:reiz.com.ua" for domain property,
// or "https://reiz.com.ua/" for URL-prefix property
const SC_SITE_URL = "sc-domain:reiz.com.ua";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const KEY_PATH = resolve(import.meta.dirname, "../../service-account.json");

// Indexing API limit: 200 requests/day
const INDEXING_LIMIT = 200;
// URL Inspection API limit: 2000 requests/day
const INSPECTION_LIMIT = 600;

interface PageResult {
	url: string;
	indexStatus: string;
	submitted: "OK" | "FAILED" | "—";
}

async function getAuthClient() {
	const key = JSON.parse(readFileSync(KEY_PATH, "utf-8"));
	const auth = new google.auth.GoogleAuth({
		credentials: key,
		scopes: [
			"https://www.googleapis.com/auth/indexing",
			"https://www.googleapis.com/auth/webmasters.readonly",
		],
	});
	return auth.getClient();
}

async function fetchSitemapUrls(): Promise<string[]> {
	console.log(`\nFetching sitemap: ${SITEMAP_URL}`);
	const res = await fetch(SITEMAP_URL);
	const xml = await res.text();

	const urls: string[] = [];

	// Main <loc> URLs (default locale)
	const locRegex = /<loc>([^<]+)<\/loc>/g;
	let match: RegExpExecArray | null;
	while ((match = locRegex.exec(xml)) !== null) {
		urls.push(match[1]);
	}

	// Alternate language URLs from <xhtml:link> tags (/ru/..., /en/..., etc.)
	const altRegex = /xhtml:link[^>]+href="([^"]+)"/g;
	while ((match = altRegex.exec(xml)) !== null) {
		urls.push(match[1]);
	}

	const unique = [...new Set(urls)];
	console.log(`Found ${unique.length} URLs in sitemap (incl. language variants)`);
	return unique;
}

async function checkIndexStatus(
	authClient: Awaited<ReturnType<typeof getAuthClient>>,
	url: string,
): Promise<{ url: string; status: string; isIndexed: boolean }> {
	const searchconsole = google.searchconsole({ version: "v1", auth: authClient });

	try {
		const res = await searchconsole.urlInspection.index.inspect({
			requestBody: {
				inspectionUrl: url,
				siteUrl: SC_SITE_URL,
			},
		});

		const coverageState =
			res.data.inspectionResult?.indexStatusResult?.coverageState ?? "Unknown";
		const verdict = res.data.inspectionResult?.indexStatusResult?.verdict ?? "UNKNOWN";

		return {
			url,
			status: coverageState,
			isIndexed: verdict === "PASS",
		};
	} catch (error: any) {
		const message = error?.message ?? "Unknown error";
		return { url, status: `Error: ${message}`, isIndexed: false };
	}
}

async function submitForIndexing(
	authClient: Awaited<ReturnType<typeof getAuthClient>>,
	url: string,
): Promise<boolean> {
	const indexing = google.indexing({ version: "v3", auth: authClient });

	try {
		await indexing.urlNotifications.publish({
			requestBody: {
				url,
				type: "URL_UPDATED",
			},
		});
		return true;
	} catch (error: any) {
		return false;
	}
}

function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

function shortUrl(url: string): string {
	return url.replace(SITE_URL, "");
}

function printTable(results: PageResult[]) {
	const pathWidth = Math.max(
		4,
		...results.map((r) => shortUrl(r.url).length),
	);
	const statusWidth = Math.max(
		12,
		...results.map((r) => r.indexStatus.length),
	);

	const divider = `${"─".repeat(pathWidth + 2)}┼${"─".repeat(statusWidth + 2)}┼${"─".repeat(10)}`;
	const header = ` ${"URL".padEnd(pathWidth)} │ ${"Index Status".padEnd(statusWidth)} │ Submitted`;

	console.log("");
	console.log(header);
	console.log(divider);

	for (const r of results) {
		const path = shortUrl(r.url).padEnd(pathWidth);
		const status = r.indexStatus.padEnd(statusWidth);
		const icon =
			r.submitted === "OK" ? "\x1b[32mOK\x1b[0m      " :
			r.submitted === "FAILED" ? "\x1b[31mFAILED\x1b[0m  " :
			"\x1b[90m—\x1b[0m        ";
		console.log(` ${path} │ ${status} │ ${icon}`);
	}

	console.log(divider);
}

async function main() {
	console.log("=== Google Indexing Bot ===");

	const authClient = await getAuthClient();
	const urls = await fetchSitemapUrls();

	// Check indexing status
	console.log(`\nChecking indexing status (limit: ${INSPECTION_LIMIT} URLs)...\n`);
	const urlsToCheck = urls.slice(0, INSPECTION_LIMIT);
	const results: PageResult[] = [];

	for (let i = 0; i < urlsToCheck.length; i++) {
		const url = urlsToCheck[i];
		const result = await checkIndexStatus(authClient, url);

		const icon = result.isIndexed ? "\x1b[32m+\x1b[0m" : result.status.startsWith("Error") ? "\x1b[31m!\x1b[0m" : "\x1b[33m-\x1b[0m";
		console.log(
			`  [${icon}] (${i + 1}/${urlsToCheck.length}) ${shortUrl(url)}`,
		);

		results.push({
			url,
			indexStatus: result.status,
			submitted: result.isIndexed ? "—" : "—",
		});

		await sleep(200);
	}

	const indexed = results.filter((r) => r.indexStatus !== "Unknown" && r.submitted === "—" && !r.indexStatus.startsWith("Error"));
	const notIndexed = results.filter(
		(r) => !r.indexStatus.startsWith("Error") && r.indexStatus !== "Submitted and indexed" && r.indexStatus !== "Unknown",
	);
	const errors = results.filter((r) => r.indexStatus.startsWith("Error"));

	console.log(`\n--- Summary ---`);
	console.log(`Total checked: ${results.length}`);
	console.log(`\x1b[32mIndexed:       ${results.length - notIndexed.length - errors.length}\x1b[0m`);
	console.log(`\x1b[33mNot indexed:   ${notIndexed.length}\x1b[0m`);
	if (errors.length > 0) {
		console.log(`\x1b[31mErrors:        ${errors.length}\x1b[0m`);
	}

	if (notIndexed.length === 0) {
		console.log("\nAll pages are indexed!");
		printTable(results);
		return;
	}

	// Submit unindexed URLs
	const toSubmit = notIndexed.slice(0, INDEXING_LIMIT);
	console.log(
		`\nSubmitting ${toSubmit.length} URLs for indexing (limit: ${INDEXING_LIMIT}/day)...\n`,
	);

	let submitted = 0;
	let failed = 0;

	for (const entry of toSubmit) {
		const success = await submitForIndexing(authClient, entry.url);
		if (success) {
			submitted++;
			entry.submitted = "OK";
			console.log(`  \x1b[32m[OK]\x1b[0m (${submitted + failed}/${toSubmit.length}) ${shortUrl(entry.url)}`);
		} else {
			failed++;
			entry.submitted = "FAILED";
			console.log(`  \x1b[31m[FAIL]\x1b[0m (${submitted + failed}/${toSubmit.length}) ${shortUrl(entry.url)}`);
		}
		await sleep(200);
	}

	// Final report table
	console.log(`\n\n${"=".repeat(60)}`);
	console.log("  REPORT");
	console.log(`${"=".repeat(60)}`);

	printTable(results);

	console.log(`\n  \x1b[32mSubmitted: ${submitted}\x1b[0m`);
	if (failed > 0) console.log(`  \x1b[31mFailed:    ${failed}\x1b[0m`);
	console.log(`  Total:     ${results.length}`);

	if (notIndexed.length > INDEXING_LIMIT) {
		console.log(
			`\n  \x1b[33mNote: ${notIndexed.length - INDEXING_LIMIT} URLs remain. Run again tomorrow.\x1b[0m`,
		);
	}

	console.log("");
}

main().catch(console.error);
