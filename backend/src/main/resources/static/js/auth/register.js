import { registerPassenger }
from '../api/authApi.js';

import { showToast }
from '../shared/toast.js';

import {
    show,
    hide
} from '../shared/dom.js';

export function initRegister() {

    const btn =
        document.getElementById('register-btn');

    btn.addEventListener(
        'click',
        register
    );

    initAuthTabs();
}

function initAuthTabs() {

    const loginTab =
        document.getElementById('tab-login');

    const registerTab =
        document.getElementById('tab-register');

    loginTab.addEventListener('click', () => {

        show(document.getElementById('login-form'));

        hide(document.getElementById('register-form'));
    });

    registerTab.addEventListener('click', () => {

        show(document.getElementById('register-form'));

        hide(document.getElementById('login-form'));
    });
}

async function register() {

    const payload = {

        firstName:
            document.getElementById('reg-firstname').value,

        lastName:
            document.getElementById('reg-lastname').value,

        email:
            document.getElementById('reg-email').value,

        phoneNumber:
            document.getElementById('reg-phone').value,

        dob:
            document.getElementById('reg-dob').value,

        passportNo:
            document.getElementById('reg-passport').value,

        username:
            document.getElementById('reg-username').value,

        password:
            document.getElementById('reg-password').value
    };

    try {

        await registerPassenger(payload);

        showToast(
            'Account created successfully',
            'success'
        );

    } catch (err) {

        const errEl =
            document.getElementById('auth-error');

        errEl.textContent =
            err.message;

        show(errEl);
    }
}