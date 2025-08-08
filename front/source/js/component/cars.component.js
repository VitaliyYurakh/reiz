import {getAll} from '../api/cars.api.js';
import {BASE_URL} from '../api/config.js';

export class Cars {
    constructor() {
        this.cars = [];
        this.carListEl = document.querySelector('#cars');
        this.handlerRegister();
    }

    async init() {
        await this.getCars();
        this.renderCars();
    }

    async getCars() {
        this.cars = await getAll();
        console.log(this.cars);
    }

    handlerRegister() {}

    renderCars() {
        let carsList = ``;

        this.cars.forEach(
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
                i
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
            }
        );

        if (!carsList) {
            carsList = 'Немає машин';
        }

        this.carListEl.insertAdjacentHTML('beforeend', carsList);
    }
}
