import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const CANVAS = { width: 1672, height: 941 };
const MAP = {
  width: 1060,
  centerX: CANVAS.width / 2,
  centerY: CANVAS.height / 2,
};
const COLORS = {
  fill: "#fff2df",
  stroke: "rgba(151, 120, 87, 0.18)",
  highlight: "#ff9f1c",
};
const GEOJSON_URL =
  "https://raw.githubusercontent.com/EugeneBorshch/ukraine_geojson/master/UA_FULL_Ukraine.geojson";
const CACHE_PATH = path.join(
  process.cwd(),
  ".cache",
  "travel-map",
  "UA_FULL_Ukraine.geojson",
);

function parseArgs() {
  const args = new Map();
  for (let index = 2; index < process.argv.length; index += 1) {
    const key = process.argv[index];
    const value = process.argv[index + 1];
    if (key.startsWith("--") && value && !value.startsWith("--")) {
      args.set(key.slice(2), value);
      index += 1;
    }
  }

  const input = args.get("input");
  const output = args.get("output");
  if (!input || !output) {
    throw new Error(
      [
        "Usage:",
        "  node scripts/build-travel-map-card.mjs --input <background.png> --output <card.webp> [--highlight UA-46]",
        "",
        "The output uses a fixed 1672x941 canvas and a centered 1060px Ukraine map.",
      ].join("\n"),
    );
  }

  return {
    input,
    output,
    highlight: args.get("highlight"),
  };
}

async function loadGeoJson() {
  try {
    return JSON.parse(await readFile(CACHE_PATH, "utf8"));
  } catch {
    const response = await fetch(GEOJSON_URL);
    if (!response.ok) {
      throw new Error(`Failed to download GeoJSON: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    await mkdir(path.dirname(CACHE_PATH), { recursive: true });
    await writeFile(CACHE_PATH, text);
    return JSON.parse(text);
  }
}

function collectPoints(geoJson) {
  const points = [];

  function walk(coords) {
    if (typeof coords[0] === "number") {
      points.push(coords);
      return;
    }

    coords.forEach(walk);
  }

  geoJson.features.forEach((feature) => walk(feature.geometry.coordinates));
  return points;
}

function createProjector(geoJson) {
  const points = collectPoints(geoJson);
  const projectedPoints = points.map(projectMercator);
  const minX = Math.min(...projectedPoints.map((point) => point[0]));
  const maxX = Math.max(...projectedPoints.map((point) => point[0]));
  const minY = Math.min(...projectedPoints.map((point) => point[1]));
  const maxY = Math.max(...projectedPoints.map((point) => point[1]));
  const scale = MAP.width / (maxX - minX);
  const drawWidth = (maxX - minX) * scale;
  const drawHeight = (maxY - minY) * scale;
  const offsetX = MAP.centerX - drawWidth / 2;
  const offsetY = MAP.centerY - drawHeight / 2;

  return {
    meta: {
      canvas: CANVAS,
      map: {
        width: Math.round(drawWidth),
        height: Math.round(drawHeight),
        x: Math.round(offsetX),
        y: Math.round(offsetY),
        centerX: MAP.centerX,
        centerY: MAP.centerY,
      },
    },
    project([lon, lat]) {
      const [x, y] = projectMercator([lon, lat]);
      return [offsetX + (x - minX) * scale, offsetY + (maxY - y) * scale];
    },
  };
}

function projectMercator([lon, lat]) {
  const x = (lon * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + phi / 2));
  return [x, y];
}

function ringPath(ring, project) {
  return `${ring
    .map((point, index) => {
      const [x, y] = project(point);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ")} Z`;
}

function geometryPath(geometry, project) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap((polygon) => polygon.map((ring) => ringPath(ring, project))).join(" ");
}

function createMapSvg(geoJson, highlight, project) {
  const paths = geoJson.features
    .map((feature) => {
      const iso = feature.properties["iso3166-2"];
      const isHighlighted = iso === highlight;
      return `<path d="${geometryPath(feature.geometry, project)}" fill="${
        isHighlighted ? COLORS.highlight : COLORS.fill
      }" fill-opacity="${isHighlighted ? "0.98" : "0.9"}" stroke="${COLORS.stroke}" stroke-width="1.4"/>`;
    })
    .join("\n");

  return `
    <svg width="${CANVAS.width}" height="${CANVAS.height}" viewBox="0 0 ${CANVAS.width} ${CANVAS.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#2f2118" flood-opacity="0.18"/>
        </filter>
      </defs>
      <g filter="url(#softShadow)">${paths}</g>
    </svg>`;
}

async function main() {
  const args = parseArgs();
  const geoJson = await loadGeoJson();
  const { meta, project } = createProjector(geoJson);
  const mapSvg = createMapSvg(geoJson, args.highlight, project);

  await sharp(args.input)
    .resize(CANVAS.width, CANVAS.height, { fit: "cover" })
    .composite([{ input: Buffer.from(mapSvg), blend: "over" }])
    .webp({ quality: 86 })
    .toFile(args.output);

  console.log(JSON.stringify(meta, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
