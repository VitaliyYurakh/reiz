export class ElementReplacer {
  constructor(params) {
    const {element, parentDesktop, parentMobile, breakpoint, mobilePlace, desktopPlace} = params;

    this.element = element;
    this.parentDesktop = parentDesktop;
    this.parentMobile = parentMobile;
    this.breakpoint = breakpoint;
    this.firstRule = mobilePlace;
    this.lastRule = desktopPlace;

    if (this.element && this.parentDesktop && this.parentMobile) {
      this.init();
    }
  }

  replaceElement() {
    let containerWidth = document.documentElement.clientWidth;

    if (this.element) {
      if (containerWidth <= this.breakpoint) {
        this.parentMobile.insertAdjacentElement(this.firstRule, this.element);
      } else {
        this.parentDesktop.insertAdjacentElement(this.lastRule, this.element);
      }
    }
  }

  init() {
    window.addEventListener("DOMContentLoaded", () => this.replaceElement());
    window.addEventListener("resize", () => this.replaceElement());
  }
}


