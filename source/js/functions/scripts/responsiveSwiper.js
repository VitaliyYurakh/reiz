
// Функция для инициализации слайдера на основе брейкпоинта
export function responsiveSwiper(Swiper,breakpointQuery, sliderSelector, settings = {}) {
  const breakpoint = window.matchMedia(breakpointQuery);
  let slider;


  const breakpointChecker = function () {
    if (breakpoint.matches) {
      // Уничтожаем слайдер, если экран соответствует условиям брейкпоинта
      if (slider !== undefined) {
        slider.destroy(true, true);
        slider = undefined;
      }
    } else {
      // Инициализируем слайдер, если экран не соответствует условиям брейкпоинта
      if (slider === undefined) {
        slider = new Swiper(sliderSelector, settings);
      }
    }
  };

  // Добавляем слушатель событий к брейкпоинту
  breakpoint.addListener(breakpointChecker);
  // Выполняем проверку при инициализации
  breakpointChecker();
}

// В другом файле или месте использования:
// import { responsiveSwiper } from './path/to/this/file.js';
// responsiveSwiper("(min-width:1024px)", ".index-logo__slider");
