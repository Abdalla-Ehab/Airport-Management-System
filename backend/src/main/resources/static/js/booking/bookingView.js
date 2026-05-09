
import { getFlights } from '../api/flightApi.js';
import { showToast } from '../shared/toast.js';

export async function loadFlights() {

    try {

        const flights = await getFlights();

        console.log(flights);

    } catch (err) {

        showToast(err.message, 'error');
    }
}
