"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import UiImage from "@/components/ui/UiImage";
import "swiper/css";
import "swiper/css/pagination";

interface PhotoCollageProps {
  images: string[];
  alt: string;
}

export default function PhotoCollage({ images, alt }: PhotoCollageProps) {
  return (
    <>
      {/* Desktop: Grid */}
      <div className="photo-collage">
        {images.map((image, index) => (
          <div key={index} className="photo-collage__item">
            <UiImage
              src={image}
              alt={`${alt} ${index + 1}`}
              width={400}
              height={500}
            />
          </div>
        ))}
      </div>

      {/* Mobile: Slider */}
      <div className="photo-collage-mobile">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="photo-collage-mobile__image">
                <UiImage
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  width={400}
                  height={500}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
