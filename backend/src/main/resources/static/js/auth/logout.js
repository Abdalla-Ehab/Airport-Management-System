
import { clearSession } from '../shared/storage.js';

export function logout() {

    clearSession();

    location.reload();
}
