import { bootstrapApp } from './shared/appBootstrap.js';

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

import { initUI } from './shared/ui.js';


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