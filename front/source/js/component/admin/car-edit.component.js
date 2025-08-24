import {
    addPhoto,
    addPreview,
    deletePhoto,
    getOne,
    getSegments,
    updateOne,
    updatePhoto,
    updateRentalTariffs,
} from '../../api/cars.api.js';
import {BASE_URL} from '../../api/config.js';

export class CarEdit {
    car = null;

    constructor() {
        this.carPropEls = document.querySelectorAll('[data-car]');
        this.description = document.getElementById('mess');
        this.preview = document.getElementById('preview');
        this.carPhotoEl = document.getElementById('photo');
        this.carMobilePhotoEl = document.getElementById('mobile');
        this.carAttrEls = document.querySelectorAll('[data-attr]');
        this.rentalTariffsEls = document.querySelectorAll('[data-tariff]');
        this.overPriceEl = document.getElementById('over');
        this.depositEl = document.getElementById('deposit');
        this.carDiscountEl = document.getElementById('discount');
        this.carConfigurationEl = document.getElementById('configuration');
        this.segmentsEl = document.getElementById('segments');

        this.handlerRegister();
    }

    async init() {
        await this.getCar();
        await this.getSegment();
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

    async getSegment() {
        this.segments = await getSegments();
        console.log(this.segments);
    }

    handlerRegister() {
        this.openEditModalHandler();
        this.saveCarHandler();
        this.editDescriptionHandler();
        this.editAttributeHandler();
        this.changeDiscountHandler();
        this.addConfigurationHandler();
        this.editTariffHandler();
        this.addPhotoHandler();
        this.deletePhotoHandler();
    }

    deletePhotoHandler() {
        const photoContainers = [
            document.querySelector('#photo'),
            document.querySelector('#mobile'),
        ];

        photoContainers.forEach((el) =>
            el.addEventListener('click', async (e) => {
                const deleteBtn = e.target.closest('.delete-btn');
                const editBtn = e.target.closest('.edit-btn');

                if (deleteBtn) {
                    const parent = deleteBtn.closest('[data-photo]');
                    if (!parent) return;

                    const photoId = parent.dataset.photo;
                    if (!photoId) return;

                    try {
                        await deletePhoto(this.car.id, photoId);
                        await this.getCar();
                        this.render();
                    } catch (err) {
                        alert(err);
                    }
                }

                if (editBtn) {
                    const parent = editBtn.closest('[data-photo]');
                    if (!parent) return;

                    const photoId = parent.dataset.photo;
                    if (!photoId) return;

                    const photo = this.car.carPhoto.find((item) => item.id == photoId);

                    const alt = prompt(`Текущий alt: ${photo.alt}`);

                    if (!alt) return;

                    try {
                        await updatePhoto(this.car.id, {
                            photoId,
                            alt,
                        });
                        await this.getCar();
                        this.render();
                    } catch (err) {
                        alert(err);
                    }
                }
            })
        );
    }

    addPhotoHandler() {
        document.querySelectorAll('[data-upload-group]').forEach((group) => {
            const addButton = group.querySelector('.main-info__add');
            addButton.addEventListener('click', async () => {
                const type = group.dataset.uploadGroup;

                const input = group.querySelector('input[type="file"]');
                input.click();

                const upload = async () => {
                    const file = input.files?.[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('car', file);

                    if (type === 'PREVIEW') {
                        try {
                            await addPreview(this.car.id, formData);
                            await this.getCar();
                            this.render();
                        } catch (err) {
                            alert(err);
                        } finally {
                            input.removeEventListener('change', upload);
                        }

                        return;
                    }

                    formData.append('type', type);
                    formData.append('alt', 'test');
                    try {
                        await addPhoto(this.car.id, formData);
                        await this.getCar();
                        this.render();
                    } catch (err) {
                        alert(err);
                    } finally {
                        input.removeEventListener('change', upload);
                    }
                };

                input.addEventListener('change', upload);
            });
        });
    }

    editTariffHandler() {
        const btn = document.querySelector('#edit-tariff');
        btn.addEventListener('click', async () => {
            const newTariffs = this.car.rentalTariff.map((tariff, i) => ({
                ...tariff,
                dailyPrice: +this.rentalTariffsEls[i].querySelector('input').value,
                deposit: +this.depositEl.value,
            }));

            try {
                await updateRentalTariffs(this.car.id, newTariffs);
                await this.getCar();
                this.render();
            } catch (err) {
                alert(err);
            }
        });
    }

    addConfigurationHandler() {
        const btn = document.querySelector('#add-configuration');
        btn.addEventListener('click', async () => {
            const res = prompt('Добавить комплектацию');

            if (res) {
                const configuration = JSON.parse(this.car.configuration);

                try {
                    await updateOne(this.car.id, {
                        configuration: configuration
                            ? JSON.stringify([...configuration, res])
                            : JSON.stringify([res]),
                    });
                    await this.getCar();
                    this.render();
                } catch (err) {
                    alert(err);
                }
            }
        });
    }

    changeDiscountHandler() {
        const inputDiscountEls = document.querySelectorAll('input[name="discount"]');

        inputDiscountEls.forEach((el) =>
            el.addEventListener('click', async () => {
                try {
                    await updateOne(this.car.id, {
                        discount: parseInt(el.value) * -1,
                    });
                    await this.getCar();
                    this.render();
                } catch (err) {
                    alert(err);
                }
            })
        );
    }

    openEditModalHandler() {
        const btn = document.querySelector('[data-btn-modal="settings"]');
        btn.addEventListener('click', () => {
            const inputs = document.querySelectorAll('[data-edit]');

            inputs.forEach((input) => {
                const prop = input.dataset.edit;
                input.value = this.car[prop];
            });
        });
    }

    editAttributeHandler() {
        const editBtn = document.querySelector('#edit-attr');
        editBtn.addEventListener('click', async () => {
            try {
                const data = {};

                this.carAttrEls.forEach((el) => {
                    const attr = el.dataset.attr;
                    data[attr] = el.value;
                });

                await updateOne(this.car.id, {
                    ...data,
                    seats: +data.seats,
                });
                await this.getCar();
                this.render();
            } catch (err) {
                alert(err);
            }
        });
    }

    editDescriptionHandler() {
        const editBtn = document.querySelector('#edit-description');
        editBtn.addEventListener('click', async () => {
            try {
                await updateOne(this.car.id, {
                    description: this.description.value,
                });
                await this.getCar();
                this.render();
            } catch (err) {
                alert(err);
            }
        });
    }

    saveCarHandler() {
        const form = document.forms.edit;
        const close = form.querySelector('.close');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const segmentId = data['custom-select-value'];
            delete data['custom-select-value'];

            const reqData = {
                ...data,
                yearOfManufacture: +data.yearOfManufacture,
            };

            if (segmentId) {
                reqData.segmentIds = [+segmentId];
            }

            try {
                await updateOne(this.car.id, reqData);
                await this.getCar();
                this.render();
                close.click();
            } catch (err) {
                alert(err);
            }
        });
    }

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
                span.innerHTML = segment[0].name;
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
                <img src="${BASE_URL}static/${previewUrl}" alt="Загруженное фото" style="width: 100%; aspect-ratio: 16 / 9; object-fit: cover;">
            `
            : '';

        this.carPhotoEl.innerHTML =
            carPhoto.reduce((acc, {id, url, type}) => {
                if (type !== 'PC') return acc;

                acc += `<li data-photo="${id}" class="main-info__item">
                            <button class="edit-btn" title="Редагувати">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                </svg>
                            </button>

                            <!-- Кнопка видалення -->
                            <button class="delete-btn" title="Видалити">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                </svg>
                            </button>
                            <img src="${BASE_URL}static/${url}" alt="Загруженное фото" style="width: 100%; aspect-ratio: 16 / 9; object-fit: cover;">
                        </li>`;

                return acc;
            }, '') || '';

        this.carMobilePhotoEl.innerHTML =
            carPhoto.reduce((acc, {id, url, type}) => {
                if (type !== 'MOBILE') return acc;

                acc += `<li data-photo="${id}" class="main-info__item">
                            <button class="edit-btn" title="Редагувати">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                </svg>
                            </button>

                            <!-- Кнопка видалення -->
                            <button class="delete-btn" title="Видалити">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                </svg>
                            </button>
                            <img src="${BASE_URL}static/${url}" alt="Загруженное фото" style="width: 100%; aspect-ratio: 16 / 9; object-fit: cover;">
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
