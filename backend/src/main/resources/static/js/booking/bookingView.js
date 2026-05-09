import {
    searchFlights
}
from '../api/flightApi.js';

import {
    createBooking
}
from '../api/bookingApi.js';

import {
    renderSeatMap
}
from './seatMap.js';

import { state }
from '../shared/state.js';

import {
    escHtml,
    formatTime
}
from '../shared/helpers.js';

import {
    showToast
}
from '../shared/toast.js';

export function initBookingView() {

    const btn =
        document.getElementById(
            'search-flight-btn'
        );

    if (!btn) return;

    btn.addEventListener(
        'click',
        search
    );

    const classFilter =
        document.getElementById(
            'class-filter'
        );

    if (classFilter) {

        classFilter.addEventListener(
            'change',
            e => {

                renderSeatMap(
                    e.target.value
                );
            }
        );
    }

    const bookingBtn =
        document.getElementById(
            'confirm-booking-btn'
        );

    if (bookingBtn) {

        bookingBtn.addEventListener(
            'click',
            confirmBooking
        );
    }
}

async function search() {

    const origin =
        document.getElementById(
            'flight-origin'
        ).value;

    const destination =
        document.getElementById(
            'flight-destination'
        ).value;

    const resultsEl =
        document.getElementById(
            'flight-results'
        );

    resultsEl.innerHTML =
        'Searching flights...';

    try {

        const flights =
            await searchFlights(
                origin,
                destination
            );

        renderFlights(flights);

    } catch (err) {

        resultsEl.innerHTML = '';

        showToast(
            err.message,
            'error'
        );
    }
}

function renderFlights(flights) {

    const listEl =
        document.getElementById(
            'flight-results'
        );

    listEl.innerHTML = '';

    if (!flights.length) {

        listEl.innerHTML =
            '<p>No flights found</p>';

        return;
    }

    flights.forEach(f => {

        const card =
            document.createElement('div');

        card.className =
            'flight-result-card';

        const fn =
            escHtml(
                f.flight_number ||
                'UNKNOWN'
            );

        const depTime =
            formatTime(
                f.departure_time
            );

        const arrTime =
            formatTime(
                f.arrival_time
            );

        const pseudoPrice =
            Math.floor(
                Math.random() * 400 + 150
            );

        card.innerHTML = `
            <div class="flight-header">
                ✈ ${fn}
            </div>

            <div class="flight-times">

                <div class="time-block">
                    <h3>${depTime}</h3>
                    <p>Departure</p>
                </div>

                <div class="flight-duration">
                    Direct
                </div>

                <div class="time-block">
                    <h3>${arrTime}</h3>
                    <p>Arrival</p>
                </div>

            </div>

            <div class="flight-price">
                US$${pseudoPrice}
            </div>
        `;

        const btn =
            document.createElement('button');

        btn.className =
            'btn-primary';

        btn.textContent =
            'Select Flight';

        btn.addEventListener(
            'click',
            () => selectFlight(f)
        );

        card.appendChild(btn);

        listEl.appendChild(card);
    });
}

function selectFlight(flight) {

    state.currentFlight = flight;

    document.getElementById(
        'selected-flight'
    ).textContent =
        flight.flight_number;

    renderSeatMap('ECONOMY');

    showToast(
        `Selected flight ${flight.flight_number}`,
        'success'
    );
}

async function confirmBooking() {

    if (!state.currentFlight) {

        showToast(
            'Please select a flight',
            'error'
        );

        return;
    }

    if (
        !state.selectedSeats.length
    ) {

        showToast(
            'Please select seats',
            'error'
        );

        return;
    }

    try {

        const payload = {

            flight_id:
                state.currentFlight.flight_id,

            passenger_id:
                state.currentUser?.id,

            seat_nos:
                state.selectedSeats,

            class_name:
                document.getElementById(
                    'class-filter'
                ).value,

            is_transit: false
        };

        await createBooking(payload);

        showToast(
            'Booking confirmed successfully',
            'success'
        );

    } catch (err) {

        showToast(
            err.message,
            'error'
        );
    }
}