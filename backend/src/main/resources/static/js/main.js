import { bootstrapApp } from './shared/appBootstrap.js';
import { getCurrentUser } from './shared/storage.js';
import { initUI } from './shared/ui.js';

import { initLogin } from './auth/login.js';
import { initRegister } from './auth/register.js';
import { initLogout } from './auth/logout.js';

import { initBookingView } from './booking/bookingView.js';
import { initCheckin } from './booking/checkin.js';
import { initFlightStatus } from './booking/flightStatus.js';

import { initAirportView } from './airports/airportView.js';

import { initBaggageDrop } from './baggage/baggageDrop.js';
import { initScanner } from './baggage/scanner.js';

import { initFleet } from './admin/fleet.js';
import { initMaintenance } from './admin/maintenance.js';
import { initScheduler } from './admin/scheduler.js';
import { initFlightsPage } from './admin/flightsPage.js';
import { initAirportsPage } from './admin/airportsPage.js';
import { initAirlinesPage } from './admin/airlinesPage.js';

import { getFlights } from './api/flightApi.js';


function initSidebar() {

    const sidebar =
        document.getElementById(
            'sidebar'
        );

    const toggle =
        document.getElementById(
            'sidebar-toggle'
        );

    if (!sidebar || !toggle) return;

    toggle.addEventListener('click', () => {

        sidebar.classList.toggle('active');
    });
}


window.addEventListener('load', () => {

    document.body.classList.add('loaded');
});


document.addEventListener('DOMContentLoaded', () => {

    bootstrapApp();

    const user =
        getCurrentUser();

    if (user) {

        const profileName =
            document.getElementById('profile-name');

        const profileRole =
            document.getElementById('profile-role');

        const navUsername =
            document.getElementById('nav-username');

        const navRole =
            document.getElementById('nav-role');

        const avatar =
            document.getElementById('nav-avatar');

        if (profileName)
            profileName.textContent =
                user.username || user.email || 'User';

        if (profileRole)
            profileRole.textContent =
                user.role;

        if (navUsername)
            navUsername.textContent =
                user.username || user.email || 'User';

        if (navRole)
            navRole.textContent =
                user.role;

        if (avatar)
            avatar.textContent =
                user.username || user.email || 'User'
                    .charAt(0)
                    .toUpperCase();
    }

    try {

        getFlights()
            .then(flights => {

                const kpi =
                    document.getElementById(
                        'dashboard-flight-count'
                    );

                if (kpi && flights) {

                    kpi.textContent =
                        flights.length;
                }
            })
            .catch(console.error);

    } catch (err) {

        console.error(err);
    }

    initUI();

    initSidebar();

    initLogin();

    initRegister();

    initLogout();

    initBookingView();

    initCheckin();

    initFlightStatus();

    initAirportView();

    initBaggageDrop();

    initScanner();

    initFleet();

    initMaintenance();

    initScheduler();

    initFlightsPage();

    initAirportsPage();

    initAirlinesPage();

    console.log(
        'twixNexus AMS Initialized Successfully'
    );
});