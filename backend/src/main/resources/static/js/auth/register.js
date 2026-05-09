
import { registerPassenger } from '../api/authApi.js';
import { showToast } from '../shared/toast.js';

export function initRegister() {

    const form = document.getElementById('register-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const payload = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            username: document.getElementById('register-username').value,
            password: document.getElementById('register-password').value
        };

        try {

            await registerPassenger(payload);

            showToast('Registration successful', 'success');

        } catch (err) {

            showToast(err.message, 'error');
        }
    });
}
