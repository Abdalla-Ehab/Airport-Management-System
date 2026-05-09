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

import { initUI } from './shared/ui.js';

document.addEventListener('DOMContentLoaded', () => {

    bootstrapApp();

    initUI();

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

    console.log(
        'Airport Management System Fully Modularized'
    );
});