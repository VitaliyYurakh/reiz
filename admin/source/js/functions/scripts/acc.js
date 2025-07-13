class Accordion {
    constructor(selector, options = {}) {
        if (!window.accordionInstances) {
            window.accordionInstances = new Map();
        }

        if (window.accordionInstances.has(selector)) {
            return window.accordionInstances.get(selector);
        }

        this.selector = selector;
        this.options = {
            btnAttribute: 'data-id',
            contentAttribute: 'data-content',
            activeClass: 'active',
            ...options
        };

        this.openStates = new Map();
        this.handlers = new WeakMap();
        this.accordions = [];

        window.accordionInstances.set(selector, this);
        this.init();
        return this;
    }

    init() {
        const elements = document.querySelectorAll(this.selector);
        if (!elements.length) return;

        this.accordions = Array.from(elements).map(element => {
            const accordion = {
                element,
                buttons: element.querySelectorAll(`[${this.options.btnAttribute}]`),
                isSingle: element.dataset.single === 'true',
                breakpoint: element.dataset.breakpoint ? parseInt(element.dataset.breakpoint) : null
            };

            const savedStates = this.openStates.get(element);
            if (savedStates && savedStates.size > 0) {
                savedStates.forEach(contentId => {
                    const content = element.querySelector(`[${this.options.contentAttribute}="${contentId}"]`);
                    const button = element.querySelector(`[${this.options.btnAttribute}="${contentId}"]`);
                    if (content && button) {
                        this.openSection(content, button);
                    }
                });
            } else {
                this.setDefaultOpen(accordion);
            }

            return accordion;
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.accordions.forEach(accordion => {
            accordion.buttons.forEach(button => {
                const oldHandler = this.handlers.get(button);
                if (oldHandler) {
                    button.removeEventListener('click', oldHandler);
                }

                const handler = (e) => this.handleClick(e, accordion);
                this.handlers.set(button, handler);
                button.addEventListener('click', handler);
            });
        });
    }

    handleClick(e, accordion) {
        e.preventDefault();

        const button = e.currentTarget;
        const contentId = button.getAttribute(this.options.btnAttribute);
        const content = accordion.element.querySelector(
            `[${this.options.contentAttribute}="${contentId}"]`
        );

        if (!content) return;

        const isOpen = content.classList.contains(this.options.activeClass);

        let openSections = this.openStates.get(accordion.element);
        if (!openSections) {
            openSections = new Set();
            this.openStates.set(accordion.element, openSections);
        }

        if (isOpen) {
            this.closeSection(content, button);
            openSections.delete(contentId);
        } else {
            if (accordion.isSingle && (!accordion.breakpoint || window.innerWidth <= accordion.breakpoint)) {
                const openContent = accordion.element.querySelector(`.${this.options.activeClass}[${this.options.contentAttribute}]`);
                if (openContent) {
                    const openButton = accordion.element.querySelector(
                        `[${this.options.btnAttribute}="${openContent.getAttribute(this.options.contentAttribute)}"]`
                    );
                    this.closeSection(openContent, openButton);
                    openSections.clear();
                }
            }

            this.openSection(content, button);
            openSections.add(contentId);
        }
    }

    openSection(content, button) {
        requestAnimationFrame(() => {
            content.style.maxHeight = `${content.scrollHeight}px`;
            content.classList.add(this.options.activeClass);
            button.classList.add(this.options.activeClass);
            button.parentNode.classList.add(this.options.activeClass);
        });
    }

    closeSection(content, button) {
        content.style.maxHeight = '0';
        content.classList.remove(this.options.activeClass);
        button.classList.remove(this.options.activeClass);
        button.parentNode.classList.remove(this.options.activeClass);
    }

    setDefaultOpen(accordion) {
        const defaultId = accordion.element.dataset.default;
        if (!defaultId) return;

        const content = accordion.element.querySelector(
            `[${this.options.contentAttribute}="${defaultId}"]`
        );
        const button = accordion.element.querySelector(
            `[${this.options.btnAttribute}="${defaultId}"]`
        );

        if (content && button) {
            this.openSection(content, button);
            let openSections = this.openStates.get(accordion.element);
            if (!openSections) {
                openSections = new Set();
                this.openStates.set(accordion.element, openSections);
            }
            openSections.add(defaultId);
        }
    }

    reinit() {
        const currentStates = new Map(this.openStates);

        this.accordions.forEach(accordion => {
            accordion.buttons.forEach(button => {
                const handler = this.handlers.get(button);
                if (handler) {
                    button.removeEventListener('click', handler);
                    this.handlers.delete(button);
                }
            });
        });

        this.accordions = [];
        this.init();

        currentStates.forEach((openSections, element) => {
            openSections.forEach(contentId => {
                const content = element.querySelector(`[${this.options.contentAttribute}="${contentId}"]`);
                const button = element.querySelector(`[${this.options.btnAttribute}="${contentId}"]`);
                if (content && button) {
                    this.openSection(content, button);
                }
            });
        });
    }

    destroy() {
        this.accordions.forEach(accordion => {
            accordion.buttons.forEach(button => {
                const handler = this.handlers.get(button);
                if (handler) {
                    button.removeEventListener('click', handler);
                    this.handlers.delete(button);
                }
            });
        });

        this.openStates.clear();
        this.accordions = [];

        window.accordionInstances.delete(this.selector);
    }
}

export default Accordion;