import CustomSelect from '../functions/scripts/customSelect.js';

document.addEventListener('DOMContentLoaded', () => {
    const selects = document.querySelectorAll('.custom-select');

    selects.forEach(function (select) {
        const customSelect = new CustomSelect(select, {
            mode: 'single',

            name: select.getAttribute('data-name') || '',
            hideOnSelect: true,
            hideOnClear: true,
            showRemoveButton: false,
        });

        select.CustomSelectInstance = customSelect;
    });
});
