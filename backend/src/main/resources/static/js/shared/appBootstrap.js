import { getCurrentUser } from './storage.js';

export function bootstrapApp() {

    const loginScreen =
        document.getElementById('login-screen');

    const appShell =
        document.getElementById('app-shell');

    const body =
        document.body;

    const user =
        getCurrentUser();

    if (user) {

        loginScreen?.classList.add('hidden');

        appShell?.classList.remove('hidden');

        body.classList.remove('loading');

    } else {

        loginScreen?.classList.remove('hidden');

        appShell?.classList.add('hidden');

    }
}