import {
    getFleet,
    updateAircraftStatus
}
from '../api/maintenanceApi.js';

import { escHtml }
from '../shared/helpers.js';

import {
    showToast
}
from '../shared/toast.js';

export function initFleet() {

    const btn =
        document.getElementById(
            'fleet-btn'
        );

    if (!btn) return;

    btn.addEventListener(
        'click',
        loadFleet
    );
}

async function loadFleet() {

    const grid =
        document.getElementById(
            'fleet-grid'
        );

    grid.innerHTML =
        'Loading fleet...';

    try {

        const fleet =
            await getFleet();

        renderFleet(fleet);

    } catch (err) {

        grid.innerHTML = '';

        showToast(
            err.message,
            'error'
        );
    }
}

function renderFleet(fleet) {

    const grid =
        document.getElementById(
            'fleet-grid'
        );

    grid.innerHTML = '';

    fleet.forEach(a => {

        const status =
            a.status || 'ACTIVE';

        let badgeClass =
            'status-active';

        if (status === 'MAINTENANCE') {
            badgeClass =
                'status-maintenance';
        }

        if (status === 'GROUNDED') {
            badgeClass =
                'status-grounded';
        }

        const card =
            document.createElement('div');

        card.className =
            'data-card';

        card.innerHTML = `
            <div class="card-icon">
                ✈️
            </div>

            <h3>
                ${escHtml(a.type)}
            </h3>

            <div class="card-detail">
                ${escHtml(a.registration_no)}
            </div>

            <div class="
                status-badge
                ${badgeClass}
            ">
                ${escHtml(status)}
            </div>
        `;

        const select =
            document.createElement('select');

        select.className =
            'input-glass';

        select.innerHTML = `
            <option value="">
                Change Status
            </option>

            <option value="ACTIVE">
                ACTIVE
            </option>

            <option value="MAINTENANCE">
                MAINTENANCE
            </option>

            <option value="GROUNDED">
                GROUNDED
            </option>
        `;

        select.addEventListener(
            'change',
            async e => {

                try {

                    await updateAircraftStatus(
                        a.aircraft_id,
                        e.target.value
                    );

                    showToast(
                        'Aircraft updated',
                        'success'
                    );

                    loadFleet();

                } catch (err) {

                    showToast(
                        err.message,
                        'error'
                    );
                }
            }
        );

        card.appendChild(select);

        grid.appendChild(card);
    });
}