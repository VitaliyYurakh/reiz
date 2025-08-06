import {Cars} from '../component/cars.component.js';

class MainPage {
    async init() {
        await new Cars().init();
    }
}

export default new MainPage();
