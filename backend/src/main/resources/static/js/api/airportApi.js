import { apiRequest } from './apiClient.js';

export async function getAirports() {
    return await apiRequest('/airports');
}

export async function updateAirport(id, payload) {
    return await apiRequest(`/airports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export async function deleteAirport(id) {
    return await apiRequest(`/airports/${id}`, {
        method: 'DELETE'
    });
}