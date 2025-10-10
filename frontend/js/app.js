// Refresh to first page and update display
function refreshToFirstPage() {
    currentPage = 0;
    loadStudents(0);
}
// Global Variables
let students = [];
let totalStudents = 0;
let currentPage = 0;
let itemsPerPage = 10;
let isEditMode = false;
let currentEditId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input with debounce
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchStudents();
        }, 500);
    });

    // Close modal when clicking outside
    window.onclick = (event) => {
        const modal = document.getElementById('studentModal');
        const statsModal = document.getElementById('statsModal');
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === statsModal) {
            closeStatsModal();
        }
    };
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Load all students
async function loadStudents(page = 0) {
    try {
        showLoading(false);
        let skip = page * itemsPerPage;
        const limit = itemsPerPage;
        const result = await api.getAllStudents({ skip, limit });
        if (Array.isArray(result)) {
            students = result;
            totalStudents = students.length;
        } else {
            students = result.items || [];
            totalStudents = Number(result.total_count) || students.length;
        }
    displayStudents();
    } catch (error) {
        showToast('Lỗi khi tải danh sách sinh viên: ' + error.message, 'error');
        console.error('Load students error:', error);
    } finally {
        showLoading(false); 
    }
}

// Display students in table
function displayStudents() {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align: center; padding: 40px; color: #95a5a6;">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 10px; display: block;"></i>
                    Không có dữ liệu sinh viên
                </td>
            </tr>
        `;
        updatePagination();
        return;
    }

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        // Helper to safely extract string from XML-parsed value
        const safe = v => {
            if (v === null || v === undefined || v === '') return '-';
            if (typeof v === 'object') {
                // If object with _text or #text, return that
                if ('_text' in v) return v._text === '' ? '-' : v._text;
                if ('#text' in v) return v['#text'] === '' ? '-' : v['#text'];
                // If array, join as string
                if (Array.isArray(v)) return v.map(safe).join(', ');
                // Otherwise, try to stringify
                return Object.values(v).map(safe).join(', ');
            }
            return v;
        };
        row.innerHTML = `
            <td><input type="checkbox" class="student-checkbox" data-id="${safe(student.id)}"></td>
            <td><strong>${safe(student.ma_so_sv)}</strong></td>
            <td>${safe(student.ho)}</td>
            <td>${safe(student.ten)}</td>
            <td>${safe(student.email)}</td>
            <td>${formatDate(student.ngay_sinh)}</td>
            <td>${safe(student.que_quan)}</td>
            <td>${formatScore(student.diem_toan)}</td>
            <td>${formatScore(student.diem_van)}</td>
            <td>${formatScore(student.diem_anh)}</td>
            <td><strong style="color: #3498db;">${formatScore(student.diem_trung_binh)}</strong></td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editStudent(${safe(student.id)})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${safe(student.id)})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updatePagination();
    return currentPage;
}

// Format date
function formatDate(dateString) {
    // Use safe() to extract string if needed
    const safe = v => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'object') {
            if ('_text' in v) return v._text;
            if ('#text' in v) return v['#text'];
            if (Array.isArray(v)) return v.map(safe).join(', ');
            return Object.values(v).map(safe).join(', ');
        }
        return v;
    };
    const str = safe(dateString);
    if (!str) return '-';
    const date = new Date(str);
    return isNaN(date) ? '-' : date.toLocaleDateString('vi-VN');
}

// Format score
function formatScore(score) {
    // Use safe() to extract string if needed
    const safe = v => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'object') {
            if ('_text' in v) return v._text;
            if ('#text' in v) return v['#text'];
            if (Array.isArray(v)) return v.map(safe).join(', ');
            return Object.values(v).map(safe).join(', ');
        }
        return v;
    };
    const str = safe(score);
    if (str === '') return '-';
    const num = Number(str);
    if (isNaN(num)) return '-';
    return num.toFixed(1);
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(totalStudents / itemsPerPage);
    const start = currentPage * itemsPerPage + 1;
    const end = Math.min((currentPage + 1) * itemsPerPage, totalStudents);
    document.getElementById('pageInfo').textContent = 
        `Records ${start} to ${end} of ${totalStudents}`;
    // Enable/disable pagination buttons
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
}

// Previous page
async function previousPage() {
    if (currentPage > 0) {
        currentPage--;
    await loadStudents(currentPage);
    }
}

// Next page
async function nextPage() {
    const totalPages = Math.ceil(totalStudents / itemsPerPage);
    if (currentPage < totalPages - 1) {
        currentPage++;
        await loadStudents(currentPage);
    }
}

// Show add modal
function showAddModal() {
    isEditMode = false;
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Thêm Sinh Viên Mới';
    document.getElementById('studentForm').reset();
    document.getElementById('student_id').value = '';
    document.getElementById('studentModal').style.display = 'block';
}

// Edit student
async function editStudent(id) {
    try {
        const student = await api.getStudentById(id);
        isEditMode = true;
        currentEditId = id;
        
        document.getElementById('modalTitle').textContent = 'Chỉnh Sửa Sinh Viên';
        // Helper to safely extract string from XML-parsed value
        const safe = v => {
            if (v === null || v === undefined || v === '') return '';
            if (typeof v === 'object') {
                if ('_text' in v) return v._text === '' ? '' : v._text;
                if ('#text' in v) return v['#text'] === '' ? '' : v['#text'];
                if (Array.isArray(v)) return v.map(safe).join(', ');
                return Object.values(v).map(safe).join(', ');
            }
            return v;
        };
        document.getElementById('student_id').value = safe(student.id);
        document.getElementById('ma_so_sv').value = safe(student.ma_so_sv);
        document.getElementById('ho').value = safe(student.ho);
        document.getElementById('ten').value = safe(student.ten);
        document.getElementById('email').value = safe(student.email);
        document.getElementById('ngay_sinh').value = safe(student.ngay_sinh);
        document.getElementById('que_quan').value = safe(student.que_quan);
        document.getElementById('diem_toan').value = safe(student.diem_toan);
        document.getElementById('diem_van').value = safe(student.diem_van);
        document.getElementById('diem_anh').value = safe(student.diem_anh);
        
        document.getElementById('studentModal').style.display = 'block';
    } catch (error) {
        showToast('Lỗi khi tải thông tin sinh viên: ' + error.message, 'error');
    }
}

// Delete student
async function deleteStudent(id) {
    // Always treat id as number for comparison
    const toNum = v => {
        if (typeof v === 'object' && v !== null) {
            if ('_text' in v) return Number(v._text);
            if ('#text' in v) return Number(v['#text']);
        }
        return Number(v);
    };
    const numId = toNum(id);
    const student = students.find(s => toNum(s.id) === numId);
    if (!student) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa sinh viên ${student.ho ? student.ho : ''} ${student.ten ? student.ten : ''}?`)) {
        return;
    }

    try {
        await api.deleteStudent(numId);
        showToast('Xóa sinh viên thành công!', 'success');
        // After delete, reload and adjust currentPage if needed
        // Get new total count
        const result = await api.getAllStudents({ skip: 0, limit: 1 });
        let newTotal = 0;
        if (Array.isArray(result)) {
            newTotal = result.length;
        } else {
            newTotal = Number(result.total_count) || 0;
        }
        const lastPage = Math.max(0, Math.ceil(newTotal / itemsPerPage) - 1);
        if (currentPage > lastPage) currentPage = lastPage;
        await loadStudents(currentPage);
    } catch (error) {
        showToast('Lỗi khi xóa sinh viên: ' + error.message, 'error');
    }
}

// Submit student form
async function submitStudent(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const studentData = {
        ma_so_sv: formData.get('ma_so_sv'),
        ho: formData.get('ho'),
        ten: formData.get('ten'),
        email: formData.get('email') || null,
        ngay_sinh: formData.get('ngay_sinh') || null,
        que_quan: formData.get('que_quan') || null,
        diem_toan: formData.get('diem_toan') ? parseFloat(formData.get('diem_toan')) : null,
        diem_van: formData.get('diem_van') ? parseFloat(formData.get('diem_van')) : null,
        diem_anh: formData.get('diem_anh') ? parseFloat(formData.get('diem_anh')) : null,
    };

    try {
        if (isEditMode && currentEditId) {
            await api.updateStudent(currentEditId, studentData);
            showToast('Cập nhật sinh viên thành công!', 'success');
        } else {
            await api.createStudent(studentData);
            showToast('Thêm sinh viên thành công!', 'success');
        }
    closeModal();
    await loadStudents(currentPage);
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

// Close modal
function closeModal() {
    document.getElementById('studentModal').style.display = 'none';
    document.getElementById('studentForm').reset();
    isEditMode = false;
    currentEditId = null;
}

// Close stats modal
function closeStatsModal() {
    document.getElementById('statsModal').style.display = 'none';
}

// Search students
async function searchStudents() {
    const keyword = document.getElementById('searchInput').value.trim();
    
    try {
        if (keyword) {
            let result = await api.searchStudents(keyword);
            if (result && typeof result === 'object' && 'items' in result) {
                students = Array.isArray(result.items) ? result.items : [];
                totalStudents = Number(result.total_count) || students.length;
            } else if (Array.isArray(result)) {
                students = result;
                totalStudents = students.length;
            } else if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
                students = [];
                totalStudents = 0;
            } else {
                students = [result];
                totalStudents = 1;
            }
            showToast(`Tìm thấy ${students.length} kết quả`, 'success');
        } else {
            await loadStudents();
        }
        currentPage = 0;
        displayStudents();
    } catch (error) {
        showToast('Lỗi khi tìm kiếm: ' + error.message, 'error');
    }
}

// Show statistics
async function showStatistics() {
    try {
        const stats = await api.getStatistics();
        const safe = v => {
            if (v === null || v === undefined || v === '') return '-';
            if (typeof v === 'object') {
                if ('_text' in v) return v._text === '' ? '-' : v._text;
                if ('#text' in v) return v['#text'] === '' ? '-' : v['#text'];
                if (Array.isArray(v)) return v.map(safe).join(', ');
                return Object.values(v).map(safe).join(', ');
            }
            return v;
        };
        const formatStat = v => {
            const str = safe(v);
            if (str === '-' || str === '') return 'N/A';
            const num = Number(str);
            if (isNaN(num)) return 'N/A';
            return num.toFixed(2);
        };
        const statsContent = document.getElementById('statsContent');
        statsContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card success">
                    <h4>Tổng Sinh Viên</h4>
                    <div class="stat-value">${safe(stats.total_students)}</div>
                </div>
                <div class="stat-card info">
                    <h4>Điểm TB Toán</h4>
                    <div class="stat-value">${formatStat(stats.avg_diem_toan)}</div>
                </div>
                <div class="stat-card warning">
                    <h4>Điểm TB Văn</h4>
                    <div class="stat-value">${formatStat(stats.avg_diem_van)}</div>
                </div>
                <div class="stat-card">
                    <h4>Điểm TB Anh</h4>
                    <div class="stat-value">${formatStat(stats.avg_diem_anh)}</div>
                </div>
                <div class="stat-card success">
                    <h4>Điểm TB Chung</h4>
                    <div class="stat-value">${formatStat(stats.avg_diem_trung_binh)}</div>
                </div>
            </div>
        `;
        document.getElementById('statsModal').style.display = 'block';
    } catch (error) {
        showToast('Lỗi khi tải thống kê: ' + error.message, 'error');
    }
}

// Toggle select all
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
}

// Export to CSV
function exportCSV() {
    (async () => {
        // Fetch all students from backend (no pagination)
        const result = await api.getAllStudents({ skip: 0, limit: 100000 });
        let allStudents = [];
        if (Array.isArray(result)) {
            allStudents = result;
        } else if (result.items) {
            allStudents = result.items;
        }
        if (allStudents.length === 0) {
            showToast('Không có dữ liệu để xuất', 'warning');
            return;
        }
        const headers = ['ID', 'Mã SV', 'Họ', 'Tên', 'Email', 'Ngày Sinh', 'Quê Quán', 'Điểm Toán', 'Điểm Văn', 'Điểm Anh', 'Điểm TB'];
        // Helper to safely extract string from XML-parsed value
        const safe = v => {
            if (v === null || v === undefined || v === '') return '';
            if (typeof v === 'object') {
                if ('_text' in v) return v._text === '' ? '' : v._text;
                if ('#text' in v) return v['#text'] === '' ? '' : v['#text'];
                if (Array.isArray(v)) return v.map(safe).join(', ');
                return Object.values(v).map(safe).join(', ');
            }
            return v;
        };
        const rows = allStudents.map(s => [
            safe(s.id),
            safe(s.ma_so_sv),
            safe(s.ho),
            safe(s.ten),
            safe(s.email),
            safe(s.ngay_sinh),
            safe(s.que_quan),
            safe(s.diem_toan),
            safe(s.diem_van),
            safe(s.diem_anh),
            safe(s.diem_trung_binh)
        ]);
        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.map(field => `"${field}"`).join(',') + '\n';
        });
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `students_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Xuất CSV thành công!', 'success');
    })();
}

// Print preview
function printPreview() {
    (async () => {
        // Fetch all students from backend (no pagination)
        const result = await api.getAllStudents({ skip: 0, limit: 100000 });
        let allStudents = [];
        if (Array.isArray(result)) {
            allStudents = result;
        } else if (result.items) {
            allStudents = result.items;
        }
        // Helper to safely extract string from XML-parsed value
        const safe = v => {
            if (v === null || v === undefined || v === '') return '';
            if (typeof v === 'object') {
                if ('_text' in v) return v._text === '' ? '' : v._text;
                if ('#text' in v) return v['#text'] === '' ? '' : v['#text'];
                if (Array.isArray(v)) return v.map(safe).join(', ');
                return Object.values(v).map(safe).join(', ');
            }
            return v;
        };
        const headers = ['Mã SV', 'Họ', 'Tên', 'Email', 'Ngày Sinh', 'Quê Quán', 'Điểm Toán', 'Điểm Văn', 'Điểm Anh', 'Điểm TB'];
        let tableHtml = '<table style="width:100%;border-collapse:collapse;">';
        tableHtml += '<thead><tr>' + headers.map(h => `<th style="border:1px solid #ddd;padding:8px;background:#34495e;color:white;">${h}</th>`).join('') + '</tr></thead><tbody>';
        allStudents.forEach(s => {
            tableHtml += '<tr>' + [
                safe(s.ma_so_sv),
                safe(s.ho),
                safe(s.ten),
                safe(s.email),
                safe(s.ngay_sinh),
                safe(s.que_quan),
                safe(s.diem_toan),
                safe(s.diem_van),
                safe(s.diem_anh),
                safe(s.diem_trung_binh)
            ].map(f => `<td style="border:1px solid #ddd;padding:8px;">${f}</td>`).join('') + '</tr>';
        });
        tableHtml += '</tbody></table>';
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Danh Sách Sinh Viên</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; }');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
        printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
        printWindow.document.write('th { background-color: #34495e; color: white; }');
        printWindow.document.write('h1 { text-align: center; color: #2c3e50; }');
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<h1>DANH SÁCH SINH VIÊN</h1>');
        printWindow.document.write(tableHtml);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    })();
}

// Toggle filter
function toggleFilter() {
    showToast('Chức năng lọc đang được phát triển', 'warning');
}

// Show loading
function showLoading(show) {
    // You can implement a loading spinner here
    const tableBody = document.getElementById('studentsTableBody');
    if (show) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align: center; padding: 40px;">
                    <div class="loading"></div>
                    <p style="margin-top: 10px; color: #95a5a6;">Đang tải dữ liệu...</p>
                </td>
            </tr>
        `;
    }
}