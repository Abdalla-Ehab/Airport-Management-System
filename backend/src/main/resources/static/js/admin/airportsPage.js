import {
    getAirports
}
from '../api/airportApi.js';

import {
    escHtml
}
from '../shared/helpers.js';

export async function initAirportsPage() {

    try {

        const airports =
            await getAirports();

        renderAirports(airports);

    } catch (err) {

        console.error(err);
    }
}

function renderAirports(airports) {

    const grid =
        document.getElementById(
            'airports-grid'
        );

    if (!grid) return;

    grid.innerHTML = '';

    airports.forEach(a => {

        const card =
            document.createElement('div');

        card.className =
            'card airport-card';

        card.innerHTML = `

            <div class="airport-header">

                <div class="airport-icon">
                    🏢
                </div>

                <span
                    class="badge badge-success">

                    ACTIVE
                </span>

            </div>

            <h3>
                ${escHtml(a.name)}
            </h3>

            <p>
                ${escHtml(a.city)},
                ${escHtml(a.country)}
            </p>

            <div class="airport-meta">

                <div class="airport-meta-item">

                    <span>
                        IATA Code
                    </span>

                    <strong>
                        ${escHtml(a.iata_code || 'N/A')}
                    </strong>

                </div>

                <div class="airport-meta-item">

                    <span>
                        Daily Flights
                    </span>

                    <strong>
                        ${Math.floor(Math.random()*400)}
                    </strong>

                </div>

                <div class="airport-meta-item">

                    <span>
                        Active Gates
                    </span>

                    <strong>
                        ${Math.floor(Math.random()*120)}
                    </strong>

                </div>

            </div>

        `;

        grid.appendChild(card);
    });
}