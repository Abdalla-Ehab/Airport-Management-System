import { navigate }
from './router.js';

const NAV_CONFIG = {

    passenger: [
        {
            view: 'home',
            label: 'Airports'
        },
        {
            view: 'book',
            label: 'Book Flight'
        },
        {
            view: 'status',
            label: 'Flight Status'
        }
    ],

    staff: [
        {
            view: 'baggage',
            label: 'Baggage'
        },
        {
            view: 'scanner',
            label: 'Scanner'
        }
    ],

    admin: [
        {
            view: 'schedule',
            label: 'Scheduler'
        },
        {
            view: 'fleet',
            label: 'Fleet'
        }
    ]
};

export function buildNavigation(role) {

    const container =
        document.getElementById('nav-links');

    container.innerHTML = '';

    const items =
        NAV_CONFIG[role] || [];

    items.forEach(item => {

        const li =
            document.createElement('li');

        const a =
            document.createElement('a');

        a.textContent =
            item.label;

        a.href = '#';

        a.addEventListener('click', () => {

            navigate(item.view);
        });

        li.appendChild(a);

        container.appendChild(li);
    });

    if (items.length) {
        navigate(items[0].view);
    }
}