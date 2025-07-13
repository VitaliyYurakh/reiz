export function setupClipFunctionality({
  clipSelector = '[data-clip]',
  btnSelector = '[data-clip-btn]',
  itemSelector = '[data-clip-item]',
  transitionStyle = 'max-height 0.4s linear'
} = {}) {
  const elements = document.querySelectorAll(clipSelector);

  elements.forEach((element) => {
    const btn = element.querySelector(btnSelector);
    const box = element.querySelector(itemSelector);

    if (!btn || !box) return;

    const computedStyle = window.getComputedStyle(box);
    const originalHeight = parseInt(computedStyle.getPropertyValue('max-height'), 10) || 0;
    const collapsedText = btn.textContent; // начальный текст
    const expandedText = btn.getAttribute('data-clip-btn'); // текст при раскрытии

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = box.getAttribute('data-clip-item') === 'true';

      if (!isOpen) {
        box.style.maxHeight = box.scrollHeight + 'px';
        btn.textContent = expandedText;
		btn.classList.add('active');
      } else {
        box.style.maxHeight = originalHeight + 'px';
        btn.textContent = collapsedText;
		btn.classList.remove('active');
      }

      box.setAttribute('data-clip-item', String(!isOpen));
    });

    box.style.transition = transitionStyle;
  });
}
