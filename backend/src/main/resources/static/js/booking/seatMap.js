import { state }
from '../shared/state.js';

import { showToast }
from '../shared/toast.js';

const seatMapEl =
    document.getElementById('seat-map');

const seatLegendEl =
    document.getElementById('seat-legend');

export function renderSeatMap(
    seatClass = 'ECONOMY'
) {

    if (!seatMapEl) return;

    state.selectedSeats = [];

    seatMapEl.innerHTML = '';

    renderLegend();

    let rows = 20;
    let seatsPerRow = 6;

    if (seatClass === 'BUSINESS') {
        rows = 8;
        seatsPerRow = 4;
    }

    if (seatClass === 'FIRST') {
        rows = 4;
        seatsPerRow = 4;
    }

    const letters =
        ['A', 'B', 'C', 'D', 'E', 'F'];

    for (let row = 1; row <= rows; row++) {

        const rowEl =
            document.createElement('div');

        rowEl.className = 'seat-row';

        for (
            let seat = 0;
            seat < seatsPerRow;
            seat++
        ) {

            const seatNo =
                `${row}${letters[seat]}`;

            const btn =
                document.createElement('button');

            btn.className = 'seat';

            btn.textContent = seatNo;

            btn.dataset.seat = seatNo;

            if (Math.random() < 0.15) {

                btn.classList.add('occupied');

                btn.disabled = true;

            } else {

                btn.addEventListener(
                    'click',
                    () => toggleSeat(btn)
                );
            }

            rowEl.appendChild(btn);
        }

        seatMapEl.appendChild(rowEl);
    }
}

function toggleSeat(btn) {

    const seatNo =
        btn.dataset.seat;

    if (
        btn.classList.contains('selected')
    ) {

        btn.classList.remove('selected');

        state.selectedSeats =
            state.selectedSeats.filter(
                s => s !== seatNo
            );

    } else {

        if (
            state.selectedSeats.length >= 3
        ) {

            showToast(
                'Maximum 3 seats allowed',
                'error'
            );

            return;
        }

        btn.classList.add('selected');

        state.selectedSeats.push(seatNo);
    }

    updateSeatSummary();
}

function updateSeatSummary() {

    const selectedEl =
        document.getElementById(
            'selected-seats'
        );

    if (!selectedEl) return;

    selectedEl.textContent =
        state.selectedSeats.join(', ') ||
        'None';
}

function renderLegend() {

    if (!seatLegendEl) return;

    seatLegendEl.innerHTML = `
        <div class="legend-item">
            <div class="seat"></div>
            Available
        </div>

        <div class="legend-item">
            <div class="seat selected"></div>
            Selected
        </div>

        <div class="legend-item">
            <div class="seat occupied"></div>
            Occupied
        </div>
    `;
}