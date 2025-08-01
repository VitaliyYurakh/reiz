import {authCheck} from '../api/auth.api.js';
import {CarEdit} from '../component/car-edit.component.js';

class CarEditPage {
    async init() {
        await this.authCheck();
        await new CarEdit().init();
    }

    async authCheck() {
        const isAuth = await authCheck();

        if (!isAuth) location.href = '/admin/';
    }
}

export default new CarEditPage();
