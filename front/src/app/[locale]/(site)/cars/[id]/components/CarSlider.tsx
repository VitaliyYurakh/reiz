"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    Fancybox.bind(`[data-fancybox="${group}"]`, {});
    return () => Fancybox.destroy();
  }, [group]);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const displayItems = isMobile ? mobileItems : pcItems;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

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
        {displayItems.map((it, i) => {
          const thumb = it.thumb ?? it.src;
          const w = it.w ?? 891;
          const h = it.h ?? 499;

          return (
            <SwiperSlide
              key={`${group}-${i}-${thumb}`}
              className="gallery-slider__slide swiper-slide"
            >
              <a href={it.src} className="gallery-slider__card">
                <picture>
                  <img
                    width={w}
                    height={h}
                    src={`${BASE_URL}static/${thumb}`}
                    data-fancybox={group}
                    alt={it.alt || "image"}
                    className="block w-full h-auto object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </picture>
              </a>
            </SwiperSlide>
          );
        })}
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
