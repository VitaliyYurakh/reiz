import { Link } from "@/i18n/request";

interface StackedPhotoCardProps {
  href: string;
  label: string;
  photos: string[];
  badge?: string;
}

export default function StackedPhotoCard({
  href,
  label,
  photos,
  badge,
}: StackedPhotoCardProps) {
  // Показуємо до 3 фото в стеці
  const stack = photos.slice(0, 3);

  return (
    <Link href={href} className="stacked-card">
      <div className="stacked-card__photos">
        {stack.map((src, i) => (
          <div
            key={i}
            className={`stacked-card__photo stacked-card__photo--${i}`}
          >
            <img src={src} alt="" />
          </div>
        ))}
        {stack.length === 0 && (
          <div className="stacked-card__photo stacked-card__photo--empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
        {badge && <span className="stacked-card__badge">{badge}</span>}
      </div>
      <p className="stacked-card__label">{label}</p>
    </Link>
  );
}
