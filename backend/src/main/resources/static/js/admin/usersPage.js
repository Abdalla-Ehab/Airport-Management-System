import { getPassengers, updatePassenger, deletePassenger, getStaff, updateStaff, deleteStaff } from '../api/userApi.js';
import { escHtml } from '../shared/helpers.js';
import { showToast } from '../shared/toast.js';

let passengersCache = [];
let staffCache = [];

export async function initUsersPage() {
    try {
        const [passengers, staff] = await Promise.all([
            getPassengers(),
            getStaff()
        ]);
        
        passengersCache = passengers || [];
        staffCache = staff || [];
        
        renderUsers(passengersCache, staffCache);
        setupUserModal();
        setupFilters();
        
    } catch (err) {
        console.error(err);
        showToast('Failed to load users', 'error');
    }
}

function setupFilters() {
    const searchInput = document.getElementById('user-search');
    const roleFilter = document.getElementById('user-role-filter');

    if (searchInput) {
        searchInput.oninput = () => applyFilters();
    }
    if (roleFilter) {
        roleFilter.onchange = () => applyFilters();
    }
}

function applyFilters() {
    const query = document.getElementById('user-search').value.toLowerCase();
    const role = document.getElementById('user-role-filter').value;

    let filteredPassengers = passengersCache.filter(p => 
        (p.firstName?.toLowerCase().includes(query) || 
         p.lastName?.toLowerCase().includes(query) || 
         p.email?.toLowerCase().includes(query))
    );

    let filteredStaff = staffCache.filter(s => 
        (s.first_name?.toLowerCase().includes(query) || 
         s.last_name?.toLowerCase().includes(query) || 
         s.email?.toLowerCase().includes(query))
    );

    if (role === 'staff') {
        renderUsers([], filteredStaff);
    } else if (role === 'passenger') {
        renderUsers(filteredPassengers, []);
    } else {
        renderUsers(filteredPassengers, filteredStaff);
    }
}

function renderUsers(passengers, staff) {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    const allUsers = [
        ...(passengers || []).map(p => ({ ...p, _type: 'passenger' })),
        ...(staff || []).map(s => ({ ...s, _type: 'staff' }))
    ];

    if (!allUsers.length) {
        tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">No Users Found</div></td></tr>`;
        return;
    }

    allUsers.forEach(u => {
        const tr = document.createElement('tr');
        
        const firstName = u.firstName || u.first_name || 'N/A';
        const lastName = u.lastName || u.last_name || 'N/A';
        const phone = u.phoneNumber || u.phone_number || 'N/A';
        const role = u._type === 'staff' ? (u.role || 'STAFF') : 'PASSENGER';
        const id = u._type === 'staff' ? u.staff_id : u.passengerId;
        
        tr.innerHTML = `
            <td><strong>${escHtml(firstName)} ${escHtml(lastName)}</strong></td>
            <td><span class="badge ${u._type === 'staff' ? 'badge-primary' : 'badge-secondary'}">${escHtml(role)}</span></td>
            <td>${escHtml(u.email || 'N/A')}</td>
            <td>
                <div class="management-actions">
                    <button class="btn btn-secondary btn-sm edit-user-btn" data-id="${id}" data-type="${u._type}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-user-btn" data-id="${id}" data-type="${u._type}">Delete</button>
                </div>
            </td>
        `;

        tr.querySelector('.edit-user-btn').onclick = () => openUserModal(u);
        tr.querySelector('.delete-user-btn').onclick = () => handleDeleteUser(id, u._type);

        tbody.appendChild(tr);
    });
}

function setupUserModal() {
    const modal = document.getElementById('user-modal');
    const closeBtn = document.getElementById('close-user-modal');
    const saveBtn = document.getElementById('save-user-btn');
    
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('active');
    }

    const addStaffBtn = document.getElementById('open-user-modal');
    if (addStaffBtn) {
        addStaffBtn.onclick = () => {
            const title = document.getElementById('user-modal-title');
            if (title) title.textContent = 'Add New Staff';
            
            document.getElementById('user-id').value = '';
            document.getElementById('user-type').value = 'staff';
            document.getElementById('user-first-name').value = '';
            document.getElementById('user-last-name').value = '';
            document.getElementById('user-email').value = '';
            document.getElementById('user-phone').value = '';
            document.getElementById('user-role').value = 'STAFF';
            document.getElementById('user-role-group').style.display = 'block';
            document.getElementById('user-passport-group').style.display = 'none';
            modal.classList.add('active');
        };
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const id = document.getElementById('user-id').value;
            const type = document.getElementById('user-type').value;
            
            if (!id) {
                const email = document.getElementById('user-email').value || '';
                const payload = {
                    username: email.split('@')[0] || ('staff_' + Math.floor(Math.random() * 1000)),
                    password: 'password123',
                    first_name: document.getElementById('user-first-name').value,
                    last_name: document.getElementById('user-last-name').value,
                    email: email,
                    phone_number: document.getElementById('user-phone').value,
                    dept_id: 1,
                    role: document.getElementById('user-role').value
                };
                try {
                    const { apiRequest } = await import('../api/apiClient.js');
                    await apiRequest('/auth/register/staff', { method: 'POST', body: JSON.stringify(payload) });
                    showToast('Staff added successfully', 'success');
                    modal.classList.remove('active');
                    initUsersPage();
                } catch (err) {
                    showToast(err.message || 'Failed to add staff', 'error');
                }
                return;
            }

            const payload = {
                email: document.getElementById('user-email').value,
                role: document.getElementById('user-role').value
            };

            if (type === 'staff') {
                payload.first_name = document.getElementById('user-first-name').value;
                payload.last_name = document.getElementById('user-last-name').value;
                payload.phone_number = document.getElementById('user-phone').value;
                
                try {
                    await updateStaff(id, payload);
                    showToast('Staff updated successfully', 'success');
                    modal.classList.remove('active');
                    initUsersPage();
                } catch (err) {
                    showToast(err.message || 'Failed to update staff', 'error');
                }
            } else {
                payload.firstName = document.getElementById('user-first-name').value;
                payload.lastName = document.getElementById('user-last-name').value;
                payload.phoneNumber = document.getElementById('user-phone').value;
                payload.passportNo = document.getElementById('user-passport').value;
                
                try {
                    await updatePassenger(id, payload);
                    showToast('Passenger updated successfully', 'success');
                    modal.classList.remove('active');
                    initUsersPage();
                } catch (err) {
                    showToast(err.message || 'Failed to update passenger', 'error');
                }
            }
        };
    }
}

function openUserModal(user) {
    const modal = document.getElementById('user-modal');
    const title = document.getElementById('user-modal-title');
    if (title) title.textContent = 'Edit User';
    
    const id = user._type === 'staff' ? user.staff_id : user.passengerId;
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    const phone = user.phoneNumber || user.phone_number || '';
    
    document.getElementById('user-id').value = id;
    document.getElementById('user-type').value = user._type;
    document.getElementById('user-first-name').value = firstName;
    document.getElementById('user-last-name').value = lastName;
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('user-phone').value = phone;
    
    const roleGroup = document.getElementById('user-role-group');
    const passportGroup = document.getElementById('user-passport-group');
    
    if (user._type === 'staff') {
        roleGroup.style.display = 'block';
        passportGroup.style.display = 'none';
        document.getElementById('user-role').value = user.role || 'STAFF';
    } else {
        roleGroup.style.display = 'none';
        passportGroup.style.display = 'block';
        document.getElementById('user-passport').value = user.passportNo || '';
    }

    modal.classList.add('active');
}

async function handleDeleteUser(id, type) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
        if (type === 'staff') {
            await deleteStaff(id);
        } else {
            await deletePassenger(id);
        }
        showToast('User deleted successfully', 'success');
        initUsersPage();
    } catch (err) {
        showToast(err.message || 'Failed to delete user', 'error');
    }
}
