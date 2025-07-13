import SmoothScroll from 'smooth-scroll';

document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

    new SmoothScroll('a[href*="#"]', {
        speed: 400,
        offset: 0,
        updateURL: false
    });
});
