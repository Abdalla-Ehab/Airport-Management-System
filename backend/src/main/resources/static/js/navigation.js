import { navigate }
from './router.js';

const NAVIGATION = {

    admin: [

        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊'
        },

        {
            id: 'flights',
            label: 'Flights',
            icon: '✈'
        },

        {
            id: 'airports',
            label: 'Airports',
            icon: '🏢'
        },

        {
            id: 'airlines',
            label: 'Airlines',
            icon: '🛩'
        },



        {
            id: 'analytics',
            label: 'Analytics',
            icon: '📈'
        },

        {
            id: 'users',
            label: 'Users',
            icon: '👥'
        },

        {
            id: 'reports',
            label: 'Reports',
            icon: '📄'
        }
    ],

    passenger: [

        {
            id: 'book',
            label: 'Book Flight',
            icon: '🎫'
        },

        {
            id: 'bookings',
            label: 'My Bookings',
            icon: '🎟'
        },

        {
            id: 'boarding',
            label: 'Boarding Pass',
            icon: '🛂'
        },

        {
            id: 'profile',
            label: 'Profile',
            icon: '👤'
        }
    ],

    staff: [

        {
            id: 'checkin',
            label: 'Check-In',
            icon: '🛂'
        },

        {
            id: 'baggage',
            label: 'Baggage',
            icon: '🧳'
        },

        {
            id: 'scanner',
            label: 'Scanner',
            icon: '📡'
        }
    ]
};

export function buildNavigation(role) {

    const container =
        document.getElementById(
            'nav-links'
        );

    if (!container) return;

    container.innerHTML = '';

    const items =
        NAVIGATION[role] || [];

    items.forEach((item, index) => {

        const a =
            document.createElement('a');

        a.href = '#';

        a.className =
            'sidebar-link';

        if (index === 0) {

            a.classList.add('active');
        }

        a.innerHTML = `
            <span>${item.icon}</span>
            <span>${item.label}</span>
        `;

        a.addEventListener('click', () => {

            document
                .querySelectorAll('.sidebar-link')
                .forEach(link =>
                    link.classList.remove('active')
                );

            a.classList.add('active');

            navigate(item.id);

            document
                .getElementById('sidebar')
                ?.classList.remove('active');
        });

        container.appendChild(a);
    });

    if (items.length) {

        navigate(items[0].id);
    }
}