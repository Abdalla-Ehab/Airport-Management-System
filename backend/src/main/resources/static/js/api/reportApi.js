import { apiRequest } from './apiClient.js';

export async function getSystemSummary() {
    return await apiRequest('/reports/summary');
}
