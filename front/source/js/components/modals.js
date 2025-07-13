import ModalManager from "../functions/scripts/modals.js";
import vars from "../_vars.js";
import initModalSteps from '../functions/scripts/modalSteps.js';

document.addEventListener("DOMContentLoaded", () => {
  const modalManager = new ModalManager(vars);
    initModalSteps();
});



