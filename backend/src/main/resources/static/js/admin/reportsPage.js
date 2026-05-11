import { getSystemSummary } from '../api/reportApi.js';
import { showToast } from '../shared/toast.js';

export async function initReportsPage() {
    setupRefreshButton();
    await loadReports();
}

function setupRefreshButton() {
    const btn = document.getElementById('refresh-reports-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            loadReports();
        });
    }
}

async function loadReports() {
    try {
        const summaryResponse = await getSystemSummary();
        // The API returns { message: "...", data: { totalFlights: ... } }
        const data = summaryResponse.data || summaryResponse;

        if (data) {
            const mapping = {
                'report-total-flights': data.totalFlights,
                'report-total-passengers': data.totalPassengers,
                'report-total-staff': data.totalStaff,
                'report-total-bookings': data.totalBookings
            };
            Object.entries(mapping).forEach(([id, value]) => animateValue(id, value || 0));
        }
    } catch (err) {
        console.error(err);
        showToast('Failed to load system reports', 'error');
    }
}

function animateValue(elementId, end, duration = 1000) {
    const obj = document.getElementById(elementId);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * end).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
