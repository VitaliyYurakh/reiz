"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import BusinessCtaButton from "./BusinessCtaButton";

import "swiper/css";

type VehicleTab = {
  key: string;
  label: string;
  title: string;
  text: string;
  cta: string;
};

const AUTOPLAY_MS = 6000;

export default function BusinessVehicleTabs({ tabs }: { tabs: VehicleTab[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const rafRef = useRef<number>(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setProgress(0);

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / AUTOPLAY_MS, 1);
      setProgress(pct);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  const goTo = useCallback(
    (idx: number) => {
      if (!swiper || idx === active) return;
      swiper.slideTo(idx);
    },
    [swiper, active],
  );

  const onSlideChange = useCallback((s: SwiperClass) => {
    setActive(s.realIndex);
    startRef.current = Date.now();
    setProgress(0);
  }, []);

  return (
    <div>
      <div className="business-vehicles__tabs">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            type="button"
            className={`business-vehicles__tab${i === active ? " business-vehicles__tab--active" : ""}`}
            onClick={() => goTo(i)}
          >
            <span className="business-vehicles__tab-label">{t.label}</span>
            <span className="business-vehicles__tab-track">
              <span
                className="business-vehicles__tab-bar"
                style={{ transform: `scaleX(${i === active ? progress : 0})` }}
              />
            </span>
          </button>
        ))}
      </div>

      <div className="business-vehicles__slider">
        <button
          type="button"
          className="business-vehicles__arrow business-vehicles__arrow--prev"
          onClick={() => swiper?.slidePrev()}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" fill="none"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
        </button>

        <div className="business-vehicles__viewport">
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiper}
            onSlideChange={onSlideChange}
            slidesPerView={1}
            spaceBetween={20}
            speed={550}
            autoplay={{
              delay: AUTOPLAY_MS,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            loop
            grabCursor
            resistance
            resistanceRatio={0.65}
          >
            {tabs.map((tab) => (
              <SwiperSlide key={tab.key}>
                <div className="business-vehicles__panel">
                  <div className="business-vehicles__panel-content">
                    <h3 className="business-vehicles__panel-title">{tab.title}</h3>
                    <p className="business-vehicles__panel-text">{tab.text}</p>
                    <div className="business-vehicles__panel-cta">
                      <BusinessCtaButton label={tab.cta} className="main-button" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          type="button"
          className="business-vehicles__arrow business-vehicles__arrow--next"
          onClick={() => swiper?.slideNext()}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" fill="none"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/></svg>
        </button>
      </div>
    </div>
  );
}
