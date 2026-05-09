import { apiRequest } from './apiClient.js';

export async function getAirports() {
    return await apiRequest('/airports');
}
