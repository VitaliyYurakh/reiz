import './_components.js';
import {carEditPage, loginPage} from './pages/index.js';

const pages = {
    login: loginPage,
    'car-edit': carEditPage,
};

window.addEventListener('DOMContentLoaded', () => {
    const pageKey = document.body.dataset.page;

    if (pages[pageKey]) {
        const PageClass = pages[pageKey];
        new PageClass.init();
    } else {
        console.warn(`No JS handler for data-page="${pageKey}"`);
    }
});
