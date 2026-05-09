
export function renderSeatMap(seats = []) {

    const container = document.getElementById('seat-map');

    if (!container) return;

    container.innerHTML = '';

    seats.forEach(seat => {

        const btn = document.createElement('button');

        btn.className = 'seat-btn';

        btn.textContent = seat.seat_number;

        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
        });

        container.appendChild(btn);
    });
}
