"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Icon from "@/components/Icon";

import "swiper/css";
import "swiper/css/navigation";
import UiImage from "@/components/ui/UiImage";
import type { Swiper as SwiperClass } from "swiper/types";

type Slide = {
  id: string | number;
  title: string;
  text: string;
};

export default function TeamSlider({ slides }: { slides: Slide[] }) {
  const [swiperControl, setSwiperControl] = useState<SwiperClass | null>(null);

  return (
    <div className="team-slider swiper">
      <Swiper
        modules={[Navigation]}
        className="info-slider__swiper"
        wrapperClass="info-slider__wrapper swiper-wrapper"
        slidesPerView={1}
        loop={true}
        speed={800}
        spaceBetween={0}
        onSwiper={(swiper) => setSwiperControl(swiper)}
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id} className="team-slider__slide swiper-slide">
            <div className="team-card">
              <div className="team-card__image">
                <UiImage
                  width={490}
                  height={479}
                  src="/img/user.png"
                  alt="Мар'ян Єдинак — основатель компании REIZ"
                  sizePreset="card"
                />
              </div>
              <div className="team-card__info">
                <h3 className="team-card__name">{s.title}</h3>
                <p className="team-card__position">{s.text}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="slider-controls">
        <button
          className="slider-btn prev"
          onClick={() => swiperControl?.slidePrev()}
          aria-label="Предыдущий"
        >
          <i className="sprite">
            <Icon id="arrow-d2" width={12} height={7} />
          </i>
        </button>
        <button
          className="slider-btn next"
          onClick={() => swiperControl?.slideNext()}
          aria-label="Следующий"
        >
          <i className="sprite">
            <Icon id="arrow-d2" width={12} height={7} />
          </i>
        </button>
      </div>
    </div>
  );
}
