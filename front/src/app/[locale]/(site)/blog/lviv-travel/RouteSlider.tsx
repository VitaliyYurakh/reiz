"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import UiImage from "@/components/ui/UiImage";
import "swiper/css";
import "swiper/css/pagination";

interface RouteSliderProps {
  images: string[];
  alt: string;
}

export default function RouteSlider({ images, alt }: RouteSliderProps) {
  return (
    <div className="route-slider">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="route-slider__image">
              <UiImage
                src={image}
                alt={`${alt} ${index + 1}`}
                width={800}
                height={450}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
