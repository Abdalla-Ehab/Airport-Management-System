
export const API_BASE = 'http://localhost:8080/api';

export async function apiRequest(endpoint, options = {}) {

    const token = sessionStorage.getItem('jwt_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    let data = null;

    try {
        data = await response.json();
    } catch {}

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            'Request failed'
        );
    }

    return data?.data || data;
}
