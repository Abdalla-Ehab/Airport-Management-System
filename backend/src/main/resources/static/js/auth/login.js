import { loginRequest } from '../api/authApi.js';

import {
    setToken,
    setCurrentUser
} from '../shared/storage.js';

import { state } from '../shared/state.js';

import { showToast }
from '../shared/toast.js';

import {
    hide,
    show
} from '../shared/dom.js';

import { buildNavigation }
from '../navigation.js';

export function initLogin() {

    const btn =
        document.getElementById('login-btn');

    btn.addEventListener('click', login);
}

async function login() {

    const username =
        document.getElementById('login-username')
        .value
        .trim();

    const password =
        document.getElementById('login-password')
        .value
        .trim();

    const errEl =
        document.getElementById('auth-error');

    const btn =
        document.getElementById('login-btn');

    if (!username || !password) {

        errEl.textContent =
            'Please enter username and password';

        show(errEl);

        return;
    }

    try {

        btn.disabled = true;

        btn.innerHTML =
            'Authenticating...';

        const user =
            await loginRequest(
                username,
                password
            );

        state.currentUser = user;

        setCurrentUser(user);

        if (user.token) {
            setToken(user.token);
        }

        document.getElementById('nav-username')
            .textContent = user.username;

        document.getElementById('nav-role')
            .textContent = user.role;

        document.getElementById('nav-avatar')
            .textContent =
                user.username[0].toUpperCase();

        hide(document.getElementById('login-screen'));

        show(document.getElementById('app-shell'));

        buildNavigation(user.role);

        showToast(
            `Welcome back ${user.username}`,
            'success'
        );

    } catch (err) {

        errEl.textContent =
            err.message;

        show(errEl);

    } finally {

        btn.disabled = false;

        btn.innerHTML = 'Sign In';
    }
}