
import { navigate } from './router.js';

export function initNavigation() {

    document
        .querySelectorAll('[data-view]')
        .forEach(link => {

            link.addEventListener('click', () => {

                const view = link.dataset.view;

                navigate(view);
            });
        });
}
