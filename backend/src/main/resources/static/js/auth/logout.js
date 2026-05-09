import { clearSession }
from '../shared/storage.js';

import { state }
from '../shared/state.js';

import {
    show,
    hide
} from '../shared/dom.js';

import { showToast }
from '../shared/toast.js';

export function initLogout() {

    document
        .getElementById('logout-btn')
        .addEventListener('click', logout);
}

function logout() {

    clearSession();

    state.currentUser = null;

    hide(document.getElementById('app-shell'));

    show(document.getElementById('login-screen'));

    showToast(
        'Signed out successfully',
        'info'
    );
}