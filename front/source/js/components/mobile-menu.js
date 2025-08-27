import {disableScroll} from '../functions/disable-scroll.js';
import {enableScroll} from '../functions/enable-scroll.js';
import vars from '../_vars.js';

import {
    toggleClassInArray,
    toggleCustomClass,
    removeCustomClass,
    removeClassInArray,
    addCustomClass,
} from '../functions/customFunctions.js';

const {
    overlay,
    burger,
    mobileMenu,
    header,
    activeClass,
    activeClassMode,
    filterAside,
    filterBtn,
    filterClose,
    filterShowCarsBtn,
} = vars;
const orderBlock = document.querySelector('.main-order');
const filterWrapper = document.querySelector('.catalog-aside__open');

const mobileMenuHandler = function (overlay, mobileMenu, burger) {
    burger.forEach((btn) => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            if (filterAside) {
                const isMenuActive = mobileMenu.classList.contains(activeClass);
                const isFilterActive = filterAside.classList.contains('active');

                if (isFilterActive) {
                    hideFilterHandler();
                }
            }
            toggleCustomClass(mobileMenu, activeClass);
            toggleClassInArray(burger, activeClass);

            const newMenuActive = mobileMenu.classList.contains(activeClass);

            if (newMenuActive) {
                addCustomClass(overlay, activeClass);
                disableScroll();
                addCustomClass(header, 'open-menu');
            } else {
                removeCustomClass(overlay, activeClass);
                removeCustomClass(overlay, activeClassMode);
                enableScroll();
                removeCustomClass(header, 'open-menu');
            }
        });
    });
};

export const hideMenuHandler = function (overlay, mobileMenu, burger) {
    enableScroll();
    removeCustomClass(mobileMenu, activeClass);
    removeClassInArray(burger, activeClass);
    removeCustomClass(overlay, activeClassMode);
    removeCustomClass(overlay, activeClass);
    removeCustomClass(header, 'open-menu');
};

const hideFilterHandler = function () {
    removeCustomClass(filterAside, 'active');
    removeCustomClass(overlay, activeClassMode);
    removeCustomClass(overlay, activeClass);
    enableScroll();
    removeCustomClass(header, 'open-menu');
};

document.addEventListener('DOMContentLoaded', function () {
    if (overlay) {
        mobileMenuHandler(overlay, mobileMenu, burger);
        overlay.addEventListener('click', function (e) {
            if (e.target.classList.contains('overlay')) {
                hideMenuHandler(overlay, mobileMenu, burger);
            }
        });
    }

    if (mobileMenu) {
        mobileMenu.querySelectorAll("a[href^='#']").forEach(function (item) {
            item.addEventListener('click', function () {
                hideMenuHandler(overlay, mobileMenu, burger);
            });
        });
    }

    document.querySelectorAll('[data-modal]').forEach(function (item) {
        item.addEventListener('click', function () {
            hideMenuHandler(overlay, mobileMenu, burger);
        });
    });

    if (filterBtn && filterAside) {
        filterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const isFilterActive = filterAside.classList.contains('active');

            toggleCustomClass(filterAside, 'active');

            if (!isFilterActive) {
                addCustomClass(overlay, activeClass);
                disableScroll();
                addCustomClass(header, 'open-menu');
                addCustomClass(header, 'sticky');
            } else {
                hideFilterHandler();
            }
        });

        filterClose?.addEventListener('click', function (e) {
            e.preventDefault();
            hideFilterHandler();
        });

        document.addEventListener('click', function (e) {
            if (
                filterAside.classList.contains('active') &&
                !filterAside.contains(e.target) &&
                !filterBtn.contains(e.target)
            ) {
                hideFilterHandler();
            }
        });
    }

    if(filterShowCarsBtn) {
        filterShowCarsBtn.addEventListener('click', (e) => {
            e.preventDefault()
            hideFilterHandler();
        })
    }

    if (orderBlock) {
        const wrapper = document.querySelector('.main-order-wrapper');

        function toggleFixedBlock() {
            const wrapperTop = wrapper.getBoundingClientRect().top;

            if (wrapperTop > window.innerHeight - orderBlock.offsetHeight - 20) {
                orderBlock.classList.add('show');
            } else {
                orderBlock.classList.remove('show');
            }
        }

        toggleFixedBlock();
        window.addEventListener('scroll', toggleFixedBlock);
        window.addEventListener('resize', toggleFixedBlock);
    }

    if (filterWrapper) {
        let addTimeout = null;
        let removeTimeout = null;
        const addDelayMs = 200;
        const removeAdvanceMs = 100;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const rectTop = entry.boundingClientRect.top;
                const rectBottom = entry.boundingClientRect.bottom;

                const isAbove = rectBottom < 0;
                const isBelow = rectTop > window.innerHeight;

                if (isAbove) {
                    if (removeTimeout) {
                        clearTimeout(removeTimeout);
                        removeTimeout = null;
                    }
                    if (!addTimeout) {
                        addTimeout = setTimeout(() => {
                            filterBtn.parentNode.classList.add('fixed');
                            addTimeout = null;
                        }, addDelayMs);
                    }
                } else {
                    if (!isBelow) {
                        if (addTimeout) {
                            clearTimeout(addTimeout);
                            addTimeout = null;
                        }
                        if (!removeTimeout) {
                            removeTimeout = setTimeout(() => {
                                filterBtn.parentNode.classList.remove('fixed');
                                removeTimeout = null;
                            }, removeAdvanceMs);
                        }
                    }
                }
            },
            {
                root: null,
                threshold: 0,
            }
        );

        observer.observe(filterWrapper);
    }



    const normalizePath = path => {
        return ("/" + path
            .replace(/^\/+/, "")
            .replace(/\/$/, "")
            .replace(/\.html$/, "")
            .replace(/^index$/, "")
        ) || "/";
    };

    const currentPath = normalizePath(window.location.pathname);
    const links = document.querySelectorAll(".mobile .main-nav > ul > li > a");

    links.forEach(link => link.classList.remove("active"));

     links.forEach(link => {
        const linkPath = normalizePath(link.getAttribute("href"));

        if (currentPath === "/single") {
            document.querySelector(".mobile .main-nav__acc")?.classList.add("active");
        } else if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });


});
