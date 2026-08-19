import Image from "next/image";

type BrandLogoProps = {
  brand: string;
  className?: string;
};

/** Every make shipped in the brands/ sprite, plus aliases for common spellings. */
const BRAND_LOGOS = new Set([
  "acura",
  "alfaromeo",
  "astonmartin",
  "audi",
  "bentley",
  "bmw",
  "bugatti",
  "buick",
  "byd",
  "cadillac",
  "chevrolet",
  "chrysler",
  "dodge",
  "ferrari",
  "fiat",
  "ford",
  "genesis",
  "gmc",
  "honda",
  "hummer",
  "hyundai",
  "infiniti",
  "jaguar",
  "jeep",
  "kia",
  "koenigsegg",
  "lamborghini",
  "landrover",
  "lexus",
  "lincoln",
  "lotus",
  "lucid",
  "maserati",
  "mazda",
  "mb",
  "mclaren",
  "mini",
  "mitsubishi",
  "nissan",
  "pagani",
  "polestar",
  "porsche",
  "ram",
  "rivian",
  "rollsroyce",
  "subaru",
  "tesla",
  "toyota",
  "vinfast",
  "volkswagen",
  "volvo",
]);

const BRAND_ALIASES: Record<string, string> = {
  chevy: "chevrolet",
  rangerover: "landrover",
  benz: "mb",
  mercedes: "mb",
  mercedesbenz: "mb",
  vw: "volkswagen",
};

const brandKey = (brand: string) =>
  brand
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]/g, "");

const getInitials = (brand: string) =>
  (brand.match(/[\p{L}\p{N}]+/gu) ?? [])
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

/** Displays a standalone SVG logo, with initials only for unlisted makes. */
export default function BrandLogo({ brand, className }: BrandLogoProps) {
  const rawKey = brandKey(brand);
  const key = BRAND_LOGOS.has(rawKey) ? rawKey : BRAND_ALIASES[rawKey];
  const logoClassName = ["brand-logo", className].filter(Boolean).join(" ");

  if (key) {
    return (
      <span className={logoClassName} aria-hidden="true">
        <Image
          className="brand-logo__image"
          src={`/img/icons/brands/${key}.svg`}
          alt=""
          width={512}
          height={512}
          unoptimized
        />
      </span>
    );
  }

  return (
    <span
      className={`${logoClassName} brand-logo--fallback`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 36 36" focusable="false">
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <text
          x="18"
          y="19"
          dominantBaseline="middle"
          fill="currentColor"
          fontFamily="Arial, sans-serif"
          fontSize="10"
          fontWeight="700"
          textAnchor="middle"
        >
          {getInitials(brand)}
        </text>
      </svg>
    </span>
  );
}
