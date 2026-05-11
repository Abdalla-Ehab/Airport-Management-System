import {
    scheduleFlight
}
    from '../api/flightApi.js';

import {
    showToast
}
    from '../shared/toast.js';

import {
    initFlightsPage
}
    from './flightsPage.js';


export function initScheduler() {

    const form =
        document.getElementById(
            'schedule-form'
        );

    const submitBtn =
        document.getElementById(
            'schedule-btn'
        );

    if (submitBtn) {

        submitBtn.addEventListener(
            'click',
            submitSchedule
        );
    }
}


async function submitSchedule(e) {
    // If button text is Update Flight, let flightsPage.js handle it
    if (e.target.textContent.includes('Update')) return;

    e.preventDefault();

    const payload = {
        flight_number: getVal('schedule-flight-number'),
        airline_id: getVal('schedule-airline'),
        aircraft_id: getVal('schedule-aircraft'),
        departure_airport_id: getVal('schedule-departure-airport'),
        arrival_airport_id: getVal('schedule-arrival-airport'),
        departure_gate_id: getVal('schedule-departure-gate'),
        arrival_gate_id: getVal('schedule-arrival-gate'),
        departure_time: getVal('schedule-departure-time'),
        arrival_time: getVal('schedule-arrival-time')
    };

    try {
        await scheduleFlight(payload);
        showToast('Flight scheduled successfully', 'success');
        
        // Clear form
        clearForm();
        
        // Close modal if open
        const modal = document.getElementById('flight-modal');
        if (modal) modal.classList.remove('active');

        // Refresh flights page if we are on it
        initFlightsPage();

    } catch (err) {
        console.error(err);
        showToast(err.message || 'Failed to schedule flight', 'error');
    }
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : null;
}

function clearForm() {
    const ids = [
        'schedule-flight-number', 'schedule-airline', 'schedule-aircraft',
        'schedule-departure-airport', 'schedule-arrival-airport',
        'schedule-departure-gate', 'schedule-arrival-gate',
        'schedule-departure-time', 'schedule-arrival-time'
    ];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}