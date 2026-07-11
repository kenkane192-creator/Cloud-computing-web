// --- STATE MANAGEMENT ---
const TABS = [
    { id: 'dashboard', name: 'Bảng điều khiển', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25h2.25A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"></path></svg>' },
    { id: 'lopGiangDay', name: 'Lớp đang giảng dạy', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.25 0m-5.25 0a3.75 3.75 0 00-5.25 0M3 13.5a3 3 0 013-3h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75H3a3 3 0 01-3-3zm18 0a3 3 0 00-3-3h-1.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75H21a3 3 0 003-3zm-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"></path></svg>' },
    { id: 'lichGiangDay', name: 'Lịch dạy trong tuần', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5"></path></svg>' },
    { id: 'hoSo', name: 'Hồ sơ cá nhân', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg>' },
];
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

    setupTabs();
    await loadAndRenderAll();
    
    showTab('dashboard'); // Show dashboard by default
};

// --- TABS ---
function setupTabs() {
    const nav = document.getElementById('teacher-tab-nav');
    nav.innerHTML = '';
    TABS.forEach(tab => {
        const a = document.createElement('a');
        a.href = '#';
        a.id = `btn-${tab.id}`;
        a.className = 'flex items-center space-x-3 rounded-md p-3 text-gray-600 hover:bg-gray-100 font-medium';
        a.innerHTML = `${tab.icon}<span>${tab.name}</span>`;
        a.onclick = (e) => {
            e.preventDefault();
            showTab(tab.id);
        };
        nav.appendChild(a);
    });
}

function showTab(tabId) {
    if (tabId === 'nhapDiem') tabId = 'chiTietLop'; // Alias

    // 1. Hide all tab content panels
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // 2. Un-style all sidebar buttons
    TABS.forEach(tab => {
        const button = document.getElementById(`btn-${tab.id}`);
        if (button) {
            button.classList.remove('bg-orange-100', 'text-orange-700', 'font-semibold');
            button.classList.add('text-gray-600', 'hover:bg-gray-100');
        }
    });

    // 3. Show the target content panel
    const activeContent = document.getElementById(tabId);
    if (activeContent) {
        activeContent.classList.add('active');
    }

    // 4. Style the target sidebar button (if it exists in the sidebar)
    const activeButton = document.getElementById(`btn-${tabId}`);
    if (activeButton) {
        activeButton.classList.remove('text-gray-600', 'hover:bg-gray-100');
        activeButton.classList.add('bg-orange-100', 'text-orange-700', 'font-semibold');
    }
    
    // Rerender dashboard every time it's viewed
    if (tabId === 'dashboard') {
        renderDashboard();
    }
}

// --- MASTER DATA HANDLING ---
async function loadAndRenderAll() {
    // 1. Fetch teaching assignments
    const { data: lichHocData, error: lichHocError } = await supabaseClient
        .from('lich_hoc')
        .select('*, mon_hoc(*, chuyen_nganh(ten_chuyen_nganh)), lop_hoc(*)')
        .eq('giang_vien_id', currentTeacherId);

    if (lichHocError) return hienLoiApi(lichHocError, 'tải lịch giảng dạy');
    cachedData.lich_hoc = lichHocData || [];

    // Reset caches
    cachedData.unique_mon_hoc_ids.clear();
    cachedData.unique_lop_ids.clear();
    cachedData.unique_sinh_vien_ids.clear();
    cachedData.mon_hoc.clear();
    cachedData.lop_hoc.clear();
    cachedData.submission_status.clear();

    if (cachedData.lich_hoc.length === 0) {
        renderDashboard();
        renderLopGiangDayTab();
        updateScheduleView();
        populateCourseDropdown();
        return;
    }

    // 2. Process teaching assignments
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

    // 3. Fetch students based on assigned classes
    const { data: studentData, error: studentError } = await supabaseClient
        .from('sinh_vien')
        .select('id, lop_id, ma_sv, ho_ten, email_dang_nhap, chuyen_nganh(ten_chuyen_nganh)')
        .in('lop_id', Array.from(cachedData.unique_lop_ids));

    if (studentError) return hienLoiApi(studentError, 'tải sinh viên');
    cachedData.sinh_vien = studentData || [];

    // 4. Process student data
    cachedData.sinh_vien.forEach(sv => {
        cachedData.unique_sinh_vien_ids.add(sv.id);
        if (cachedData.lop_hoc.has(sv.lop_id)) {
            cachedData.lop_hoc.get(sv.lop_id).si_so++;
        }
    });

    // 5. Fetch grades and submission statuses in parallel
    const { data: submissionData, error: submissionError } = await supabaseClient
        .from('bang_diem_submission')
        .select('mon_hoc_id, lop_id, da_gui')
        .eq('giang_vien_id', currentTeacherId);
    const { data: diemData, error: diemError } = await supabaseClient
        .from('diem')
        .select('sinh_vien_id, mon_hoc_id, diem_chuyen_can, diem_giua_ky, diem_cuoi_ky, diem_so')
        .in('sinh_vien_id', Array.from(cachedData.unique_sinh_vien_ids))
        .in('mon_hoc_id', Array.from(cachedData.unique_mon_hoc_ids));

    if (diemError) return hienLoiApi(diemError, 'tải điểm');
    if (submissionError) return hienLoiApi(submissionError, 'tải trạng thái nộp điểm');
    cachedData.diem = diemData || [];
    (submissionData || []).forEach(s => cachedData.submission_status.set(`${s.mon_hoc_id}-${s.lop_id}`, s.da_gui));

    // 6. Render UI
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
        const lichHocStr = `${WEEKDAYS[lh.ngay_trong_tuan]} (Ca ${lh.ca_hoc}) - P.${lh.phong_hoc || 'N/A'} (${lh.loai_hinh || 'N/A'})`;

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
    showTab('chiTietLop');

    // Set the dropdowns for display purposes
    document.getElementById('chonMonHoc').value = monHocId;
    await populateClassDropdown(); // This populates the class dropdown
    document.getElementById('chonLopHoc').value = lopId;

    // Directly filter students from the cache and render the table
    const studentsInClass = cachedData.sinh_vien.filter(sv => sv.lop_id == lopId);
    currentCourseStudents = studentsInClass;
    renderStudentGradeTable(currentCourseStudents);
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
    const loaiHinh = event.loai_hinh || '';

    card.innerHTML = `
        <div class="font-bold">${loaiHinh}: ${courseName}</div>
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
        const diem_so = diemData?.diem_so ?? 'N/A';
        const chuyenNganhTen = sv.chuyen_nganh?.ten_chuyen_nganh || 'N/A';

        html += `
            <tr data-sv-id="${sv.id}" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left whitespace-nowrap">${sv.ma_sv}</td>
                <td class="py-3 px-6 text-left whitespace-nowrap">${sv.ho_ten}</td>
                <td class="py-3 px-6 text-left whitespace-nowrap">${sv.email_dang_nhap || 'N/A'}</td>
                <td class="py-3 px-6 text-left whitespace-nowrap">${chuyenNganhTen}</td>
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

async function exportToExcel() {
    const monHocId = document.getElementById('chonMonHoc').value;
    const lopHocId = document.getElementById('chonLopHoc').value;

    if (!monHocId || !lopHocId) {
        return alert('Vui lòng chọn môn học và lớp học trước khi xuất file.');
    }

    // 1. Get course and class info from cache for the filename
    const monHocInfo = cachedData.mon_hoc.get(parseInt(monHocId));
    const lopHocInfo = cachedData.lop_hoc.get(parseInt(lopHocId));
    const fileName = `Diem_${monHocInfo?.ten_mon.replace(/\s/g, '_')}_${lopHocInfo?.ten_lop}.csv`;

    // 2. Fetch the detailed grade data directly for reliability
    const { data: students, error: studentError } = await supabaseClient
        .from('sinh_vien')
        .select('ma_sv, ho_ten, email_dang_nhap, chuyen_nganh(ten_chuyen_nganh), diem!inner(diem_chuyen_can, diem_giua_ky, diem_cuoi_ky, diem_so)')
        .eq('lop_id', lopHocId)
        .eq('diem.mon_hoc_id', monHocId);

    if (studentError) return hienLoiApi(studentError, 'xuất bảng điểm');
    if (!students || students.length === 0) return alert('Không có dữ liệu điểm của lớp này để xuất.');

    // 3. Build CSV content
    const headers = ['Mã SV', 'Họ Tên', 'Email', 'Chuyên ngành', 'Điểm Chuyên Cần', 'Điểm Giữa Kỳ', 'Điểm Cuối Kỳ', 'Điểm Tổng Kết'];
    const rows = students.map(sv => {
        const diem = sv.diem[0] || {};
        const rowData = [
            `'${sv.ma_sv}`, // Dấu ' để Excel hiểu là text
            sv.ho_ten,
            sv.email_dang_nhap || '',
            sv.chuyen_nganh?.ten_chuyen_nganh || '',
            diem.diem_chuyen_can ?? '',
            diem.diem_giua_ky ?? '',
            diem.diem_cuoi_ky ?? '',
            diem.diem_so ?? ''
        ];
        return rowData.join(',');
    });

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for UTF-8
    csvContent += headers.join(',') + '\r\n';
    csvContent += rows.join('\r\n');

    // 4. Trigger download
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

    // Populate new header
    document.getElementById('txtWelcomeTeacher').textContent = `Chào mừng, ${data.ho_ten}.`;
    document.getElementById('profileNameShort').textContent = data.ho_ten;
    const initials = data.ho_ten.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('profileAvatar').textContent = initials;
}