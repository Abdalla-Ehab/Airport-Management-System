import {
    getFlights,
    updateFlight,
    deleteFlight
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

    try {

        const flights =
            await getFlights();

        flightsCache =
            flights || [];

        renderFlights(
            flightsCache
        );

        initSearch();
        initNewFlightButton();

    } catch (err) {

        console.error(err);

        showToast(
            'Failed to load flights',
            'error'
        );
    }
}


function initSearch() {
    const searchInput = document.getElementById('flight-search');
    if (!searchInput) return;

    searchInput.oninput = (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            renderFlights(flightsCache);
            return;
        }

        const filtered = flightsCache.filter(f => 
            (f.flight_number && f.flight_number.toLowerCase().includes(query)) ||
            (f.airline_id && String(f.airline_id).includes(query))
        );
        renderFlights(filtered);
    };
}


function renderFlights(flights) {

    const tbody =
        document.getElementById(
            'flights-table-body'
        );

    if (!tbody) return;

    tbody.innerHTML = '';

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

    // Limit to 50 for search results, 10 for initial load if no search
    const displayFlights = flights.slice(0, 50);

    displayFlights.forEach(flight => {

        const tr =
            document.createElement('tr');

        const status =
            (
                flight.status ||
                'SCHEDULED'
            ).toUpperCase();

        tr.innerHTML = `

            <td>
                <strong>${escHtml(flight.flight_number || 'UNKNOWN')}</strong>
            </td>

            <td>
                ${flight.airline_id || '-'}
            </td>

            <td>
                ${flight.aircraft_id || '-'}
            </td>

            <td>
                ${formatTime(flight.departure_time)}
            </td>

            <td>
                ${formatTime(flight.arrival_time)}
            </td>

            <td>
                <span class="status-badge status-${status.toLowerCase()}">
                    ${status}
                </span>
            </td>

            <td>
                <div class="table-actions">
                    <button class="btn btn-secondary btn-sm edit-flight" data-id="${flight.flight_id}">
                        Edit
                    </button>
                    <button class="btn btn-danger btn-sm delete-flight" data-id="${flight.flight_id}">
                        Delete
                    </button>
                </div>
            </td>
        `;

        // =====================================
        // ACTIONS
        // =====================================

        const editBtn = tr.querySelector('.edit-flight');
        const deleteBtn = tr.querySelector('.delete-flight');

        editBtn.onclick = () => openEditModal(flight);
        deleteBtn.onclick = () => handleDeleteFlight(flight.flight_id);

        tbody.appendChild(tr);
    });
}


async function handleDeleteFlight(id) {
    if (!confirm('Are you sure you want to delete this flight?')) return;

    try {
        await deleteFlight(id);
        showToast('Flight deleted', 'success');
        initFlightsPage();
    } catch (err) {
        showToast(err.message || 'Failed to delete flight', 'error');
    }
}


function openEditModal(flight) {
    const modal = document.getElementById('flight-modal');
    if (!modal) return;

    // Fill inputs
    setVal('schedule-flight-id', flight.flight_id);
    setVal('schedule-flight-number', flight.flight_number);
    setVal('schedule-airline', flight.airline_id);
    setVal('schedule-aircraft', flight.aircraft_id);
    setVal('schedule-departure-airport', flight.departure_airport_id);
    setVal('schedule-arrival-airport', flight.arrival_airport_id);
    setVal('schedule-departure-gate', flight.departure_gate_id);
    setVal('schedule-arrival-gate', flight.arrival_gate_id);
    setVal('schedule-departure-time', flight.departure_time ? flight.departure_time.substring(0, 16) : '');
    setVal('schedule-arrival-time', flight.arrival_time ? flight.arrival_time.substring(0, 16) : '');

    const saveBtn = document.getElementById('schedule-btn');
    if (saveBtn) {
        saveBtn.textContent = 'Update Flight';
        saveBtn.onclick = async (e) => {
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
                await updateFlight(flight.flight_id, payload);
                showToast('Flight updated', 'success');
                modal.classList.remove('active');
                initFlightsPage();
            } catch (err) {
                showToast(err.message || 'Update failed', 'error');
            }
        };
    }

    modal.classList.add('active');
}

function initNewFlightButton() {
    const btn = document.getElementById('open-flight-modal');
    const modal = document.getElementById('flight-modal');
    const closeBtn = document.getElementById('close-flight-modal');

    if (btn) {
        btn.onclick = () => {
            // Reset title and button
            const title = document.querySelector('#flight-modal h2');
            if (title) title.textContent = 'Schedule New Flight';
            
            const saveBtn = document.getElementById('schedule-btn');
            if (saveBtn) saveBtn.textContent = 'Schedule Flight';
            
            // Clear inputs
            const ids = [
                'schedule-flight-id', 'schedule-flight-number', 'schedule-airline', 'schedule-aircraft',
                'schedule-departure-airport', 'schedule-arrival-airport',
                'schedule-departure-gate', 'schedule-arrival-gate',
                'schedule-departure-time', 'schedule-arrival-time'
            ];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });

            if (modal) modal.classList.add('active');
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            if (modal) modal.classList.remove('active');
        };
    }
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : null;
}