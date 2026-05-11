import { apiRequest }
from './apiClient.js';

export async function getFlights() {

    return await apiRequest(
        '/flights'
    );
}

export async function searchFlights(
    origin,
    destination,
    date
) {

    return apiRequest(
        `/flights/search?origin=${origin}&destination=${destination}&date=${date}`
    );
}

export async function getFlightById(
    flightId
) {

    return await apiRequest(
        `/flights/${flightId}`
    );
}

export async function scheduleFlight(
    payload
) {

    return await apiRequest(
        '/flights',
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    );
}

export async function getFlightStatus() {

    return await apiRequest(
        '/flights/status'
    );
}

export async function updateFlight(id, payload) {
    return await apiRequest(`/flights/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export async function deleteFlight(id) {
    return await apiRequest(`/flights/${id}`, {
        method: 'DELETE'
    });
}