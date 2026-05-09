
import { apiRequest } from './apiClient.js';

export async function createBooking(payload) {
    return await apiRequest('/bookings/create', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export async function getBookings() {
    return await apiRequest('/bookings');
}
