import {
    scheduleFlight
}
from '../api/flightApi.js';

import {
    showToast
}
from '../shared/toast.js';

export function initScheduler() {

    const btn =
        document.getElementById(
            'schedule-btn'
        );

    if (!btn) return;

    btn.addEventListener(
        'click',
        submitSchedule
    );
}

async function submitSchedule() {

    const payload = {

        flight_number:
            document.getElementById(
                'schedule-flight-number'
            ).value,

        aircraft_id:
            document.getElementById(
                'schedule-aircraft'
            ).value,

        airline_id:
            document.getElementById(
                'schedule-airline'
            ).value,

        departure_airport_id:
            document.getElementById(
                'schedule-departure-airport'
            ).value,

        arrival_airport_id:
            document.getElementById(
                'schedule-arrival-airport'
            ).value,

        departure_gate_id:
            document.getElementById(
                'schedule-departure-gate'
            ).value,

        arrival_gate_id:
            document.getElementById(
                'schedule-arrival-gate'
            ).value,

        departure_time:
            document.getElementById(
                'schedule-departure-time'
            ).value,

        arrival_time:
            document.getElementById(
                'schedule-arrival-time'
            ).value
    };

    try {

        await scheduleFlight(payload);

        showToast(
            'Flight scheduled successfully',
            'success'
        );

    } catch (err) {

        showToast(
            err.message,
            'error'
        );
    }
}