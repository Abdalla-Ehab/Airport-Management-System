import { bootstrapApp } from './shared/appBootstrap.js';
import { getCurrentUser } from './shared/storage.js';
import { initUI } from './shared/ui.js';

import { initLogin } from './auth/login.js';
import { initRegister } from './auth/register.js';
import { initLogout } from './auth/logout.js';

import { initBookingView } from './booking/bookingView.js';
import { initCheckin } from './booking/checkin.js';
import { initFlightStatus } from './booking/flightStatus.js';
import { initMyBookings } from './booking/myBookings.js';

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

    toggle.addEventListener(
        'click',
        () => {

            sidebar.classList.toggle(
                'active'
            );
        }
    );

    document.addEventListener(
        'click',
        e => {

            const insideSidebar =
                sidebar.contains(
                    e.target
                );

            const clickedToggle =
                toggle.contains(
                    e.target
                );

            if (
                !insideSidebar &&
                !clickedToggle
            ) {

                sidebar.classList.remove(
                    'active'
                );
            }
        }
    );
}


window.addEventListener(
    'load',
    () => {

        document.body.classList.add(
            'loaded'
        );
    }
);


document.addEventListener(
    'DOMContentLoaded',
    async () => {

        bootstrapApp();

        const user =
            getCurrentUser();

        // =====================================
        // USER PROFILE UI
        // =====================================

        if (user) {

            const displayName =
                user.username ||
                user.email ||
                'User';

            const displayRole =
                user.role ||
                'passenger';

            const profileName =
                document.getElementById(
                    'profile-name'
                );

            const profileRole =
                document.getElementById(
                    'profile-role'
                );

            const navUsername =
                document.getElementById(
                    'nav-username'
                );

            const navRole =
                document.getElementById(
                    'nav-role'
                );

            const avatar =
                document.getElementById(
                    'nav-avatar'
                );

            const profileAvatar =
                document.getElementById(
                    'profile-avatar'
                );

            const profileRoleInfo =
                document.getElementById(
                    'profile-role-info'
                );

            const profileUsername =
                document.getElementById(
                    'profile-username'
                );

            if (profileName) {

                profileName.textContent =
                    displayName;
            }

            if (profileRole) {

                profileRole.textContent =
                    displayRole;
            }

            if (navUsername) {

                navUsername.textContent =
                    displayName;
            }

            if (navRole) {

                navRole.textContent =
                    displayRole;
            }

            if (profileUsername) {

                profileUsername.textContent =
                    displayName;
            }

            if (profileRoleInfo) {

                profileRoleInfo.textContent =
                    displayRole;
            }

            if (avatar) {

                avatar.textContent =
                    displayName
                        .charAt(0)
                        .toUpperCase();
            }

            if (profileAvatar) {

                profileAvatar.textContent =
                    displayName
                        .charAt(0)
                        .toUpperCase();
            }
            
        }

        // =====================================
        // DASHBOARD KPI
        // =====================================

        try {

            const flights =
                await getFlights();

            const kpi =
                document.getElementById(
                    'dashboard-flight-count'
                );

            if (kpi && flights) {

                kpi.textContent =
                    flights.length;
            }

        } catch (err) {

            console.error(err);
        }

        // =====================================
        // CORE UI
        // =====================================

        initUI();

        initSidebar();

        initLogin();

        initRegister();

        initLogout();

        // =====================================
        // PASSENGER FEATURES
        // =====================================

        initBookingView();

        initMyBookings();

        initCheckin();

        initFlightStatus();

        initAirportView();

        initBaggageDrop();

        initScanner();

        // =====================================
        // ADMIN / STAFF FEATURES
        // =====================================

        if (
            user &&
            (
                user.role === 'admin' ||
                user.role === 'staff'
            )
        ) {

            initFleet();

            initMaintenance();

            initScheduler();

            initFlightsPage();

            initAirportsPage();

            initAirlinesPage();
        }

        console.log(
            'twixNexus AMS Initialized Successfully'
        );
    }
);