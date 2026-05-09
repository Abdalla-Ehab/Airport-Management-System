import {
    checkIn,
    getBoardingPass
}
from '../api/bookingApi.js';

import { showToast }
from '../shared/toast.js';

import { escHtml }
from '../shared/helpers.js';

export function initCheckin() {

    const btn =
        document.getElementById(
            'checkin-btn'
        );

    if (!btn) return;

    btn.addEventListener(
        'click',
        performCheckin
    );
}

async function performCheckin() {

    const ticketNo =
        document.getElementById(
            'checkin-ticket'
        ).value
        .trim();

    const passportNo =
        document.getElementById(
            'checkin-passport'
        ).value
        .trim();

    if (!ticketNo || !passportNo) {

        showToast(
            'Please enter ticket and passport',
            'error'
        );

        return;
    }

    try {

        const payload = {

            ticket_no: ticketNo,

            passport_no: passportNo
        };

        await checkIn(payload);

        showToast(
            'Check-in completed successfully',
            'success'
        );

        await loadBoardingPass(ticketNo);

    } catch (err) {

        showToast(
            err.message,
            'error'
        );
    }
}

async function loadBoardingPass(
    ticketNo
) {

    try {

        const bp =
            await getBoardingPass(ticketNo);

        renderBoardingPass(bp);

    } catch (err) {

        showToast(
            'Boarding pass unavailable',
            'error'
        );
    }
}

function renderBoardingPass(bp) {

    const container =
        document.getElementById(
            'boarding-pass-container'
        );

    if (!container) return;

    container.innerHTML = `
        <div class="boarding-pass">

            <div class="bp-header">
                ✈ BOARDING PASS
            </div>

            <div class="bp-grid">

                <div>
                    <strong>Ticket</strong>
                    <p>${escHtml(bp.ticket_no)}</p>
                </div>

                <div>
                    <strong>Boarding Group</strong>
                    <p>${escHtml(bp.boarding_group)}</p>
                </div>

                <div>
                    <strong>Sequence</strong>
                    <p>${escHtml(bp.sequence_number)}</p>
                </div>

                <div>
                    <strong>Status</strong>
                    <p>
                        ${bp.is_boarded
                            ? 'BOARDED'
                            : 'READY'}
                    </p>
                </div>

            </div>

        </div>
    `;
}