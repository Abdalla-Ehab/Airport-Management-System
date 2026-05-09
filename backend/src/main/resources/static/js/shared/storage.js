
export function saveToken(token) {
    sessionStorage.setItem('jwt_token', token);
}

export function getToken() {
    return sessionStorage.getItem('jwt_token');
}

export function saveUser(user) {
    sessionStorage.setItem('current_user', JSON.stringify(user));
}

export function getUser() {
    return JSON.parse(
        sessionStorage.getItem('current_user')
    );
}

export function clearSession() {
    sessionStorage.clear();
}
