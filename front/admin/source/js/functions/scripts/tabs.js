import {addCustomClass, removeClassInArray} from "../customFunctions.js";

class Tabs {
    constructor(parentSelector, navAttr, contentAttr, activeClass = "active") {
        this.parentSelector = parentSelector;
        this.navAttr = navAttr;
        this.contentAttr = contentAttr;
        this.activeClass = activeClass;
        this.tabsParents = document.querySelectorAll(this.parentSelector);
        this.init();
    }

    init() {
        this.tabsParents.forEach((tabParent) => {
            if (tabParent) {
                const tabNav = [...tabParent.querySelectorAll(`[${this.navAttr}]`)];
                const tabContent = [...tabParent.querySelectorAll(`[${this.contentAttr}]`)];

                tabNav.forEach((nav) => {
                    nav.addEventListener("click", (e) => {
                        e.preventDefault();
                        const activeTabAttr = e.target.getAttribute(`${this.navAttr}`);
                        removeClassInArray(tabNav, this.activeClass);
                        removeClassInArray(tabContent, this.activeClass);
                        addCustomClass(tabParent.querySelector(`[${this.navAttr}="${activeTabAttr}"]`), this.activeClass);
                        addCustomClass(tabParent.querySelector(`[${this.contentAttr}="${activeTabAttr}"]`), this.activeClass);
                    });
                });
            }
        });
    }

    reinit() {
        this.tabsParents = document.querySelectorAll(this.parentSelector);
        this.init();
    }
}

export default Tabs;
