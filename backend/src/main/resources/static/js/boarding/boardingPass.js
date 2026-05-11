import { state }
from '../shared/state.js';

export function renderBoardingPass(
    booking
) {

    if (!booking) return;

    document.getElementById(
        'bp-passenger-name'
    ).textContent =
        booking.passengerName ||
        state.currentUser?.username ||
        'Passenger';

    document.getElementById(
        'bp-from'
    ).textContent =
        booking.departureAirport ||
        'Unknown';

    document.getElementById(
        'bp-to'
    ).textContent =
        booking.arrivalAirport ||
        'Unknown';

    document.getElementById(
        'bp-date'
    ).textContent =
        booking.flightDate ||
        'N/A';

    document.getElementById(
        'bp-departure'
    ).textContent =
        booking.departureTime ||
        'N/A';

    document.getElementById(
        'bp-arrival'
    ).textContent =
        booking.arrivalTime ||
        'N/A';

    document.getElementById(
        'bp-flight'
    ).textContent =
        booking.flightNumber ||
        'N/A';

    document.getElementById(
        'bp-seat'
    ).textContent =
        booking.seatNo ||
        'N/A';

    document.getElementById(
        'bp-class'
    ).textContent =
        booking.className ||
        'ECONOMY';

    document.getElementById(
        'bp-ticket'
    ).textContent =
        `TKT-${booking.bookingId}`;

    document.getElementById(
        'bp-boarding-time'
    ).textContent =
        booking.boardingTime ||
        booking.departureTime ||
        'N/A';

    // =====================================
    // QR CODE
    // =====================================

    document.getElementById(
        'bp-qr'
    ).src =
        `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=TKT-${booking.bookingId}`;
}