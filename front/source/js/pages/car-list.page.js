import {authCheck} from '../api/auth.api.js';

class CarListPage {
    async init() {
        await this.authCheck();
    }

    async authCheck() {
        const isAuth = await authCheck();

        if (!isAuth) location.replace('/admin/');
    }
}

export default new CarListPage();
