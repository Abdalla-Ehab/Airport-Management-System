import {
    apiRequest
}
from '../api/apiClient.js';

import {
    escHtml
}
from '../shared/helpers.js';

import {
    showToast
}
from '../shared/toast.js';


let airlinesCache = [];


export async function initAirlinesPage() {

    try {

        const airlines =
            await apiRequest(
                '/airlines'
            );

        airlinesCache =
            airlines || [];

        renderAirlines(
            airlinesCache
        );

        initTableActions();

    } catch (err) {

        console.error(err);

        showToast(
            'Failed to load airlines',
            'error'
        );
    }
}


// =====================================================
// RENDER AIRLINES
// =====================================================

function renderAirlines(airlines) {

    const tbody =
        document.getElementById(
            'airlines-table-body'
        );

    if (!tbody) return;

    tbody.innerHTML = '';

    // =========================================
    // EMPTY STATE
    // =========================================

    if (!airlines ||
        !airlines.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="5">

                    <div class="empty-state">

                        No Airlines Found

                    </div>

                </td>

            </tr>
        `;

        return;
    }

    airlines.forEach((a, index) => {

        const tr =
            document.createElement('tr');

        // =====================================
        // SAFE FLEET VALUE
        // =====================================

        const pseudoFleet =
            12 + (index * 3);

        tr.innerHTML = `

            <td>

                <div class="airline-cell">

                    <div class="airline-table-logo">
                        ✈
                    </div>

                    <div>

                        <strong>
                            ${escHtml(
                                a.name || 'Unknown Airline'
                            )}
                        </strong>

                    </div>

                </div>

            </td>

            <td>
                ${escHtml(
                    a.country || '-'
                )}
            </td>

            <td>

                ${pseudoFleet}
                Aircraft

            </td>

            <td>

                <span
                    class="
                        badge
                        badge-success
                    ">

                    ACTIVE

                </span>

            </td>

            <td>

                <div
                    class="
                        management-actions
                    ">

                    <button
                        class="
                            btn
                            btn-secondary
                            edit-airline
                        "
                        data-id="${a.airline_id}">

                        Edit

                    </button>

                    <button
                        class="
                            btn
                            btn-primary
                            view-airline
                        "
                        data-id="${a.airline_id}">

                        View

                    </button>

                </div>

            </td>
        `;

        tbody.appendChild(tr);
    });
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
                    '.view-airline'
                );

            const editBtn =
                e.target.closest(
                    '.edit-airline'
                );

            // =================================
            // VIEW
            // =================================

            if (viewBtn) {

                const id =
                    viewBtn.dataset.id;

                const airline =
                    airlinesCache.find(
                        a =>
                            a.airline_id == id
                    );

                if (!airline) return;

                showToast(
                    `Viewing ${airline.name}`,
                    'success'
                );

                console.log(
                    'VIEW AIRLINE:',
                    airline
                );
            }

            // =================================
            // EDIT
            // =================================

            if (editBtn) {

                const id =
                    editBtn.dataset.id;

                const airline =
                    airlinesCache.find(
                        a =>
                            a.airline_id == id
                    );

                if (!airline) return;

                showToast(
                    `Editing ${airline.name}`,
                    'success'
                );

                console.log(
                    'EDIT AIRLINE:',
                    airline
                );
            }
        }
    );
}