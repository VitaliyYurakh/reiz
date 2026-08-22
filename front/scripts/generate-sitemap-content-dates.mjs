import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(projectRoot, "src");
const translationsRoot = join(sourceRoot, "i18n/translations");

const routeSources = {
  home: "app/[locale]/page.tsx",
  about: "app/[locale]/(site)/about/page.tsx",
  blog: "app/[locale]/(site)/blog/page.tsx",
  business: "app/[locale]/(site)/business/page.tsx",
  certificate: "app/[locale]/(site)/certificate/page.tsx",
  contacts: "app/[locale]/(site)/contacts/page.tsx",
  faq: "app/[locale]/(site)/faq/page.tsx",
  insurance: "app/[locale]/(site)/insurance/page.tsx",
  invest: "app/[locale]/(site)/invest/page.tsx",
  terms: "app/[locale]/(site)/terms/page.tsx",
};

function fileDate(relativePath) {
  try {
    return statSync(join(sourceRoot, relativePath)).mtime;
  } catch {
    return undefined;
  }
}

function latestDate(paths) {
  return paths
    .map(fileDate)
    .filter(Boolean)
    .reduce(
      (latest, date) => (!latest || date > latest ? date : latest),
      undefined,
    );
}

function isoDate(date) {
  return date?.toISOString();
}

const translationSources = readdirSync(translationsRoot, {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => `i18n/translations/${entry.name}/index.json`);

const routeDates = Object.fromEntries(
  Object.entries(routeSources).map(([route, source]) => [
    route,
    isoDate(latestDate([source, ...translationSources])),
  ]),
);

const citySources = [
  "data/cities.ts",
  "data/cityContent.ts",
  ...translationSources,
];

const blogRoot = join(sourceRoot, "app/[locale]/(site)/blog");
const blogDates = {};
for (const entry of readdirSync(blogRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  const articlePath = `/blog/${entry.name}`;
  blogDates[articlePath] = isoDate(
    latestDate([
      `app/[locale]/(site)/blog/${entry.name}/page.tsx`,
      ...translationSources,
    ]),
  );
}

const outputPath = join(sourceRoot, "generated/sitemap-content-dates.json");
// The manifest is generated during `npm run build`, so sitemap dates reflect
// the latest mtime of the page source and localized content files in the
// exact source snapshot used for that deployment.
const manifest = {
  routes: routeDates,
  privacy: isoDate(
    latestDate([
      "app/[locale]/(site)/privacy-policy/page.tsx",
      ...translationSources,
    ]),
  ),
  cityPages: isoDate(latestDate(citySources)),
  blog: blogDates,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${relative(projectRoot, outputPath)}`);
