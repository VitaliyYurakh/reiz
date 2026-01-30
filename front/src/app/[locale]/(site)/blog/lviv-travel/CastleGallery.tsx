"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import UiImage from "@/components/ui/UiImage";
import "swiper/css";
import "swiper/css/pagination";

interface CastleData {
  id: string;
  name: string;
  images: string[];
}

interface CastleGalleryProps {
  castles: CastleData[];
}

export default function CastleGallery({ castles }: CastleGalleryProps) {
  return (
    <div className="castle-gallery" role="region" aria-label="Галерея замків">
      {castles.map((castle) => (
        <figure key={castle.id} className="castle-gallery__item">
          <div className="castle-gallery__slider">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
            >
              {castle.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="castle-gallery__image">
                    <UiImage
                      src={image}
                      alt={`${castle.name} - фото ${index + 1}`}
                      width={400}
                      height={500}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <figcaption className="castle-gallery__name">{castle.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
