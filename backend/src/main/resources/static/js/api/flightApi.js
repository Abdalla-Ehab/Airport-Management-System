
import { apiRequest } from './apiClient.js';

export async function getFlights() {
    return await apiRequest('/flights');
}

export async function searchFlights(origin, destination) {
    return await apiRequest(
        `/flights/search?origin=${origin}&destination=${destination}`
    );
}
