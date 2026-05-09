import {
    getCurrentUser
}
from './storage.js';

import { state }
from './state.js';

import {
    show,
    hide
}
from './dom.js';

import {
    buildNavigation
}
from '../navigation.js';

export function bootstrapApp() {

    const user =
        getCurrentUser();

    if (!user) {

        show(
            document.getElementById(
                'login-screen'
            )
        );

        hide(
            document.getElementById(
                'app-shell'
            )
        );

        return;
    }

    state.currentUser = user;

    document.getElementById(
        'nav-username'
    ).textContent =
        user.username;

    document.getElementById(
        'nav-role'
    ).textContent =
        user.role;

    document.getElementById(
        'nav-avatar'
    ).textContent =
        user.username[0]
            .toUpperCase();

    hide(
        document.getElementById(
            'login-screen'
        )
    );

    show(
        document.getElementById(
            'app-shell'
        )
    );

    buildNavigation(
        user.role
    );
}