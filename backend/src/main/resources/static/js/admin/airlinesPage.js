import {
    apiRequest
}
from '../api/apiClient.js';

import {
    escHtml
}
from '../shared/helpers.js';

export async function initAirlinesPage() {

    try {

        const airlines =
            await apiRequest(
                '/airlines'
            );

        renderAirlines(airlines);

    } catch (err) {

        console.error(err);
    }
}

function renderAirlines(airlines) {

    const tbody =
        document.getElementById(
            'airlines-table-body'
        );

    if (!tbody) return;

    tbody.innerHTML = '';

    airlines.forEach(a => {

        const tr =
            document.createElement('tr');

        tr.innerHTML = `

            <td>

                <div class="airline-cell">

                    <div class="airline-table-logo">
                        🛩
                    </div>

                    <div>

                        <strong>
                            ${escHtml(a.name)}
                        </strong>

                    </div>

                </div>

            </td>

            <td>
                ${escHtml(a.country)}
            </td>

            <td>
                ${Math.floor(Math.random()*80)}
                Aircraft
            </td>

            <td>

                <span
                    class="badge badge-success">

                    ACTIVE

                </span>

            </td>

            <td>

                <div
                    class="management-actions">

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