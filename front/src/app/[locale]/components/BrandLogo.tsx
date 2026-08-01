import {
  AudiIcon,
  BentleyIcon,
  BMWIcon,
  CadillacIcon,
  ChevroletIcon,
  HyundaiIcon,
  KiaIcon,
  LandroverIcon,
  MazdaIcon,
  MBIcon,
  PorscheIcon,
  TeslaIcon,
  ToyotaIcon,
  VolkswagenIcon,
} from "@cardog-icons/react";

type BrandLogoProps = {
  brand: string;
  className?: string;
};

const BRAND_LOGOS = {
  audi: AudiIcon,
  bentley: BentleyIcon,
  bmw: BMWIcon,
  cadillac: CadillacIcon,
  chevrolet: ChevroletIcon,
  hyundai: HyundaiIcon,
  kia: KiaIcon,
  landrover: LandroverIcon,
  mazda: MazdaIcon,
  mercedes: MBIcon,
  mercedesbenz: MBIcon,
  porsche: PorscheIcon,
  tesla: TeslaIcon,
  toyota: ToyotaIcon,
  volkswagen: VolkswagenIcon,
  vw: VolkswagenIcon,
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

/** Displays an archived SVG logo, with initials only for unlisted makes. */
export default function BrandLogo({ brand, className }: BrandLogoProps) {
  const BrandIcon = BRAND_LOGOS[brandKey(brand) as keyof typeof BRAND_LOGOS];
  const logoClassName = ["brand-logo", className].filter(Boolean).join(" ");

  if (BrandIcon) {
    return (
      <span className={logoClassName} aria-hidden="true">
        <BrandIcon width="100%" height="100%" focusable="false" />
      </span>
    );
  }

  return (
    <span className={`${logoClassName} brand-logo--fallback`} aria-hidden="true">
      <svg viewBox="0 0 36 36" focusable="false">
        <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <text x="18" y="19" dominantBaseline="middle" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle">{getInitials(brand)}</text>
      </svg>
    </span>
  );
}
