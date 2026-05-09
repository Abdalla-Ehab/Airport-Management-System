import { apiRequest }
from './apiClient.js';

export async function getFlights() {

    return await apiRequest(
        '/flights'
    );
}

export async function searchFlights(
    origin,
    destination
) {

    const query =
        `?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

    return await apiRequest(
        `/flights/search${query}`
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