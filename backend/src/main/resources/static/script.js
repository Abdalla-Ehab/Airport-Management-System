/* =============================================
   AERONEXUS — AIRPORT MANAGEMENT SYSTEM
   SPA Router + API Layer + UI Logic
   ============================================= */

'use strict';

const API = 'http://localhost:8080/api';

/* ── STATE ── */
let currentUser = null;  // { username, role, id }
// Lock the date picker to only allow today or past dates
if (document.getElementById('reg-dob')) {
  document.getElementById('reg-dob').max = new Date().toISOString().split("T")[0];
}

/* ═══════════════════════════════════════════
   ROLE DEFINITIONS & NAV CONFIG
═══════════════════════════════════════════ */
const NAV_CONFIG = {
  passenger: [
    {
      category: 'My Travel', icon: '✈️',
      items: [
        { view: 'book', label: 'Book a Flight', onEnter: initBookingView },
        { view: 'status', label: 'Flight Status', onEnter: initStatusView },
        { view: 'history', label: 'Flight History' }
      ]
    },
    {
      category: 'Airport Services', icon: '🏢',
      items: [
        { view: 'home', label: 'Airports Network', onEnter: loadAirports },
        { view: 'checkin', label: 'Check-In Kiosk' },
        { view: 'dutyfree', label: 'Duty-Free Shops' }
      ]
    }
  ],
  staff: [
    {
      category: 'Ground Ops', icon: '🦺',
      items: [
        { view: 'baggage', label: 'Baggage Drop' },
        { view: 'scanner', label: 'Barcode Scanner', icon: '📇' },
        { view: 'gate', label: 'Gate Management' }
      ]
    },
    {
      category: 'Terminal Security', icon: '🛡️',
      items: [
        { view: 'security', label: 'Incident Logs' },
        { view: 'watchlist', label: 'Passenger Watchlist' }
      ]
    },
    {
      category: 'Engineering & Maintenance', icon: '🔧',
      items: [
        { view: 'maintenance', label: 'Fleet Grounding', onEnter: initMaintenanceView }
      ]
    }
  ],
  admin: [
    {
      category: 'Flight Operations', icon: '🌍',
      items: [
        { view: 'schedule', label: 'Master Scheduler', onEnter: initScheduleView },
        { view: 'active-flights', label: 'Live Traffic Map' }
      ]
    },
    {
      category: 'Asset Management', icon: '🔧',
      items: [
        { view: 'fleet', label: 'Fleet & Aircraft', onEnter: loadFleet },
        { view: 'maintenance', label: 'Maintenance Logs' }
      ]
    },
    {
      category: 'Human Resources', icon: '👥',
      items: [
        { view: 'add-staff', label: 'Hire Employee' },
        { view: 'roster', label: 'Staff Roster', icon: '📅' }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════
   AUTHENTICATION & REGISTRATION LOGIC
═══════════════════════════════════════════ */

document.getElementById('tab-login').addEventListener('click', () => {
  document.getElementById('form-login').classList.remove('hidden');
  document.getElementById('form-register').classList.add('hidden');
  document.getElementById('tab-login').style.background = '';
  document.getElementById('tab-register').style.background = 'transparent';
  document.getElementById('auth-error').classList.add('hidden');
});

document.getElementById('tab-register').addEventListener('click', () => {
  document.getElementById('form-register').classList.remove('hidden');
  document.getElementById('form-login').classList.add('hidden');
  document.getElementById('tab-register').style.background = 'linear-gradient(135deg, var(--sky) 0%, #1a5fd4 100%)';
  document.getElementById('tab-login').style.background = 'transparent';
  document.getElementById('auth-error').classList.add('hidden');
});

async function authenticate(username, password) {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      // Unwrapping just in case Auth is standardized
      const payload = data.data || data;
      sessionStorage.setItem('jwt_token', payload.token || data.token);
      return payload;
    }
  } catch (err) {
    console.error("Database connection failed", err);
  }
  return null;
}

document.getElementById('register-btn').addEventListener('click', async () => {
  const dob = document.getElementById('reg-dob').value;
  const passport = document.getElementById('reg-passport').value.trim();
  const fn = document.getElementById('reg-firstname').value.trim();
  const ln = document.getElementById('reg-lastname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const errEl = document.getElementById('auth-error');

  if (!fn || !ln || !email || !phone || !username || !password || !dob || !passport) {
    errEl.textContent = 'Please fill out all fields.';
    errEl.classList.remove('hidden');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register/passenger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: fn, lastName: ln, email: email, phoneNumber: phone,
        dob: dob, passportNo: passport, username: username, password: password
      })
    });

    if (res.ok) {
      showToast('Account created! You can now log in.', 'success');
      document.getElementById('tab-login').click();
      document.querySelectorAll('#form-register input').forEach(i => i.value = '');
    } else {
      errEl.textContent = 'Registration failed. Username or Email might already exist.';
      errEl.classList.remove('hidden');
    }
  } catch (err) {
    errEl.textContent = 'Server error.';
    errEl.classList.remove('hidden');
  }
});

document.getElementById('add-staff-btn')?.addEventListener('click', async () => {
  const fn = document.getElementById('staff-fn').value.trim();
  const ln = document.getElementById('staff-ln').value.trim();
  const email = document.getElementById('staff-email').value.trim();
  const phone = document.getElementById('staff-phone').value.trim();
  const role = document.getElementById('staff-role').value;
  const username = document.getElementById('staff-username').value.trim();
  const password = document.getElementById('staff-password').value.trim();
  const deptElement = document.getElementById('reg-staff-dept');
  const deptId = deptElement ? parseInt(deptElement.value) : 1;
  const resultEl = document.getElementById('add-staff-result');

  if (!fn || !username || !password) {
    showResult(resultEl, `⚠️ Please fill in all required fields.`, false);
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token')
      },
      body: JSON.stringify({
        first_name: fn, last_name: ln, email: email, phone_number: phone,
        role: role, username: username, password: password, dept_id: deptId,
        hire_date: new Date().toISOString().split("T")[0]
      })
    });

    if (res.ok) {
      showResult(resultEl, `✅ Staff account '${username}' created successfully!`, true);
      document.querySelectorAll('#view-add-staff input').forEach(i => i.value = '');
    } else {
      const errorText = await res.text();
      showResult(resultEl, `❌ Failed to create staff account: ${errorText}`, false);
    }
  } catch (err) {
    showResult(resultEl, `⚠️ Network error.`, false);
  }
});

/* ═══════════════════════════════════════════
   ROUTER & NAV
═══════════════════════════════════════════ */
function navigate(viewId) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.classList.add('hidden');
  });
  document.querySelectorAll('.nav-submenu a').forEach(a => a.classList.remove('active'));

  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  } else {
    const mainContent = document.getElementById('main-content');
    let placeholder = document.getElementById('view-placeholder');
    if (!placeholder) {
      placeholder = document.createElement('section');
      placeholder.id = 'view-placeholder';
      placeholder.className = 'view active';
      mainContent.appendChild(placeholder);
    }
    placeholder.innerHTML = `<div class="view-header"><h2>Coming Soon</h2><p>This module is currently under development.</p></div>`;
    placeholder.classList.remove('hidden');
    placeholder.classList.add('active');
  }

  const link = document.querySelector(`.nav-submenu a[data-view="${viewId}"]`);
  if (link) link.classList.add('active');

  let foundItem = null;
  const categories = NAV_CONFIG[currentUser?.role] || [];
  categories.forEach(cat => {
    const match = cat.items.find(i => i.view === viewId);
    if (match) foundItem = match;
  });

  if (foundItem?.onEnter) foundItem.onEnter();
}

function buildNav(role) {
  const ul = document.getElementById('nav-links');
  ul.innerHTML = '';
  const categories = NAV_CONFIG[role] || [];

  categories.forEach((cat, index) => {
    const li = document.createElement('li');
    li.className = 'nav-category';

    const header = document.createElement('div');
    header.className = 'nav-category-header';
    header.innerHTML = `<div class="nav-category-title"><span class="nav-icon">${cat.icon}</span>${cat.category}</div> <span class="nav-arrow">▾</span>`;

    const submenu = document.createElement('ul');
    submenu.className = 'nav-submenu';

    if (index === 0) {
      submenu.classList.add('open');
      header.querySelector('.nav-arrow').style.transform = 'rotate(180deg)';
    }

    header.addEventListener('click', () => {
      submenu.classList.toggle('open');
      header.querySelector('.nav-arrow').style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    cat.items.forEach((item, i) => {
      const subLi = document.createElement('li');
      const a = document.createElement('a');
      a.dataset.view = item.view;
      a.textContent = item.label;
      a.addEventListener('click', () => navigate(item.view));
      subLi.appendChild(a);
      submenu.appendChild(subLi);

      if (index === 0 && i === 0) setTimeout(() => navigate(item.view), 0);
    });

    li.appendChild(header);
    li.appendChild(submenu);
    ul.appendChild(li);
  });
}

/* ═══════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════ */
document.getElementById('login-btn').addEventListener('click', async () => {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errEl = document.getElementById('auth-error');
  const btn = document.getElementById('login-btn');

  if (!username || !password) {
    errEl.textContent = 'Please enter your username and password.';
    errEl.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Authenticating…';
  errEl.classList.add('hidden');

  try {
    const user = await authenticate(username, password);

    btn.disabled = false;
    btn.innerHTML = 'Sign In';

    if (!user) {
      errEl.textContent = 'Invalid credentials. Please try again.';
      errEl.classList.remove('hidden');
      return;
    }

    currentUser = user;

    const displayUsername = user.username ? user.username : 'User';
    document.getElementById('nav-username').textContent = displayUsername.charAt(0).toUpperCase() + displayUsername.slice(1);
    document.getElementById('nav-role').textContent = ({ passenger: 'Passenger Portal', staff: 'Staff Operations', admin: 'Admin Dashboard' })[user.role] || user.role;
    document.getElementById('nav-avatar').textContent = displayUsername.charAt(0).toUpperCase();

    buildNav(user.role);

    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    document.getElementById('app-shell').style.display = 'flex';

    showToast('Welcome back, ' + displayUsername + '!', 'success');

  } catch (error) {
    btn.disabled = false;
    btn.innerHTML = 'Sign In';
    errEl.textContent = 'A system error occurred. Check the console.';
    errEl.classList.remove('hidden');
  }
});

['login-username', 'login-password'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('login-btn').click();
  });
});

document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  sessionStorage.removeItem('jwt_token');
  document.getElementById('app-shell').style.display = 'none';
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  showToast('Signed out successfully.', 'info');
});

/* ═══════════════════════════════════════════
   TOAST & UTILS
═══════════════════════════════════════════ */
function showToast(message, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s cubic-bezier(.4,0,.2,1) forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

function showResult(el, message, isSuccess) {
  el.className = `result-area ${isSuccess ? 'result-success' : 'result-error'}`;
  el.innerHTML = message;
  el.classList.remove('hidden');
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;'); // &#39; is the safe HTML code for a single quote!
}

/* ═══════════════════════════════════════════
   PASSENGER: Load Airports
═══════════════════════════════════════════ */
async function loadAirports() {
  const grid = document.getElementById('airports-grid');
  grid.innerHTML = '<div class="skeleton-loader"></div><div class="skeleton-loader"></div><div class="skeleton-loader"></div>';

  try {
    const res = await fetch(`${API}/airports`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // THE FIX: Unwrapping ApiResponse data if present
    const airports = data.data || data.content || (Array.isArray(data) ? data : []);

    if (!airports.length) {
      grid.innerHTML = '<p style="color:var(--silver)">No airports found.</p>';
      return;
    }

    grid.innerHTML = airports.map(a => {
      const country = a.country ? `, ${a.country}` : '';
      const name = a.airport_name || a.airportName || a.name || 'Airport';
      const city = a.city || a.location || 'Unknown City';
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(name + ' ' + city)}`;

      return `
        <div class="data-card hover-lift" onclick="window.open('${mapsUrl}', '_blank')">
          <div class="card-icon">🏢</div>
            <h3>${escHtml(name)}</h3>
            <div class="card-detail">📍 ${escHtml(city)}${escHtml(country)}</div>
            <div class="card-action-link">🌍 View on Map ↗</div>
        </div>
      `;
    }).join('');

  } catch (err) {
    grid.innerHTML = `<div class="result-area result-error">Failed to load airports: ${err.message}</div>`;
  }
}

/* ═══════════════════════════════════════════
   PASSENGER: Book a Flight
═══════════════════════════════════════════ */
let currentFlightData = null;
let selectedSeatsArr = [];

async function initBookingView() {
  document.getElementById('book-date').min = new Date().toISOString().split("T")[0];
  try {
    const res = await fetch(`${API}/airports`);
    const json = await res.json();

    // THE FIX: Unwrapping ApiResponse data if present
    const airports = json.data || json.content || (Array.isArray(json) ? json : []);

    let options = '<option value="">Select Airport...</option>';
    airports.forEach(a => options += `<option value="${a.id || a.airport_id}">${escHtml(a.name || a.city)}</option>`);
    document.getElementById('book-origin').innerHTML = options;
    document.getElementById('book-dest').innerHTML = options;
  } catch (e) { console.log("Failed to load airports."); }
}

document.getElementById('search-flights-btn').addEventListener('click', async () => {
  const origin = document.getElementById('book-origin').value;
  const dest = document.getElementById('book-dest').value;
  const date = document.getElementById('book-date').value;

  const resultsContainer = document.getElementById('flight-results-container');
  const listEl = document.getElementById('flight-list');
  const btn = document.getElementById('search-flights-btn');

  document.getElementById('seat-selection-container').classList.add('hidden');

  if (!origin || !dest || !date) { showToast('Please select origin, destination, and date.', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = 'Searching...';
  listEl.innerHTML = '<div class="skeleton-loader"></div>';
  resultsContainer.classList.remove('hidden');

  try {
    const res = await fetch(`${API}/flights`);
    const json = await res.json();

    // THE FIX: Safely unwrap the ApiResponse wrapper
    const allFlights = json.data || json.content || (Array.isArray(json) ? json : []);

    const available = allFlights.filter(f => {
      const flightDate = f.departure_time.split('T')[0].split(' ')[0];
      return String(f.departure_airport_id) === origin &&
        String(f.arrival_airport_id) === dest &&
        flightDate === date;
    });

    if (available.length === 0) {
      listEl.innerHTML = '<p style="color: var(--silver); padding: 20px;">No flights found for this date. Try another day.</p>';
      return;
    }

    listEl.innerHTML = '';
    available.forEach(f => {
      const depTime = new Date(f.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const arrTime = new Date(f.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const fn = f.flight_number || `FL-${f.flight_id}`;
      const pseudoPrice = 150 + (f.flight_id % 300);

      const card = document.createElement('div');
      card.className = 'flight-result-card';
      card.innerHTML = `
                <div style="flex: 1; color: var(--sky-light); font-weight: bold;">${fn}</div>
                <div class="flight-times">
                    <div class="time-block"><h3>${depTime}</h3><p>Departure</p></div>
                    <div class="flight-duration">Direct</div>
                    <div class="time-block"><h3>${arrTime}</h3><p>Arrival</p></div>
                </div>
                <div class="flight-price">US$${pseudoPrice}</div>
                <div class="flight-action"><button class="btn-primary" style="padding: 8px 16px; font-size: 0.9rem;" onclick="selectFlight(${f.flight_id}, '${fn}')">Select</button></div>
            `;
      listEl.appendChild(card);
    });

  } catch (e) {
    listEl.innerHTML = '<p class="result-error">Error fetching flights.</p>';
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Search';
  }
});

async function selectFlight(flightId, flightNumber) {
  currentFlightData = flightId;
  selectedSeatsArr = [];

  const hiddenInput = document.getElementById('selected-seat-no');
  if (hiddenInput) hiddenInput.value = '';

  const seatContainer = document.getElementById('seat-selection-container');
  const plane = document.getElementById('plane-seats');

  plane.innerHTML = '<div class="plane-cockpit">Front of Aircraft (' + flightNumber + ')</div>';
  seatContainer.classList.remove('hidden');
  document.getElementById('book-btn').disabled = true;
  seatContainer.scrollIntoView({ behavior: 'smooth' });

  try {
    const res = await fetch(`${API}/bookings/flights/${flightId}/seats`, {
      headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token') }
    });

    let occupiedSeats = [];
    if (res.ok) {
      const json = await res.json();
      // THE FIX: Unwrap seats
      occupiedSeats = json.data || json;
    }

    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const passDropdown = document.getElementById('book-passengers');
    let requiredSeats = passDropdown ? parseInt(passDropdown.value) : 1;

    const buildRow = (r, className) => {
      let rowDiv = document.createElement('div');
      rowDiv.className = 'seat-row';
      letters.forEach((col, index) => {
        const seatId = `${r}${col}`;
        const isOccupied = occupiedSeats.includes(seatId);

        let seat = document.createElement('div');
        seat.className = `seat ${isOccupied ? 'occupied' : 'available'}`;
        seat.dataset.id = seatId;
        seat.dataset.class = className;
        seat.textContent = isOccupied ? '' : seatId;

        if (!isOccupied) {
          seat.addEventListener('click', () => {
            if (seat.classList.contains('wrong-class')) return;

            if (seat.classList.contains('selected')) {
              seat.classList.remove('selected');
              selectedSeatsArr = selectedSeatsArr.filter(s => s !== seatId);
            } else {
              if (selectedSeatsArr.length < requiredSeats) {
                seat.classList.add('selected');
                selectedSeatsArr.push(seatId);
              } else {
                showToast(`You only selected ${requiredSeats} passenger(s).`, 'info');
                return;
              }
            }

            if (hiddenInput) hiddenInput.value = selectedSeatsArr.join(',');
            const bookBtn = document.getElementById('book-btn');
            if (bookBtn) bookBtn.disabled = (selectedSeatsArr.length !== requiredSeats);
          });
        }

        rowDiv.appendChild(seat);
        if (index === 2) {
          let aisle = document.createElement('div');
          aisle.className = 'aisle'; aisle.textContent = r;
          rowDiv.appendChild(aisle);
        }
      });
      plane.appendChild(rowDiv);
    };

    plane.insertAdjacentHTML('beforeend', `<div class="row-divider"><span>First Class</span></div>`);
    for (let r = 1; r <= 2; r++) buildRow(r, "First");

    plane.insertAdjacentHTML('beforeend', `<div class="row-divider"><span>Business Class</span></div>`);
    for (let r = 3; r <= 5; r++) buildRow(r, "Business");

    plane.insertAdjacentHTML('beforeend', `<div class="row-divider"><span>Economy Class</span></div>`);
    for (let r = 6; r <= 15; r++) buildRow(r, "Economy");

    applyClassFilter();

  } catch (e) { console.error("Could not load seat map."); }
}

document.querySelectorAll('input[name="travel-class"]').forEach(radio => {
  radio.addEventListener('change', applyClassFilter);
});

function applyClassFilter() {
  const selectedClass = document.querySelector('input[name="travel-class"]:checked').value;
  document.getElementById('selected-seat-no').value = '';
  document.getElementById('book-btn').disabled = true;
  selectedSeatsArr = [];
  let availableInClass = 0;

  document.querySelectorAll('.seat').forEach(seat => {
    seat.classList.remove('selected');
    if (seat.dataset.class !== selectedClass) {
      seat.classList.add('wrong-class');
    } else {
      seat.classList.remove('wrong-class');
      if (!seat.classList.contains('occupied')) {
        availableInClass++;
      }
    }
  });

  const inventoryDisplay = document.getElementById('class-inventory-count');
  if (inventoryDisplay) {
    if (availableInClass === 0) {
      inventoryDisplay.innerHTML = `<span style="color: var(--error);">Sold Out</span>`;
    } else {
      inventoryDisplay.innerHTML = `<span style="color: var(--success);">${availableInClass} seats available in ${selectedClass} Class</span>`;
    }
  }
}

document.getElementById('book-btn').addEventListener('click', async () => {
  const className = document.querySelector('input[name="travel-class"]:checked').value;
  const seatNosArray = document.getElementById('selected-seat-no').value.split(',');

  const resultEl = document.getElementById('book-result');
  const btn = document.getElementById('book-btn');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Booking…';

  try {
    const res = await fetch(`${API}/bookings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token')
      },
      body: JSON.stringify({
        flight_id: currentFlightData,
        passenger_id: currentUser.id,
        seat_nos: seatNosArray,
        class_name: className,
        is_transit: false
      })
    });

    const text = await res.text();
    let msg;
    try { msg = JSON.parse(text); } catch { msg = text; }

    if (res.ok) {
      // THE FIX: Unwrap the ApiResponse for the booking payload
      const payload = msg.data || msg;
      const seatsString = seatNosArray.join(', ');
      showResult(resultEl, `🎉 Booking confirmed!<br>Ticket Number(s): <strong>${payload.ticket_nos ? payload.ticket_nos.join(', ') : payload.ticket_no}</strong><br>Seats: <strong>${seatsString}</strong>`, true);
      showToast('Flight booked successfully!', 'success');
      document.getElementById('seat-selection-container').classList.add('hidden');
    } else {
      const errMsg = msg.message || msg.error || 'Failed to book.';
      showResult(resultEl, `Error: ${errMsg}`, false);
      showToast('Booking failed.', 'error');
    }
  } catch (err) {
    showResult(resultEl, `Network error: ${err.message}`, false);
  } finally {
    btn.innerHTML = 'Confirm Booking';
  }
});

/* ═══════════════════════════════════════════
   PASSENGER: Check-In 
═══════════════════════════════════════════ */
document.getElementById('checkin-btn').addEventListener('click', async () => {
  const ticketNo = document.getElementById('checkin-ticket').value.trim();
  const bpEl = document.getElementById('boarding-pass');
  const btn = document.getElementById('checkin-btn');

  if (!ticketNo) { showToast('Please enter your ticket number.', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Processing…';
  bpEl.classList.add('hidden');

  try {
    const res = await fetch(`${API}/checkin/${encodeURIComponent(ticketNo)}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token') }
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = {}; }

    if (res.ok) {
      // THE FIX: Unwrap check-in payload
      const payload = data.data || data;
      renderBoardingPass(bpEl, payload, ticketNo);
      bpEl.classList.remove('hidden');
      showToast('Check-in successful!', 'success');
    } else {
      const errMsg = data.message || data.error || text;
      bpEl.classList.add('hidden');
      showResult(document.getElementById('boarding-pass'), `Check-in failed: ${errMsg}`, false);
      bpEl.classList.remove('hidden');
      showToast('Check-in failed.', 'error');
    }
  } catch (err) {
    bpEl.innerHTML = `<div class="result-area result-error">Network error: ${err.message}</div>`;
    bpEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Check In Now';
  }
});

async function renderBoardingPass(el, data, ticketNo) {
  let airportName = data.departure_airport || data.departureAirport || '—';

  try {
    const res = await fetch(`${API}/airports`);
    if (res.ok) {
      const airJson = await res.json();
      const airports = airJson.data || airJson.content || (Array.isArray(airJson) ? airJson : []);
      const found = airports.find(a => String(a.id || a.airport_id) === String(airportName));
      if (found) {
        airportName = found.name || found.airportName || found.city || airportName;
      }
    }
  } catch (e) {
    console.log("Could not fetch airport names for boarding pass");
  }

  el.innerHTML = `
    <div class="bp-header">
      <div>
        <div class="bp-airline">AeroNexus Airlines</div>
        <div class="bp-title">Boarding Pass</div>
      </div>
      <div class="bp-status-badge">✓ Checked In</div>
    </div>
    <hr class="bp-divider"/>
    <div class="bp-row">
      <div class="bp-field">
        <label>Ticket No.</label>
        <span>${escHtml(ticketNo)}</span>
      </div>
      <div class="bp-field">
        <label>Passenger</label>
        <span>${escHtml(data.passengerName || data.passenger_name || currentUser?.username || '—')}</span>
      </div>
    </div>
    <div class="bp-row">
      <div class="bp-field">
        <label>Flight</label>
        <span>${escHtml(String(data.flightId || data.flight_id || data.flightNo || data.flight_no || '—'))}</span>
      </div>
      <div class="bp-field">
        <label>Seat</label>
        <span>${escHtml(String(data.seat || data.seatNo || data.seat_no || 'TBA'))}</span>
      </div>
    </div>
    <div class="bp-row">
      <div class="bp-field">
        <label>Gate</label>
        <span>${escHtml(String(data.gate || data.departureGate || data.departure_gate || '—'))}</span>
      </div>
      <div class="bp-field">
        <label>Class</label>
        <span>${escHtml(data.travelClass || data.travel_class || data.className || data.class_name || '—')}</span>
      </div>
    </div>
    <hr class="bp-divider"/>
    <div class="bp-field">
      <label>Departure</label>
      <span>${escHtml(airportName)} at ${escHtml(String(data.departure_time || data.departureTime || '—'))}</span>
    </div>
  `;
}

/* ═══════════════════════════════════════════
   PASSENGER: Flight Status 
═══════════════════════════════════════════ */
async function initStatusView() {
  try {
    const res = await fetch(`${API}/airports`);
    const json = await res.json();
    const airports = json.data || json.content || (Array.isArray(json) ? json : []);

    let options = '<option value="">Select Airport...</option>';
    airports.forEach(a => {
      options += `<option value="${a.id || a.airport_id}">${escHtml(a.name || a.city || a.airport_id)}</option>`;
    });

    document.getElementById('status-origin').innerHTML = options;
    document.getElementById('status-dest').innerHTML = options;
  } catch (e) {
    console.log("Failed to load airports for status view.");
  }
}

['status-origin', 'status-dest'].forEach(id => {
  document.getElementById(id).addEventListener('change', async () => {
    const origin = document.getElementById('status-origin').value;
    const dest = document.getElementById('status-dest').value;
    const flightSelect = document.getElementById('status-flight-select');

    if (!origin || !dest) {
      flightSelect.innerHTML = '<option value="">Please select Origin and Destination first</option>';
      flightSelect.disabled = true;
      return;
    }

    flightSelect.innerHTML = '<option value="">Searching flights...</option>';
    flightSelect.disabled = true;

    try {
      const res = await fetch(`${API}/flights`);
      const json = await res.json();
      const flights = json.data || json.content || (Array.isArray(json) ? json : []);

      const availableFlights = flights.filter(f =>
        String(f.departure_airport_id) === String(origin) &&
        String(f.arrival_airport_id) === String(dest)
      );

      if (availableFlights.length === 0) {
        flightSelect.innerHTML = '<option value="">No flights scheduled for this route</option>';
      } else {
        let options = '<option value="">Select a Flight to Track...</option>';
        availableFlights.forEach(f => {
          options += `<option value="${f.flight_id}">Flight ${f.flight_id} - Departs: ${f.departure_time || 'TBA'}</option>`;
        });
        flightSelect.innerHTML = options;
        flightSelect.disabled = false;
      }
    } catch (e) {
      flightSelect.innerHTML = '<option value="">Error loading flights</option>';
    }
  });
});

document.getElementById('status-btn').addEventListener('click', async () => {
  const flightId = document.getElementById('status-flight-select').value;
  const resultEl = document.getElementById('flight-status-result');
  const btn = document.getElementById('status-btn');

  if (!flightId) { showToast('Please select a flight to track.', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Fetching…';
  resultEl.classList.add('hidden');

  try {
    const res = await fetch(`${API}/flights`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list = json.data || json.content || (Array.isArray(json) ? json : []);

    const flight = list.find(f => String(f.id || f.flightId || f.flight_id) === String(flightId));

    if (!flight) {
      resultEl.innerHTML = `<div class="result-area result-error">No flight found.</div>`;
    } else {

      let originName = flight.departure_airport_id;
      let destName = flight.arrival_airport_id;
      let airlineName = flight.airline_id;

      try {
        const airRes = await fetch(`${API}/airports`);
        const airJson = await airRes.json();
        const airports = airJson.data || airJson.content || (Array.isArray(airJson) ? airJson : []);

        const o = airports.find(a => String(a.id || a.airport_id) === String(flight.departure_airport_id));
        if (o) originName = o.name || o.airportName || o.city || originName;

        const d = airports.find(a => String(a.id || a.airport_id) === String(flight.arrival_airport_id));
        if (d) destName = d.name || d.airportName || d.city || destName;
      } catch (e) { console.log("Could not fetch airport names"); }

      try {
        const lineRes = await fetch(`${API}/airlines`);
        const lineJson = await lineRes.json();
        const airlines = lineJson.data || lineJson.content || (Array.isArray(lineJson) ? lineJson : []);

        const al = airlines.find(a => String(a.id || a.airline_id) === String(flight.airline_id));
        if (al) airlineName = al.name || al.airlineName || airlineName;
      } catch (e) { console.log("Could not fetch airline names"); }

      resultEl.innerHTML = `
        <div class="status-row">
          <div class="status-field">
            <label>Flight ID</label>
            <div class="status-val">${escHtml(String(flight.flight_id || flightId))}</div>
          </div>
          <div class="status-field">
            <label>Airline</label>
            <div class="status-val">✈️ ${escHtml(String(airlineName || '—'))}</div>
          </div>
        </div>
        <div class="status-row">
          <div class="status-field">
            <label>Departure Gate</label>
            <div class="status-val">🚪 ${escHtml(String(flight.departure_gate_id || '—'))}</div>
          </div>
          <div class="status-field">
            <label>Aircraft ID</label>
            <div class="status-val">🛫 ${escHtml(String(flight.aircraft_id || '—'))}</div>
          </div>
        </div>
        <div class="status-row">
          <div class="status-field">
            <label>Origin Airport</label>
            <div class="status-val">${escHtml(String(originName || '—'))}</div>
          </div>
          <div class="status-field">
            <label>Destination</label>
            <div class="status-val">${escHtml(String(destName || '—'))}</div>
          </div>
        </div>
        <div class="status-row">
          <div class="status-field">
            <label>Departure Time</label>
            <div class="status-val">${escHtml(String(flight.departure_time || '—'))}</div>
          </div>
          <div class="status-field">
            <label>Arrival Time</label>
            <div class="status-val">${escHtml(String(flight.arrival_time || '—'))}</div>
          </div>
        </div>
      `;
      showToast('Flight data loaded.', 'success');
    }
    resultEl.classList.remove('hidden');
  } catch (err) {
    resultEl.innerHTML = `<div class="result-area result-error">Error: ${err.message}</div>`;
    resultEl.classList.remove('hidden');
    showToast('Failed to fetch flights.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Track Flight';
  }
});

/* ═══════════════════════════════════════════
   STAFF: Baggage Drop 
═══════════════════════════════════════════ */
document.getElementById('bag-btn').addEventListener('click', async () => {
  const ticketNo = document.getElementById('bag-ticket').value.trim();
  const weight = document.getElementById('bag-weight').value.trim();
  const resultEl = document.getElementById('bag-result');
  const btn = document.getElementById('bag-btn');

  if (!ticketNo || !weight) { showToast('Please fill all fields.', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Processing…';

  try {
    const res = await fetch(`${API}/baggage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token')
      },
      body: JSON.stringify({ ticketNo, weight: parseFloat(weight) }),
    });
    const text = await res.text();
    let msg;
    try { msg = JSON.parse(text); } catch { msg = text; }

    if (res.ok) {
      showResult(resultEl, `🧳 Baggage processed!<br>Ticket: <strong>${escHtml(ticketNo)}</strong> | Weight: <strong>${weight} kg</strong>`, true);
      showToast('Baggage drop complete.', 'success');
    } else {
      const msgStr = (typeof msg === 'object') ? (msg.message || msg.error || JSON.stringify(msg)) : msg;
      showResult(resultEl, `Failed: ${msgStr}`, false);
      showToast('Baggage processing failed.', 'error');
    }
  } catch (err) {
    showResult(resultEl, `Network error: ${err.message}`, false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Process Baggage';
  }
});

/* ═══════════════════════════════════════════
   STAFF: Security Log 
═══════════════════════════════════════════ */
document.getElementById('sec-btn').addEventListener('click', async () => {
  const terminal = document.getElementById('sec-terminal').value;
  const report = document.getElementById('sec-report').value.trim();
  const resultEl = document.getElementById('sec-result');
  const btn = document.getElementById('sec-btn');

  if (!terminal || !report) { showToast('Please fill all fields.', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Submitting…';

  try {
    const res = await fetch(`${API}/security`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token')
      },
      body: JSON.stringify({
        terminal,
        report,
        staffId: currentUser.id,
        timestamp: new Date().toISOString(),
      }),
    });
    const text = await res.text();
    let msg;
    try { msg = JSON.parse(text); } catch { msg = text; }

    if (res.ok) {
      showResult(resultEl, `🔒 Incident report filed for <strong>${escHtml(terminal)}</strong>.`, true);
      document.getElementById('sec-report').value = '';
      showToast('Security report submitted.', 'success');
    } else {
      const msgStr = (typeof msg === 'object') ? (msg.message || msg.error || JSON.stringify(msg)) : msg;
      showResult(resultEl, `Failed: ${msgStr}`, false);
    }
  } catch (err) {
    showResult(resultEl, `Network error: ${err.message}`, false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Submit Report';
  }
});

/* ═══════════════════════════════════════════
   STAFF: Barcode Scanner 
═══════════════════════════════════════════ */
document.getElementById('scan-btn')?.addEventListener('click', async () => {
  const barcode = document.getElementById('scan-barcode').value.trim();
  const location = document.getElementById('scan-location').value.trim();
  const override = document.getElementById('scan-override').value;
  const resultEl = document.getElementById('scan-result');
  const btn = document.getElementById('scan-btn');

  if (!barcode || !location) { showToast('Barcode and Location are required.', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Scanning…';

  try {
    const res = await fetch(`${API}/baggage/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token')
      },
      body: JSON.stringify({
        barcode: barcode,
        staff_id: currentUser.id,
        location: location,
        override_status: override
      }),
    });

    const json = await res.json();

    if (res.ok) {
      // THE FIX: Unwrap the ApiResponse payload
      const data = json.data || json;

      showResult(resultEl, `
                <div style="display:flex; justify-content: space-between; align-items:center;">
                    <div>
                        <strong>✅ Scan Recorded</strong><br>
                        Barcode: <span style="font-family:monospace; color:var(--sky-light);">${data.barcode}</span><br>
                        Location: ${data.location}
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size: 0.8rem; color: var(--silver-dim);">Status Updated:</span><br>
                        <span style="text-decoration: line-through; color: var(--error);">${data.previous_status}</span> ➔ 
                        <span style="color: var(--success); font-weight:bold;">${data.new_status}</span>
                    </div>
                </div>
            `, true);

      document.getElementById('scan-barcode').value = '';
      document.getElementById('scan-barcode').focus();
    } else {
      showResult(resultEl, `❌ Scan Failed: ${json.message || json.error || 'Unknown error'}`, false);
    }
  } catch (err) {
    showResult(resultEl, `Network error: ${err.message}`, false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Record Scan';
  }
});

/* ═══════════════════════════════════════════
   STAFF: Maintenance Dashboard
═══════════════════════════════════════════ */
async function initMaintenanceView() {
  const grid = document.getElementById('maintenance-grid');
  grid.innerHTML = '<div class="skeleton-loader"></div><div class="skeleton-loader"></div>';

  try {
    const res = await fetch(`${API}/aircraft`, {
      headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token') }
    });
    if (!res.ok) throw new Error('Failed to load aircraft');

    const json = await res.json();
    // THE FIX: Unwrap the ApiResponse for fleet
    const fleet = json.data || json.content || (Array.isArray(json) ? json : []);

    if (!fleet.length) {
      grid.innerHTML = '<p style="color:var(--silver)">No aircraft found in the fleet.</p>';
      return;
    }

    grid.innerHTML = fleet.map(a => {
      const status = a.status || 'ACTIVE';
      let badgeColor = 'var(--success)';
      let icon = '✈️';
      if (status === 'GROUNDED') { badgeColor = 'var(--error)'; icon = '🛑'; }
      if (status === 'MAINTENANCE') { badgeColor = 'var(--warn)'; icon = '🔧'; }

      return `
                <div class="data-card" id="aircraft-card-${a.aircraft_id}">
                    <div class="card-icon">${icon}</div>
                    <h3>${escHtml(a.type)}</h3>
                    <div class="card-detail" style="font-family: monospace; letter-spacing: 1px;">${escHtml(a.registration_no)}</div>
                    
                    <div style="margin-top: 15px; display: flex; align-items: center; justify-content: space-between;">
                        <span style="background: ${badgeColor}; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
                            ${status}
                        </span>
                        
                        <select class="input-glass" style="width: auto; padding: 4px 8px; font-size: 0.8rem;" onchange="updateAircraftStatus(${a.aircraft_id}, this.value)">
                            <option value="">Change Status...</option>
                            <option value="ACTIVE">Mark ACTIVE</option>
                            <option value="MAINTENANCE">Send to MAINTENANCE</option>
                            <option value="GROUNDED">GROUND Aircraft</option>
                        </select>
                    </div>
                </div>
            `;
    }).join('');

  } catch (err) {
    grid.innerHTML = `<div class="result-area result-error">Network error loading fleet.</div>`;
  }
}

async function updateAircraftStatus(aircraftId, newStatus) {
  if (!newStatus) return;

  try {
    const res = await fetch(`${API}/aircraft/${aircraftId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token')
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      showToast(`Aircraft status updated to ${newStatus}`, 'success');
      initMaintenanceView();
    } else {
      showToast('Failed to update aircraft status', 'error');
    }
  } catch (err) {
    showToast('Network error while updating status', 'error');
  }
}

/* ═══════════════════════════════════════════
   ADMIN: Schedule Flight 
═══════════════════════════════════════════ */
async function initScheduleView() {
  try {
    const res = await fetch(`${API}/airlines`);
    const json = await res.json();
    const airlines = json.data || json.content || (Array.isArray(json) ? json : []);

    let options = '<option value="">Select Airline...</option>';
    airlines.forEach(a => {
      const code = a.iata_code || a.iataCode || a.name.substring(0, 2).toUpperCase();
      options += `<option value="${code}">${code} (${a.name})</option>`;
    });

    document.getElementById('sched-airline-code').innerHTML = options;
  } catch (err) {
    console.log("Could not load airlines for scheduler");
  }
}

document.getElementById('sched-btn').addEventListener('click', async () => {
  const airlineCode = document.getElementById('sched-airline-code').value;
  const routeNo = document.getElementById('sched-route-no').value.trim();
  const realFlightNumber = `${airlineCode}${routeNo}`;
  const aircraftId = document.getElementById('sched-aircraft-id').value.trim();
  const origin = document.getElementById('sched-origin').value.trim();
  const dest = document.getElementById('sched-dest').value.trim();
  const depart = document.getElementById('sched-depart').value;
  const arrive = document.getElementById('sched-arrive').value;
  const resultEl = document.getElementById('sched-result');
  const btn = document.getElementById('sched-btn');

  if (!airlineCode || !routeNo || !aircraftId || !origin || !dest || !depart) {
    showToast('Please fill all required fields.', 'error'); return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Scheduling…';

  try {
    const res = await fetch(`${API}/flights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token')
      },
      body: JSON.stringify({
        flight_number: realFlightNumber,
        aircraft_id: parseInt(aircraftId),
        origin: origin,
        destination: dest,
        departure_time: depart,
        arrival_time: arrive,
      }),
    });
    const text = await res.text();
    let msg;
    try { msg = JSON.parse(text); } catch { msg = text; }

    if (res.ok) {
      showResult(resultEl, `🗓️ Flight <strong>${escHtml(realFlightNumber)}</strong> scheduled successfully!`, true);
      showToast('Flight scheduled!', 'success');
      document.getElementById('sched-route-no').value = '';
    } else {
      const errMsg = (typeof msg === 'object') ? (msg.message || msg.error || JSON.stringify(msg)) : msg;
      showResult(resultEl, `Scheduling failed: ${errMsg}`, false);
    }
  } catch (err) {
    showResult(resultEl, `Network error: ${err.message}`, false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Schedule Flight';
  }
});

/* ═══════════════════════════════════════════
   ADMIN: Load Fleet 
═══════════════════════════════════════════ */
async function loadFleet() {
  const grid = document.getElementById('fleet-grid');
  grid.innerHTML = '<div class="skeleton-loader"></div><div class="skeleton-loader"></div><div class="skeleton-loader"></div>';
  try {
    const res = await fetch(`${API}/aircraft`, {
      headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token') }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    // THE FIX: Unwrap the ApiResponse for fleet
    const fleet = json.data || json.content || (Array.isArray(json) ? json : []);

    if (!fleet.length) {
      grid.innerHTML = '<p style="color:var(--silver)">No aircraft found.</p>';
      return;
    }

    grid.innerHTML = fleet.map(a => `
      <div class="data-card">
        <div class="card-icon">✈️</div>
        <h3>${escHtml(a.type || 'Aircraft')}</h3>
        <div class="card-detail">Tail No: ${escHtml(a.registration_no || '—')}</div>
        <div class="card-detail">ID: ${escHtml(String(a.aircraft_id || '—'))}</div>
        <div class="card-detail">Capacity: ${escHtml(String(a.number_of_seats || '—'))} seats</div>
        <div class="card-badge">Active</div>
      </div>
    `).join('');

  } catch (err) {
    grid.innerHTML = `<div class="result-area result-error">Failed to load fleet: ${err.message}</div>`;
  }
}

/* ═══════════════════════════════════════════
   ADMIN: Assign Staff Shift
═══════════════════════════════════════════ */
document.getElementById('assign-shift-btn')?.addEventListener('click', async () => {
  const staffId = document.getElementById('shift-staff-id').value;
  const role = document.getElementById('shift-role').value.trim();
  const start = document.getElementById('shift-start').value;
  const end = document.getElementById('shift-end').value;
  const resultEl = document.getElementById('shift-result');
  const btn = document.getElementById('assign-shift-btn');

  if (!staffId || !role || !start || !end) {
    showToast('All fields are required.', 'error');
    return;
  }

  if (new Date(start) >= new Date(end)) {
    showToast('End time must be after start time.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Assigning…';

  try {
    const res = await fetch(`${API}/shifts/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt_token')
      },
      body: JSON.stringify({
        staff_id: parseInt(staffId),
        role_assigned: role,
        start_time: start,
        end_time: end
      })
    });

    const data = await res.json();

    if (res.ok) {
      showResult(resultEl, `✅ ${data.message}`, true);
      showToast('Shift scheduled.', 'success');
      document.querySelectorAll('#view-roster input').forEach(i => i.value = '');
    } else {
      showResult(resultEl, `❌ ${data.message || data.error}`, false);
      showToast('Scheduling failed.', 'error');
    }
  } catch (err) {
    showResult(resultEl, `Network error: ${err.message}`, false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Assign Shift';
  }
});