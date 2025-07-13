import { Fancybox } from "@fancyapps/ui";
const items = document.querySelectorAll('[data-fancybox]');

if(items){
    Fancybox.bind('[data-fancybox]', {});
}

