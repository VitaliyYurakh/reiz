import {createOne, deleteOne, getAll} from '../api/cars.api.js';

export class CarList {
    constructor() {
        this.cars = [];
        this.carListEl = document.querySelector('.cabinet-table__list');
        this.btnAddCar = document.querySelector('button.add-car');
        this.handlerRegister();
    }

    async init() {
        await this.getCars();
        console.log(this.cars);
        this.renderCars();
    }

    handlerRegister() {
        this.listHandle();
        this.addCarHandle();
    }

    listHandle() {
        this.carListEl.addEventListener('click', async (e) => {
            const {target} = e;

            const isEditBtn = target.closest('button.edit');
            const isDeleteBtn = target.closest('button.delete');

            const carItem = target.closest('.cabinet-table__row');

            if (isDeleteBtn) {
                const isConfirm = confirm('Підтвердити видалення');

                if (!isConfirm) return;

                const id = carItem.dataset.carId;
                try {
                    await deleteOne(id);
                    this.clearList();
                    this.cars = this.cars.filter((el) => +el.id !== +id);
                    this.renderCars();
                } catch (err) {
                    alert(err);
                }
            } else if (isEditBtn) {
                const id = carItem.dataset.carId;
                location.href = `/admin/car-edit.html?id=${id}`;
            }
        });
    }

    addCarHandle() {
        this.btnAddCar.addEventListener('click', async () => {
            try {
                const car = await createOne({});
                location.href = `/admin/car-edit.html?id=${car.id}`;
            } catch (err) {
                alert(err);
            }
        });
    }

    async getCars() {
        this.cars = await getAll();
    }

    renderCars() {
        let carsEl = ``;

        this.cars.forEach(({brand, model, id, plateNumber}, i) => {
            carsEl += `
                <li data-car-id="${id}" class="cabinet-table__row">
                    <span class="cabinet-table__value">${brand} ${model}</span>
                    <span class="cabinet-table__value">${plateNumber}</span>
                    <span class="cabinet-table__status">Свободен ✅</span>
                    <span class="cabinet-table__value">ТО через 1200 км</span>
                    <span class="cabinet-table__value">ЛЬВОВ</span>
                    <span class="cabinet-table__value">18 / 30 (60%)</span>
                    <span class="cabinet-table__value">20.07.2025</span>
                    <div class="cabinet-table__box">
                        <button class="grey-btn edit">Редактировать</button>
                        <button class="grey-btn delete">
                            <i class="sprite">
                                <svg width='20' height='20'>
                                <use href='../img/sprite/sprite.svg#delete'></use>
                                </svg>
                            </i>
                        </button>
                    </div>
                </li>
            `;
        });

        this.carListEl.insertAdjacentHTML('beforeend', carsEl);
    }

    clearList() {
        this.carListEl.innerHTML = `
            <li class="cabinet-table__row">
                <span class="cabinet-table__title">НАЗВАНИЕ</span>
                <span class="cabinet-table__title">НОМЕР</span>
                <span class="cabinet-table__title">СТАТУС</span>
                <span class="cabinet-table__title">СТАТУС ТО</span>
                <span class="cabinet-table__title">ЛОКАЦИЯ</span>
                <span class="cabinet-table__title">ЗАГРУЗКА АВТО</span>
                <span class="cabinet-table__title">СТРАХОВКА ДО </span>
                <span class="cabinet-table__title">ДЕЙСТВИЯ</span>
            </li>
        `;
    }
}
