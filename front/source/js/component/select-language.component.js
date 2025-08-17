export class SelectLanguage {
    constructor() {
        this.select = document.querySelector('#language');
        this.links = document.querySelectorAll('#language a');
    }

    init() {
        let path = window.location.pathname;

        path = path.replace('/ua', '');
        path = path.replace('/en', '');

        this.links.forEach((item) => (item.href += path.slice(1)));
    }
}
