// --- STATE MANAGEMENT ---
let scheduleInitialized = false;
let cachedData = { 
    mon_hoc: new Map(),
    lich_hoc: [],
    diem: [],
    sinh_vien: null
};
const courseColors = ['#3182ce', '#dd6b20', '#38a169', '#805ad5', '#d53f8c'];
let colorIndex = 0;

// --- INITIALIZATION & TABS ---
window.onload = async function() {
    const session = await yeuCauPhien('sv');
    if (!session) return;
    
    // Initialize tab buttons
    document.querySelectorAll('.tab-btn-tailwind').forEach(button => {
        button.classList.add('whitespace-nowrap', 'py-4', 'px-1', 'border-b-2', 'font-medium', 'text-sm', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'mr-4', 'cursor-pointer', 'border-transparent');
    });

    loadStudentProfile(session.user);
    showTab('dashboard'); // Default to dashboard
};

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-btn-tailwind').forEach(btn => {
        btn.classList.remove('text-indigo-600', 'border-indigo-500');
        btn.classList.add('text-gray-500', 'border-transparent');
    });
    
    document.getElementById(tabId).classList.add('active');
    const activeBtn = document.getElementById('btn' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-500', 'border-transparent');
        activeBtn.classList.add('text-indigo-600', 'border-indigo-500');
    }

    // Initialize schedule on first view
    if (tabId === 'lichHoc' && !scheduleInitialized) {
        // The data is already loaded by loadStudentProfile,
        // so we just need to ensure the tab is visible.
        scheduleInitialized = true;
    }
    if (tabId === 'dashboard') {
        renderDashboard();
    }
    if (tabId === 'hoSo') {
        // Data is already loaded, nothing to do here, just show the tab.
    }
}

// --- DATA LOADING ---
async function loadStudentProfile(user) {
    const { data: sinh_vien, error } = await supabaseClient
        .from('sinh_vien')
        .select(`
            *,
            chuyen_nganh ( ten_chuyen_nganh ), lop_hoc ( ten_lop )
        `)
        .eq('user_id', user.id)
        .single();

    if (error) {
        hienLoiApi(error, 'tải hồ sơ sinh viên');
        document.getElementById('txtWelcome').innerText = `Tài khoản: ${user.email}`;
        return;
    }

    if (!sinh_vien) {
        document.getElementById('txtWelcome').innerText = `Tài khoản: ${user.email} (Chưa có hồ sơ — liên hệ Admin)`;
        return;
    }

    cachedData.sinh_vien = sinh_vien; // Cache student profile
    // Populate Welcome text and Profile Tab
    document.getElementById('txtWelcome').innerText = `👋 Xin chào, ${sinh_vien.ho_ten} (${sinh_vien.ma_sv})`;
    
    // Populate the profile tab
    populateProfileTab(sinh_vien);
    // Load grades
    await taiBangDiem(sinh_vien.id);
    // Load schedule if student has a class
    if (sinh_vien.lop_id) {
        await taiLichHoc(sinh_vien.lop_id);
    }
    // Render tabs that depend on loaded data
    renderDashboard();
    renderMonHocTab();
}

function populateProfileTab(data) {
    if (!data) return;

    // --- Read-only fields ---
    document.getElementById('profileNameDisplay').textContent = data.ho_ten;
    document.getElementById('profileId').value = data.ma_sv;
    document.getElementById('profileFullName').value = data.ho_ten;
    document.getElementById('profileMajor').value = data.chuyen_nganh?.ten_chuyen_nganh || 'N/A';
    document.getElementById('profileClass').value = data.lop_hoc?.ten_lop || 'N/A';
    document.getElementById('profileEmail').value = data.email_dang_nhap;
    
    // --- Editable fields ---
    document.getElementById('profilePhone').value = data.so_dien_thoai || '';
    document.getElementById('profileAddress').value = data.dia_chi || '';
    document.getElementById('profileAvatarUrl').value = data.anh_dai_dien_url || '';
    document.getElementById('profileAvatar').src = data.anh_dai_dien_url || 'https://via.placeholder.com/96';
}

async function updateStudentProfile() {
    const updates = {
        so_dien_thoai: document.getElementById('profilePhone').value,
        dia_chi: document.getElementById('profileAddress').value,
        anh_dai_dien_url: document.getElementById('profileAvatarUrl').value,
    };

    const { error } = await supabaseClient
        .from('sinh_vien')
        .update(updates)
        .eq('id', cachedData.sinh_vien.id);

    if (error) return hienLoiApi(error, 'cập nhật hồ sơ');
    
    alert('Cập nhật hồ sơ thành công!');
    document.getElementById('profileAvatar').src = updates.anh_dai_dien_url || 'https://via.placeholder.com/96';
}

async function taiBangDiem(sinhVienId) {
    const { data: diem, error } = await supabaseClient
        .from('diem')
        .select('diem_so, mon_hoc ( id, ten_mon )')
        .eq('sinh_vien_id', sinhVienId);

    if (error) return hienLoiApi(error, 'tải điểm');
    cachedData.diem = diem || [];

    const tbody = document.getElementById('tblDiem');
    if (!diem || diem.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">Chưa có dữ liệu điểm số.</td></tr>`;
        return;
    }
    
    let html = '';
    diem.forEach(d => {
        const isPass = d.diem_so >= 5;
        const xepLoai = isPass 
            ? `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Đạt</span>`
            : `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Học lại</span>`;
        html += `<tr class="border-b border-gray-200 hover:bg-gray-50">
            <td class="py-3 px-6 text-left whitespace-nowrap font-medium">${d.mon_hoc.ten_mon}</td>
            <td class="py-3 px-6 text-center font-semibold">${d.diem_so}</td>
            <td class="py-3 px-6 text-center">${xepLoai}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function renderDashboard() {
    document.getElementById('stat-mon-hoc').textContent = cachedData.lich_hoc.length;
}

function renderMonHocTab() {
    const tbody = document.getElementById('tblMonHoc');
    if (cachedData.lich_hoc.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500">Chưa có dữ liệu môn học.</td></tr>`;
        return;
    }

    const diemMap = new Map(cachedData.diem.map(d => [d.mon_hoc.id, d.diem_so]));
    const WEEKDAYS = { 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7', 7: 'CN' };

    let html = '';
    cachedData.lich_hoc.forEach(lh => {
        const diem_so = diemMap.get(lh.mon_hoc_id);
        let statusHtml;
        if (diem_so !== undefined) {
            statusHtml = diem_so >= 5 
                ? `<span class="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-semibold">Qua môn</span>`
                : `<span class="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs font-semibold">Học lại</span>`;
        } else {
            statusHtml = `<span class="bg-blue-200 text-blue-700 py-1 px-3 rounded-full text-xs font-semibold">Đang học</span>`;
        }

        const lichHocStr = `${WEEKDAYS[lh.ngay_trong_tuan]} (Ca ${lh.ca_hoc}) - P.${lh.phong_hoc || 'N/A'}`;

        html += `<tr class="border-b border-gray-200 hover:bg-gray-50">
            <td class="py-3 px-6 text-left font-medium">${lh.mon_hoc.ten_mon}</td>
            <td class="py-3 px-6 text-left">${lh.giang_vien.ho_ten}</td>
            <td class="py-3 px-6 text-left">${lichHocStr}</td>
            <td class="py-3 px-6 text-center">${statusHtml}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// --- SCHEDULE (LỊCH HỌC) TAB ---
function getCardColor(courseId) {
    if (!cachedData.mon_hoc.has(courseId)) return '#6366f1'; // Default color
    
    const course = cachedData.mon_hoc.get(courseId);
    if (!course.color) {
        course.color = courseColors[colorIndex % courseColors.length];
        colorIndex++;
    }
    return course.color;
}

async function taiLichHoc(lopId) {
    const { data: scheduleData, error } = await supabaseClient
        .from('lich_hoc')
        .select(`
            *,
            mon_hoc ( id, ten_mon ),
            giang_vien ( ho_ten ),
            lop_hoc ( ten_lop )
        `)
        .eq('lop_id', lopId);
        
    if (error) return hienLoiApi(error, 'tải lịch học');
    cachedData.lich_hoc = scheduleData || [];

    // Populate mon_hoc cache from schedule data instead of a separate API call
    (scheduleData || []).forEach(event => {
        if (event.mon_hoc && !cachedData.mon_hoc.has(event.mon_hoc.id)) {
            cachedData.mon_hoc.set(event.mon_hoc.id, { ten_mon: event.mon_hoc.ten_mon });
        }
    });

    // Clear existing events
    document.querySelectorAll('.event-card').forEach(card => card.remove());

    (scheduleData || []).forEach(renderEventCard);
}

function renderEventCard(event) {
    // DB: Mon=1..Sun=7. Grid: Mon=1..Sat=6, Sun=0.
    const dayOfWeek = event.ngay_trong_tuan;
    const gridDayId = dayOfWeek === 7 ? 0 : dayOfWeek;
    const timeSlotId = event.ca_hoc; // 'sáng', 'chiều', 'tối'

    const slot = document.getElementById(`slot-${gridDayId}-${timeSlotId}`);
    if (!slot) {
        console.warn(`Slot not found: slot-${gridDayId}-${timeSlotId}`);
        return;
    }
    
    const card = document.createElement('div');
    card.className = 'event-card rounded-lg p-2 text-sm shadow text-white space-y-1';
    card.style.backgroundColor = getCardColor(event.mon_hoc_id);
    
    const courseName = event.mon_hoc?.ten_mon || 'N/A';
    const teacherName = event.giang_vien?.ho_ten || 'N/A';
    const homeroomClassName = event.lop_hoc?.ten_lop || 'N/A';

    card.innerHTML = `
        <div class="font-bold">${courseName}</div>
        <div class="text-xs">Lớp: ${homeroomClassName}</div>
        <div class="text-xs">GV: ${teacherName}</div>
        <div class="text-xs">Phòng: ${event.phong_hoc || 'N/A'}</div>
    `;
    slot.appendChild(card);
}

function showProfileTab() {
    showTab('hoSo');
}