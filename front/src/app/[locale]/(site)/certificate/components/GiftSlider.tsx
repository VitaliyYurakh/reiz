"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation /*, Autoplay*/ } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import Icon from "@/components/Icon";
import type { Swiper as SwiperClass } from "swiper/types";

type Slide = {
  webp?: string;
  png: string;
  title: string;
  text: string;
  alt: string;
};

type Props = {
  slides: Slide[];
  dataAos?: string;
  dataAosDuration?: number;
  dataAosDelay?: number;
};

export default function GiftSlider({
  slides,
  dataAos,
  dataAosDuration,
  dataAosDelay,
}: Props) {
  const [swiperControl, setSwiperControl] = useState<SwiperClass | null>(null);

  return (
    <div
      className="gift-slider"
      {...(dataAos ? { "data-aos": dataAos } : {})}
      {...(dataAosDuration ? { "data-aos-duration": dataAosDuration } : {})}
      {...(dataAosDelay ? { "data-aos-delay": dataAosDelay } : {})}
      aria-label="Подарочные сценарии"
    >
      <Swiper
        modules={[Navigation]}
        className="swiper gift-slider__swiper"
        wrapperClass="gift-slider__wrapper swiper-wrapper"
        slideClass={"gift-slider__slide"}
        slidesPerView={1}
        loop={true}
        speed={800}
        onSwiper={(swiper) => setSwiperControl(swiper)}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 },
          768: { slidesPerView: 1, spaceBetween: 0 },
        }}
      >
        {slides.map((s, i) => (
          <SwiperSlide
            key={`${s.title}-${i}`}
            className="gift-slider__slide swiper-slide"
          >
            <div className="gift-slider__image">
              <picture>
                <Image
                  width={512}
                  height={320}
                  src={s.png}
                  alt={s.alt}
                  loading="lazy"
                />
              </picture>
            </div>

            <div className="gift-slider__content">
              <h2 className="gift-slider__title">{s.title}</h2>
              <p>{s.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="slider-controls">
        <button
          onClick={() => swiperControl?.slidePrev()}
          className="slider-btn prev"
          aria-label="Предыдущий слайд"
        >
          <i className="sprite">
            <Icon id="arrow-d2" width={12} height={7} />
          </i>
        </button>
        <button
          onClick={() => swiperControl?.slideNext()}
          className="slider-btn next"
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
