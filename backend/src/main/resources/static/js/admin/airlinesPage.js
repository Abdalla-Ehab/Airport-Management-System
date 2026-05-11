import { getAirlines, updateAirline } from '../api/airlineApi.js';
import { escHtml } from '../shared/helpers.js';
import { showToast } from '../shared/toast.js';

let airlinesCache = [];

export async function initAirlinesPage() {
    try {
        const airlines = await getAirlines();
        airlinesCache = airlines || [];
        renderAirlines(airlinesCache);
        setupAirlineModal();
    } catch (err) {
        console.error(err);
        showToast('Failed to load airlines', 'error');
    }
}

function renderAirlines(airlines) {
    const tbody = document.getElementById('airlines-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!airlines || !airlines.length) {
        tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">No Airlines Found</div></td></tr>`;
        return;
    }

    airlines.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="airline-cell">
                    <div class="airline-table-logo">✈</div>
                    <div><strong>${escHtml(a.name || 'Unknown Airline')}</strong></div>
                </div>
            </td>
            <td>${escHtml(a.country || '-')}</td>
            <td><span class="badge badge-success">ACTIVE</span></td>
            <td>
                <div class="management-actions">
                    <button class="btn btn-secondary btn-sm edit-airline" data-id="${a.airline_id}">Edit</button>
                    <button class="btn btn-primary btn-sm view-airline" data-id="${a.airline_id}">View</button>
                </div>
            </td>
        `;

        tr.querySelector('.edit-airline').onclick = () => openAirlineModal(a, false);
        tr.querySelector('.view-airline').onclick = () => openAirlineModal(a, true);

        tbody.appendChild(tr);
    });
}

function setupAirlineModal() {
    const modal = document.getElementById('airline-modal');
    const closeBtn = document.getElementById('close-airline-modal');
    const saveBtn = document.getElementById('save-airline-btn');

    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('active');
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const id = document.getElementById('airline-id').value;
            const payload = {
                name: document.getElementById('airline-name').value,
                country: document.getElementById('airline-country').value
            };

            try {
                await updateAirline(id, payload);
                showToast('Airline updated successfully', 'success');
                modal.classList.remove('active');
                initAirlinesPage();
            } catch (err) {
                showToast(err.message || 'Failed to update airline', 'error');
            }
        };
    }
}

function openAirlineModal(airline, readOnly) {
    const modal = document.getElementById('airline-modal');
    const title = document.getElementById('airline-modal-title');
    const saveBtn = document.getElementById('save-airline-btn');

    document.getElementById('airline-id').value = airline.airline_id;
    document.getElementById('airline-name').value = airline.name || '';
    document.getElementById('airline-country').value = airline.country || '';

    document.getElementById('airline-name').disabled = readOnly;
    document.getElementById('airline-country').disabled = readOnly;

    if (readOnly) {
        title.textContent = 'View Airline';
        saveBtn.style.display = 'none';
    } else {
        title.textContent = 'Edit Airline';
        saveBtn.style.display = 'block';
    }

    modal.classList.add('active');
}