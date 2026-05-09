import {
    apiRequest
}
from './apiClient.js';

export async function getFleet() {

    return await apiRequest(
        '/aircraft'
    );
}

export async function updateAircraftStatus(
    aircraftId,
    status
) {

    return await apiRequest(
        `/aircraft/${aircraftId}/status`,
        {
            method: 'PUT',

            body: JSON.stringify({
                status
            })
        }
    );
}

export async function getMaintenanceLogs() {

    return await apiRequest(
        '/maintenance'
    );
}

export async function createMaintenanceRecord(
    payload
) {

    return await apiRequest(
        '/maintenance',
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    );
}