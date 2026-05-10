import {
    registerPassenger
}
    from '../api/authApi.js';

import {
    showToast
}
    from '../shared/toast.js';

import {
    show,
    hide
}
    from '../shared/dom.js';


export function initRegister() {

    const btn =
        document.getElementById(
            'register-btn'
        );

    const dob =
        document.getElementById(
            'reg-dob'
        );

    // =====================================
    // Prevent future DOB
    // =====================================

    if (dob) {

        dob.max =
            new Date()
                .toISOString()
                .split('T')[0];
    }

    // =====================================
    // Register Button
    // =====================================

    if (btn) {

        btn.addEventListener(
            'click',
            register
        );
    }

    initAuthTabs();
}


function initAuthTabs() {

    const loginTab =
        document.getElementById(
            'tab-login'
        );

    const registerTab =
        document.getElementById(
            'tab-register'
        );

    const loginForm =
        document.getElementById(
            'login-form'
        );

    const registerForm =
        document.getElementById(
            'register-form'
        );

    // =====================================
    // LOGIN TAB
    // =====================================

    if (loginTab) {

        loginTab.addEventListener(
            'click',
            () => {

                show(loginForm);

                hide(registerForm);

                loginTab.classList.add(
                    'active'
                );

                registerTab.classList.remove(
                    'active'
                );
            }
        );
    }

    // =====================================
    // REGISTER TAB
    // =====================================

    if (registerTab) {

        registerTab.addEventListener(
            'click',
            () => {

                show(registerForm);

                hide(loginForm);

                registerTab.classList.add(
                    'active'
                );

                loginTab.classList.remove(
                    'active'
                );
            }
        );
    }
}


async function register() {

    const errEl =
        document.getElementById(
            'auth-error'
        );

    if (errEl) {

        errEl.textContent = '';

        hide(errEl);
    }

    const payload = {

        firstName:
            document.getElementById(
                'reg-firstname'
            )?.value?.trim(),

        lastName:
            document.getElementById(
                'reg-lastname'
            )?.value?.trim(),

        email:
            document.getElementById(
                'reg-email'
            )?.value?.trim(),

        phoneNumber:
            document.getElementById(
                'reg-phone'
            )?.value?.trim(),

        dob:
            document.getElementById(
                'reg-dob'
            )?.value,

        passportNo:
            document.getElementById(
                'reg-passport'
            )?.value?.trim(),

        username:
            document.getElementById(
                'reg-username'
            )?.value?.trim(),

        password:
            document.getElementById(
                'reg-password'
            )?.value
    };

    // =====================================
    // VALIDATION
    // =====================================

    if (
        !payload.firstName ||
        !payload.lastName ||
        !payload.email ||
        !payload.username ||
        !payload.password
    ) {

        showToast(
            'Please fill all required fields',
            'error'
        );

        return;
    }

    try {

        await registerPassenger(
            payload
        );

        showToast(
            'Account created successfully',
            'success'
        );

        // =================================
        // RESET FORM
        // =================================

        document.getElementById(
            'register-form'
        )?.reset();

        // =================================
        // SWITCH TO LOGIN
        // =================================

        const loginTab =
            document.getElementById(
                'tab-login'
            );

        if (loginTab) {

            loginTab.click();
        }

    } catch (err) {

        console.error(err);

        if (errEl) {

            errEl.textContent =
                err.message ||
                'Registration failed';

            show(errEl);
        }

        showToast(
            err.message ||
            'Registration failed',
            'error'
        );
    }
}