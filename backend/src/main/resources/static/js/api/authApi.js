
import { apiRequest } from './apiClient.js';

export async function login(username, password) {
    return await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

export async function registerPassenger(payload) {
    return await apiRequest('/auth/register/passenger', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
