import {getOne} from '../api/cars.api.js';

export class CarEdit {
    car = null;

    constructor() {
        this.carPropEls = document.querySelectorAll('[data-car]');
        this.description = document.querySelector('#mess');
        this.preview = document.querySelector('#preview');
        this.carPhotoEl = document.querySelector('#photo');
        this.carMobilePhotoEl = document.querySelector('#mobile');
        this.carAttrEls = document.querySelectorAll('[data-attr]');
        this.rentalTariffsEls = document.querySelectorAll('[data-tariff]');
        this.overPriceEl = document.querySelector('#over');
        this.depositEl = document.querySelector('#deposit');
        this.carDiscountEl = document.querySelector('#discount');
        this.carConfigurationEl = document.querySelector('#configuration');

        this.handlerRegister();
    }

    async init() {
        await this.getCar();
        this.render();
    }

    async getCar() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        try {
            this.car = await getOne(id);
            console.log(this.car);
        } catch (err) {
            alert(err);
            location.href = '/admin/car-list.html';
        }
    }

    handlerRegister() {}

    render() {
        if (!this.car) return;

        const {
            brand,
            model,
            yearOfManufacture,
            description,
            previewUrl,
            carPhoto,
            rentalTariff,
            segment,
            discount,
            configuration,
        } = this.car;

        this.carPropEls.forEach((el) => {
            const prop = el.dataset.car;
            const span = el.querySelector('span');

            if (prop === 'title') {
                span.innerHTML = `${brand || ''} ${model || ''} ${yearOfManufacture || ''}`;
            } else if (prop === 'segment') {
                span.innerHTML = segment.name;
            } else {
                span.innerHTML = this.car[prop];
            }
        });

        this.overPriceEl.value = segment.overmileagePrice;

        this.carAttrEls.forEach((el) => {
            const attr = el.dataset.attr;
            el.value = this.car[attr] || '';
        });

        this.rentalTariffsEls.forEach((el) => {
            const [min, max] = el.dataset.tariff.split('_');

            const tariff = rentalTariff.find(
                ({minDays, maxDays}) => minDays === +min && maxDays === +max
            );

            if (tariff) {
                const input = el.querySelector('input');
                input.value = tariff.dailyPrice;
                this.depositEl.value = tariff.deposit;
            }
        });

        this.preview.innerHTML = previewUrl
            ? `
                <img src="http://localhost:3002/static/${previewUrl}" alt="Загруженное фото" style="width: 100%; aspect-ratio: 16 / 9; object-fit: cover;">
            `
            : '';

        this.carPhotoEl.innerHTML =
            carPhoto.reduce((acc, {url, type}) => {
                if (type !== 'PC') return acc;

                acc += `<li class="main-info__item">
                        <img src="http://localhost:3002/static/${url}" alt="Загруженное фото" style="width: 100%; aspect-ratio: 16 / 9; object-fit: cover;">
                    </li>`;

                return acc;
            }, '') || '';

        this.carMobilePhotoEl.innerHTML =
            carPhoto.reduce((acc, {url, type}) => {
                if (type !== 'MOBILE') return acc;

                acc += `<li class="main-info__item">
                        <img src="http://localhost:3002/static/${url}" alt="Загруженное фото" style="width: 100%; aspect-ratio: 16 / 9; object-fit: cover;">
                    </li>`;

                return acc;
            }, '') || '';

        this.description.innerHTML = description;

        if (discount) {
            const input = this.carDiscountEl.querySelector(`input#discount_${discount}`);
            input.checked = true;
        }

        if (configuration) {
            const arrConfiguration = JSON.parse(configuration);

            this.carConfigurationEl.innerHTML = arrConfiguration.reduce(
                (acc, el) =>
                    (acc += `
                        <label class="main-info__label">
                        <span>${el}</span>
                        </label>
                    `),
                ''
            );
        }
    }
}
