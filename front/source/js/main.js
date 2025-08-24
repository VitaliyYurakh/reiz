import './_components.js';
import {SelectLanguage} from './component/select-language.component.js';
import {carEditPage, loginPage, carListPage} from './pages/admin/index.js';
import mainPage from './pages/main.page.js';

const pages = {
    login: loginPage,
    'car-edit': carEditPage,
    'car-list': carListPage,
    main: mainPage,
};

window.addEventListener('DOMContentLoaded', async () => {
    const pageKey = document.body.dataset.page;

    const selectLanguage = new SelectLanguage();
    selectLanguage.init();

    if (pages[pageKey]) {
        const page = pages[pageKey];
        await page.init();
    } else {
        console.warn(`No JS handler for data-page="${pageKey}"`);
    }
});
