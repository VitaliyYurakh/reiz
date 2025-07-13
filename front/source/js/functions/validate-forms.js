import JustValidate from 'just-validate';
import Inputmask from 'inputmask';
import {afterForm} from "../components/form-validate";

function saveUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams.entries()) {
        if (key.startsWith('utm_')) {
            localStorage.setItem(key, value);
        }
    }
}

function getUTMParameters() {
    const utmParams = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('utm_')) {
            utmParams[key] = localStorage.getItem(key);
        }
    }
    return utmParams;
}

function sendToTelegram(data, afterForm) {
    const telegramBotToken = '6390227740:AAGm11ewpvNB_Rogid6371qzpRmtkI3yL1o';
    const telegramChatId = '-1002006978745';

    const message = Object.entries(data)
        .filter(([key]) => !key.startsWith('_wpcf7') && key !== 'wpcf7tg_sending' && key !== 'utm_') // Исключить ключи, начинающиеся с _wpcf7 и ключ wpcf7tg_sending
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: telegramChatId,
            text: message
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                afterForm()
            } else {
                console.error('Ошибка при отправке сообщения в Telegram:', data);
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке сообщения в Telegram:', error);
        });
}

export const validateForms = (form, rules, checkboxes = [], afterSend) => {
    saveUTMParameters();
    if (!form) {
        console.error('Нет такого элемента формы!');
        return false;
    }

    if (!rules) {
        console.error('Вы не передали правила валидации!');
        return false;
    }

    const telSelector = form.querySelector('input[type="tel"]');

    if (telSelector) {
        telSelector.setAttribute('autocomplete', 'off');
        const mask = new Inputmask({
            mask: "+38 (ABC) 999 99 99",
            definitions: {
                'A': {
                    validator: "[0]",
                    cardinality: 1,
                    casing: "lower"
                },
                'B': {
                    validator: "[5-9]",
                    cardinality: 1,
                    casing: "lower"
                },
                'C': {
                    validator: "[3-9]",
                    cardinality: 1,
                    casing: "lower"
                },
            },
            placeholder: "_",
            // showMaskOnHover: false,
            // showMaskOnFocus: false
        });
        mask.mask(telSelector);
    }

    const validation = new JustValidate(form, {
        validateBeforeSubmitting: true,
    });

    for (let item of rules) {
        if (form.querySelector(item.ruleSelector)) {
            validation.addField(item.ruleSelector, item.rules);
        }
    }

    if (checkboxes.length) {
        for (let item of checkboxes) {
            validation.addRequiredGroup(
                `${item.selector}`,
                `${item.errorMessage}`
            );
        }
    }

    validation.onSuccess((ev) => {
        ev.preventDefault(); // Предотвратить стандартное поведение формы
        form.classList.add('loader');
        let formData = new FormData(form);
        const action = form.action;

        const utmParams = getUTMParameters();
        for (const [key, value] of Object.entries(utmParams)) {
            formData.append(key, value);
        }


        fetch(action, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                return response.text();
            })
            .then(responseText => {
                form.classList.remove('loader');
            })
            .catch(error => {
                form.classList.remove('loader');
            });

        // Отправка данных в Telegram
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        sendToTelegram(data, afterSend);

        form.reset();
    });
};
