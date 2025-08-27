import {getAll} from '../api/cars.api.js';
import {BASE_URL} from '../api/config.js';

export class Cars {
    constructor() {
        this.cars = [];
        this.view = [];
        this.carListEl = document.querySelector('#cars');
        this.formEl = document.querySelector('.catalog-aside__form');
        this.classMobileSelectEl = document.querySelector('.custom-select.car');
        this.classSelectEls = this.formEl.querySelectorAll('input[name="car-type"]');
        this.brandSelectEl = this.formEl.querySelector('.custom-select:not(.car):nth-of-type(2)');
        this.modelSelectEl = this.formEl.querySelector('.custom-select:not(.car):nth-of-type(3)');
        this.fuelTypeEl = this.formEl.querySelector('.custom-select:not(.car):nth-of-type(4)');
        this.priceMinEl = this.formEl.querySelector('#value_min');
        this.priceMaxEl = this.formEl.querySelector('#value_max');
        this.sortKeyEl = document.querySelector('.catalog-section__content .custom-select.mode');

        this.filters = {
            class: null,
            brand: null,
            model: null,
            fuel: null,
            priceMin: null,
            priceMax: null,
        };

        this.sortKey = 'default';
        this.handlerRegister();
        this.readFiltersFromUI();
    }

    async init() {
        await this.getCars();
        this.restoreFromURL()
        this.applyAll();
    }

    async getCars() {
        this.cars = await getAll();
        const uniqueBrands = new Set();
        const uniqueModels = new Set();
        for(const car of this.cars) {
            uniqueBrands.add(car.brand.trim());
            uniqueModels.add(car.model.trim());
        }
        this.brandSelectEl.CustomSelectInstance.setOptions(Array.from(uniqueBrands).map(brand => ({value: brand, label: brand})));
        this.modelSelectEl.CustomSelectInstance.setOptions(Array.from(uniqueModels).map(model => ({value: model, label: model})));
    }

    readFiltersFromUI() {
        this.filters.class = this.formEl.querySelector('input[name="car-type"]:checked')?.value || null;
        this.filters.brand = this.brandSelectEl.CustomSelectInstance.getValue()
        this.filters.model = this.modelSelectEl.CustomSelectInstance.getValue()
        this.filters.fuel = this.fuelTypeEl.CustomSelectInstance.getValue()

        const minInput = +this.priceMinEl.value
        const maxInput = +this.priceMaxEl.value;
        this.filters.priceMin = this.priceMinEl.value ? (Number.isFinite(minInput) ? minInput : null) : null;
        this.filters.priceMax = this.priceMaxEl.value ? (Number.isFinite(maxInput) ? maxInput : null) : null;

        this.sortKey = this.sortKeyEl.CustomSelectInstance.getValue() || 'default';
    }

    applyAll() {
        this.readFiltersFromUI();
        const filtered = this.cars.filter(c => this.matchCar(c, this.filters));
        this.view = this.sortCars(filtered);
        this.updateURL();
        this.renderCars();
        document.querySelector('.catalog-aside__filter b').innerText = Object.values(this.filters).filter(el => el).length;
        document.querySelector('#showCarsBtn span').innerText = this.view.length;
    }

    matchCar(car, f) {
        if (f.class) {
            if (!car.segment.some(segment => segment.name.trim().toLowerCase() === f.class.toLowerCase())) return false;
        }
        if (f.brand) {
            if (car.brand.trim().toLowerCase() !== f.brand.toLowerCase()) return false;
        }
        if (f.model) {
            if (car.model.trim().toLowerCase() !== f.model.toLowerCase()) return false;
        }
        if (f.fuel) {
            if (car.engineType.trim().trim().toLowerCase() !== f.fuel.toLowerCase()) return false;
        }
        if (f.priceMin != null && car.rentalTariff[car.rentalTariff.length - 1].dailyPrice < f.priceMin) return false;
        if (f.priceMax != null && car.rentalTariff[car.rentalTariff.length - 1].dailyPrice > f.priceMax) return false;

        return true;
    }

    sortCars(arr) {
        if (this.sortKey === 'asc') {
            return [...arr].sort((a, b) => a.rentalTariff[a.rentalTariff.length - 1].dailyPrice - b.rentalTariff[a.rentalTariff.length - 1].dailyPrice);
        }
        if (this.sortKey === 'desc') {
            return [...arr].sort((a, b) => b.rentalTariff[a.rentalTariff.length - 1].dailyPrice - a.rentalTariff[a.rentalTariff.length - 1].dailyPrice);
        }
        return arr;
    }

    renderCars() {
        let carsList = ``;

        this.view.forEach(
            (
                {
                    brand,
                    model,
                    previewUrl,
                    rentalTariff,
                    engineVolume,
                    engineType,
                    transmission,
                    seats,
                    driveType,
                },
                i,
            ) => {
                carsList += `
                <li class="car-card">
                    <a href="single" class="car-card__image">
                        <picture>
                            <source
                                type="image/webp"
                                srcset="${BASE_URL}static/${previewUrl}"
                            />
                            <img
                                width="450"
                                height="252"
                                src="${BASE_URL}static/${previewUrl}"
                                alt="${brand} ${model}"
                            />
                        </picture>
                    </a>

                    <div class="car-card__box">
                        <div class="car-card__top">
                            <a href="single" class="car-card__name"
                                >${brand} ${model}</a
                            >
                            <span class="car-card__label">NEW</span>
                        </div>

                        <div class="car-card__labels">
                            <span class="active">С залогом</span>
                            <span>Покрытие 50%</span>
                            <span>Покрытие 100%</span>
                        </div>

                        <ul class="car-card__list">
                            <li class="car-card__item">
                                <span class="car-card__text">1 - 2 дней</span>
                                <span class="car-card__value"
                                    ><b>${rentalTariff[0].dailyPrice} USD</b><i>/</i>сутки</span
                                >
                            </li>
                            <li class="car-card__item">
                                <span class="car-card__text">3 - 7 дней</span>
                                <span class="car-card__value"
                                    ><b>${rentalTariff[1].dailyPrice} USD</b><i>/</i>сутки</span
                                >
                            </li>
                            <li class="car-card__item">
                                <span class="car-card__text">8 - 29 дней</span>
                                <span class="car-card__value"
                                    ><b>${rentalTariff[2].dailyPrice} USD</b><i>/</i>сутки</span
                                >
                            </li>
                            <li class="car-card__item">
                                <span class="car-card__text">Более 29 дней</span>
                                <span class="car-card__value"
                                    ><b>${rentalTariff[3].dailyPrice} USD</b><i>/</i>сутки</span
                                >
                            </li>
                        </ul>

                        <ul class="car-card__info">
                            <li class="car-card__item">
                                <i class="sprite">
                                    <svg width="26" height="26">
                                        <use
                                            href="img/sprite/sprite.svg#icon1"
                                        ></use>
                                    </svg>
                                </i>
                                <span class="car-card__text">Двигатель</span>
                                <span class="car-card__value desktop">${engineVolume}</span>
                                <span class="car-card__value mob">${engineVolume} ${engineType}</span>
                            </li>
                            <li class="car-card__item">
                                <i class="sprite">
                                    <svg width="26" height="26">
                                        <use
                                            href="img/sprite/sprite.svg#icon2"
                                        ></use>
                                    </svg>
                                </i>
                                <span class="car-card__text">Трансмисия</span>

                                <span class="car-card__value desktop"
                                    >${transmission}</span
                                >
                                <span class="car-card__value mob">${transmission}</span>
                            </li>
                            <li class="car-card__item">
                                <i class="sprite">
                                    <svg width="26" height="26">
                                        <use
                                            href="img/sprite/sprite.svg#icon3"
                                        ></use>
                                    </svg>
                                </i>
                                <span class="car-card__text">Привод</span>
                                <span class="car-card__value desktop">${driveType}</span>
                                <span class="car-card__value mob"
                                    >${driveType}</span
                                >
                            </li>
                            <li class="car-card__item">
                                <i class="sprite">
                                    <svg width="26" height="26">
                                        <use
                                            href="img/sprite/sprite.svg#icon4"
                                        ></use>
                                    </svg>
                                </i>
                                <span class="car-card__text">Число мест</span>
                                <span class="car-card__value">${seats} Seats</span>
                            </li>
                        </ul>

                        <div class="car-card__total">
                            <span class="car-card__text">Залог:</span>
                            <span class="car-card__value">${rentalTariff[0].deposit} USD</span>
                        </div>
                        <a href="single" class="main-button">ПОДРОБНЕЕ</a>
                    </div>
                </li>
            `;
            },
        );

        if (!carsList) {
            carsList = 'Немає машин';
        }

        this.carListEl.innerHTML = carsList;
    }

    resetFiltersUI() {
        this.priceMinEl.value = '';
        this.priceMaxEl.value = '';

        this.brandSelectEl.CustomSelectInstance.clear()
        this.modelSelectEl.CustomSelectInstance.clear()
        this.fuelTypeEl.CustomSelectInstance.clear()
        this.classMobileSelectEl.CustomSelectInstance.clear()
        this.classSelectEls.forEach(el => {
            el.checked = false
        })
        this.filters = {class: null, brand: null, model: null, fuel: null, priceMin: null, priceMax: null};
        this.sortKey = 'default';
        this.updateURL(true);
    }

    updateURL(clear = false) {
        const params = new URLSearchParams();

        if (!clear) {
            if (this.filters.class) params.set('class', this.filters.class);
            if (this.filters.brand) params.set('brand', this.filters.brand);
            if (this.filters.model) params.set('model', this.filters.model);
            if (this.filters.fuel) params.set('fuel', this.filters.fuel);
            if (this.filters.priceMin != null) params.set('priceMin', String(this.filters.priceMin));
            if (this.filters.priceMax != null) params.set('priceMax', String(this.filters.priceMax));
            if (this.sortKey && this.sortKey !== 'default') params.set('sort', this.sortKey);
        }

        const qs = params.toString();
        const url = qs ? `?${qs}` : location.pathname;
        history.replaceState(null, '', url);
    }

    handlerRegister() {
        if (this.formEl) {
            this.formEl.addEventListener('input', (e) => {
                const target = e.target;
                if (target.matches('#value_min, #value_max')) {
                    this.applyAll();
                }
            });

            this.brandSelectEl.CustomSelectInstance.onSelect((value) => {
                const availableModels = new Set();
                this.cars.forEach(c => {
                    if (c.brand.trim().toLowerCase() === value?.trim().toLowerCase()) {
                        availableModels.add(c.model);
                    }
                })
                this.modelSelectEl.CustomSelectInstance.setOptions(Array.from(availableModels).map(model => ({value: model, label: model})));
            })

            this.sortKeyEl.CustomSelectInstance.onSelect((value) => {
                this.sortKey = value
                this.applyAll()
            })

            this.formEl.addEventListener('click', (e) => {
                const opt = e.target.closest('.options-container .option');
                if (opt) {
                    const list = opt.parentElement;
                    list.querySelectorAll('.option.active').forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    this.applyAll();
                }

                const resetBtn = e.target.closest('.reset-btn');
                if (resetBtn) {
                    e.preventDefault();
                    this.resetFiltersUI();
                    this.applyAll();
                }

                const radio = e.target.closest('.radio-checkbox__field');
                if (radio && radio.name === 'car-type') {
                    this.classMobileSelectEl.CustomSelectInstance.setValue(radio.value)
                    this.applyAll();
                }
            });
            this.classMobileSelectEl.CustomSelectInstance.onSelect(value => {
                this.classSelectEls.forEach(el => {
                    el.checked = el.value === value
                })
            })
        }
    }

    restoreFromURL() {
        const params = new URLSearchParams(location.search);
        const map = (k) => (params.get(k) || null);

        this.filters.class = map('class');
        this.filters.brand = map('brand');
        this.filters.model = map('model');
        this.filters.fuel = map('fuel');

        const priceMin = params.get('priceMin');
        const priceMax = params.get('priceMax');
        this.filters.priceMin = priceMin != null ? Number(priceMin) : null;
        this.filters.priceMax = priceMax != null ? Number(priceMax) : null;

        const sort = params.get('sort');
        this.sortKey = sort || 'default';
        if (this.filters.class) {
            this.classMobileSelectEl.CustomSelectInstance.setValue(this.filters.class)
            this.classSelectEls.forEach(r => {
                if (r.value === this.filters.class) {
                    r.checked = true;
                }
            })
        }
        if (this.filters.brand) this.brandSelectEl.CustomSelectInstance.setValue(this.filters.brand);
        if (this.filters.model) {
            this.modelSelectEl.CustomSelectInstance.setValue(this.filters.model);
        }
        if (this.filters.fuel)  this.fuelTypeEl.CustomSelectInstance.setValue(this.filters.fuel);

        if(this.filters.priceMin) this.priceMinEl.value = String(this.filters.priceMin);
        if(this.filters.priceMax) this.priceMaxEl.value = String(this.filters.priceMax);

        if (this.sortKey && this.sortKey !== 'default') {
            const key = this.sortKey === 'asc' ? 'asc' : this.sortKey === 'desc' ? 'desc' : null;
            if (key) this.sortKeyEl.CustomSelectInstance.setValue(key)
        }
    }
}
