import Swiper from "swiper";

import { Navigation, Autoplay } from "swiper/modules";
import vars from "../_vars.js";

document.addEventListener("DOMContentLoaded", function () {
  const { teamSliders, infoSliders, gallerySliders, giftSliders } = vars;

  gallerySliders.forEach(function (slider) {
    const container = slider.querySelector(".swiper-container");
    const nextBtn = slider.querySelector(".next");
    const prevBtn = slider.querySelector(".prev");

    const mainSwiper = new Swiper(slider, {
      modules: [Navigation, Autoplay],
      spaceBetween: 10,
      slidesPerView: 1,
      loop: true,
      speed: 800,
      autoplay: {
        delay: 5000,
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
    });
  });

  teamSliders.forEach(function (slider) {
    const container = slider.querySelector(".swiper-container");
    const nextBtn = slider.querySelector(".next");
    const prevBtn = slider.querySelector(".prev");

    const mainSwiper = new Swiper(slider, {
      modules: [Navigation],
      spaceBetween: 0,
      slidesPerView: 1,
      loop: true,
      speed: 800,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },

      breakpoints: {
        320: {
          spaceBetween: 20,
        },
        768: {
          spaceBetween: 0,
        },
      },
    });
  });

  giftSliders.forEach(function (slider) {
    const container = slider.querySelector(".swiper-container");
    const nextBtn = slider.querySelector(".next");
    const prevBtn = slider.querySelector(".prev");

    const mainSwiper = new Swiper(slider, {
      modules: [Navigation],
      spaceBetween: 0,
      slidesPerView: 1,
      loop: true,
      speed: 800,
      
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      }
    });
  });

  infoSliders.forEach(function (slider) {
    const container = slider.querySelector(".swiper-container");
    const nextBtn = slider.querySelector(".next");
    const prevBtn = slider.querySelector(".prev");

    const infoSwiper = new Swiper(slider, {
      modules: [Navigation],
      spaceBetween: 0,
      slidesPerView: 4,
      speed: 800,

      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },

      breakpoints: {
        320: {
          spaceBetween: 15,
          slidesPerView: "auto",
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 2,
        },
        1100: {
          slidesPerView: 3,
        },
        1350: {
          slidesPerView: 4,
          spaceBetween: 0,
        },
      },
      on: {
        init(swiper) {
          swiper.slides.forEach((slide, index) => {
            const pagination = slide.querySelector(".info-slider__pagination");
            if (pagination) {
              pagination.textContent = `${index + 1}–${swiper.slides.length}`;
            }
          });
        },
      },
    });
  });
});
