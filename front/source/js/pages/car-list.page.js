import {authCheck} from '../api/auth.api.js';
import {CarList} from '../component/car-list.component.js';

class CarListPage {
    async init() {
        await this.authCheck();
        await new CarList().init();
    }

    async authCheck() {
        const isAuth = await authCheck();

        if (!isAuth) location.href = '/admin/';
    }
}

export default new CarListPage();
