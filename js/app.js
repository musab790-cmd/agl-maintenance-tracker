/* ===========================
   AGL Maintenance Tracker
   Main Application JavaScript
   =========================== */

// Global State
const state = {
    records: [],
    filteredRecords: [],
    currentPage: 1,
    recordsPerPage: 10,
    currentView: 'dashboard',
    currentSort: { field: null, direction: 'asc' },
    editingRecord: null,
    charts: {}
};

// API Configuration
const API_BASE = 'tables/maintenance_records';

/* ===========================
   Initialization
   =========================== */
document.addEventListener('DOMContentLoaded', async () => {
    initializeEventListeners();
    await loadRecords();
    renderDashboard();
    renderMaintenanceView();
});

/* ===========================
   Event Listeners
   =========================== */
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchView(e.target.closest('.nav-btn').dataset.view));
    });

    // Dashboard
    document.getElementById('refreshDashboard')?.addEventListener('click', async () => {
        await loadRecords();
        renderDashboard();
        showToast('Dashboard refreshed successfully', 'success');
    });

    // Maintenance View
    document.getElementById('addRecordBtn')?.addEventListener('click', openAddModal);
    document.getElementById('searchInput')?.addEventListener('input', handleSearch);
    document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
    document.getElementById('priorityFilter')?.addEventListener('change', applyFilters);
    document.getElementById('typeFilter')?.addEventListener('change', applyFilters);
    document.getElementById('equipmentFilter')?.addEventListener('change', applyFilters);
    document.getElementById('clearFilters')?.addEventListener('click', clearFilters);

    // Table Sorting
    document.querySelectorAll('.records-table th[data-sort]').forEach(th => {
        th.addEventListener('click', () => handleSort(th.dataset.sort));
    });

    // Pagination
    document.getElementById('prevPage')?.addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage')?.addEventListener('click', () => changePage(1));

    // Modal
    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.getElementById('cancelBtn')?.addEventListener('click', closeModal);
    document.getElementById('recordForm')?.addEventListener('submit', handleFormSubmit);

    // Close modal on outside click
    document.getElementById('recordModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'recordModal') closeModal();
    });

    // Reports
    document.getElementById('exportCSV')?.addEventListener('click', exportToCSV);
    document.getElementById('exportJSON')?.addEventListener('click', exportToJSON);
    document.getElementById('printReport')?.addEventListener('click', printReport);
    document.getElementById('monthlySummary')?.addEventListener('click', generateMonthlySummary);
}

/* ===========================
   Data Loading & API
   =========================== */
async function loadRecords() {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}?limit=1000`);
        if (!response.ok) throw new Error('Failed to load records');
        
        const data = await response.json();
        state.records = data.data || [];
        state.filteredRecords = [...state.records];
        
        // Check for overdue items
        updateOverdueStatus();
        
    } catch (error) {
        console.error('Error loading records:', error);
        showToast('Failed to load maintenance records', 'error');
        state.records = [];
        state.filteredRecords = [];
    } finally {
        showLoading(false);
    }
}

function updateOverdueStatus() {
    const now = new Date();
    state.records.forEach(record => {
        if (record.status === 'Scheduled') {
            const scheduledDate = new Date(record.scheduled_date);
            if (scheduledDate < now) {
                record.status = 'Overdue';
            }
        }
    });
}

async function createRecord(data) {
    showLoading(true);
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to create record');
        
        const newRecord = await response.json();
        await loadRecords();
        showToast('Maintenance record created successfully!', 'success');
        return newRecord;
    } catch (error) {
        console.error('Error creating record:', error);
        showToast('Failed to create record', 'error');
        throw error;
    } finally {
        showLoading(false);
    }
}

async function updateRecord(id, data) {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to update record');
        
        await loadRecords();
        showToast('Maintenance record updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating record:', error);
        showToast('Failed to update record', 'error');
        throw error;
    } finally {
        showLoading(false);
    }
}

async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this maintenance record?')) return;
    
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete record');
        
        await loadRecords();
        renderCurrentView();
        showToast('Maintenance record deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting record:', error);
        showToast('Failed to delete record', 'error');
    } finally {
        showLoading(false);
    }
}

/* ===========================
   View Management
   =========================== */
function switchView(viewName) {
    state.currentView = viewName;
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    
    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`)?.classList.add('active');
    
    // Render appropriate content
    renderCurrentView();
}

function renderCurrentView() {
    switch(state.currentView) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'maintenance':
            renderMaintenanceView();
            break;
        case 'reports':
            generateMonthlySummary();
            break;
    }
}

/* ===========================
   Dashboard Rendering
   =========================== */
function renderDashboard() {
    updateStatistics();
    renderCharts();
    renderRecentActivity();
}

function updateStatistics() {
    const total = state.records.length;
    const scheduled = state.records.filter(r => r.status === 'Scheduled').length;
    const inProgress = state.records.filter(r => r.status === 'In Progress').length;
    const completed = state.records.filter(r => r.status === 'Completed').length;
    const overdue = state.records.filter(r => r.status === 'Overdue').length;
    const totalCost = state.records.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0);
    
    document.getElementById('totalRecords').textContent = total;
    document.getElementById('scheduledCount').textContent = scheduled;
    document.getElementById('progressCount').textContent = inProgress;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('overdueCount').textContent = overdue;
    document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
}

function renderCharts() {
    renderMaintenanceTypeChart();
    renderStatusChart();
    renderEquipmentChart();
    renderPriorityChart();
}

function renderMaintenanceTypeChart() {
    const ctx = document.getElementById('typeChart');
    if (!ctx) return;
    
    const typeCounts = {};
    state.records.forEach(record => {
        typeCounts[record.maintenance_type] = (typeCounts[record.maintenance_type] || 0) + 1;
    });
    
    destroyChart('typeChart');
    
    state.charts.typeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 15, font: { size: 12 } }
                }
            }
        }
    });
}

function renderStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    const statusCounts = {
        'Scheduled': 0,
        'In Progress': 0,
        'Completed': 0,
        'Overdue': 0,
        'Cancelled': 0
    };
    
    state.records.forEach(record => {
        statusCounts[record.status] = (statusCounts[record.status] || 0) + 1;
    });
    
    destroyChart('statusChart');
    
    state.charts.statusChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                label: 'Number of Records',
                data: Object.values(statusCounts),
                backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#6b7280'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderEquipmentChart() {
    const ctx = document.getElementById('equipmentChart');
    if (!ctx) return;
    
    const equipmentCounts = {};
    state.records.forEach(record => {
        equipmentCounts[record.equipment_type] = (equipmentCounts[record.equipment_type] || 0) + 1;
    });
    
    destroyChart('equipmentChart');
    
    state.charts.equipmentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(equipmentCounts),
            datasets: [{
                data: Object.values(equipmentCounts),
                backgroundColor: [
                    '#2563eb', '#10b981', '#f59e0b', '#ef4444',
                    '#8b5cf6', '#06b6d4', '#ec4899'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 15, font: { size: 12 } }
                }
            }
        }
    });
}

function renderPriorityChart() {
    const ctx = document.getElementById('priorityChart');
    if (!ctx) return;
    
    const priorityCounts = {
        'Low': 0,
        'Medium': 0,
        'High': 0,
        'Critical': 0
    };
    
    state.records.forEach(record => {
        priorityCounts[record.priority] = (priorityCounts[record.priority] || 0) + 1;
    });
    
    destroyChart('priorityChart');
    
    state.charts.priorityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(priorityCounts),
            datasets: [{
                label: 'Number of Records',
                data: Object.values(priorityCounts),
                backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#dc2626'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function destroyChart(chartId) {
    if (state.charts[chartId]) {
        state.charts[chartId].destroy();
        delete state.charts[chartId];
    }
}

function renderRecentActivity() {
    const container = document.getElementById('recentActivityList');
    if (!container) return;
    
    // Sort by created/updated date and take last 5
    const recentRecords = [...state.records]
        .sort((a, b) => (b.updated_at || b.created_at) - (a.updated_at || a.created_at))
        .slice(0, 5);
    
    if (recentRecords.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-tertiary); padding: 2rem;">No recent activity</p>';
        return;
    }
    
    container.innerHTML = recentRecords.map(record => `
        <div class="activity-item">
            <div class="activity-info">
                <div class="activity-title">${escapeHtml(record.equipment_name)}</div>
                <div class="activity-details">
                    ${escapeHtml(record.maintenance_type)} • ${escapeHtml(record.technician)} • 
                    <span class="badge badge-${record.status.toLowerCase().replace(' ', '-')}">${escapeHtml(record.status)}</span>
                </div>
            </div>
            <div class="activity-date">${formatDate(record.scheduled_date)}</div>
        </div>
    `).join('');
}

/* ===========================
   Maintenance View Rendering
   =========================== */
function renderMaintenanceView() {
    applyFilters();
}

function renderRecordsTable() {
    const tbody = document.getElementById('recordsTableBody');
    if (!tbody) return;
    
    const start = (state.currentPage - 1) * state.recordsPerPage;
    const end = start + state.recordsPerPage;
    const pageRecords = state.filteredRecords.slice(start, end);
    
    if (pageRecords.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-tertiary);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    No maintenance records found
                </td>
            </tr>
        `;
        updatePagination();
        return;
    }
    
    tbody.innerHTML = pageRecords.map(record => `
        <tr>
            <td><strong>${escapeHtml(record.equipment_name)}</strong></td>
            <td>${escapeHtml(record.equipment_type)}</td>
            <td>${escapeHtml(record.maintenance_type)}</td>
            <td>${formatDate(record.scheduled_date)}</td>
            <td><span class="badge badge-${record.status.toLowerCase().replace(' ', '-')}">${escapeHtml(record.status)}</span></td>
            <td><span class="badge badge-${record.priority.toLowerCase()}">${escapeHtml(record.priority)}</span></td>
            <td>${escapeHtml(record.technician)}</td>
            <td><strong>$${parseFloat(record.cost || 0).toFixed(2)}</strong></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="openEditModal('${record.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteRecord('${record.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(state.filteredRecords.length / state.recordsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (pageInfo) pageInfo.textContent = `Page ${state.currentPage} of ${totalPages || 1}`;
    if (prevBtn) prevBtn.disabled = state.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = state.currentPage >= totalPages;
}

function changePage(direction) {
    const totalPages = Math.ceil(state.filteredRecords.length / state.recordsPerPage);
    state.currentPage = Math.max(1, Math.min(totalPages, state.currentPage + direction));
    renderRecordsTable();
}

/* ===========================
   Filtering & Sorting
   =========================== */
function handleSearch(e) {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const priorityFilter = document.getElementById('priorityFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const equipmentFilter = document.getElementById('equipmentFilter')?.value || '';
    
    state.filteredRecords = state.records.filter(record => {
        const matchesSearch = 
            record.equipment_name.toLowerCase().includes(searchTerm) ||
            record.technician.toLowerCase().includes(searchTerm) ||
            record.location.toLowerCase().includes(searchTerm) ||
            (record.description && record.description.toLowerCase().includes(searchTerm));
        
        const matchesStatus = !statusFilter || record.status === statusFilter;
        const matchesPriority = !priorityFilter || record.priority === priorityFilter;
        const matchesType = !typeFilter || record.maintenance_type === typeFilter;
        const matchesEquipment = !equipmentFilter || record.equipment_type === equipmentFilter;
        
        return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesEquipment;
    });
    
    state.currentPage = 1;
    renderRecordsTable();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('priorityFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('equipmentFilter').value = '';
    applyFilters();
    showToast('Filters cleared', 'info');
}

function handleSort(field) {
    if (state.currentSort.field === field) {
        state.currentSort.direction = state.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        state.currentSort.field = field;
        state.currentSort.direction = 'asc';
    }
    
    state.filteredRecords.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        // Handle dates
        if (field.includes('date')) {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }
        
        // Handle numbers
        if (field === 'cost') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        }
        
        // Handle strings
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return state.currentSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return state.currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    renderRecordsTable();
}

/* ===========================
   Modal Management
   =========================== */
function openAddModal() {
    state.editingRecord = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Add Maintenance Record';
    document.getElementById('recordForm').reset();
    
    // Set default values
    document.getElementById('status').value = 'Scheduled';
    document.getElementById('priority').value = 'Medium';
    
    document.getElementById('recordModal').classList.add('active');
}

function openEditModal(recordId) {
    const record = state.records.find(r => r.id === recordId);
    if (!record) return;
    
    state.editingRecord = record;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Maintenance Record';
    
    // Populate form
    document.getElementById('equipmentName').value = record.equipment_name || '';
    document.getElementById('equipmentType').value = record.equipment_type || '';
    document.getElementById('maintenanceType').value = record.maintenance_type || '';
    document.getElementById('scheduledDate').value = formatDateTimeLocal(record.scheduled_date);
    document.getElementById('status').value = record.status || '';
    document.getElementById('priority').value = record.priority || '';
    document.getElementById('technician').value = record.technician || '';
    document.getElementById('location').value = record.location || '';
    document.getElementById('cost').value = record.cost || '';
    document.getElementById('completedDate').value = record.completed_date ? formatDateTimeLocal(record.completed_date) : '';
    document.getElementById('description').value = record.description || '';
    document.getElementById('notes').value = record.notes || '';
    
    document.getElementById('recordModal').classList.add('active');
}

function closeModal() {
    document.getElementById('recordModal').classList.remove('active');
    document.getElementById('recordForm').reset();
    state.editingRecord = null;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        equipment_name: document.getElementById('equipmentName').value,
        equipment_type: document.getElementById('equipmentType').value,
        maintenance_type: document.getElementById('maintenanceType').value,
        scheduled_date: document.getElementById('scheduledDate').value,
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value,
        technician: document.getElementById('technician').value,
        location: document.getElementById('location').value,
        cost: parseFloat(document.getElementById('cost').value) || 0,
        completed_date: document.getElementById('completedDate').value || null,
        description: document.getElementById('description').value,
        notes: document.getElementById('notes').value
    };
    
    try {
        if (state.editingRecord) {
            await updateRecord(state.editingRecord.id, formData);
        } else {
            await createRecord(formData);
        }
        
        closeModal();
        renderCurrentView();
    } catch (error) {
        // Error already handled in API functions
    }
}

/* ===========================
   Export & Reports
   =========================== */
function exportToCSV() {
    if (state.records.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }
    
    const headers = [
        'Equipment Name', 'Equipment Type', 'Maintenance Type', 'Scheduled Date',
        'Completed Date', 'Status', 'Priority', 'Technician', 'Location', 
        'Cost', 'Description', 'Notes'
    ];
    
    const rows = state.records.map(r => [
        r.equipment_name, r.equipment_type, r.maintenance_type,
        formatDate(r.scheduled_date), formatDate(r.completed_date),
        r.status, r.priority, r.technician, r.location,
        r.cost, r.description, r.notes
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell || ''}"`).join(',') + '\n';
    });
    
    downloadFile(csv, 'maintenance-records.csv', 'text/csv');
    showToast('CSV file downloaded successfully!', 'success');
}

function exportToJSON() {
    if (state.records.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }
    
    const json = JSON.stringify(state.records, null, 2);
    downloadFile(json, 'maintenance-records.json', 'application/json');
    showToast('JSON file downloaded successfully!', 'success');
}

function printReport() {
    window.print();
}

function generateMonthlySummary() {
    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;
    
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const monthRecords = state.records.filter(r => {
        const date = new Date(r.scheduled_date);
        return date >= monthStart && date <= monthEnd;
    });
    
    const completed = monthRecords.filter(r => r.status === 'Completed').length;
    const pending = monthRecords.filter(r => r.status === 'Scheduled' || r.status === 'In Progress').length;
    const overdue = monthRecords.filter(r => r.status === 'Overdue').length;
    const totalCost = monthRecords.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0);
    
    const typeBreakdown = {};
    monthRecords.forEach(r => {
        typeBreakdown[r.maintenance_type] = (typeBreakdown[r.maintenance_type] || 0) + 1;
    });
    
    summaryContent.innerHTML = `
        <h4 style="margin-bottom: 1rem; color: var(--primary-color);">${currentMonth} Summary</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 2rem; font-weight: 800; color: var(--primary-color);">${monthRecords.length}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Total Records</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 2rem; font-weight: 800; color: var(--success-color);">${completed}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Completed</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 2rem; font-weight: 800; color: var(--warning-color);">${pending}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Pending</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 2rem; font-weight: 800; color: var(--danger-color);">${overdue}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Overdue</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 2rem; font-weight: 800; color: var(--info-color);">$${totalCost.toFixed(2)}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Total Cost</div>
            </div>
        </div>
        
        <h5 style="margin-bottom: 1rem;">Maintenance Type Breakdown</h5>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${Object.entries(typeBreakdown).map(([type, count]) => `
                <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-md);">
                    <span><strong>${type}</strong></span>
                    <span>${count} record${count !== 1 ? 's' : ''}</span>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 2rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); border-left: 4px solid var(--primary-color);">
            <strong>Key Insights:</strong>
            <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                <li>Completion rate: ${monthRecords.length > 0 ? ((completed / monthRecords.length) * 100).toFixed(1) : 0}%</li>
                <li>Average cost per maintenance: $${monthRecords.length > 0 ? (totalCost / monthRecords.length).toFixed(2) : 0}</li>
                ${overdue > 0 ? `<li style="color: var(--danger-color);">⚠️ ${overdue} overdue task${overdue !== 1 ? 's' : ''} require${overdue === 1 ? 's' : ''} attention</li>` : ''}
            </ul>
        </div>
    `;
}

/* ===========================
   Utility Functions
   =========================== */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTimeLocal(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.toggle('active', show);
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Make functions globally accessible
window.openEditModal = openEditModal;
window.deleteRecord = deleteRecord;