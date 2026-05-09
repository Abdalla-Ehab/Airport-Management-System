import {
    getMaintenanceLogs,
    createMaintenanceLog
}
from '../api/maintenanceApi.js';

import { escHtml }
from '../shared/helpers.js';

import {
    showToast
}
from '../shared/toast.js';

export function initMaintenance() {

    const btn =
        document.getElementById(
            'maintenance-btn'
        );

    if (!btn) return;

    btn.addEventListener(
        'click',
        submitMaintenance
    );

    loadMaintenanceLogs();
}

async function loadMaintenanceLogs() {

    const container =
        document.getElementById(
            'maintenance-logs'
        );

    if (!container) return;

    try {

        const logs =
            await getMaintenanceLogs();

        renderLogs(logs);

    } catch (err) {

        showToast(
            err.message,
            'error'
        );
    }
}

function renderLogs(logs) {

    const container =
        document.getElementById(
            'maintenance-logs'
        );

    container.innerHTML = '';

    logs.forEach(log => {

        const card =
            document.createElement('div');

        card.className =
            'data-card';

        card.innerHTML = `
            <h3>
                Maintenance Record
            </h3>

            <p>
                ${escHtml(log.work_done)}
            </p>

            <p>
                Duration:
                ${log.duration_minutes} mins
            </p>

            <p>
                Status:
                ${escHtml(log.approval_status)}
            </p>
        `;

        container.appendChild(card);
    });
}

async function submitMaintenance() {

    const work =
        document.getElementById(
            'maintenance-work'
        ).value;

    const duration =
        document.getElementById(
            'maintenance-duration'
        ).value;

    try {

        await createMaintenanceLog({

            work_done: work,

            duration_minutes:
                duration
        });

        showToast(
            'Maintenance submitted',
            'success'
        );

        loadMaintenanceLogs();

    } catch (err) {

        showToast(
            err.message,
            'error'
        );
    }
}