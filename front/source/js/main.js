import './_components.js';
import carListPage from './pages/car-list.page.js';
import {carEditPage, loginPage} from './pages/index.js';

const pages = {
    login: loginPage,
    'car-edit': carEditPage,
    'car-list': carListPage,
};

window.addEventListener('DOMContentLoaded', async () => {
    const pageKey = document.body.dataset.page;

    console.log(pageKey);

    if (pages[pageKey]) {
        const page = pages[pageKey];
        await page.init();
    } else {
        console.warn(`No JS handler for data-page="${pageKey}"`);
    }
});
