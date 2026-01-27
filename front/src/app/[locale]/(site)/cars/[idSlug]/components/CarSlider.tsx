"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";

import "swiper/css";
import "swiper/css/navigation";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import { Fancybox } from "@fancyapps/ui";
import Icon from "@/components/Icon";
import { BASE_URL } from "@/config/environment";

type Item = {
  src: string;
  thumb?: string;
  alt?: string;
  w?: number;
  h?: number;
};

const resolveStaticPath = (value: string) => {
  if (!value) return value;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const base = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const normalized = value.replace(/^\/+/, "");
  const staticPath = normalized.startsWith("static/")
    ? normalized
    : `static/${normalized}`;

  return `${base}${encodeURI(staticPath)}`;
};

export default function CarGallerySlider({
  pcItems,
  mobileItems,
  group = "car-gallery-1",
  ariaLabel = "Галерея авто",
}: {
  pcItems: Item[];
  mobileItems: Item[];
  group?: string;
  ariaLabel?: string;
}) {
  const [swiperControl, setSwiperControl] = useState<SwiperClass | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [isHydrated]);

  const fallbackItems = pcItems.length > 0 ? pcItems : mobileItems;
  const displayItems = useMemo(() => {
    if (isHydrated && isMobile && mobileItems.length > 0) return mobileItems;
    return fallbackItems;
  }, [fallbackItems, isHydrated, isMobile, mobileItems]);

  useEffect(() => {
    if (!isHydrated) return;
    Fancybox.bind(`[data-fancybox="${group}"]`, {});
    return () => Fancybox.destroy();
  }, [displayItems, group, isHydrated]);

  if (fallbackItems.length === 0) {
    return null;
  }

  const renderSlide = (it: Item, index: number) => {
    const imageSrc = resolveStaticPath(it.src);
    const fullSrc = resolveStaticPath(it.src);
    const w = it.w ?? 891;
    const h = it.h ?? 499;

    return (
      <a href={fullSrc} className="gallery-slider__card" data-fancybox={group}>
        <Image
          src={imageSrc}
          width={w}
          height={h}
          alt={it.alt || "image"}
          className="block w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
          quality={85}
          priority={index === 0}
        />
      </a>
    );
  };

  if (!isHydrated) {
    const firstItem = fallbackItems[0];
    return (
      <div className="gallery-slider swiper" aria-label={ariaLabel}>
        <div className="gallery-slider__swiper">
          <div className="gallery-slider__wrapper swiper-wrapper">
            <div className="gallery-slider__slide swiper-slide">
              {renderSlide(firstItem, 0)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="gallery-slider swiper"
      aria-label={ariaLabel}
      // data-aos="fade-right"
      // data-aos-duration="900"
      // data-aos-delay="500"
    >
      <Swiper
        modules={[Navigation]}
        className="gallery-slider__swiper"
        wrapperClass="gallery-slider__wrapper swiper-wrapper"
        slidesPerView={1}
        speed={800}
        loop={true}
        onSwiper={setSwiperControl}
      >
        {displayItems.map((it, i) => (
          <SwiperSlide
            key={`${group}-${i}-${it.thumb ?? it.src}`}
            className="gallery-slider__slide swiper-slide"
          >
            {renderSlide(it, i)}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="slider-controls">
        <button
          className="slider-btn prev"
          onClick={() => swiperControl?.slidePrev()}
          aria-label="Попередній слайд"
        >
          <i className="sprite">
            <Icon id="arrow-d2" width={12} height={7} />
          </i>
        </button>
        <button
          className="slider-btn next"
          onClick={() => swiperControl?.slideNext()}
          aria-label="Наступний слайд"
        >
          <i className="sprite">
            <Icon id="arrow-d2" width={12} height={7} />
          </i>
        </button>
      </div>
    </div>
  );
}
