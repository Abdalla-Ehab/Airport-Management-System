import {
    getFlights
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


let flightsCache = [];


export async function initFlightsPage() {

    await loadFlights();

    initSearch();

    initModal();

    initTableActions();
}


// =====================================================
// LOAD FLIGHTS
// =====================================================

async function loadFlights() {

    try {

        const flights =
            await getFlights();

        flightsCache =
            flights || [];

        renderFlights(
            flightsCache
        );

    } catch (err) {

        console.error(err);

        showToast(
            'Failed to load flights',
            'error'
        );
    }
}


// =====================================================
// RENDER TABLE
// =====================================================

function renderFlights(flights) {

    const tbody =
        document.getElementById(
            'flights-table-body'
        );

    if (!tbody) return;

    tbody.innerHTML = '';

    // =========================================
    // EMPTY STATE
    // =========================================

    if (!flights ||
        !flights.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        No Flights Found

                    </div>

                </td>

            </tr>
        `;

        return;
    }

    flights.forEach(flight => {

        const tr =
            document.createElement('tr');

        const status =
            (
                flight.status ||
                'SCHEDULED'
            ).toUpperCase();

        tr.innerHTML = `

            <td>
                ${escHtml(
            flight.flight_number ||
            'UNKNOWN'
        )}
            </td>

            <td>
                ${flight.airline_id || '-'}
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
                        class="
                            btn
                            btn-secondary
                            edit-flight
                        "
                        data-id="${flight.flight_id}">

                        Edit

                    </button>

                    <button
                        class="
                            btn
                            btn-primary
                            view-flight
                        "
                        data-id="${flight.flight_id}">

                        View

                    </button>

                </div>

            </td>
        `;

        tbody.appendChild(tr);
    });
}


// =====================================================
// SEARCH/FILTER
// =====================================================

function initSearch() {

    const search =
        document.getElementById(
            'flight-search'
        );

    const statusFilter =
        document.getElementById(
            'flight-status-filter'
        );

    if (search) {

        search.addEventListener(
            'input',
            applyFilters
        );
    }

    if (statusFilter) {

        statusFilter.addEventListener(
            'change',
            applyFilters
        );
    }
}


function applyFilters() {

    const searchValue =
        document.getElementById(
            'flight-search'
        )?.value
            ?.toLowerCase() || '';

    const statusValue =
        document.getElementById(
            'flight-status-filter'
        )?.value || '';

    const filtered =
        flightsCache.filter(f => {

            const matchesSearch =

                (
                    f.flight_number || ''
                )
                    .toLowerCase()
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


// =====================================================
// MODAL
// =====================================================

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

    if (openBtn) {

        openBtn.addEventListener(
            'click',
            () => {

                modal.classList.add(
                    'active'
                );
            }
        );
    }

    if (closeBtn) {

        closeBtn.addEventListener(
            'click',
            () => {

                modal.classList.remove(
                    'active'
                );
            }
        );
    }

    modal.addEventListener(
        'click',
        e => {

            if (e.target === modal) {

                modal.classList.remove(
                    'active'
                );
            }
        }
    );
}


// =====================================================
// TABLE ACTIONS
// =====================================================

function initTableActions() {

    document.addEventListener(
        'click',
        e => {

            const viewBtn =
                e.target.closest(
                    '.view-flight'
                );

            const editBtn =
                e.target.closest(
                    '.edit-flight'
                );

            // =================================
            // VIEW
            // =================================

            if (viewBtn) {

                const id =
                    viewBtn.dataset.id;

                const flight =
                    flightsCache.find(
                        f =>
                            f.flight_id == id
                    );

                if (!flight) return;

                showToast(
                    `Viewing flight ${flight.flight_number}`,
                    'success'
                );

                console.log(
                    'VIEW FLIGHT:',
                    flight
                );
            }

            // =================================
            // EDIT
            // =================================

            if (editBtn) {

                const id =
                    editBtn.dataset.id;

                const flight =
                    flightsCache.find(
                        f =>
                            f.flight_id == id
                    );

                if (!flight) return;

                const modal =
                    document.getElementById(
                        'flight-modal'
                    );

                if (modal) {

                    modal.classList.add(
                        'active'
                    );
                }

                showToast(
                    `Editing flight ${flight.flight_number}`,
                    'success'
                );

                console.log(
                    'EDIT FLIGHT:',
                    flight
                );
            }
        }
    );
}