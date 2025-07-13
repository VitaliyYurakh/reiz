export default function initModalSteps() {
  const modal = document.querySelector('.rent-modal');
  if (!modal) return;

  const nextStepBtn = modal.querySelector('[data-next-step]');
  if (!nextStepBtn) return;

  nextStepBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('slide-step-2');
  });

  const backBtn = modal.querySelector('[data-prev-step]');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('slide-step-2');
    });
  }
}