import { apiRequest }
from './apiClient.js';

export async function createBooking(
    payload
) {

    return await apiRequest(
        '/bookings',
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    );
}

export async function getPassengerBookings(
    passengerId
) {

    return await apiRequest(
        `/bookings/passenger/${passengerId}`
    );
}

export async function cancelBooking(
    ticketNo
) {

    return await apiRequest(
        `/bookings/${ticketNo}`,
        {
            method: 'DELETE'
        }
    );
}

export async function checkIn(
    payload
) {

    return await apiRequest(
        '/checkin',
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    );
}

export async function getBoardingPass(
    ticketNo
) {

    return await apiRequest(
        `/boarding-pass/${ticketNo}`
    );
}