import { getAirports, updateAirport, deleteAirport } from '../api/airportApi.js';
import { escHtml } from '../shared/helpers.js';
import { showToast } from '../shared/toast.js';

export async function initAirportsPage() {
    try {
        const airports = await getAirports();
        renderAirports(airports);
        setupAirportModal();
    } catch (err) {
        console.error(err);
        showToast('Failed to load airports', 'error');
    }
}

function renderAirports(airports) {
    const grid = document.getElementById('airports-grid');
    if (!grid) return;
    grid.innerHTML = '';

    airports.forEach(a => {
        const card = document.createElement('div');
        card.className = 'card airport-card';
        card.innerHTML = `
            <div class="airport-header">
                <div class="airport-icon">🏢</div>
                <span class="badge badge-success">ACTIVE</span>
            </div>
            <h3>${escHtml(a.name)}</h3>
            <p>${escHtml(a.city)}, ${escHtml(a.country)}</p>
            <div class="airport-meta">
                <div class="airport-meta-item">
                    <span>IATA Code</span>
                    <strong>${escHtml(a.iata_code || 'N/A')}</strong>
                </div>
                <div class="airport-meta-item">
                    <span>Daily Flights</span>
                    <strong>${Math.floor(Math.random()*400)}</strong>
                </div>
            </div>
            <div style="margin-top: 16px; display:flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
                <button class="btn btn-primary btn-sm delete-btn" style="background-color: #ef4444;">Delete</button>
            </div>
        `;

        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => openAirportModal(a));

        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => handleDeleteAirport(a.airport_id));

        grid.appendChild(card);
    });
}

function setupAirportModal() {
    const modal = document.getElementById('airport-modal');
    const closeBtn = document.getElementById('close-airport-modal');
    const saveBtn = document.getElementById('save-airport-btn');

    if (!modal) return;

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    saveBtn.addEventListener('click', async () => {
        const id = document.getElementById('airport-id').value;
        if (!id) return;

        const payload = {
            name: document.getElementById('airport-name').value,
            city: document.getElementById('airport-city').value,
            country: document.getElementById('airport-country').value,
            iata_code: document.getElementById('airport-iata').value
        };

        try {
            await updateAirport(id, payload);
            showToast('Airport updated successfully', 'success');
            modal.classList.remove('active');
            initAirportsPage(); // refresh
        } catch (err) {
            showToast(err.message || 'Failed to update airport', 'error');
        }
    });
}

function openAirportModal(airport) {
    const modal = document.getElementById('airport-modal');
    document.getElementById('airport-id').value = airport.airport_id;
    document.getElementById('airport-name').value = airport.name;
    document.getElementById('airport-city').value = airport.city;
    document.getElementById('airport-country').value = airport.country;
    document.getElementById('airport-iata').value = airport.iata_code || '';
    modal.classList.add('active');
}

async function handleDeleteAirport(id) {
    if (!confirm('Are you sure you want to delete this airport?')) return;
    try {
        await deleteAirport(id);
        showToast('Airport deleted successfully', 'success');
        initAirportsPage(); // refresh
    } catch (err) {
        showToast(err.message || 'Failed to delete airport', 'error');
    }
}