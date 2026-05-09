import {
    getAirports
}
from '../api/airportApi.js';

import { escHtml }
from '../shared/helpers.js';

import {
    showToast
}
from '../shared/toast.js';

export function initAirportView() {

    const btn =
        document.getElementById(
            'load-airports-btn'
        );

    if (!btn) return;

    btn.addEventListener(
        'click',
        loadAirports
    );
}

async function loadAirports() {

    const grid =
        document.getElementById(
            'airports-grid'
        );

    grid.innerHTML =
        'Loading airports...';

    try {

        const airports =
            await getAirports();

        renderAirports(airports);

    } catch (err) {

        grid.innerHTML = '';

        showToast(
            err.message,
            'error'
        );
    }
}

function renderAirports(
    airports
) {

    const grid =
        document.getElementById(
            'airports-grid'
        );

    grid.innerHTML = '';

    airports.forEach(a => {

        const name =
            a.airport_name ||
            a.name ||
            'Airport';

        const city =
            a.city ||
            'Unknown City';

        const country =
            a.country ||
            '';

        const mapsUrl =
            `https://www.google.com/maps/search/?api=1&query=${
                encodeURIComponent(
                    `${name} ${city}`
                )
            }`;

        const card =
            document.createElement('div');

        card.className =
            'data-card hover-lift';

        card.innerHTML = `
            <div class="card-icon">
                🏢
            </div>

            <h3>
                ${escHtml(name)}
            </h3>

            <div class="card-detail">
                📍 ${escHtml(city)},
                ${escHtml(country)}
            </div>

            <div class="card-action-link">
                🌍 View on Map ↗
            </div>
        `;

        card.addEventListener(
            'click',
            () => {
                window.open(
                    mapsUrl,
                    '_blank'
                );
            }
        );

        grid.appendChild(card);
    });
}