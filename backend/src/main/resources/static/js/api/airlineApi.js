import { apiRequest } from './apiClient.js';

export async function getAirlines() {
    return await apiRequest('/airlines');
}

export async function updateAirline(id, payload) {
    return await apiRequest(`/airlines/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}
