
import { login } from '../api/authApi.js';
import { saveToken, saveUser } from '../shared/storage.js';
import { showToast } from '../shared/toast.js';

export function initLogin() {

    const form = document.getElementById('login-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {

            const payload = await login(username, password);

            saveToken(payload.token);
            saveUser(payload);

            showToast('Login successful', 'success');

            location.reload();

        } catch (err) {

            showToast(err.message, 'error');
        }
    });
}
