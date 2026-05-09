
import { initLogin } from './auth/login.js';
import { initRegister } from './auth/register.js';
import { initNavigation } from './navigation.js';
import { loadFlights } from './booking/bookingView.js';

document.addEventListener('DOMContentLoaded', () => {

    initLogin();

    initRegister();

    initNavigation();

    loadFlights();
});
