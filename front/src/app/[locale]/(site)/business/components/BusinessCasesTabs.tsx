"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";

import "swiper/css";

type CaseItem = {
  title: string;
  text: string;
  photo: string;
};

const AUTOPLAY_MS = 6000;

const CASE_ICONS = [
  // IT-компанії — laptop
  <svg key="it" viewBox="0 0 24 24"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>,
  // Міжнародні організації — globe
  <svg key="intl" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
  // Будівельні компанії — construction
  <svg key="build" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>,
  // Логістичні — truck
  <svg key="logistics" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
];

export default function BusinessCasesTabs({ items }: { items: CaseItem[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const rafRef = useRef<number>(0);
  const startRef = useRef(Date.now());

  // progress bar animation via rAF
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
      <div className="business-cases__tabs">
        {items.map((t, i) => (
          <button
            key={t.title}
            type="button"
            className={`business-cases__tab${i === active ? " business-cases__tab--active" : ""}`}
            onClick={() => goTo(i)}
          >
            <span className="business-cases__tab-label">{t.title}</span>
            <span className="business-cases__tab-track">
              <span
                className="business-cases__tab-bar"
                style={{ transform: `scaleX(${i === active ? progress : 0})` }}
              />
            </span>
          </button>
        ))}
      </div>

      <div className="business-cases__slider">
        <button
          type="button"
          className="business-cases__arrow business-cases__arrow--prev"
          onClick={() => swiper?.slidePrev()}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" fill="none"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
        </button>

        <div className="business-cases__viewport">
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
            {items.map((card, i) => (
              <SwiperSlide key={card.title}>
                <div className="business-cases__panel">
                  {CASE_ICONS[i] && (
                    <div className="business-cases__panel-icon" aria-hidden="true">
                      {CASE_ICONS[i]}
                    </div>
                  )}
                  <div className="business-cases__panel-content">
                    <h3 className="business-cases__panel-title">{card.title}</h3>
                    <p className="business-cases__panel-text">{card.text}</p>
                  </div>
                  <div className="business-cases__panel-image">
                    <Image
                      src={card.photo}
                      alt={card.title}
                      width={480}
                      height={320}
                      sizes="(max-width: 768px) 100vw, 480px"
                      loading="lazy"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          type="button"
          className="business-cases__arrow business-cases__arrow--next"
          onClick={() => swiper?.slideNext()}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" fill="none"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/></svg>
        </button>
      </div>
    </div>
  );
}
