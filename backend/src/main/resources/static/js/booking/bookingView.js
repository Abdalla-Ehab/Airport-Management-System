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

import {
    getAirports
}
    from '../api/airportApi.js';


export async function initBookingView() {

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

    const originSelect =
        document.getElementById(
            'flight-origin'
        );

    const destinationSelect =
        document.getElementById(
            'flight-destination'
        );

    const dateInput =
        document.getElementById(
            'flight-date'
        );

    if (!originSelect ||
        !destinationSelect) {

        return;
    }

    try {

        const airports =
            await getAirports();

        originSelect.innerHTML = `
            <option value="">
                Select Departure
            </option>
        `;

        destinationSelect.innerHTML = `
            <option value="">
                Select Destination
            </option>
        `;

        airports.forEach(a => {

            originSelect.innerHTML += `
                <option value="${a.airport_id}">
                    ${a.name} (${a.city})
                </option>
            `;

            destinationSelect.innerHTML += `
                <option value="${a.airport_id}">
                    ${a.name} (${a.city})
                </option>
            `;
        });

        if (dateInput) {

            dateInput.min =
                new Date()
                    .toISOString()
                    .split('T')[0];
        }

    } catch (err) {

        console.error(err);

        showToast(
            'Failed to load airports',
            'error'
        );
    }
    const changeBtn =
        document.getElementById(
            'change-flight-btn'
        );

    if (changeBtn) {

        changeBtn.addEventListener(
            'click',
            () => {

                document.getElementById(
                    'flight-results'
                ).style.display =
                    'grid';

                document.getElementById(
                    'seat-map'
                ).innerHTML = '';

                document.getElementById(
                    'selected-flight'
                ).textContent =
                    'None Selected';

                document.getElementById(
                    'selected-flight-section'
                ).classList.add(
                    'hidden'
                );

                document.getElementById(
                    'seat-selection-section'
                ).classList.add(
                    'hidden'
                );

                changeBtn.classList.add(
                    'hidden'
                );
            }
        );
    }
}


async function search() {

    const origin =
        document.getElementById(
            'flight-origin'
        )?.value;

    const destination =
        document.getElementById(
            'flight-destination'
        )?.value;

    const date =
        document.getElementById(
            'flight-date'
        )?.value;

    const resultsEl =
        document.getElementById(
            'flight-results'
        );

    if (!origin || !destination) {

        showToast(
            'Please select airports',
            'error'
        );

        return;
    }

    if (origin === destination) {

        showToast(
            'Departure and destination cannot be the same',
            'error'
        );

        return;
    }

    if (!resultsEl) return;

    resultsEl.innerHTML =
        'Searching flights...';

    try {

        const flights =
            await searchFlights(
                origin,
                destination,
                date
            );

        renderFlights(flights);

    } catch (err) {

        console.error(err);

        resultsEl.innerHTML = '';

        showToast(
            err.message ||
            'Failed to load flights',
            'error'
        );
    }
}


function renderFlights(flights) {

    const listEl =
        document.getElementById(
            'flight-results'
        );

    if (!listEl) return;

    listEl.innerHTML = '';

    if (!flights ||
        !flights.length) {

        listEl.innerHTML = `
            <div class="empty-state">

                <h3>
                    No Flights Found
                </h3>

                <p>
                    Try another route or date.
                </p>

            </div>
        `;

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
            document.createElement(
                'button'
            );

        btn.className =
            'btn btn-primary';

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

    console.log(
        'Selected Flight:',
        flight
    );

    state.currentFlight = flight;

    const results =
        document.getElementById(
            'flight-results'
        );

    if (results) {

        results.style.display =
            'none';
    }

    const selected =
        document.getElementById(
            'selected-flight'
        );

    if (selected) {

        selected.textContent =
            flight.flight_number ||
            'Flight Selected';
    }

    try {

        renderSeatMap(
            'ECONOMY'
        );

    } catch (err) {

        console.error(
            'Seat map error:',
            err
        );
    }

    const backBtn =
        document.getElementById(
            'change-flight-btn'
        );

    if (backBtn) {

        backBtn.classList.remove(
            'hidden'
        );
    }

    showToast(
        `Selected flight ${flight.flight_number}`,
        'success'
    );

    document.getElementById(
        'selected-flight-section'
    ).classList.remove('hidden');

    document.getElementById(
        'seat-selection-section'
    ).classList.remove('hidden');
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
        !state.selectedSeats ||
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
                )?.value ||

                'ECONOMY',

            is_transit: false
        };

        await createBooking(payload);

        showToast(
            'Booking confirmed successfully',
            'success'
        );

    } catch (err) {

        console.error(err);

        showToast(
            err.message ||
            'Booking failed',
            'error'
        );
    }
    document.getElementById(
        'seat-map'
    ).innerHTML = '';

    document.getElementById(
        'selected-flight'
    ).textContent =
        'None Selected';

    document.getElementById(
        'flight-results'
    ).style.display =
        'grid';

    showToast(
        'Booking created successfully',
        'success'
    );
}