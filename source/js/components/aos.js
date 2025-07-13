import AOS from 'aos';

function initAOS(config = {}) {
  AOS.init({
    disable: function () {
      return window.innerWidth < 1024;
    },
    once: true,
    ...config
  });
}

window.addEventListener('resize', () => {
  AOS.refresh();
});

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
});

const gallerySlider = document.querySelector('.gallery-slider');
const tabs = document.querySelector('.single-section__tabs');

if (gallerySlider && tabs) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tabs.classList.add('aos-animate');
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(gallerySlider);
}

const asideEl = document.querySelector('.aside');
const catalogEl = document.querySelector('.catalog-aside');

if (asideEl) {
  asideEl.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'opacity' || event.propertyName === 'transform') {
      asideEl.classList.add('aos-transition-done');
    }
  });
}

if (catalogEl) {
  catalogEl.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'opacity' || event.propertyName === 'transform') {
      catalogEl.classList.add('aos-transition-done');
    }
  });
}

const middleEl = document.querySelector('.footer__middle');
const bottomEl = document.querySelector('.footer__bottom');

if (middleEl && bottomEl) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bottomEl.removeAttribute('data-aos');
        bottomEl.classList.add('aos-animate');
        bottomEl.style.opacity = '0';
        bottomEl.style.transition = 'opacity 0.6s ease';

        setTimeout(() => {
          bottomEl.style.opacity = '1';
        }, 850);

        observer.disconnect();
      }
    });
  }, {
    threshold: 0.5
  });

  observer.observe(middleEl);
}

document.querySelectorAll('.car-card__name').forEach(name => {
  const card = name.closest('.car-card');
  if (!card) return;

  const button = card.querySelector('.main-button');
  if (!button) return;

  name.addEventListener('mouseenter', () => {
    button.classList.add('hovered');
  });

  name.addEventListener('mouseleave', () => {
    button.classList.remove('hovered');
  });
});
