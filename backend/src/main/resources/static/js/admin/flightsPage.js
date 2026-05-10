import {
    getFlights
}
from '../api/flightApi.js';

import {
    escHtml,
    formatTime
}
from '../shared/helpers.js';

let flightsCache = [];

export async function initFlightsPage() {

    await loadFlights();

    initSearch();

    initModal();
}

async function loadFlights() {

    try {

        const flights =
            await getFlights();

        flightsCache = flights;

        renderFlights(flights);

    } catch (err) {

        console.error(err);
    }
}

function renderFlights(flights) {

    const tbody =
        document.getElementById(
            'flights-table-body'
        );

    if (!tbody) return;

    tbody.innerHTML = '';

    flights.forEach(flight => {

        const tr =
            document.createElement('tr');

        const status =
            flight.status || 'SCHEDULED';

        tr.innerHTML = `

            <td>
                ${escHtml(flight.flight_number)}
            </td>

            <td>
                Airline
            </td>

            <td>
                ${formatTime(
                    flight.departure_time
                )}
            </td>

            <td>
                ${formatTime(
                    flight.arrival_time
                )}
            </td>

            <td>

                <span
                    class="
                        status-badge
                        status-${status.toLowerCase()}
                    ">

                    ${status}

                </span>

            </td>

            <td>
                ${flight.departure_gate_id || '-'}
            </td>

            <td>

                <div class="table-actions">

                    <button
                        class="btn btn-secondary">

                        Edit
                    </button>

                    <button
                        class="btn btn-secondary">

                        View
                    </button>

                </div>

            </td>
        `;

        tbody.appendChild(tr);
    });
}

function initSearch() {

    const search =
        document.getElementById(
            'flight-search'
        );

    const statusFilter =
        document.getElementById(
            'flight-status-filter'
        );

    if (!search) return;

    search.addEventListener(
        'input',
        applyFilters
    );

    statusFilter.addEventListener(
        'change',
        applyFilters
    );
}

function applyFilters() {

    const searchValue =
        document.getElementById(
            'flight-search'
        ).value
        .toLowerCase();

    const statusValue =
        document.getElementById(
            'flight-status-filter'
        ).value;

    const filtered =
        flightsCache.filter(f => {

            const matchesSearch =
                f.flight_number
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                !statusValue ||
                f.status === statusValue;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    renderFlights(filtered);
}

function initModal() {

    const modal =
        document.getElementById(
            'flight-modal'
        );

    const openBtn =
        document.getElementById(
            'open-flight-modal'
        );

    const closeBtn =
        document.getElementById(
            'close-flight-modal'
        );

    if (!modal) return;

    openBtn.addEventListener('click', () => {

        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {

        modal.classList.remove('active');
    });

    modal.addEventListener('click', e => {

        if (e.target === modal) {

            modal.classList.remove('active');
        }
    });
}