import { state }
from '../shared/state.js';

import { showToast }
from '../shared/toast.js';

import {
    getBookedSeats
}
from '../api/bookingApi.js';

const seatMapEl =
    document.getElementById(
        'seat-map'
    );

const seatLegendEl =
    document.getElementById(
        'seat-legend'
    );

// =====================================================
// RENDER SEAT MAP
// =====================================================

export async function renderSeatMap(
    seatClass = 'ECONOMY'
) {

    if (!seatMapEl) return;

    if (!state.currentFlight) return;

    state.selectedSeats = [];

    seatMapEl.innerHTML = '';

    renderLegend();

    // =====================================================
    // FETCH REAL BOOKED SEATS
    // =====================================================

    let bookedSeats = [];

    try {

        bookedSeats =
            await getBookedSeats(
                state.currentFlight.flight_id
            );

    } catch (err) {

        console.error(
            'Failed to load booked seats',
            err
        );
    }

    // =====================================================
    // AIRCRAFT CONFIG
    // =====================================================

    const totalSeats =
        state.currentFlight
            .number_of_seats || 60;

    let seatsPerRow = 6;

    let letters =
        ['A', 'B', 'C', 'D', 'E', 'F'];

    // =====================================================
    // CABIN CONFIG
    // =====================================================

    if (seatClass === 'BUSINESS') {

        seatsPerRow = 4;

        letters =
            ['A', 'B', 'D', 'F'];
    }

    if (seatClass === 'FIRST') {

        seatsPerRow = 4;

        letters =
            ['A', 'C', 'D', 'F'];
    }

    const rows =
        Math.ceil(
            totalSeats / seatsPerRow
        );

    let seatCounter = 0;

    // =====================================================
    // GENERATE ROWS
    // =====================================================

    for (
        let row = 1;
        row <= rows;
        row++
    ) {

        const rowEl =
            document.createElement(
                'div'
            );

        rowEl.className =
            'aircraft-row';

        for (
            let seat = 0;
            seat < seatsPerRow;
            seat++
        ) {

            if (
                seatCounter >= totalSeats
            ) break;

            const seatNo =
                `${row}${letters[seat]}`;

            const btn =
                document.createElement(
                    'button'
                );

            btn.className =
                'aircraft-seat';

            btn.textContent =
                seatNo;

            btn.dataset.seat =
                seatNo;

            // =================================================
            // REAL OCCUPIED SEATS
            // =================================================

            if (
                bookedSeats.includes(
                    seatNo
                )
            ) {

                btn.classList.add(
                    'occupied'
                );

                btn.disabled = true;

            } else {

                btn.addEventListener(
                    'click',
                    () => toggleSeat(btn)
                );
            }

            rowEl.appendChild(btn);

            // =================================================
            // AIRCRAFT AISLE
            // =================================================

            if (
                seatClass === 'ECONOMY' &&
                seat === 2
            ) {

                const aisle =
                    document.createElement(
                        'div'
                    );

                aisle.className =
                    'aircraft-aisle';

                rowEl.appendChild(
                    aisle
                );
            }

            if (
                seatClass !== 'ECONOMY' &&
                seat === 1
            ) {

                const aisle =
                    document.createElement(
                        'div'
                    );

                aisle.className =
                    'aircraft-aisle';

                rowEl.appendChild(
                    aisle
                );
            }

            seatCounter++;
        }

        seatMapEl.appendChild(
            rowEl
        );
    }

    updateSeatSummary();
}

// =====================================================
// TOGGLE SEAT
// =====================================================

function toggleSeat(btn) {

    const seatNo =
        btn.dataset.seat;

    if (
        btn.classList.contains(
            'selected'
        )
    ) {

        btn.classList.remove(
            'selected'
        );

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

        btn.classList.add(
            'selected'
        );

        state.selectedSeats.push(
            seatNo
        );
    }

    updateSeatSummary();
}

// =====================================================
// UPDATE SUMMARY
// =====================================================

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

// =====================================================
// LEGEND
// =====================================================

function renderLegend() {

    if (!seatLegendEl) return;

    seatLegendEl.innerHTML = `

        <div class="legend-item">

            <div class="aircraft-seat"></div>

            Available

        </div>

        <div class="legend-item">

            <div class="aircraft-seat selected"></div>

            Selected

        </div>

        <div class="legend-item">

            <div class="aircraft-seat occupied"></div>

            Occupied

        </div>
    `;
}