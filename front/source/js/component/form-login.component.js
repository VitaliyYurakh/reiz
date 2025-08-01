import {login} from '../api/auth.api.js';

export class FormLogin {
    constructor() {
        this.formEl = document.forms.login;

        this.handlerRegister();
    }

    handlerRegister() {
        this.formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(this.formEl);
            const data = Object.fromEntries(formData.entries());

            try {
                const token = await login(data.email, data.password);
                localStorage.setItem('token', token);
                location.href = '/admin/car-list.html';
            } catch (err) {
                alert(err);
            }
        });
    }
}
