"use client";

import { useState, useEffect } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // SSR placeholder with same dimensions
    return (
      <div className="castle-gallery">
        {castles.map((castle) => (
          <div key={castle.id} className="castle-gallery__item">
            <div className="castle-gallery__slider">
              <div className="castle-gallery__image">
                <UiImage
                  src={castle.images[0]}
                  alt={`${castle.name} - фото 1`}
                  width={400}
                  height={500}
                />
              </div>
            </div>
            <p className="castle-gallery__name">{castle.name}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="castle-gallery">
      {castles.map((castle) => (
        <div key={castle.id} className="castle-gallery__item">
          <div className="castle-gallery__slider">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              loop={castle.images.length >= 3}
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
          <p className="castle-gallery__name">{castle.name}</p>
        </div>
      ))}
    </div>
  );
}
