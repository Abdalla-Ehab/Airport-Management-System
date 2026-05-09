import { API_BASE } from '../shared/constants.js';
import { getToken } from '../shared/storage.js';

export async function apiRequest(
    endpoint,
    options = {}
) {

    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {}

    if (!response.ok) {

        throw new Error(
            data?.message ||
            'Request failed'
        );
    }

    return data?.data || data;
}