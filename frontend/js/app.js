// Global Variables
let students = [];
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
async function loadStudents() {
    try {
        showLoading(true);
        students = await api.getAllStudents();
        displayStudents();
        showToast(`Đã tải ${students.length} sinh viên`, 'success');
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

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedStudents = students.slice(start, end);

    paginatedStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="student-checkbox" data-id="${student.id}"></td>
            <td><strong>${student.ma_so_sv || '-'}</strong></td>
            <td>${student.ho || '-'}</td>
            <td>${student.ten || '-'}</td>
            <td>${student.email || '-'}</td>
            <td>${formatDate(student.ngay_sinh)}</td>
            <td>${student.que_quan || '-'}</td>
            <td>${formatScore(student.diem_toan)}</td>
            <td>${formatScore(student.diem_van)}</td>
            <td>${formatScore(student.diem_anh)}</td>
            <td><strong style="color: #3498db;">${formatScore(student.diem_trung_binh)}</strong></td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editStudent(${student.id})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updatePagination();
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Format score
function formatScore(score) {
    if (score === null || score === undefined) return '-';
    return score.toFixed(1);
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(students.length / itemsPerPage);
    const start = currentPage * itemsPerPage + 1;
    const end = Math.min((currentPage + 1) * itemsPerPage, students.length);
    
    document.getElementById('pageInfo').textContent = 
        `Records ${start} to ${end} of ${students.length}`;

    // Enable/disable pagination buttons
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
}

// Previous page
function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        displayStudents();
    }
}

// Next page
function nextPage() {
    const totalPages = Math.ceil(students.length / itemsPerPage);
    if (currentPage < totalPages - 1) {
        currentPage++;
        displayStudents();
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
        document.getElementById('student_id').value = student.id;
        document.getElementById('ma_so_sv').value = student.ma_so_sv || '';
        document.getElementById('ho').value = student.ho || '';
        document.getElementById('ten').value = student.ten || '';
        document.getElementById('email').value = student.email || '';
        document.getElementById('ngay_sinh').value = student.ngay_sinh || '';
        document.getElementById('que_quan').value = student.que_quan || '';
        document.getElementById('diem_toan').value = student.diem_toan || '';
        document.getElementById('diem_van').value = student.diem_van || '';
        document.getElementById('diem_anh').value = student.diem_anh || '';
        
        document.getElementById('studentModal').style.display = 'block';
    } catch (error) {
        showToast('Lỗi khi tải thông tin sinh viên: ' + error.message, 'error');
    }
}

// Delete student
async function deleteStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa sinh viên ${student.ho} ${student.ten}?`)) {
        return;
    }

    try {
        await api.deleteStudent(id);
        showToast('Xóa sinh viên thành công!', 'success');
        await loadStudents();
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
        await loadStudents();
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
            students = await api.searchStudents(keyword);
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
        
        const statsContent = document.getElementById('statsContent');
        statsContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card success">
                    <h4>Tổng Sinh Viên</h4>
                    <div class="stat-value">${stats.total_students}</div>
                </div>
                <div class="stat-card info">
                    <h4>Điểm TB Toán</h4>
                    <div class="stat-value">${stats.avg_diem_toan ? stats.avg_diem_toan.toFixed(2) : 'N/A'}</div>
                </div>
                <div class="stat-card warning">
                    <h4>Điểm TB Văn</h4>
                    <div class="stat-value">${stats.avg_diem_van ? stats.avg_diem_van.toFixed(2) : 'N/A'}</div>
                </div>
                <div class="stat-card">
                    <h4>Điểm TB Anh</h4>
                    <div class="stat-value">${stats.avg_diem_anh ? stats.avg_diem_anh.toFixed(2) : 'N/A'}</div>
                </div>
                <div class="stat-card success">
                    <h4>Điểm TB Chung</h4>
                    <div class="stat-value">${stats.avg_diem_trung_binh ? stats.avg_diem_trung_binh.toFixed(2) : 'N/A'}</div>
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
    if (students.length === 0) {
        showToast('Không có dữ liệu để xuất', 'warning');
        return;
    }

    const headers = ['ID', 'Mã SV', 'Họ', 'Tên', 'Email', 'Ngày Sinh', 'Quê Quán', 'Điểm Toán', 'Điểm Văn', 'Điểm Anh', 'Điểm TB'];
    const rows = students.map(s => [
        s.id,
        s.ma_so_sv || '',
        s.ho || '',
        s.ten || '',
        s.email || '',
        s.ngay_sinh || '',
        s.que_quan || '',
        s.diem_toan !== null ? s.diem_toan : '',
        s.diem_van !== null ? s.diem_van : '',
        s.diem_anh !== null ? s.diem_anh : '',
        s.diem_trung_binh !== null ? s.diem_trung_binh : ''
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
}

// Print preview
function printPreview() {
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
    printWindow.document.write(document.getElementById('studentsTable').outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
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