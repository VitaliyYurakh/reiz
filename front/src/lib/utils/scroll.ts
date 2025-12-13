let locks = 0;

export function lockScroll() {
  if (locks++ > 0) return;
  const body = document.body;
  const fixBlocks = document?.querySelectorAll<HTMLElement>(".fixed-block");
  const pagePosition = window.scrollY;
  const paddingOffset = `${window.innerWidth - body.offsetWidth}px`;

  document.documentElement.style.scrollBehavior = "none";
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  body.style.paddingRight = paddingOffset;
  body.classList.add("dis-scroll");
  body.dataset.position = pagePosition.toString();
  body.style.top = `-${pagePosition}px`;
}

export function unlockScroll() {
  if (locks === 0 || --locks > 0) return;

  const fixBlocks = document?.querySelectorAll<HTMLElement>(".fixed-block");
  const body = document.body;
  const pagePosition = parseInt(body.dataset.position as string, 10);
  fixBlocks.forEach((el) => {
    el.style.paddingRight = "0px";
  });
  body.style.paddingRight = "0px";

  body.style.top = "auto";
  body.classList.remove("dis-scroll");

  if (pagePosition) {
    window.scroll({
      top: pagePosition,
      left: 0,
    });
  }

  body.removeAttribute("data-position");
}
