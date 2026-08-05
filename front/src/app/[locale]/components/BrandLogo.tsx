import {
  AcuraIcon,
  AlfaRomeoIcon,
  AstonMartinIcon,
  AudiIcon,
  BentleyIcon,
  BMWIcon,
  BugattiIcon,
  BuickIcon,
  BYDIcon,
  CadillacIcon,
  ChevroletIcon,
  ChryslerIcon,
  DodgeIcon,
  FerrariIcon,
  FiatIcon,
  FordIcon,
  GenesisIcon,
  GMCIcon,
  HondaIcon,
  HummerIcon,
  HyundaiIcon,
  InfinitiIcon,
  JaguarIcon,
  JeepIcon,
  KiaIcon,
  KoenigseggIcon,
  LamborghiniIcon,
  LandroverIcon,
  LexusIcon,
  LincolnIcon,
  LotusIcon,
  LucidIcon,
  MaseratiIcon,
  MazdaIcon,
  MBIcon,
  MclarenIcon,
  MiniIcon,
  MitsubishiIcon,
  NissanIcon,
  PaganiIcon,
  PolestarIcon,
  PorscheIcon,
  RAMIcon,
  RivianIcon,
  RollsRoyceIcon,
  SubaruIcon,
  TeslaIcon,
  ToyotaIcon,
  VinfastIcon,
  VolkswagenIcon,
  VolvoIcon,
} from "@cardog-icons/react";

type BrandLogoProps = {
  brand: string;
  className?: string;
};

/** Every make shipped by @cardog-icons/react, plus aliases for common spellings. */
const BRAND_LOGOS = {
  acura: AcuraIcon,
  alfaromeo: AlfaRomeoIcon,
  astonmartin: AstonMartinIcon,
  audi: AudiIcon,
  bentley: BentleyIcon,
  bmw: BMWIcon,
  bugatti: BugattiIcon,
  buick: BuickIcon,
  byd: BYDIcon,
  cadillac: CadillacIcon,
  chevrolet: ChevroletIcon,
  chevy: ChevroletIcon,
  chrysler: ChryslerIcon,
  dodge: DodgeIcon,
  ferrari: FerrariIcon,
  fiat: FiatIcon,
  ford: FordIcon,
  genesis: GenesisIcon,
  gmc: GMCIcon,
  honda: HondaIcon,
  hummer: HummerIcon,
  hyundai: HyundaiIcon,
  infiniti: InfinitiIcon,
  jaguar: JaguarIcon,
  jeep: JeepIcon,
  kia: KiaIcon,
  koenigsegg: KoenigseggIcon,
  lamborghini: LamborghiniIcon,
  landrover: LandroverIcon,
  rangerover: LandroverIcon,
  lexus: LexusIcon,
  lincoln: LincolnIcon,
  lotus: LotusIcon,
  lucid: LucidIcon,
  maserati: MaseratiIcon,
  mazda: MazdaIcon,
  mb: MBIcon,
  benz: MBIcon,
  mercedes: MBIcon,
  mercedesbenz: MBIcon,
  mclaren: MclarenIcon,
  mini: MiniIcon,
  mitsubishi: MitsubishiIcon,
  nissan: NissanIcon,
  pagani: PaganiIcon,
  polestar: PolestarIcon,
  porsche: PorscheIcon,
  ram: RAMIcon,
  rivian: RivianIcon,
  rollsroyce: RollsRoyceIcon,
  subaru: SubaruIcon,
  tesla: TeslaIcon,
  toyota: ToyotaIcon,
  vinfast: VinfastIcon,
  volkswagen: VolkswagenIcon,
  vw: VolkswagenIcon,
  volvo: VolvoIcon,
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
