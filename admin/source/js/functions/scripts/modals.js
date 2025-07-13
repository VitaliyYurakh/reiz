import vars from "../../_vars.js";
import { disableScroll } from "../disable-scroll.js";
import { enableScroll } from "../enable-scroll.js";

import { addCustomClass, removeCustomClass, removeClassInArray, fadeIn, fadeOut } from "../customFunctions.js"

class ModalManager {
  constructor(vars) {
    this.vars = vars;
    this.innerButton = null;
    this.bindEvents();
  }

  bindEvents() {
    const { overlay, modalsButton, innerButtonModal } = this.vars;
    overlay.addEventListener("click", (e) => this.overlayClickHandler(e));
    modalsButton.forEach(btn => {
      btn.addEventListener("click", (e) => this.buttonClickHandler(e, "data-btn-modal"));
    });
    innerButtonModal.forEach(btn => {
      btn.addEventListener("click", (e) => this.innerButtonClickHandler(e));
    });
  }

 closeModal() {
  const { overlay, modals, activeClassMode, activeClass } = this.vars;

  removeCustomClass(overlay, activeClassMode);
  removeCustomClass(overlay, activeClass);

  modals.forEach(modal => {
    fadeOut(modal, 300); // fadeOut отвечает за display: none
    setTimeout(() => {
      removeCustomClass(modal, activeClass); // удаляем класс после анимации
    }, 300);
  });

  enableScroll();
}


  buttonClickHandler(e, buttonAttribute) {
    e.preventDefault();
    const { overlay, activeClass, mobileMenu, burger, modals, activeClassMode } = this.vars;
    const attributeValue = this.findAttribute(e.target, buttonAttribute);
    if (!attributeValue) return;

    const modal = overlay.querySelector(`[data-popup="${attributeValue}"]`);
    mobileMenu && removeCustomClass(mobileMenu, activeClass);
    burger && removeClassInArray(burger, activeClass);
    removeClassInArray(modals, activeClass);
    addCustomClass(overlay, activeClass);
    addCustomClass(overlay, activeClassMode);
    addCustomClass(modal, activeClass);
    fadeIn(modal, 200, 'flex');
    disableScroll();
    this.innerButton = overlay.querySelector(`${"[data-popup]"}.${activeClass} .close`);
  }

  overlayClickHandler(e) {
    const { overlay } = this.vars;
    if (e.target === overlay || e.target === this.innerButton) {
      e.preventDefault();
      this.closeModal();
    }
  }

  innerButtonClickHandler(e) {
    e.preventDefault();
    const { overlay, modals, activeClass } = this.vars;
    enableScroll();
    const prevId = this.findAttribute(e.target.closest('[data-popup]'), 'data-popup');
    if (!prevId) return;

    const currentModalId = e.target.getAttribute("data-btn-inner");
    const currentModal = overlay.querySelector(`[data-popup="${currentModalId}"]`);
    removeClassInArray(modals, activeClass);
    addCustomClass(overlay, activeClass);
    fadeOut(document.querySelector(`[data-popup="${prevId}"]`), 0);
    fadeIn(currentModal, 200);
    addCustomClass(currentModal, activeClass);
    disableScroll();
    this.innerButton = overlay.querySelector(`${"[data-popup]"}.${activeClass} .close`);
  }

  findAttribute(element, attributeName) {
    let target = element;
    while (target && target !== document) {
      if (target.hasAttribute(attributeName)) {
        return target.getAttribute(attributeName);
      }
      target = target.parentNode;
    }
    return null;
  }
}

export default ModalManager; // или export { ModalManager };


