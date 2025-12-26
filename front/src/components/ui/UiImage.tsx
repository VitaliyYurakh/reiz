"use client";

import Image, { type ImageProps } from "next/image";

/**
 * Size thresholds for automatic quality detection
 */
const SIZE_THRESHOLDS = {
  /** Icons, thumbnails, small previews */
  ICON: 64,
  /** Small images like avatars, badges */
  SMALL: 200,
  /** Medium images like cards */
  MEDIUM: 600,
  /** Large images like hero sections */
  LARGE: 1200,
} as const;

/**
 * Quality presets based on image type and size
 */
const QUALITY_PRESETS = {
  /** Hero/LCP images - highest quality */
  hero: 90,
  /** Large images */
  large: 85,
  /** Medium images - balanced */
  medium: 82,
  /** Small images */
  small: 75,
  /** Icons and thumbnails - more aggressive compression */
  icon: 65,
} as const;

/**
 * Default responsive sizes for different image types
 * Using vw-based values to ensure crisp images on large/retina/4K displays
 *
 * Note: For 2x retina displays, browser requests 2x the calculated size.
 * On 2560px 27" monitor: 75vw = 1920px, with 2x DPR = 3840px request
 */
const DEFAULT_SIZES = {
  /** Full-width hero images */
  hero: "100vw",
  /** Full-width responsive images */
  fullWidth: "100vw",
  /** Images in containers (most common case) - generous for retina */
  contained: "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 75vw",
  /** Card images in grids - generous for retina/4K displays */
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 75vw",
  /** Small images like icons */
  icon: "96px",
  /** Thumbnail images */
  thumbnail: "(max-width: 640px) 50vw, 384px",
} as const;

type SizePreset = keyof typeof DEFAULT_SIZES;

export interface UiImageProps extends Omit<ImageProps, "quality"> {
  /**
   * Mark as hero/LCP image for priority loading and higher quality
   * @default false
   */
  hero?: boolean;

  /**
   * Override automatic quality detection
   * If not provided, quality is calculated based on dimensions and hero flag
   */
  quality?: number;

  /**
   * Preset for sizes attribute
   * - hero: full viewport width
   * - fullWidth: 100vw
   * - contained: responsive for container (default)
   * - card: optimized for card grids
   * - icon: fixed small size
   * - thumbnail: small responsive
   */
  sizePreset?: SizePreset;

  /**
   * Fetch priority for the image (high for LCP images)
   */
  fetchPriority?: "high" | "low" | "auto";
}

/**
 * Calculates optimal quality based on image dimensions
 */
function calculateQuality(
  width: number | `${number}` | undefined,
  height: number | `${number}` | undefined,
  isHero: boolean
): number {
  if (isHero) {
    return QUALITY_PRESETS.hero;
  }

  const w = typeof width === "string" ? parseInt(width, 10) : width;
  const h = typeof height === "string" ? parseInt(height, 10) : height;

  // If no dimensions, use medium quality as fallback
  if (!w && !h) {
    return QUALITY_PRESETS.medium;
  }

  // Use the larger dimension for quality calculation
  const maxDimension = Math.max(w || 0, h || 0);

  if (maxDimension <= SIZE_THRESHOLDS.ICON) {
    return QUALITY_PRESETS.icon;
  }
  if (maxDimension <= SIZE_THRESHOLDS.SMALL) {
    return QUALITY_PRESETS.small;
  }
  if (maxDimension <= SIZE_THRESHOLDS.MEDIUM) {
    return QUALITY_PRESETS.medium;
  }
  if (maxDimension <= SIZE_THRESHOLDS.LARGE) {
    return QUALITY_PRESETS.large;
  }

  // Very large images get hero quality
  return QUALITY_PRESETS.hero;
}

/**
 * Determines the best size preset based on dimensions and usage
 */
function determineSizePreset(
  width: number | `${number}` | undefined,
  height: number | `${number}` | undefined,
  isHero: boolean,
  fill?: boolean
): SizePreset {
  if (isHero) {
    return "hero";
  }

  if (fill) {
    return "contained";
  }

  const w = typeof width === "string" ? parseInt(width, 10) : width;
  const h = typeof height === "string" ? parseInt(height, 10) : height;
  const maxDimension = Math.max(w || 0, h || 0);

  if (maxDimension <= SIZE_THRESHOLDS.ICON) {
    return "icon";
  }
  if (maxDimension <= SIZE_THRESHOLDS.SMALL) {
    return "thumbnail";
  }
  if (maxDimension <= SIZE_THRESHOLDS.MEDIUM) {
    return "card";
  }

  return "contained";
}

/**
 * UiImage - Optimized wrapper over next/image
 *
 * Features:
 * - Automatic quality based on image dimensions
 * - Smart responsive sizes with sensible defaults
 * - Hero mode for LCP optimization
 * - Retina/4K support via srcset (handled by next/image)
 *
 * Usage:
 * ```tsx
 * // Hero image (LCP, priority, high quality)
 * <UiImage src="/hero.jpg" alt="Hero" hero fill />
 *
 * // Regular image (auto quality, auto sizes)
 * <UiImage src="/photo.jpg" alt="Photo" width={400} height={300} />
 *
 * // Small icon (aggressive compression)
 * <UiImage src="/icon.png" alt="Icon" width={24} height={24} />
 *
 * // Custom sizes override
 * <UiImage src="/card.jpg" alt="Card" width={600} height={400} sizes="(max-width: 768px) 100vw, 600px" />
 * ```
 */
export default function UiImage({
  hero = false,
  quality,
  sizePreset,
  sizes,
  priority,
  loading,
  width,
  height,
  fill,
  fetchPriority,
  ...props
}: UiImageProps) {
  // Calculate quality if not explicitly provided
  const computedQuality = quality ?? calculateQuality(width, height, hero);

  // Determine sizes if not explicitly provided
  const computedSizePreset =
    sizePreset ?? determineSizePreset(width, height, hero, fill);
  const computedSizes = sizes ?? DEFAULT_SIZES[computedSizePreset];

  // Hero images get priority loading and no lazy
  const computedPriority = priority ?? hero;
  const computedLoading = hero ? undefined : loading;

  // Hero images get high fetch priority
  const computedFetchPriority = fetchPriority ?? (hero ? "high" : undefined);

  return (
    <Image
      {...props}
      width={width}
      height={height}
      fill={fill}
      quality={computedQuality}
      sizes={computedSizes}
      priority={computedPriority}
      loading={computedLoading}
      fetchPriority={computedFetchPriority}
    />
  );
}

/**
 * Re-export for convenience
 */
export { type ImageProps };
