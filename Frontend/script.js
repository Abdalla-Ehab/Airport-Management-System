/* =============================================
   AERONEXUS — AIRPORT MANAGEMENT SYSTEM
   SPA Router + API Layer + UI Logic
   ============================================= */

'use strict';

const API = 'http://localhost:8080/api';

/* ── STATE ── */
let currentUser = null;  // { username, role, id }
// Lock the date picker to only allow today or past dates
document.getElementById('reg-dob').max = new Date().toISOString().split("T")[0];

/* ═══════════════════════════════════════════
   ROLE DEFINITIONS & NAV CONFIG (UPDATED)
═══════════════════════════════════════════ */
const NAV_CONFIG = {
  passenger: [
    {
      category: 'My Travel', icon: '✈️',
      items: [
        { view: 'book', label: 'Book a Flight', onEnter: initBookingView },
        { view: 'status', label: 'Flight Status', onEnter: initStatusView },
        { view: 'history', label: 'Flight History' } // Placeholder for future
      ]
    },
    {
      category: 'Airport Services', icon: '🏢',
      items: [
        { view: 'home', label: 'Airports Network', onEnter: loadAirports },
        { view: 'checkin', label: 'Check-In Kiosk' },
        { view: 'dutyfree', label: 'Duty-Free Shops' } // Placeholder for future
      ]
    }
  ],
  staff: [
    {
      category: 'Ground Ops', icon: '🦺',
      items: [
        { view: 'baggage', label: 'Baggage Drop' },
        { view: 'gate', label: 'Gate Management' } // Placeholder for future
      ]
    },
    {
      category: 'Terminal Security', icon: '🛡️',
      items: [
        { view: 'security', label: 'Incident Logs' },
        { view: 'watchlist', label: 'Passenger Watchlist' } // Placeholder for future
      ]
    }
  ],
  admin: [
    {
      category: 'Flight Operations', icon: '🌍',
      items: [
        { view: 'schedule', label: 'Master Scheduler', onEnter:initScheduleView },
        { view: 'active-flights', label: 'Live Traffic Map' } // Placeholder for future
      ]
    },
    {
      category: 'Asset Management', icon: '🔧',
      items: [
        { view: 'fleet', label: 'Fleet & Aircraft', onEnter: loadFleet },
        { view: 'maintenance', label: 'Maintenance Logs' } // Placeholder for future
      ]
    },
    {
      category: 'Human Resources', icon: '👥',
      items: [
        { view: 'add-staff', label: 'Hire Employee' },
        { view: 'roster', label: 'Staff Roster' } // Placeholder for future
      ]
    }
  ]
};

/* ═══════════════════════════════════════════
   AUTHENTICATION & REGISTRATION LOGIC
═══════════════════════════════════════════ */

// Toggle between Login and Register tabs
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

// REAL LOGIN (Checks database)
async function authenticate(username, password) {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      return await res.json(); // Expects Spring Boot to return { id, username, role }
    }
  } catch (err) {
    console.error("Database connection failed", err);
  }
  return null;
}

// PASSENGER REGISTRATION
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

  // 1. ADDED dob and passport to the validation check
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
        firstName: fn,
        lastName: ln,
        email: email,
        phone: phone,
        dob: dob,             // 2. ADDED DOB HERE
        passportNo: passport, // 2. ADDED PASSPORT HERE
        username: username,
        password: password
      })
    });

    if (res.ok) {
      showToast('Account created! You can now log in.', 'success');
      document.getElementById('tab-login').click(); // Switch back to login

      // 3. Clear ALL fields including dob and passport
      document.getElementById('reg-firstname').value = '';
      document.getElementById('reg-lastname').value = '';
      document.getElementById('reg-email').value = '';
      document.getElementById('reg-phone').value = '';
      document.getElementById('reg-dob').value = '';
      document.getElementById('reg-passport').value = '';
      document.getElementById('reg-username').value = '';
      document.getElementById('reg-password').value = '';
    } else {
      errEl.textContent = 'Registration failed. Username or Email might already exist.';
      errEl.classList.remove('hidden');
    }
  } catch (err) {
    errEl.textContent = 'Server error.';
    errEl.classList.remove('hidden');
  }
});

// ADMIN: ADD STAFF
document.getElementById('add-staff-btn')?.addEventListener('click', async () => {
  const fn = document.getElementById('staff-fn').value.trim();
  const ln = document.getElementById('staff-ln').value.trim();
  const email = document.getElementById('staff-email').value.trim();
  const phone = document.getElementById('staff-phone').value.trim();
  const role = document.getElementById('staff-role').value;
  const username = document.getElementById('staff-username').value.trim();
  const password = document.getElementById('staff-password').value.trim();
  const resultEl = document.getElementById('add-staff-result');

  if (!fn || !username || !password) {
    showResult(resultEl, `⚠️ Please fill in all required fields.`, false);
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: fn,
        lastName: ln,
        email: email,
        phone: phone,
        role: role,
        username: username,
        password: password
      })
    });
    if (res.ok) {
      showResult(resultEl, `✅ Staff account '${username}' created successfully as ${role}!`, true);
      // Clear fields
      document.getElementById('staff-fn').value = '';
      document.getElementById('staff-ln').value = '';
      document.getElementById('staff-email').value = '';
      document.getElementById('staff-phone').value = '';
      document.getElementById('staff-username').value = '';
      document.getElementById('staff-password').value = '';
    } else {
      showResult(resultEl, `❌ Failed to create staff account.`, false);
    }
  } catch (err) {
    showResult(resultEl, `⚠️ Network error.`, false);
  }
});


/* ═══════════════════════════════════════════
   ROUTER (UPDATED FOR DROPDOWNS)
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
    // If we click a placeholder menu item that doesn't have HTML yet, show a dummy view
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

  // Trigger onEnter logic if it exists
  let foundItem = null;
  const categories = NAV_CONFIG[currentUser?.role] || [];
  categories.forEach(cat => {
    const match = cat.items.find(i => i.view === viewId);
    if (match) foundItem = match;
  });
  
  if (foundItem?.onEnter) foundItem.onEnter();
}

/* ═══════════════════════════════════════════
   BUILD SIDEBAR NAV (UPDATED FOR ACCORDIONS)
═══════════════════════════════════════════ */
function buildNav(role) {
  const ul = document.getElementById('nav-links');
  ul.innerHTML = '';
  const categories = NAV_CONFIG[role] || [];

  categories.forEach((cat, index) => {
    const li = document.createElement('li');
    li.className = 'nav-category';
    
    // Category Header
    const header = document.createElement('div');
    header.className = 'nav-category-header';
    header.innerHTML = `<div class="nav-category-title"><span class="nav-icon">${cat.icon}</span>${cat.category}</div> <span class="nav-arrow">▾</span>`;
    
    // Submenu Items
    const submenu = document.createElement('ul');
    submenu.className = 'nav-submenu';
    
    // Open the first accordion by default
    if (index === 0) {
        submenu.classList.add('open');
        header.querySelector('.nav-arrow').style.transform = 'rotate(180deg)';
    }

    // Toggle dropdown logic
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

      // Auto-load first screen on login
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
  const errEl = document.getElementById('auth-error'); // Updated to use the correct error div
  const btn = document.getElementById('login-btn');

  if (!username || !password) {
    errEl.textContent = 'Please enter your username and password.';
    errEl.classList.remove('hidden');
    return;
  }

  // 1. Set Loading State
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Authenticating…';
  errEl.classList.add('hidden');

  try {
    // 2. Await the server response
    const user = await authenticate(username, password);

    // 3. Reset Button State immediately after response
    btn.disabled = false;
    btn.innerHTML = 'Sign In';

    if (!user) {
      errEl.textContent = 'Invalid credentials. Please try again.';
      errEl.classList.remove('hidden');
      return;
    }

    currentUser = user;

    // 4. Safely Update UI (Added checks to prevent crashes if name is missing)
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
    // MASTER CATCH: If anything crashes, reset the button!
    console.error("Login UI Error:", error);
    btn.disabled = false;
    btn.innerHTML = 'Sign In';
    errEl.textContent = 'A system error occurred. Check the console.';
    errEl.classList.remove('hidden');
  }
});

// Allow Enter key on login form
['login-username', 'login-password'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('login-btn').click();
  });
});

/* ═══════════════════════════════════════════
   LOGOUT
═══════════════════════════════════════════ */
document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  document.getElementById('app-shell').style.display = 'none';
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').classList.add('hidden');
  showToast('Signed out successfully.', 'info');
});

/* ═══════════════════════════════════════════
   TOAST NOTIFICATIONS
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

/* ═══════════════════════════════════════════
   SHARED: Show result in a result-area div
═══════════════════════════════════════════ */
function showResult(el, message, isSuccess) {
  el.className = `result-area ${isSuccess ? 'result-success' : 'result-error'}`;
  el.innerHTML = message;
  el.classList.remove('hidden');
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
    const airports = Array.isArray(data) ? data : (data.content || data.data || []);

    if (!airports.length) {
      grid.innerHTML = '<p style="color:var(--silver)">No airports found.</p>';
      return;
    }

    grid.innerHTML = airports.map(a => {
      // 1. Safely grab the country 
      const country = a.country ? `, ${a.country}` : '';

      // 2. Map all possible names for the Airport name
      const name = a.airport_name || a.airportName || a.name || 'Airport';

      // 3. Map the city
      const city = a.city || a.location || 'Unknown City';

      // 4. Create a safe Google Maps search URL
      const searchQuery = encodeURIComponent(`${name} ${city}`);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

      // Return the HTML card (Now an interactive button!)
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
    showToast('Could not fetch airport data.', 'error');
  }
}

/* ═══════════════════════════════════════════
   PASSENGER: Book a Flight (TRANSIT + SEAT MAP)
═══════════════════════════════════════════ */
let currentFlightData = null; // Stores currently selected flight(s)

// 1. Load Airports
async function initBookingView() {
  try {
    const res = await fetch(`${API}/airports`);
    const airports = await res.json();
    let options = '<option value="">Select Airport...</option>';
    airports.forEach(a => {
      options += `<option value="${a.id || a.airport_id}">${escHtml(a.name || a.city)}</option>`;
    });
    document.getElementById('book-origin').innerHTML = options;
    document.getElementById('book-dest').innerHTML = options;
  } catch (e) { console.log("Failed to load airports."); }
}

// 2. Search Direct AND Transit Flights
['book-origin', 'book-dest'].forEach(id => {
  document.getElementById('book-origin').addEventListener('change', searchFlights);
  document.getElementById('book-dest').addEventListener('change', searchFlights);
});

async function searchFlights() {
  const origin = document.getElementById('book-origin').value;
  const dest = document.getElementById('book-dest').value;
  const select = document.getElementById('book-flight-select');
  document.getElementById('seat-selection-container').classList.add('hidden');
  document.getElementById('book-btn').disabled = true;

  if (!origin || !dest) return;
  select.innerHTML = '<option value="">Searching routes...</option>';
  select.disabled = true;

  try {
    const res = await fetch(`${API}/flights`);
    const allFlights = await res.json();

    // 1. Find Direct Flights
    const directFlights = allFlights.filter(f => String(f.departure_airport_id) === origin && String(f.arrival_airport_id) === dest);
    
    // 2. Find 1-Stop Transit Flights
    const leg1 = allFlights.filter(f => String(f.departure_airport_id) === origin);
    const leg2 = allFlights.filter(f => String(f.arrival_airport_id) === dest);
    let transitFlights = [];
    
    leg1.forEach(f1 => {
        leg2.forEach(f2 => {
            // If Leg1 arrives where Leg2 departs
            if (String(f1.arrival_airport_id) === String(f2.departure_airport_id)) {
                // Ensure layover is logical (Leg 1 arrives before Leg 2 departs)
                const arr = new Date(f1.arrival_time);
                const dep = new Date(f2.departure_time);
                if (arr < dep) {
                    transitFlights.push({ leg1: f1, leg2: f2, layoverAt: f1.arrival_airport_id });
                }
            }
        });
    });

    if (directFlights.length === 0 && transitFlights.length === 0) {
      select.innerHTML = '<option value="">No routes available</option>';
      return;
    }

    let options = '<option value="">Select a Route...</option>';
    
    // Add Direct Options
    directFlights.forEach(f => {
      const fn = f.flight_number || f.flight_id;
      options += `<option value='{"type":"direct", "f1":${f.flight_id}}'>✅ DIRECT: ${fn} | Departs: ${f.departure_time}</option>`;
    });

    // Add Transit Options
    transitFlights.forEach(t => {
      const fn1 = t.leg1.flight_number || t.leg1.flight_id;
      const fn2 = t.leg2.flight_number || t.leg2.flight_id;
      options += `<option value='{"type":"transit", "f1":${t.leg1.flight_id}, "f2":${t.leg2.flight_id}}'>🔄 1-STOP: ${fn1} ➔ ${fn2} | Departs: ${t.leg1.departure_time}</option>`;
    });

    select.innerHTML = options;
    select.disabled = false;
  } catch (e) {
    select.innerHTML = '<option value="">Error finding routes</option>';
  }
}

// 3. When a Route is Selected -> Render Airplane!
document.getElementById('book-flight-select').addEventListener('change', async (e) => {
    if(!e.target.value) {
        document.getElementById('seat-selection-container').classList.add('hidden');
        document.getElementById('book-btn').disabled = true;
        return;
    }

    currentFlightData = JSON.parse(e.target.value);
    document.getElementById('selected-seat-no').value = '';
    document.getElementById('selected-seat-no-leg2').value = '';
    
    const seatContainer = document.getElementById('seat-selection-container');
    const plane = document.getElementById('plane-seats');
    
    plane.innerHTML = '<div class="plane-cockpit">Front of Aircraft</div>';
    seatContainer.classList.remove('hidden');
    document.getElementById('book-btn').disabled = true; // Wait for seat selection

    // We will render the seat map for the FIRST flight. 
    // (If it's transit, we'll auto-assign leg 2 to keep the UI from becoming chaotic)
    try {
        const res = await fetch(`${API}/flights/${currentFlightData.f1}/seats`);
        let occupiedSeats = [];
        if(res.ok) occupiedSeats = await res.json();

        // Generate 15 Rows of 6 Seats (90 seats total for visual)
        const rows = 15; 
        const letters = ['A','B','C','D','E','F'];

        for(let r=1; r<=rows; r++) {
            let rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';
            
            letters.forEach((col, index) => {
                const seatId = `${r}${col}`;
                const isOccupied = occupiedSeats.includes(seatId);
                
                let seat = document.createElement('div');
                seat.className = `seat ${isOccupied ? 'occupied' : 'available'}`;
                seat.textContent = isOccupied ? '' : seatId;
                seat.dataset.id = seatId;
                
                if(!isOccupied) {
                    seat.addEventListener('click', () => {
                        // Deselect all others
                        document.querySelectorAll('.seat').forEach(s => s.classList.remove('selected'));
                        seat.classList.add('selected');
                        document.getElementById('selected-seat-no').value = seatId;
                        
                        // If transit, generate a random seat for the second flight
                        if(currentFlightData.type === 'transit') {
                             document.getElementById('selected-seat-no-leg2').value = `${Math.floor(Math.random()*15)+1}C`;
                        }
                        
                        document.getElementById('book-btn').disabled = false; // Enable booking!
                    });
                }
                
                rowDiv.appendChild(seat);
                
                // Add Aisle in the middle
                if(index === 2) {
                    let aisle = document.createElement('div');
                    aisle.className = 'aisle';
                    aisle.textContent = r;
                    rowDiv.appendChild(aisle);
                }
            });
            plane.appendChild(rowDiv);
        }
    } catch(e) {
        console.error("Could not load seat map.");
    }
});

// 4. Submit Booking(s) to the Database
document.getElementById('book-btn').addEventListener('click', async () => {
  const className = document.querySelector('input[name="travel-class"]:checked')?.value;
  const seat1 = document.getElementById('selected-seat-no').value;
  const seat2 = document.getElementById('selected-seat-no-leg2').value;
  const resultEl = document.getElementById('book-result');
  const btn = document.getElementById('book-btn');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Booking…';

  try {
    // Helper function to post a single booking
    const postBooking = async (f_id, seat, isTransitFlag) => {
        return await fetch(`${API}/bookings/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                flight_id: f_id,
                passenger_id: currentUser.id,
                seat_no: seat,
                class_name: className,
                is_transit: isTransitFlag // Sets the DB boolean we defined earlier!
            })
        });
    };

    if(currentFlightData.type === 'direct') {
        const res = await postBooking(currentFlightData.f1, seat1, false);
        if(res.ok) {
            showResult(resultEl, `🎉 Booking confirmed!<br>Seat: <strong>${seat1}</strong><br>Class: ${className}`, true);
        } else throw new Error("Booking failed. Seat might have been taken.");
        
    } else if (currentFlightData.type === 'transit') {
        // Book Leg 1
        const res1 = await postBooking(currentFlightData.f1, seat1, true);
        if(!res1.ok) throw new Error("Failed to book first leg.");
        
        // Book Leg 2
        const res2 = await postBooking(currentFlightData.f2, seat2, true);
        if(!res2.ok) throw new Error("Failed to book connecting leg.");

        showResult(resultEl, `🎉 Transit Journey Confirmed!<br>Leg 1 Seat: <strong>${seat1}</strong><br>Leg 2 Seat: <strong>${seat2}</strong>`, true);
    }

    showToast('Flight booked successfully!', 'success');
    document.getElementById('seat-selection-container').classList.add('hidden');
    document.getElementById('book-flight-select').value = '';

  } catch (err) {
    showResult(resultEl, `Error: ${err.message}`, false);
    showToast('Booking error.', 'error');
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
    const res = await fetch(`${API}/checkin/${encodeURIComponent(ticketNo)}`, { method: 'POST' });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = {}; }

    if (res.ok) {
      renderBoardingPass(bpEl, data, ticketNo);
      bpEl.classList.remove('hidden');
      showToast('Check-in successful! Boarding pass ready.', 'success');
    } else {
      const errMsg = (typeof data === 'object') ? (data.message || data.error || text) : text;
      bpEl.classList.add('hidden');
      showResult(document.getElementById('boarding-pass'), `Check-in failed: ${errMsg}`, false);
      bpEl.classList.remove('hidden');
      showToast('Check-in failed.', 'error');
    }
  } catch (err) {
    bpEl.innerHTML = `<div class="result-area result-error">Network error: ${err.message}</div>`;
    bpEl.classList.remove('hidden');
    showToast('Network error during check-in.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Check In Now';
  }
});

async function renderBoardingPass(el, data, ticketNo) {
  // 1. Start with the raw Airport ID (just in case the lookup fails)
  let airportName = data.departure_airport || data.departureAirport || '—';

  // 2. SMART LOOKUP: Ask the server for the real Airport Name
  try {
    const res = await fetch(`${API}/airports`);
    if (res.ok) {
      const airData = await res.json();
      const airports = Array.isArray(airData) ? airData : (airData.content || airData.data || []);
      // Find the airport that matches our ID
      const found = airports.find(a => String(a.id || a.airport_id) === String(airportName));
      if (found) {
        airportName = found.name || found.airportName || found.city || airportName;
      }
    }
  } catch (e) {
    console.log("Could not fetch airport names for boarding pass");
  }

  // 3. Render the final Boarding Pass HTML
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

// 1. Load Airports into the Status Dropdowns
async function initStatusView() {
    try {
        const res = await fetch(`${API}/airports`);
        const data = await res.json();
        const airports = Array.isArray(data) ? data : (data.content || data.data || []);
        
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

// 2. Listen for route changes to find available flights
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
            const data = await res.json();
            const flights = Array.isArray(data) ? data : (data.content || data.data || []);

            // Filter flights for this specific route
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

// 3. Track the selected flight!
document.getElementById('status-btn').addEventListener('click', async () => {
  // Grab the ID from the new dropdown instead of a text box!
  const flightId = document.getElementById('status-flight-select').value;
  const resultEl = document.getElementById('flight-status-result');
  const btn      = document.getElementById('status-btn');

  if (!flightId) { showToast('Please select a flight to track.', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Fetching…';
  resultEl.classList.add('hidden');

  try {
    const res   = await fetch(`${API}/flights`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const all   = await res.json();
    const list  = Array.isArray(all) ? all : (all.content || all.data || []);
    
    const flight = list.find(f => String(f.id || f.flightId || f.flight_id) === String(flightId));

    if (!flight) {
      resultEl.innerHTML = `<div class="result-area result-error">No flight found.</div>`;
    } else {
      
      // --- SMART DATA LOOKUP (Kept intact!) ---
      let originName = flight.departure_airport_id;
      let destName = flight.arrival_airport_id;
      let airlineName = flight.airline_id;

      try {
          const airRes = await fetch(`${API}/airports`);
          const airData = await airRes.json();
          const airports = Array.isArray(airData) ? airData : (airData.content || airData.data || []);
          
          const o = airports.find(a => String(a.id || a.airport_id) === String(flight.departure_airport_id));
          if (o) originName = o.name || o.airportName || o.city || originName;

          const d = airports.find(a => String(a.id || a.airport_id) === String(flight.arrival_airport_id));
          if (d) destName = d.name || d.airportName || d.city || destName;
      } catch(e) { console.log("Could not fetch airport names"); }

      try {
          const lineRes = await fetch(`${API}/airlines`);
          const lineData = await lineRes.json();
          const airlines = Array.isArray(lineData) ? lineData : (lineData.content || lineData.data || []);
          
          const al = airlines.find(a => String(a.id || a.airline_id) === String(flight.airline_id));
          if (al) airlineName = al.name || al.airlineName || airlineName;
      } catch(e) { console.log("Could not fetch airline names"); }
      // -------------------------

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketNo, weight: parseFloat(weight) }),
    });
    const text = await res.text();
    let msg;
    try { msg = JSON.parse(text); } catch { msg = text; }
    const msgStr = (typeof msg === 'object') ? (msg.message || JSON.stringify(msg)) : msg;
    if (res.ok) {
      showResult(resultEl, `🧳 Baggage processed!<br>Ticket: <strong>${escHtml(ticketNo)}</strong> | Weight: <strong>${weight} kg</strong>`, true);
      showToast('Baggage drop complete.', 'success');
    } else {
      showResult(resultEl, `Failed: ${msgStr}`, false);
      showToast('Baggage processing failed.', 'error');
    }
  } catch (err) {
    showResult(resultEl, `Network error: ${err.message}`, false);
    showToast('Network error.', 'error');
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
      headers: { 'Content-Type': 'application/json' },
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
    const msgStr = (typeof msg === 'object') ? (msg.message || JSON.stringify(msg)) : msg;
    if (res.ok) {
      showResult(resultEl, `🔒 Incident report filed for <strong>${escHtml(terminal)}</strong>.`, true);
      document.getElementById('sec-report').value = '';
      showToast('Security report submitted.', 'success');
    } else {
      showResult(resultEl, `Failed: ${msgStr}`, false);
      showToast('Report submission failed.', 'error');
    }
  } catch (err) {
    showResult(resultEl, `Network error: ${err.message}`, false);
    showToast('Network error.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Submit Report';
  }
});

/* ═══════════════════════════════════════════
   ADMIN: Schedule Flight
═══════════════════════════════════════════ */
// 1. Load Airlines into the Dropdown
async function initScheduleView() {
  try {
    const res = await fetch(`${API}/airlines`);
    const data = await res.json();
    const airlines = Array.isArray(data) ? data : (data.content || data.data || []);
    
    let options = '<option value="">Select Airline...</option>';
    airlines.forEach(a => {
      // Smart Fallback: If your database doesn't have an official 2-letter iata_code yet, 
      // this automatically generates one from the first 2 letters of the airline's name!
      const code = a.iata_code || a.iataCode || a.name.substring(0, 2).toUpperCase();
      options += `<option value="${code}">${code} (${a.name})</option>`;
    });
    
    document.getElementById('sched-airline-code').innerHTML = options;
  } catch (err) {
    console.log("Could not load airlines for scheduler");
  }
}
// 2. Schedule the Flight!
document.getElementById('sched-btn').addEventListener('click', async () => {
  // Grab the split inputs
  const airlineCode = document.getElementById('sched-airline-code').value;
  const routeNo = document.getElementById('sched-route-no').value.trim();
  
  // THE MAGIC: Stitch them together to make a real-world flight number! (e.g., EK + 201 = EK201)
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flight_number: realFlightNumber, // Send the newly combined real-world number!
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
      
      // Clear the route number so they can schedule the next one quickly
      document.getElementById('sched-route-no').value = '';
    } else {
      const errMsg = (typeof msg === 'object') ? (msg.message || msg.error || JSON.stringify(msg)) : msg;
      showResult(resultEl, `Scheduling failed: ${errMsg}`, false);
      showToast('Failed to schedule flight.', 'error');
    }
  } catch (err) {
    showResult(resultEl, `Network error: ${err.message}`, false);
    showToast('Network error.', 'error');
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
    const res = await fetch(`${API}/aircraft`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const fleet = Array.isArray(data) ? data : (data.content || data.data || []);
    
    if (!fleet.length) {
      grid.innerHTML = '<p style="color:var(--silver)">No aircraft found.</p>';
      return;
    }
    
    // THE FIX: Updated property names to match the Spring Boot backend perfectly
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
    showToast('Could not fetch fleet data.', 'error');
  }
}

/* ═══════════════════════════════════════════
   SECURITY: HTML Escape
═══════════════════════════════════════════ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}