import {authCheck} from '../api/auth.api.js';
import {FormLogin} from '../component/form-login.component.js';

class LoginPage {
    async init() {
        await this.authCheck();
        new FormLogin();
    }

    async authCheck() {
        const isAuth = await authCheck();

        if (isAuth) location.href = '/admin/car-list.html';
    }
}

export default new LoginPage();
