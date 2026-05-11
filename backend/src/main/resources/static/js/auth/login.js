import {
    loginRequest
}
    from '../api/authApi.js';

import {
    setToken,
    setCurrentUser
}
    from '../shared/storage.js';

import {
    state
}
    from '../shared/state.js';

import {
    showToast
}
    from '../shared/toast.js';

import {
    hide,
    show
}
    from '../shared/dom.js';

import {
    buildNavigation
}
    from '../navigation.js';

import {
    initMyBookings
}
    from '../booking/myBookings.js';

export function initLogin() {

    const btn =
        document.getElementById(
            'login-btn'
        );

    if (btn) {

        btn.addEventListener(
            'click',
            login
        );
    }

    initLoginTab();
}


function initLoginTab() {

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

    if (!loginTab) return;

    loginTab.addEventListener(
        'click',
        () => {

            show(loginForm);

            hide(registerForm);

            loginTab.classList.add(
                'active'
            );

            registerTab?.classList.remove(
                'active'
            );
        }
    );
}


async function login() {

    const username =
        document.getElementById(
            'login-username'
        )?.value?.trim();

    const password =
        document.getElementById(
            'login-password'
        )?.value?.trim();

    const errEl =
        document.getElementById(
            'auth-error'
        );

    const btn =
        document.getElementById(
            'login-btn'
        );

    if (errEl) {

        errEl.textContent = '';

        hide(errEl);
    }

    // =====================================
    // VALIDATION
    // =====================================

    if (!username || !password) {

        if (errEl) {

            errEl.textContent =
                'Please enter username and password';

            show(errEl);
        }

        showToast(
            'Please enter credentials',
            'error'
        );

        return;
    }

    try {

        // =================================
        // LOADING STATE
        // =================================

        if (btn) {

            btn.disabled = true;

            btn.innerHTML =
                'Authenticating...';
        }

        // =================================
        // LOGIN REQUEST
        // =================================

        const user =
            await loginRequest(
                username,
                password
            );
        console.log(user);

        // =================================
        // SAVE USER STATE
        // =================================

        state.currentUser = user;

        setCurrentUser(user);

        if (user.token) {

            setToken(user.token);
        }

        // =================================
        // PROFILE UI
        // =================================

        const displayName =
            user.username ||
            user.email ||
            'User';

        const displayRole =
            user.role ||
            'PASSENGER';

        const navUsername =
            document.getElementById(
                'nav-username'
            );

        const navRole =
            document.getElementById(
                'nav-role'
            );

        const navAvatar =
            document.getElementById(
                'nav-avatar'
            );

        const profileName =
            document.getElementById(
                'profile-name'
            );

        const profileRole =
            document.getElementById(
                'profile-role'
            );

        const profileRoleInfo =
            document.getElementById(
                'profile-role-info'
            );

        const profileUsername =
            document.getElementById(
                'profile-username'
            );

        const profileAvatar =
            document.getElementById(
                'profile-avatar'
            );

        if (navUsername) {

            navUsername.textContent =
                displayName;
        }

        if (navRole) {

            navRole.textContent =
                displayRole;
        }

        if (navAvatar) {

            navAvatar.textContent =
                displayName
                    .charAt(0)
                    .toUpperCase();
        }

        if (profileName) {

            profileName.textContent =
                displayName;
        }

        if (profileRole) {

            profileRole.textContent =
                displayRole;
        }

        if (profileRoleInfo) {

            profileRoleInfo.textContent =
                displayRole;
        }

        if (profileUsername) {

            profileUsername.textContent =
                displayName;
        }

        if (profileAvatar) {

            profileAvatar.textContent =
                displayName
                    .charAt(0)
                    .toUpperCase();
        }

        // =================================
        // HIDE AUTH SCREEN
        // =================================

        hide(
            document.getElementById(
                'login-screen'
            )
        );

        // =================================
        // SHOW APP
        // =================================

        show(
            document.getElementById(
                'app-shell'
            )
        );

        document.body.classList.remove(
            'loading'
        );

        // =================================
        // BUILD SIDEBAR
        // =================================

        buildNavigation(
            displayRole.toLowerCase()
        );

        // =================================
        // LOAD BOOKINGS
        // =================================

        await initMyBookings();

        // =================================
        // SUCCESS TOAST
        // =================================

        showToast(
            `Welcome back ${displayName}`,
            'success'
        );

    } catch (err) {

        console.error(err);

        if (errEl) {

            errEl.textContent =
                err.message ||
                'Authentication failed';

            show(errEl);
        }

        showToast(
            err.message ||
            'Login failed',
            'error'
        );

    } finally {

        if (btn) {

            btn.disabled = false;

            btn.innerHTML =
                'Sign In';
        }
    }
}