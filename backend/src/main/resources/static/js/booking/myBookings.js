import {
    apiRequest
}
from '../api/apiClient.js';

import {
    escHtml
}
from '../shared/helpers.js';

export async function initMyBookings() {

    const container =
        document.getElementById(
            'booking-history'
        );

    if (!container) return;

    try {

        const bookings =
            await apiRequest(
                '/bookings/my'
            );

        renderBookings(
            bookings,
            container
        );

    } catch (err) {

        console.error(err);

        container.innerHTML = `

            <div class="card">

                <h3>
                    Failed To Load Bookings
                </h3>

            </div>
        `;
    }
}

function renderBookings(
    bookings,
    container
) {

    container.innerHTML = '';

    if (!bookings.length) {

        container.innerHTML = `

            <div class="card">

                <h3>
                    No Bookings Yet
                </h3>

                <p class="text-muted">

                    Your tickets will appear here.

                </p>

            </div>
        `;

        return;
    }

    bookings.forEach(booking => {

        const card =
            document.createElement('div');

        card.className =
            'card';

        card.style.marginBottom =
            '20px';

        card.innerHTML = `

            <div class="section-header">

                <h3>
                    Ticket #${booking.bookingId}
                </h3>

                <span class="badge badge-success">

                    CONFIRMED

                </span>

            </div>

            <div class="airport-meta">

                <div class="airport-meta-item">

                    <strong>
                        Flight ID
                    </strong>

                    <span>
                        ${booking.flightId}
                    </span>

                </div>

                <div class="airport-meta-item">

                    <strong>
                        Seat
                    </strong>

                    <span>
                        ${escHtml(
                            booking.seatNo
                        )}
                    </span>

                </div>

                <div class="airport-meta-item">

                    <strong>
                        Class
                    </strong>

                    <span>
                        ${escHtml(
                            booking.className
                        )}
                    </span>

                </div>

            </div>
        `;

        container.appendChild(card);
    });
}