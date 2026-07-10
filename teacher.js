// --- STATE MANAGEMENT ---
let currentCourseStudents = []; // For grade entry tab
let cachedData = {
    lich_hoc: [],
    lop_hoc: new Map(), // Map<lop_id, { ten_lop, si_so }>
    mon_hoc: new Map(), // Map<mon_hoc_id, { ten_mon, chuyen_nganh_ten }>
    sinh_vien: [], // All students in the teacher's classes
    diem: [], // All grades for those students
    submission_status: new Map(), // Map<'${mon_hoc_id}-${lop_id}', boolean>
    // Derived data
    unique_mon_hoc_ids: new Set(),
    unique_lop_ids: new Set(),
    unique_sinh_vien_ids: new Set(),
};
let currentTeacherId = null; // Store the teacher's profile ID (from giang_vien table)
const courseColors = ['#3182ce', '#dd6b20', '#38a169', '#805ad5', '#d53f8c'];
let colorIndex = 0;

// --- INITIALIZATION ---
window.onload = async function() {
    const session = await yeuCauPhien('gv');
    if (!session) return;

    await loadTeacherProfile(session.user.id); // Load teacher profile and set currentTeacherId
    if (!currentTeacherId) {
        return hienLoiApi({ message: "Không tìm thấy hồ sơ giảng viên." }, "khởi tạo");
    }

    await loadAndRenderAll();
    
    // Initialize tab buttons (apply Tailwind styles)
    document.querySelectorAll('.tab-btn-tailwind').forEach(button => {
        button.classList.add('whitespace-nowrap', 'py-4', 'px-1', 'border-b-2', 'font-medium', 'text-sm', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'mr-4', 'cursor-pointer');
    });
    
    showTab('dashboard'); // Show dashboard by default
};

// --- TABS ---
function showTab(tabId) {
    if (tabId === 'nhapDiem') tabId = 'chiTietLop'; // Alias for backward compatibility
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    const tabButtons = document.querySelectorAll('.tab-btn-tailwind');
    tabButtons.forEach(btn => {
        btn.classList.remove('text-indigo-600', 'border-indigo-500');
        btn.classList.add('text-gray-500', 'border-transparent');
    });

    document.getElementById(tabId).classList.add('active');
    const activeBtn = document.getElementById('btn' + tabId.charAt(0).toUpperCase() + tabId.slice(1)) || document.getElementById('btnNhapDiem');
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-500', 'border-transparent');
        activeBtn.classList.add('text-indigo-600', 'border-indigo-500');
    }
    
    // Rerender dashboard every time it's viewed
    if (tabId === 'dashboard') {
        renderDashboard();
    }
}

// --- MASTER DATA HANDLING ---
async function loadAndRenderAll() {
    // 1. Fetch all teaching assignments (lich_hoc) for the current teacher
    const { data: lichHocData, error: lichHocError } = await supabaseClient
        .from('lich_hoc')
        .select('*, mon_hoc(*, chuyen_nganh(ten_chuyen_nganh)), lop_hoc(*)')
        .eq('giang_vien_id', currentTeacherId);

    if (lichHocError) return hienLoiApi(lichHocError, 'tải lịch giảng dạy');
    cachedData.lich_hoc = lichHocData || [];

    if (cachedData.lich_hoc.length === 0) {
        // Handle case where teacher has no classes
        renderDashboard();
        renderLopGiangDayTab();
        updateScheduleView();
        populateCourseDropdown();
        return;
    }

    // 2. Derive unique IDs and populate maps
    cachedData.lich_hoc.forEach(lh => {
        cachedData.unique_mon_hoc_ids.add(lh.mon_hoc_id);
        cachedData.unique_lop_ids.add(lh.lop_id);
        if (lh.mon_hoc && !cachedData.mon_hoc.has(lh.mon_hoc_id)) {
            cachedData.mon_hoc.set(lh.mon_hoc_id, {
                ten_mon: lh.mon_hoc.ten_mon,
                chuyen_nganh_ten: lh.mon_hoc.chuyen_nganh?.ten_chuyen_nganh || 'N/A'
            });
        }
        if (lh.lop_hoc && !cachedData.lop_hoc.has(lh.lop_id)) {
            cachedData.lop_hoc.set(lh.lop_id, { ten_lop: lh.lop_hoc.ten_lop, si_so: 0 });
        }
    });

    // 3. Fetch all students from the assigned classes
    const { data: studentData, error: studentError } = await supabaseClient
        .from('sinh_vien')
        .select('id, lop_id, ma_sv, ho_ten, email_dang_nhap, chuyen_nganh(ten_chuyen_nganh)')
        .in('lop_id', Array.from(cachedData.unique_lop_ids));

    // 4. Fetch all grades for these students
    const { data: diemData, error: diemError } = await supabaseClient
        .from('diem')
        .select('sinh_vien_id, mon_hoc_id, diem_chuyen_can, diem_giua_ky, diem_cuoi_ky, diem_so')
        .in('sinh_vien_id', Array.from(cachedData.unique_sinh_vien_ids));

    // 5. Fetch submission statuses
    const { data: submissionData, error: submissionError } = await supabaseClient
        .from('bang_diem_submission')
        .select('mon_hoc_id, lop_id, da_gui')
        .eq('giang_vien_id', currentTeacherId);

    if (studentError) return hienLoiApi(studentError, 'tải sinh viên');
    cachedData.sinh_vien = studentData || [];

    // Calculate class sizes and total unique students
    cachedData.sinh_vien.forEach(sv => {
        cachedData.unique_sinh_vien_ids.add(sv.id);
        if (cachedData.lop_hoc.has(sv.lop_id)) {
            cachedData.lop_hoc.get(sv.lop_id).si_so++;
        }
    });

    if (diemError) return hienLoiApi(diemError, 'tải điểm');
    if (submissionError) return hienLoiApi(submissionError, 'tải trạng thái nộp điểm');
    cachedData.diem = diemData || [];
    (submissionData || []).forEach(s => cachedData.submission_status.set(`${s.mon_hoc_id}-${s.lop_id}`, s.da_gui));

    // 6. Render all UI components
    renderDashboard();
    renderLopGiangDayTab();
    updateScheduleView();
    populateCourseDropdown();
}

// --- RENDER FUNCTIONS ---
function renderDashboard() {
    document.getElementById('stat-mon-hoc').textContent = cachedData.unique_mon_hoc_ids.size;
    document.getElementById('stat-lop-hoc').textContent = cachedData.unique_lop_ids.size;
    document.getElementById('stat-sinh-vien').textContent = cachedData.unique_sinh_vien_ids.size;

    // Calculate classes with missing grades
    let classesWithMissingGrades = 0;
    const uniqueCourseClasses = [...new Map(cachedData.lich_hoc.map(item =>
        [`${item.mon_hoc_id}-${item.lop_id}`, item])).values()];

    uniqueCourseClasses.forEach(courseClass => {
        const studentsInClass = cachedData.sinh_vien.filter(sv => sv.lop_id === courseClass.lop_id);
        if (studentsInClass.length === 0) return; // Skip if class has no students

        const isSubmitted = cachedData.submission_status.get(`${courseClass.mon_hoc_id}-${courseClass.lop_id}`);
        if (!isSubmitted) {
            classesWithMissingGrades++;
        }
    });
    document.getElementById('stat-chua-nhap-diem').textContent = classesWithMissingGrades;
}

function renderLopGiangDayTab() {
    const tbody = document.getElementById('tblLopGiangDay');
    const WEEKDAYS = { 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7', 7: 'CN' };

    if (cachedData.lich_hoc.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Bạn chưa được phân công giảng dạy lớp nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = cachedData.lich_hoc.map(lh => {
        const lopInfo = cachedData.lop_hoc.get(lh.lop_id);
        const monHocInfo = cachedData.mon_hoc.get(lh.mon_hoc_id);
        const lichHocStr = `${WEEKDAYS[lh.ngay_trong_tuan]} (Ca ${lh.ca_hoc}) - P.${lh.phong_hoc || 'N/A'}`;

        return `
            <tr class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6 text-left font-medium">${lopInfo?.ten_lop || 'N/A'}</td>
                <td class="py-3 px-6 text-left font-medium">${monHocInfo?.ten_mon || 'N/A'}</td>
                <td class="py-3 px-6 text-left">${monHocInfo?.chuyen_nganh_ten || 'N/A'}</td>
                <td class="py-3 px-6 text-left">${lichHocStr}</td>
                <td class="py-3 px-6 text-center">${lopInfo?.si_so || 0}</td>
                <td class="py-3 px-6 text-center">
                    <button onclick="viewClassDetails(${lh.mon_hoc_id}, ${lh.lop_id})" class="text-blue-600 hover:underline text-sm">Xem chi tiết</button>
                </td>
            </tr>
        `;
    }).join('');
}

function getCardColor(courseId) {
    // This function needs to be smarter with the new cache structure
    // For now, a simple cycling color is fine.
    return courseColors[courseId % courseColors.length];
}

// --- NAVIGATION & INTERACTIVITY ---
async function viewClassDetails(monHocId, lopId) {
    // Switch to the grade entry tab
    showTab('chiTietLop');

    // Set the dropdowns
    const monHocDropdown = document.getElementById('chonMonHoc');
    const lopDropdown = document.getElementById('chonLopHoc');

    monHocDropdown.value = monHocId;
    
    await populateClassDropdown(); 
    lopDropdown.value = lopId;

    // Load the student list
    await loadStudentsByCourseAndClass();
}

// --- SCHEDULE (LỊCH GIẢNG DẠY) TAB ---
async function updateScheduleView() {
    // Clear existing events
    document.querySelectorAll('.event-card').forEach(card => card.remove());
    
    // Render from cache
    cachedData.lich_hoc.forEach(renderEventCard);
}

const JS_DAY_TO_GRID_DAY = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 0: 7 }; // Map JS getDay() to our 1-7 grid

function renderEventCard(event) {
    const dayOfWeek = event.ngay_trong_tuan; // 1=Mon, ..., 7=Sun.
    const timeSlotId = event.ca_hoc; // 'sáng', 'chiều', 'tối'

    // Map DB day to HTML grid ID. Grid uses 1=Mon...6=Sat, 0=Sun.
    const gridDayId = dayOfWeek === 7 ? 0 : dayOfWeek;

    const slot = document.getElementById(`slot-${gridDayId}-${timeSlotId}`);
    if (!slot) return;
    
    const card = document.createElement('div');
    card.className = 'event-card rounded-lg p-2 text-sm shadow text-white';
    card.style.backgroundColor = getCardColor(event.mon_hoc_id);
    
    const courseName = cachedData.mon_hoc.get(event.mon_hoc_id)?.ten_mon || 'N/A';
    const className = cachedData.lop_hoc.get(event.lop_id)?.ten_lop || 'N/A';

    card.innerHTML = `
        <div class="font-bold">${courseName}</div>
        <div class="room">Phòng: ${event.phong_hoc || 'N/A'}</div>
        <div class="class-id">Lớp: ${className || 'N/A'}</div>
    `;
    slot.appendChild(card);
}

// --- GRADE ENTRY (NHẬP ĐIỂM) TAB ---
async function populateCourseDropdown() {
    if (!currentTeacherId) return;

    if (cachedData.unique_mon_hoc_ids.size === 0) {
        document.getElementById('chonMonHoc').innerHTML = '<option value="">-- Bạn chưa được phân công môn học nào --</option>';
        return;
    }

    let htmlMH = '<option value="">-- Chọn Môn Học --</option>';
    cachedData.unique_mon_hoc_ids.forEach(monHocId => {
        const monHocInfo = cachedData.mon_hoc.get(monHocId);
        if (monHocInfo) htmlMH += `<option value="${monHocId}">${monHocInfo.ten_mon}</option>`;
    });
    document.getElementById('chonMonHoc').innerHTML = htmlMH;
}

async function populateClassDropdown() {
    const monHocId = document.getElementById('chonMonHoc').value;
    const lopDropdown = document.getElementById('chonLopHoc');

    if (!monHocId) {
        lopDropdown.innerHTML = '<option value="">-- Chọn Lớp Học --</option>';
        lopDropdown.classList.add('hidden');
        renderStudentGradeTable([]);
        return;
    }

    const relevantClasses = cachedData.lich_hoc.filter(lh => lh.mon_hoc_id == monHocId);
    const uniqueLopIdsInCourse = [...new Set(relevantClasses.map(lh => lh.lop_id))];

    let htmlLop = '<option value="">-- Chọn Lớp Học --</option>';
    uniqueLopIdsInCourse.forEach(lopId => {
        const lopInfo = cachedData.lop_hoc.get(lopId);
        if (lopInfo) htmlLop += `<option value="${lopId}">${lopInfo.ten_lop}</option>`;
    });
    lopDropdown.innerHTML = htmlLop;
    lopDropdown.classList.remove('hidden');
}

async function loadStudentsByCourseAndClass() {
    const monHocId = document.getElementById('chonMonHoc').value;
    const lopHocId = document.getElementById('chonLopHoc').value;

    if (!monHocId || !lopHocId) {
        currentCourseStudents = [];
        renderStudentGradeTable([]);
        return;
    }
    
    // Filter students from cache for the selected class
    const studentsInClass = cachedData.sinh_vien.filter(sv => sv.lop_id == lopHocId);
    currentCourseStudents = studentsInClass;
    
    renderStudentGradeTable(currentCourseStudents);
}

function renderStudentGradeTable(studentsToRender) {
    const tbody = document.getElementById('tblSinhVien');
    let html = '';
    const monHocId = document.getElementById('chonMonHoc').value;
    const lopHocId = document.getElementById('chonLopHoc').value;
    if (!monHocId || !lopHocId) {
        tbody.innerHTML = '';
        return;
    }

    const isSubmitted = cachedData.submission_status.get(`${monHocId}-${lopHocId}`) || false;
    updateSubmissionStatusUI(isSubmitted);

    // Create a map for quick grade lookup for the selected course
    const gradeMap = new Map();
    cachedData.diem.filter(d => d.mon_hoc_id == monHocId).forEach(d => gradeMap.set(d.sinh_vien_id, d));

    (studentsToRender || []).forEach(sv => {
        const diemData = gradeMap.get(sv.id);
        const diem_cc = diemData?.diem_chuyen_can ?? '';
        const diem_gk = diemData?.diem_giua_ky ?? '';
        const diem_ck = diemData?.diem_cuoi_ky ?? '';
        const diem_so = diemData?.diem_so !== null ? diemData.diem_so : 'N/A';
        const chuyenNganhTen = sv.chuyen_nganh?.ten_chuyen_nganh || 'N/A';

        html += `
            <tr data-sv-id="${sv.id}" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left">${sv.ma_sv}</td>
                <td class="py-3 px-6 text-left">${sv.ho_ten}</td>
                <td class="py-3 px-6 text-left">${sv.email_dang_nhap || 'N/A'}</td>
                <td class="py-3 px-6 text-left">${chuyenNganhTen}</td>
                <td class="py-3 px-6 text-center font-semibold">${diem_so}</td>
                <td class="py-3 px-6 text-left"><input type="number" class="grade-input w-20 p-1 border rounded" value="${diem_cc}" min="0" max="10" step="0.1" ${isSubmitted ? 'disabled' : ''}></td>
                <td class="py-3 px-6 text-left"><input type="number" class="grade-input w-20 p-1 border rounded" value="${diem_gk}" min="0" max="10" step="0.1" ${isSubmitted ? 'disabled' : ''}></td>
                <td class="py-3 px-6 text-left"><input type="number" class="grade-input w-20 p-1 border rounded" value="${diem_ck}" min="0" max="10" step="0.1" ${isSubmitted ? 'disabled' : ''}></td>
            </tr>`;
    });
    tbody.innerHTML = html;
}

function updateSubmissionStatusUI(isSubmitted) {
    const statusContainer = document.getElementById('submission-status-container');
    const actionsContainer = document.getElementById('grade-actions');

    if (isSubmitted) {
        statusContainer.innerHTML = 'Bảng điểm đã được gửi đi và không thể chỉnh sửa.';
        statusContainer.className = 'mb-4 p-3 rounded-md text-center font-medium bg-green-100 text-green-800';
        actionsContainer.classList.add('hidden');
    } else {
        statusContainer.innerHTML = 'Bảng điểm chưa được gửi. Bạn có thể nhập và lưu điểm.';
        statusContainer.className = 'mb-4 p-3 rounded-md text-center font-medium bg-yellow-100 text-yellow-800';
        actionsContainer.classList.remove('hidden');
    }
}

function filterRenderedStudents() {
    const searchTerm = document.getElementById('searchSinhVien').value.toLowerCase();
    if (!searchTerm) {
        renderStudentGradeTable(currentCourseStudents);
        return;
    }
    
    const filtered = currentCourseStudents.filter(sv => 
        sv.ho_ten.toLowerCase().includes(searchTerm) || sv.ma_sv.toLowerCase().includes(searchTerm)
    );
    renderStudentGradeTable(filtered);
}

async function saveAllGrades() {
    const monHocId = document.getElementById('chonMonHoc').value;
    if (!monHocId) return alert('Vui lòng chọn một môn học trước khi lưu!');
    
    const rows = document.getElementById('tblSinhVien').querySelectorAll('tr[data-sv-id]');
    const gradesToUpsert = [];

    rows.forEach(row => {
        const sinhVienId = row.getAttribute('data-sv-id');
        const inputs = row.querySelectorAll('.grade-input');
        const diem_chuyen_can = inputs[0].value === '' ? null : parseFloat(inputs[0].value);
        const diem_giua_ky = inputs[1].value === '' ? null : parseFloat(inputs[1].value);
        const diem_cuoi_ky = inputs[2].value === '' ? null : parseFloat(inputs[2].value);

        let diem_so = null;
        // Calculate final grade only if all components are present (adjust formula as needed: 10% CC, 30% GK, 60% CK)
        if (diem_chuyen_can !== null && diem_giua_ky !== null && diem_cuoi_ky !== null) {
            diem_so = (diem_chuyen_can * 0.1 + diem_giua_ky * 0.3 + diem_cuoi_ky * 0.6).toFixed(2);
        }

        gradesToUpsert.push({
            sinh_vien_id: parseInt(sinhVienId),
            mon_hoc_id: parseInt(monHocId),
            diem_chuyen_can,
            diem_giua_ky,
            diem_cuoi_ky,
            diem_so
        });
    });

    if (gradesToUpsert.length === 0) return alert('Không có điểm nào để lưu.');

    const { error } = await supabaseClient.from('diem').upsert(gradesToUpsert, { onConflict: 'sinh_vien_id,mon_hoc_id' });

    if (error) {
        hienLoiApi(error, 'lưu điểm');
        alert('Lưu điểm thất bại! Lỗi: ' + error.message);
    } else {
        alert('Đã lưu toàn bộ điểm thành công!');
        await loadAndRenderAll(); // Reload all data to get fresh grades
    }
}

async function guiBangDiem() {
    const monHocId = document.getElementById('chonMonHoc').value;
    const lopHocId = document.getElementById('chonLopHoc').value;

    if (!monHocId || !lopHocId) return alert('Vui lòng chọn lớp học phần.');

    // Check if all students have all grades
    const studentsInClass = cachedData.sinh_vien.filter(sv => sv.lop_id == lopHocId);
    const gradeMap = new Map();
    cachedData.diem.filter(d => d.mon_hoc_id == monHocId).forEach(d => gradeMap.set(d.sinh_vien_id, d));

    for (const student of studentsInClass) {
        const diemData = gradeMap.get(student.id);
        if (!diemData || diemData.diem_chuyen_can === null || diemData.diem_giua_ky === null || diemData.diem_cuoi_ky === null) {
            return alert(`Lỗi: Sinh viên ${student.ho_ten} (${student.ma_sv}) chưa có đầy đủ điểm. Vui lòng lưu bảng điểm trước khi gửi.`);
        }
    }

    if (!confirm('Bạn có chắc chắn muốn gửi bảng điểm này không? Sau khi gửi, bạn sẽ không thể chỉnh sửa được nữa.')) {
        return;
    }

    const { error } = await supabaseClient
        .from('bang_diem_submission')
        .upsert({
            mon_hoc_id: monHocId,
            lop_id: lopHocId,
            giang_vien_id: currentTeacherId,
            da_gui: true
        }, { onConflict: 'mon_hoc_id, lop_id' });

    if (error) return hienLoiApi(error, 'gửi bảng điểm');

    alert('Gửi bảng điểm thành công!');
    await loadAndRenderAll();
    await loadStudentsByCourseAndClass(); // Re-render the current view to lock it
}

function exportToExcel() {
    const monHocId = document.getElementById('chonMonHoc').value;
    const lopHocId = document.getElementById('chonLopHoc').value;

    if (!monHocId || !lopHocId) {
        return alert('Vui lòng chọn môn học và lớp học trước khi xuất file.');
    }

    const monHocInfo = cachedData.mon_hoc.get(parseInt(monHocId));
    const lopHocInfo = cachedData.lop_hoc.get(parseInt(lopHocId));
    const fileName = `Diem_${monHocInfo?.ten_mon.replace(/\s/g, '_')}_${lopHocInfo?.ten_lop}.csv`;

    const headers = ['Mã SV', 'Họ Tên', 'Email', 'Chuyên ngành', 'Điểm Chuyên Cần', 'Điểm Giữa Kỳ', 'Điểm Cuối Kỳ', 'Điểm Tổng Kết'];
    
    const gradeMap = new Map();
    cachedData.diem.filter(d => d.mon_hoc_id == monHocId).forEach(d => gradeMap.set(d.sinh_vien_id, d));

    const rows = currentCourseStudents.map(sv => {
        const diemData = gradeMap.get(sv.id);
        const rowData = [
            `'${sv.ma_sv}`, // Dấu ' để Excel hiểu là text
            sv.ho_ten,
            sv.email_dang_nhap || '',
            sv.chuyen_nganh?.ten_chuyen_nganh || '',
            diemData?.diem_chuyen_can ?? '',
            diemData?.diem_giua_ky ?? '',
            diemData?.diem_cuoi_ky ?? '',
            diemData?.diem_so ?? ''
        ];
        return rowData.join(',');
    });

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for UTF-8
    csvContent += headers.join(',') + '\r\n';
    csvContent += rows.join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- CÀI ĐẶT (PROFILE SETTINGS) MODAL ---
async function loadTeacherProfile(userId) {
    const { data, error } = await supabaseClient
        .from('giang_vien')
        .select(`id, ho_ten, email_dang_nhap, chuyen_nganh(ten_chuyen_nganh)`)
        .eq('user_id', userId)
        .single();

    if (error) {
        hienLoiApi(error, 'tải thông tin giảng viên');
        return;
    }
    
    currentTeacherId = data.id; // Set the global teacher ID for other functions
    populateProfileModal(data, 'gv');
}

function showProfileTab() {
    // Switches to the profile tab
    showTab('hoSo');
}

function populateProfileModal(data, role) {
    if (!data) return;

    const roleText = 'Giảng viên';
    const idLabel = 'Mã số (ID)';
    const idValue = data.id;

    document.getElementById('profileNameDisplay').textContent = data.ho_ten;
    
    const roleElement = document.getElementById('profileNameDisplay').nextElementSibling;
    if (roleElement && roleElement.tagName === 'P') {
        roleElement.textContent = roleText;
    }
    
    document.getElementById('profileId').value = idValue;
    document.getElementById('profileFullName').value = data.ho_ten;
    document.getElementById('profileMajor').value = data.chuyen_nganh?.ten_chuyen_nganh || 'N/A';
    document.getElementById('profileEmail').value = data.email_dang_nhap;
}