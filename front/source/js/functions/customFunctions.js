export const fadeIn = (el, timeout, display) => {
    el.style.opacity = 0;
    el.style.display = display || 'flex';
    el.style.transition = `all ${timeout}ms`;
    setTimeout(() => {
        el.style.opacity = 1;
    }, 10);
};
// ----------------------------------------------------
export const fadeOut = (el, timeout) => {
    el.style.opacity = 1;
    el.style.transition = `all ${timeout}ms ease`;
    el.style.opacity = 0;

    setTimeout(() => {
        el.style.display = 'none';
    }, timeout);
};

// ----------------------------------------------------
export const removeCustomClass = (item, customClass = 'active') => {
    const classes = customClass.split(',').map((cls) => cls.trim());
    classes.forEach((className) => {
        if (!item) return;
        item.classList.remove(className);
    });
};

// ----------------------------------------------------
export const toggleCustomClass = (item, customClasses = 'active') => {
    const classes = customClasses.split(',').map((cls) => cls.trim());
    classes.forEach((className) => {
        item.classList.toggle(className);
    });
};

// ----------------------------------------------------
export const addCustomClass = (item, customClass = 'active') => {
    const classes = customClass.split(',').map((cls) => cls.trim());
    classes.forEach((className) => {
        if (!item) return;
        item.classList.add(className);
    });
};

// ----------------------------------------------------
export const removeClassInArray = (arr, customClass = 'active') => {
    const classes = customClass.split(',').map((cls) => cls.trim());
    arr.forEach((item) => {
        classes.forEach((className) => {
            item.classList.remove(className);
        });
    });
};

// ----------------------------------------------------
export const toggleClassInArray = (arr, customClass = 'active') => {
    const classes = customClass.split(',').map((cls) => cls.trim());
    arr.forEach((item) => {
        classes.forEach((className) => {
            item.classList.toggle(className);
        });
    });
};

//-----------------------------------------------------

export const elementHeight = (el, variableName) => {
    // el -- сам елемент (но не коллекция)
    // variableName -- строка, имя создаваемой переменной
    if (el) {
        function initListener() {
            const elementHeight = el.offsetHeight;
            document
                .querySelector(':root')
                .style.setProperty(`--${variableName}`, `${elementHeight}px`);
        }

        window.addEventListener('DOMContentLoaded', initListener);
        window.addEventListener('resize', initListener);
    }
};
