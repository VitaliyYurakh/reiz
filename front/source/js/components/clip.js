import { setupClipFunctionality } from '../functions/scripts/clip-text.js';

setupClipFunctionality({
	clipSelector: '[data-clip]',
	btnSelector: '[data-clip-btn]',
	itemSelector: '[data-clip-item]',
	transitionStyle: 'max-height 0.4s linear'
});
