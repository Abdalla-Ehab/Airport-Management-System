export function setToken(token) {
    sessionStorage.setItem('jwt_token', token);
}

export function getToken() {
    return sessionStorage.getItem('jwt_token');
}

export function clearSession() {
    sessionStorage.clear();
}

export function setCurrentUser(user) {
    sessionStorage.setItem('current_user', JSON.stringify(user));
}

export function getCurrentUser() {
    const raw = sessionStorage.getItem('current_user');

    if (!raw) return null;

    return JSON.parse(raw);
}