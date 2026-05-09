import {
    getFlightStatus
}
from '../api/flightApi.js';

import {
    escHtml,
    formatTime
}
from '../shared/helpers.js';

import {
    showToast
}
from '../shared/toast.js';

export function initFlightStatus() {

    const btn =
        document.getElementById(
            'flight-status-btn'
        );

    if (!btn) return;

    btn.addEventListener(
        'click',
        loadFlightStatus
    );
}

async function loadFlightStatus() {

    const container =
        document.getElementById(
            'flight-status-results'
        );

    container.innerHTML =
        'Loading flight status...';

    try {

        const flights =
            await getFlightStatus();

        renderFlightStatus(flights);

    } catch (err) {

        container.innerHTML = '';

        showToast(
            err.message,
            'error'
        );
    }
}

function renderFlightStatus(
    flights
) {

    const container =
        document.getElementById(
            'flight-status-results'
        );

    container.innerHTML = '';

    if (!flights.length) {

        container.innerHTML =
            '<p>No flights available</p>';

        return;
    }

    flights.forEach(f => {

        const card =
            document.createElement('div');

        card.className =
            'data-card';

        card.innerHTML = `

            <div class="status-header">
                ✈ ${escHtml(f.flight_number)}
            </div>

            <div class="status-grid">

                <div>
                    <strong>Status</strong>
                    <p class="status-text">
                        ${escHtml(f.status)}
                    </p>
                </div>

                <div>
                    <strong>Departure</strong>
                    <p>
                        ${formatTime(
                            f.departure_time
                        )}
                    </p>
                </div>

                <div>
                    <strong>Arrival</strong>
                    <p>
                        ${formatTime(
                            f.arrival_time
                        )}
                    </p>
                </div>

            </div>
        `;

        container.appendChild(card);
    });
}