import { apiRequest } from './apiClient.js';

export async function getPassengers() {
    return await apiRequest('/passengers');
}

export async function updatePassenger(id, payload) {
    return await apiRequest(`/passengers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export async function deletePassenger(id) {
    return await apiRequest(`/passengers/${id}`, {
        method: 'DELETE'
    });
}

export async function getStaff() {
    return await apiRequest('/staff');
}

export async function updateStaff(id, payload) {
    return await apiRequest(`/staff/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export async function deleteStaff(id) {
    return await apiRequest(`/staff/${id}`, {
        method: 'DELETE'
    });
}
