import vars from "../_vars.js";
import {
  elementHeight,
  removeCustomClass,
  addCustomClass,
} from "../functions/customFunctions.js";

const { header } = vars;

let lastScroll = 0;
let defaultOffset = 40;
const filterWrapper = document.querySelector(".catalog-aside__open-box");

function stickyHeaderFunction(breakpoint) {
  const containerWidth = document.documentElement.clientWidth;
  if (containerWidth > breakpoint) {
    window.addEventListener("scroll", () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > defaultOffset) {
        addCustomClass(header, "sticky");
        defaultOffset = 0;
        if (scrollTop > lastScroll) {
          addCustomClass(header, "sticky-hidden");
          removeCustomClass(header, "sticky-visible");
        } else {
          addCustomClass(header, "sticky-visible");
          removeCustomClass(header, "sticky-hidden");
        }
      } else {
        removeCustomClass(header, "sticky");
        removeCustomClass(header, "sticky-hidden");
        removeCustomClass(header, "sticky-visible");
        defaultOffset = 40;
      }

      if (filterWrapper) {
        if (header.classList.contains("sticky-visible")) {
          addCustomClass(filterWrapper, "with-sticky");
        } else {
          removeCustomClass(filterWrapper, "with-sticky");
        }
      }

      lastScroll = scrollTop;
    });
  }
}

stickyHeaderFunction(320);

elementHeight(header, "header-height");
