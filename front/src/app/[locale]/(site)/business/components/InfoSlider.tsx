"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Icon from "@/components/Icon";

import "swiper/css";
import "swiper/css/navigation";
import type { Swiper as SwiperClass } from "swiper/types";

type Slide = {
  id: string;
  title: string;
  text: string;
};

export default function InfoSlider({ slides }: { slides: Slide[] }) {
  const [swiperControl, setSwiperControl] = useState<SwiperClass | null>(null);

  return (
    <div className="info-slider swiper" aria-label="Корпоративные преимущества">
      <Swiper
        modules={[Navigation]}
        className="info-slider__swiper"
        wrapperClass="info-slider__wrapper swiper-wrapper"
        slidesPerView={4}
        speed={800}
        loop={true}
        spaceBetween={0}
        onSwiper={(swiper) => setSwiperControl(swiper)}
        breakpoints={{
          320: { slidesPerView: "auto", spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 0 },
          1024: { slidesPerView: 2 },
          1100: { slidesPerView: 3 },
          1350: { slidesPerView: 4, spaceBetween: 0 },
        }}
      >
        {slides.map((s, i) => (
          <SwiperSlide
            key={`${i}-${s.id}`}
            className="info-slider__slide swiper-slide"
          >
            <div className="info-slider__content">
              <h2 className="info-slider__title">
                <i className="sprite">
                  <Icon id={s.id} width={27} height={27} />
                </i>
                {s.title}
              </h2>
              <p>{s.text}</p>
            </div>
            <span className="info-slider__pagination" aria-live="polite">
              {i + 1}–{slides.length}
            </span>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="slider-controls">
        <button
          className="slider-btn prev"
          onClick={() => swiperControl?.slidePrev()}
          aria-label="Предыдущий слайд"
        >
          <i className="sprite">
            <Icon id="arrow-d2" width={12} height={7} />
          </i>
        </button>
        <button
          className="slider-btn next"
          onClick={() => swiperControl?.slideNext()}
          aria-label="Следующий слайд"
        >
          <i className="sprite">
            <Icon id="arrow-d2" width={12} height={7} />
          </i>
        </button>
      </div>
    </div>
  );
}
