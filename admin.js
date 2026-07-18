// --- CONFIG & STATE ---
const TABS = [
    { id: 'dashboard', name: 'Bảng điều khiển', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25h2.25A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"></path></svg>' },
    { id: 'tai-khoan', name: 'Tổng quan Tài khoản', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.318.239-.636.354-.96M15 19.128a2.25 2.25 0 01-2.25-2.25v-6.75a2.25 2.25 0 012.25-2.25h.003l.001 0a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25h-.003l-.001 0z"></path></svg>' },
    { id: 'chuyen-nganh', name: 'Quản lý Chuyên Ngành', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.04.001m15.482 0l.04-.001m-15.482 0A2.25 2.25 0 015.91 8.25h12.18a2.25 2.25 0 012.15 1.897m-15.482 0A2.25 2.25 0 005.91 12h12.18a2.25 2.25 0 002.15-1.897m-15.482 0l.04.001m15.482 0l-.04-.001"></path></svg>' },
    { id: 'mon-hoc', name: 'Quản lý Môn Học', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-9-5.747h18"></path></svg>' },
    { id: 'lop-hoc', name: 'Quản lý Lớp SH', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.25 0m-5.25 0a3.75 3.75 0 00-5.25 0M3 13.5a3 3 0 013-3h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75H3a3 3 0 01-3-3zm18 0a3 3 0 00-3-3h-1.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75H21a3 3 0 003-3zm-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"></path></svg>' },
    { id: 'lich-hoc', name: 'Quản lý Lịch Học', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5"></path></svg>' },
    { id: 'duyet-diem', name: 'Duyệt Bảng Điểm', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
    { id: 'sinh-vien', name: 'Cấp tài khoản SV', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766z"></path></svg>' },
    { id: 'giang-vien', name: 'Cấp tài khoản GV', icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766z"></path></svg>' },
];
let cachedData = {
    giang_vien: [],
    sinh_vien: [],
    chuyen_nganh: [],
    mon_hoc: [],
    lop_hoc: [],
    lich_hoc: [],
    combinedUsers: [],
    submissions: [],
};
const loadedData = new Set(); // Tracks which data types have been loaded
let studentChart = null; // To hold chart instance

// --- INITIALIZATION ---
window.onload = async function() {
    const session = await yeuCauPhien('admin');
    if (!session) return;

    setupTabs();
    // Start by showing the first tab, which will trigger its own data loading.
    showTab(TABS[0].id);
};

// --- UI SETUP ---
function setupTabs() {
    const nav = document.getElementById('tab-nav');
    nav.innerHTML = '';
    TABS.forEach(tab => {
        const a = document.createElement('a');
        a.href = '#';
        a.id = `btn-tab-${tab.id}`;
        a.className = 'flex items-center space-x-3 rounded-md p-3 text-gray-600 hover:bg-gray-100 font-medium';
        a.innerHTML = `${tab.icon}<span>${tab.name}</span>`;
        a.onclick = (e) => {
            e.preventDefault();
            showTab(tab.id);
        };
        nav.appendChild(a);
    });
}

async function showTab(tabId) {
    // 1. Hide all tab content panels
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // 2. Un-style all sidebar buttons
    TABS.forEach(tab => {
        const button = document.getElementById(`btn-tab-${tab.id}`);
        if (button) {
            button.classList.remove('bg-blue-100', 'text-blue-700', 'font-semibold');
            button.classList.add('text-gray-600', 'hover:bg-gray-100');
        }
    });

    // 3. Show the target content panel
    const activeContent = document.getElementById(`tab-${tabId}`);
    if (activeContent) {
        activeContent.classList.add('active');
    }

    // 4. Style the target sidebar button
    const activeButton = document.getElementById(`btn-tab-${tabId}`);
    if (activeButton) {
        activeButton.classList.remove('text-gray-600', 'hover:bg-gray-100');
        activeButton.classList.add('bg-blue-100', 'text-blue-700', 'font-semibold');
    }

    // Lazy load data based on the selected tab
    try {
        switch (tabId) {
            case 'dashboard':
                await ensureDataLoaded(['chuyen_nganh', 'mon_hoc', 'sinh_vien', 'giang_vien']);
                renderDashboard();
                break;
            case 'tai-khoan':
                await ensureDataLoaded(['giang_vien', 'sinh_vien', 'chuyen_nganh', 'lop_hoc']);
                populateAllDropdowns();
                renderTaiKhoanTabs();
                break;
            case 'chuyen-nganh':
                await ensureDataLoaded(['chuyen_nganh']);
                renderChuyenNganhTab();
                break;
            case 'mon-hoc':
                await ensureDataLoaded(['mon_hoc', 'chuyen_nganh']);
                populateAllDropdowns();
                renderMonHocTab();
                break;
            case 'lop-hoc':
                await ensureDataLoaded(['lop_hoc', 'chuyen_nganh']);
                populateAllDropdowns();
                renderLopHocTab();
                break;
            case 'lich-hoc':
                await ensureDataLoaded(['lich_hoc', 'mon_hoc', 'lop_hoc', 'giang_vien']);
                populateAllDropdowns();
                renderLichHocTab();
                break;
            case 'duyet-diem':
                await ensureDataLoaded(['submissions', 'mon_hoc', 'lop_hoc']);
                renderDuyetDiemTab();
                break;
            case 'sinh-vien':
                await ensureDataLoaded(['sinh_vien', 'chuyen_nganh', 'lop_hoc']);
                populateAllDropdowns();
                renderTaiKhoanTabs();
                break;
            case 'giang-vien':
                await ensureDataLoaded(['giang_vien', 'chuyen_nganh']);
                populateAllDropdowns();
                renderTaiKhoanTabs();
                break;
        }
    } catch (e) {
        console.error(`Error loading data for tab ${tabId}:`, e);
        // Error is already displayed by hienLoiApi inside ensureDataLoaded
    }
}

// --- MASTER DATA HANDLING ---
async function ensureDataLoaded(types = []) {
    const typesToLoad = types.filter(t => !loadedData.has(t));
    if (typesToLoad.length === 0) return;

    const promises = {};
    if (typesToLoad.includes('chuyen_nganh')) promises.chuyen_nganh = supabaseClient.from('chuyen_nganh').select('*').order('id', { ascending: true });
    if (typesToLoad.includes('mon_hoc')) promises.mon_hoc = supabaseClient.from('mon_hoc').select('*, chuyen_nganh(ten_chuyen_nganh)').order('id', { ascending: true });
    if (typesToLoad.includes('lop_hoc')) promises.lop_hoc = supabaseClient.from('lop_hoc').select('*, chuyen_nganh(ten_chuyen_nganh)').order('id', { ascending: true });
    if (typesToLoad.includes('giang_vien')) promises.giang_vien = supabaseClient.from('giang_vien').select('*, chuyen_nganh(ten_chuyen_nganh)').order('id', { ascending: true });
    if (typesToLoad.includes('sinh_vien')) promises.sinh_vien = supabaseClient.from('sinh_vien').select('*, chuyen_nganh(ten_chuyen_nganh), lop_hoc(ten_lop)').order('id', { ascending: true });
    if (typesToLoad.includes('lich_hoc')) promises.lich_hoc = supabaseClient.from('lich_hoc').select('*, mon_hoc(ten_mon), lop_hoc(ten_lop), giang_vien(ho_ten)').order('id', { ascending: true });
    if (typesToLoad.includes('submissions')) promises.submissions = supabaseClient.from('bang_diem_submission').select('*, mon_hoc(ten_mon), lop_hoc(ten_lop), giang_vien(ho_ten)').order('ngay_gui', { ascending: false });

    const promiseKeys = Object.keys(promises);
    if (promiseKeys.length === 0) return;

    const results = await Promise.all(Object.values(promises));

    for (let i = 0; i < results.length; i++) {
        const key = promiseKeys[i];
        const { data, error } = results[i];
        if (error) {
            hienLoiApi(error, `tải ${key}`);
            throw new Error(`Failed to load ${key}`);
        }
        cachedData[key] = data || [];
        loadedData.add(key);
    }
}

async function reloadData(types = []) {
    types.forEach(t => loadedData.delete(t));
    await ensureDataLoaded(types);
}

function populateAllDropdowns() {
    populateDropdowns('monHocChuyenNganh', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', '-- Chọn Chuyên ngành --');
    populateDropdowns('svChuyenNganh', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', '-- Chọn Chuyên ngành --');
    populateDropdowns('gvChuyenNganh', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', '-- Chọn Chuyên ngành --');
    populateDropdowns('userChuyenNganhFilter', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', 'Tất cả chuyên ngành');
    populateDropdowns('lichHocMonHoc', cachedData.mon_hoc, 'id', 'ten_mon', '-- Chọn Môn học --');
    
    // Custom population for combined Lớp & Loại hình dropdown
    const lichHocLopEl = document.getElementById('lichHocLop');
    if (lichHocLopEl) {
        let optionsHtml = `<option value="">-- Chọn Lớp & Loại hình --</option>`;
        (cachedData.lop_hoc || []).forEach(lop => {
            optionsHtml += `<option value="${lop.id}-Lý thuyết">${lop.ten_lop} - Lý thuyết</option>`;
            optionsHtml += `<option value="${lop.id}-Thực hành">${lop.ten_lop} - Thực hành</option>`;
        });
        lichHocLopEl.innerHTML = optionsHtml;
    }
    populateDropdowns('lopHocChuyenNganh', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', '-- Chọn Chuyên ngành --');
    filterLopHocDropdown(); // Initialize student class dropdown
}

function populateDropdowns(selectId, data, valueField, textField, defaultOptionText) {
    const selectEl = document.getElementById(selectId);
    if (!selectEl) return;
    let optionsHtml = `<option value="">${defaultOptionText}</option>`;
    (data || []).forEach(item => {
        optionsHtml += `<option value="${item[valueField]}">${item[textField]}</option>`;
    });
    selectEl.innerHTML = optionsHtml;
}

function handleMonHocSelectionChange() {
    const monHocId = document.getElementById('lichHocMonHoc').value;
    const lichHocLopEl = document.getElementById('lichHocLop');

    if (!monHocId) {
        populateDropdowns('lichHocGiangVien', [], 'id', 'ho_ten', '-- Chọn Môn học trước --');
        lichHocLopEl.innerHTML = `<option value="">-- Chọn Môn học trước --</option>`;
        return;
    }

    const selectedMonHoc = cachedData.mon_hoc.find(mh => mh.id == monHocId);
    if (!selectedMonHoc) return;

    const chuyenNganhId = selectedMonHoc.chuyen_nganh_id;

    // Filter and populate teachers
    const filteredGVs = cachedData.giang_vien.filter(gv => gv.chuyen_nganh_id == chuyenNganhId);
    populateDropdowns('lichHocGiangVien', filteredGVs, 'id', 'ho_ten', '-- Chọn Giảng viên --');

    // Filter and populate classes
    const filteredLops = cachedData.lop_hoc.filter(lop => lop.chuyen_nganh_id == chuyenNganhId);
    let optionsHtml = `<option value="">-- Chọn Lớp & Loại hình --</option>`;
    filteredLops.forEach(lop => {
        optionsHtml += `<option value="${lop.id}-Lý thuyết">${lop.ten_lop} - Lý thuyết</option>`;
        optionsHtml += `<option value="${lop.id}-Thực hành">${lop.ten_lop} - Thực hành</option>`;
    });
    lichHocLopEl.innerHTML = optionsHtml;
}

function filterLopHocDropdown() {
    const chuyenNganhId = document.getElementById('svChuyenNganh').value;
    const filteredLops = chuyenNganhId 
        ? cachedData.lop_hoc.filter(lop => lop.chuyen_nganh_id == chuyenNganhId) 
        : [];
    populateDropdowns('svLopHoc', filteredLops, 'id', 'ten_lop', '-- Chọn Lớp Sinh Hoạt --');
}

function createActionButtons(id, deleteFnName, editFnName = null) {
    return `
        <div class="flex item-center justify-center space-x-4">
            <button ${editFnName ? `onclick="${editFnName}(${id})"` : 'disabled'} class="w-5 h-5 text-gray-500 ${editFnName ? 'hover:text-blue-600' : 'cursor-not-allowed opacity-50'}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
            </button>
            <button onclick="${deleteFnName}(${id})" class="w-5 h-5 text-gray-500 hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </div>`;
}

function generateStudentEmail() {
    const maSV = document.getElementById('svMa').value.trim();
    const emailInput = document.getElementById('svEmail');
    if (maSV) {
        emailInput.value = `${maSV}@student.edu.vn`;
    } else {
        emailInput.value = '';
    }
}

// --- RENDER FUNCTIONS FOR EACH TAB ---

function renderDashboard() {
    // Update stat cards
    document.getElementById('stat-chuyen-nganh').textContent = cachedData.chuyen_nganh.length;
    document.getElementById('stat-mon-hoc').textContent = cachedData.mon_hoc.length;
    document.getElementById('stat-sinh-vien').textContent = cachedData.sinh_vien.length;
    document.getElementById('stat-giang-vien').textContent = cachedData.giang_vien.length;

    // Prepare and render chart
    const studentCountsByMajor = cachedData.chuyen_nganh.map(major => ({
        id: major.id,
        name: major.ten_chuyen_nganh,
        count: cachedData.sinh_vien.filter(sv => sv.chuyen_nganh_id === major.id).length
    }));

    const chartLabels = studentCountsByMajor.map(m => m.name);
    const chartData = studentCountsByMajor.map(m => m.count);

    const ctx = document.getElementById('studentMajorChart').getContext('2d');
    if (studentChart) {
        studentChart.destroy();
    }
    studentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Số lượng sinh viên',
                data: chartData,
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#F97316'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: false }
            }
        }
    });
}

function renderDuyetDiemTab() {
    const tbody = document.getElementById('tblDuyetDiem');
    if (!tbody) return;

    tbody.innerHTML = cachedData.submissions.map(sub => {
        const status = sub.da_duyet
            ? `<span class="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-semibold">Đã duyệt</span>`
            : `<span class="bg-yellow-200 text-yellow-700 py-1 px-3 rounded-full text-xs font-semibold">Chờ duyệt</span>`;
        
        const actionButton = sub.da_duyet
            ? `<button onclick="exportApprovedGrades(${sub.mon_hoc_id}, ${sub.lop_id})" class="text-green-600 hover:underline text-sm font-semibold">Xuất Excel</button>`
            : `<button onclick="showApprovalModal(${sub.mon_hoc_id}, ${sub.lop_id})" class="text-blue-600 hover:underline text-sm font-semibold">Xem & Duyệt</button>`;

        return `
            <tr class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6 text-left font-medium">${sub.mon_hoc.ten_mon}</td>
                <td class="py-3 px-6 text-left">${sub.lop_hoc.ten_lop}</td>
                <td class="py-3 px-6 text-left">${sub.giang_vien.ho_ten}</td>
                <td class="py-3 px-6 text-center">${new Date(sub.ngay_gui).toLocaleString('vi-VN')}</td>
                <td class="py-3 px-6 text-center">${status}</td>
                <td class="py-3 px-6 text-center">${actionButton}</td>
            </tr>
        `;
    }).join('');
}

function renderChuyenNganhTab() {
    const tbody = document.getElementById('tblChuyenNganh');
    tbody.innerHTML = cachedData.chuyen_nganh.map(cn => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${cn.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cn.ten_chuyen_nganh}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">${createActionButtons(cn.id, 'xoaChuyenNganh')}</td>
        </tr>
    `).join('');
}

async function themChuyenNganh() {
    const ten = document.getElementById('tenChuyenNganh').value.trim();
    if (!ten) return alert('Vui lòng nhập tên!');
    const { error } = await supabaseClient.from('chuyen_nganh').insert([{ ten_chuyen_nganh: ten }]);
    if (error) return alert('Lỗi: ' + error.message);
    document.getElementById('tenChuyenNganh').value = '';
    await reloadData(['chuyen_nganh']);
    renderChuyenNganhTab();
    populateAllDropdowns();
}

async function xoaChuyenNganh(id) {
    if (!confirm(`Bạn có chắc chắn muốn xóa chuyên ngành có ID=${id}? CẢNH BÁO: Hành động này sẽ xóa tất cả Môn học và Lớp học thuộc chuyên ngành này. Không thể hoàn tác.`)) return;
    const { error } = await supabaseClient.from('chuyen_nganh').delete().eq('id', id);
    if (error) return alert('Lỗi: ' + error.message);
    // Clear all caches as this is a major destructive action with cascades
    loadedData.clear();
    await showTab('chuyen_nganh'); // Reload current tab
}

// --- MÔN HỌC ---
function renderMonHocTab() {
    const tbody = document.getElementById('tblMonHoc');
    tbody.innerHTML = cachedData.mon_hoc.map(mh => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${mh.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${mh.ten_mon}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${mh.chuyen_nganh?.ten_chuyen_nganh || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">${createActionButtons(mh.id, 'xoaMonHoc')}</td>
        </tr>
    `).join('');
}

async function themMonHoc() {
    const ten = document.getElementById('tenMonHoc').value.trim();
    const chuyenNganhId = document.getElementById('monHocChuyenNganh').value;
    if (!ten || !chuyenNganhId) return alert('Vui lòng nhập tên môn và chọn chuyên ngành!');
    
    const { error } = await supabaseClient.from('mon_hoc').insert([{ ten_mon: ten, chuyen_nganh_id: chuyenNganhId }]);
    if (error) return alert('Lỗi: ' + error.message);
    
    document.getElementById('tenMonHoc').value = '';
    document.getElementById('monHocChuyenNganh').value = '';
    await reloadData(['mon_hoc']);
    renderMonHocTab();
    populateAllDropdowns();
}

async function xoaMonHoc(id) {
    if (!confirm(`Bạn có chắc chắn muốn xóa môn học có ID=${id}? Hành động này sẽ xóa toàn bộ lịch học và điểm số liên quan đến môn này.`)) return;
    const { error } = await supabaseClient.from('mon_hoc').delete().eq('id', id);
    if (error) return alert('Lỗi: ' + error.message);
    // Clear caches that depend on mon_hoc
    loadedData.delete('mon_hoc');
    loadedData.delete('lich_hoc');
    await showTab('mon-hoc');
}

// --- LỚP HỌC (LỚP SINH HOẠT) ---
function renderLopHocTab() {
    const tbody = document.getElementById('tblLopHoc');
    if (!tbody) return;
    tbody.innerHTML = cachedData.lop_hoc.map(lh => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${lh.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lh.ten_lop}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lh.chuyen_nganh?.ten_chuyen_nganh || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">${createActionButtons(lh.id, 'xoaLopHoc')}</td>
        </tr>
    `).join('');
}

async function themLopHoc() {
    const ten = document.getElementById('tenLopHoc').value.trim();
    const chuyenNganhId = document.getElementById('lopHocChuyenNganh').value;
    if (!ten || !chuyenNganhId) return alert('Vui lòng nhập tên lớp và chọn chuyên ngành!');
    
    const { error } = await supabaseClient.from('lop_hoc').insert([{ ten_lop: ten, chuyen_nganh_id: chuyenNganhId }]);
    if (error) return alert('Lỗi: ' + error.message);
    
    document.getElementById('tenLopHoc').value = '';
    await reloadData(['lop_hoc']);
    renderLopHocTab();
    populateAllDropdowns();
}

async function xoaLopHoc(id) {
    if (!confirm(`Bạn có chắc chắn muốn xóa lớp học có ID=${id}? Hành động này sẽ xóa các lịch học liên quan và gỡ sinh viên khỏi lớp.`)) return;
    const { error } = await supabaseClient.from('lop_hoc').delete().eq('id', id);
    if (error) return alert('Lỗi: ' + error.message);
    loadedData.delete('lop_hoc');
    loadedData.delete('lich_hoc');
    loadedData.delete('sinh_vien');
    await showTab('lop-hoc');
}

// --- LỊCH HỌC ---
function renderLichHocTab() {
    const WEEKDAYS = { 1: 'Thứ 2', 2: 'Thứ 3', 3: 'Thứ 4', 4: 'Thứ 5', 5: 'Thứ 6', 6: 'Thứ 7', 7: 'Chủ Nhật' };
    const tbody = document.getElementById('tblLichHoc');
    tbody.innerHTML = cachedData.lich_hoc.map(lh => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${lh.mon_hoc.ten_mon}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lh.lop_hoc.ten_lop}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${WEEKDAYS[lh.ngay_trong_tuan]} - Ca ${lh.ca_hoc} (${lh.loai_hinh || 'N/A'})</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lh.giang_vien.ho_ten}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">${createActionButtons(lh.id, 'xoaLichHoc', 'openRosterModal')}</td>
        </tr>
    `).join('');
}

async function themLichHoc() {
    const lopVaLoaiHinh = document.getElementById('lichHocLop').value;
    if (!lopVaLoaiHinh) {
        return alert('Vui lòng chọn Lớp & Loại hình!');
    }
    const [lopId, loaiHinh] = lopVaLoaiHinh.split('-');

    const lichHoc = {
        mon_hoc_id: document.getElementById('lichHocMonHoc').value,
        lop_id: lopId,
        giang_vien_id: document.getElementById('lichHocGiangVien').value,
        ngay_trong_tuan: document.getElementById('ngayTrongTuan').value,
        ca_hoc: document.getElementById('caHoc').value,
        loai_hinh: loaiHinh,
        phong_hoc: document.getElementById('phongHoc').value.trim(),
    };

    for (const key in lichHoc) {
        if (!lichHoc[key]) {
            return alert(`Vui lòng điền đầy đủ thông tin! Thiếu: ${key}`);
        }
    }

    const { error } = await supabaseClient.from('lich_hoc').insert([lichHoc]);
    if (error) {
        if (error.code === '23505') return alert('Lỗi: Lịch học bị trùng! Giảng viên hoặc Lớp đã có lịch vào thời điểm này.');
        return alert('Lỗi: ' + error.message);
    }
    await reloadData(['lich_hoc']);
    renderLichHocTab();
}

async function xoaLichHoc(id) {
    if (!confirm(`Bạn có chắc chắn muốn xóa lịch học có ID=${id}?`)) return;
    const { error } = await supabaseClient.from('lich_hoc').delete().eq('id', id);
    if (error) return alert('Lỗi: ' + error.message);
    await reloadData(['lich_hoc']);
    renderLichHocTab();
}

// --- TÀI KHOẢN ---
async function taoTaiKhoanSV() {
    const [ma_sv, ho_ten, password, chuyen_nganh_id, lop_id] =
        ['svMa', 'svTen', 'svPassword', 'svChuyenNganh', 'svLopHoc'].map(id => document.getElementById(id).value.trim());

    const email = document.getElementById('svEmail').value.trim(); // Get the auto-generated email
    const msg = document.getElementById('sv-msg');

    try {
        if (!ma_sv || !ho_ten || !password || !chuyen_nganh_id || !lop_id) {
            throw new Error('Vui lòng điền đầy đủ thông tin, bao gồm cả Mã SV và Lớp Sinh Hoạt.');
        }
        if (!email) {
            throw new Error('Email không thể để trống. Vui lòng nhập Mã sinh viên.');
        }

        msg.style.color = 'blue'; msg.innerText = 'Đang tạo...';

        const tam = taoSupabaseTam();
        const { data: authData, error: authError } = await tam.auth.signUp({ email, password });

        if (authError) {
            if (authError.message.includes("User already registered")) {
                throw new Error(`Lỗi: Email '${email}' (từ Mã SV) đã tồn tại. Vui lòng kiểm tra lại Mã sinh viên.`);
            }
            if (authError.message.includes("invalid format")) {
                throw new Error(`Lỗi: Mã sinh viên '${ma_sv}' chứa ký tự không hợp lệ để tạo email.`);
            }
            throw authError;
        }

        if (authData.user) {
            const { error: profileError } = await supabaseClient
                .from('sinh_vien')
                .insert([{ ma_sv, ho_ten, email_dang_nhap: email, chuyen_nganh_id, lop_id, user_id: authData.user.id }]);
            if (profileError) {
                if (profileError.code === '23505') { // unique constraint violation
                    throw new Error(`Lỗi: Mã sinh viên '${ma_sv}' đã tồn tại trong hệ thống. (Lưu ý: một tài khoản đăng nhập có thể đã được tạo, cần xóa thủ công nếu có lỗi).`);
                }
                throw new Error('Tài khoản đã tạo, nhưng lưu hồ sơ SV thất bại: ' + profileError.message + '. Vui lòng xóa tài khoản đăng nhập thủ công.');
            }
        }

        msg.style.color = 'green';
        msg.innerText = 'Tạo tài khoản SV thành công: ' + authData.user.email;
        ['svMa', 'svTen', 'svPassword', 'svEmail'].forEach(id => document.getElementById(id).value = '');
        ['svChuyenNganh', 'svLopHoc'].forEach(id => document.getElementById(id).value = '');
        await reloadData(['sinh_vien']);
        renderTaiKhoanTabs();

    } catch (e) {
        msg.style.color = 'red'; msg.innerText = e.message;
    }
}

async function nhapSinhVienTuExcel() {
    const fileInput = document.getElementById('svExcelFile');
    const msgDiv = document.getElementById('sv-import-msg');

    if (fileInput.files.length === 0) {
        msgDiv.innerHTML = '<span class="text-red-600">Vui lòng chọn một file Excel.</span>';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    msgDiv.innerHTML = '<span class="text-blue-600">Đang đọc file...</span>';

    reader.onload = async (event) => {
        try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const students = XLSX.utils.sheet_to_json(worksheet);

            if (students.length === 0) {
                throw new Error("File Excel rỗng hoặc không có dữ liệu.");
            }

            msgDiv.innerHTML = `<span class="text-blue-600">Đã tìm thấy ${students.length} sinh viên. Bắt đầu quá trình nhập...</span>`;

            let successCount = 0;
            let errorCount = 0;
            const errorMessages = [];
            const defaultPassword = '123456';
 
            // Helper function to normalize strings for reliable matching
            const normalizeString = (str) => {
                if (!str) return '';
                // Collapse multiple whitespace chars, trim, and convert to lowercase
                return String(str).replace(/\s+/g, ' ').trim().toLowerCase();
            };
 
            // Create maps for faster lookups
            const majorMap = new Map(cachedData.chuyen_nganh.map(cn => [normalizeString(cn.ten_chuyen_nganh), cn.id]));
            const classMap = new Map(cachedData.lop_hoc.map(lh => [normalizeString(lh.ten_lop), lh.id]));
            const tam = taoSupabaseTam();
 
            for (const [index, student] of students.entries()) {
                const rowNum = index + 2; // Excel row number (1-based, +1 for header)
                const ma_sv = student.ma_sv ? String(student.ma_sv).trim() : '';
                const ho_ten = student.ho_ten ? String(student.ho_ten).trim() : '';
 
                if (!ma_sv || !ho_ten || !student.ten_chuyen_nganh || !student.ten_lop) {
                    errorCount++;
                    errorMessages.push(`Dòng ${rowNum}: Thiếu thông tin (ma_sv, ho_ten, ten_chuyen_nganh, hoặc ten_lop).`);
                    continue;
                }
 
                const chuyen_nganh_id = majorMap.get(normalizeString(student.ten_chuyen_nganh));
                if (!chuyen_nganh_id) {
                    errorCount++;
                    errorMessages.push(`Dòng ${rowNum}: Không tìm thấy chuyên ngành "${student.ten_chuyen_nganh}".`);
                    continue;
                }
 
                const lop_id = classMap.get(normalizeString(student.ten_lop));
                if (!lop_id) {
                    errorCount++;
                    errorMessages.push(`Dòng ${rowNum}: Không tìm thấy lớp "${student.ten_lop}".`);
                    continue;
                }

                const email = `${ma_sv}@student.edu.vn`;

                try {
                    const { data: authData, error: authError } = await tam.auth.signUp({ email, password: defaultPassword });
                    if (authError) {
                        if (authError.message.includes("User already registered")) {
                            throw new Error(`Email '${email}' đã tồn tại.`);
                        }
                        throw authError;
                    }

                    if (authData.user) {
                        const { error: profileError } = await supabaseClient
                            .from('sinh_vien')
                            .insert([{ ma_sv, ho_ten, email_dang_nhap: email, chuyen_nganh_id, lop_id, user_id: authData.user.id }]);
                        
                        if (profileError) {
                             if (profileError.code === '23505') { // unique constraint violation
                                throw new Error(`Mã sinh viên '${ma_sv}' đã tồn tại.`);
                            }
                            throw new Error('Tạo tài khoản thành công nhưng lưu hồ sơ thất bại: ' + profileError.message);
                        }
                    }
                    successCount++;
                } catch (e) {
                    errorCount++;
                    errorMessages.push(`Dòng ${rowNum} (${ma_sv}): ${e.message}`);
                }
                msgDiv.innerHTML = `<span class="text-blue-600">Đang xử lý: ${index + 1}/${students.length}...</span>`;
            }

            let finalMessage = `<div class="text-left"><p class="text-green-600 font-bold">Hoàn tất! Nhập thành công: ${successCount}/${students.length}.</p>`;
            if (errorCount > 0) {
                finalMessage += `<p class="text-red-600 font-bold">Thất bại: ${errorCount}/${students.length}.</p><p class="mt-2 font-semibold">Chi tiết lỗi:</p><ul class="list-disc list-inside text-sm max-h-40 overflow-y-auto">${errorMessages.map(msg => `<li>${msg}</li>`).join('')}</ul>`;
            }
            msgDiv.innerHTML = finalMessage + `</div>`;

            loadedData.clear();
            await showTab('sinh-vien');

        } catch (e) {
            msgDiv.innerHTML = `<span class="text-red-600">Lỗi xử lý file: ${e.message}</span>`;
        }
    };

    reader.onerror = () => {
        msgDiv.innerHTML = '<span class="text-red-600">Không thể đọc file.</span>';
    };

    reader.readAsArrayBuffer(file);
}

async function taoTaiKhoanGV() {
    const [ho_ten, email, password, chuyen_nganh_id] = 
        ['gvHoTen', 'gvEmail', 'gvPassword', 'gvChuyenNganh'].map(id => document.getElementById(id).value.trim());
    const msg = document.getElementById('gv-msg');

    try {
        if (!ho_ten || !email || !password || !chuyen_nganh_id) throw new Error('Vui lòng điền đầy đủ thông tin.');
        if (!email.startsWith('gv')) throw new Error('Email giảng viên phải bắt đầu bằng "gv"');

        msg.style.color = 'blue'; msg.innerText = 'Đang tạo...';

        const tam = taoSupabaseTam();
        const { data: authData, error: authError } = await tam.auth.signUp({ email, password });
        if (authError) throw authError;

        if (authData.user) {
            const { error: profileError } = await supabaseClient
                .from('giang_vien')
                .insert([{ ho_ten, email_dang_nhap: email, chuyen_nganh_id, user_id: authData.user.id }]);
            if (profileError) throw new Error('Tài khoản đã tạo, nhưng lưu hồ sơ GV thất bại: ' + profileError.message);
        }
        
        msg.style.color = 'green';
        msg.innerText = 'Tạo tài khoản GV thành công: ' + authData.user.email;
         ['gvHoTen', 'gvEmail', 'gvPassword', 'gvChuyenNganh'].forEach(id => document.getElementById(id).value = '');
        await reloadData(['giang_vien']);
        renderTaiKhoanTabs();

    } catch (e) {
        msg.style.color = 'red'; msg.innerText = e.message;
    }
}

// --- GENERIC USER LISTING ---
function renderTaiKhoanTabs() {
    // Render old tables for creation tabs
    document.getElementById('ds-giang-vien').innerHTML = renderGiangVienTable(cachedData.giang_vien);
    document.getElementById('ds-sinh-vien').innerHTML = renderSinhVienTable(cachedData.sinh_vien);

    // Map data for the new combined table
    const giangVienMapped = cachedData.giang_vien.map(user => ({
        id: user.id,
        ma_so: `GV${user.id}`,
        ho_ten: user.ho_ten,
        vai_tro: 'giang_vien',
        email: user.email_dang_nhap,
        chuyen_nganh_id: user.chuyen_nganh_id,
        chuyen_nganh_ten: user.chuyen_nganh?.ten_chuyen_nganh || 'N/A',
        deleteFn: 'xoaGiangVien'
    }));

    const sinhVienMapped = cachedData.sinh_vien.map(user => ({
        id: user.id,
        ma_so: user.ma_sv,
        ho_ten: user.ho_ten,
        vai_tro: 'sinh_vien',
        email: user.email_dang_nhap,
        chuyen_nganh_id: user.chuyen_nganh_id,
        lop_id: user.lop_id,
        lop_ten: user.lop_hoc?.ten_lop,
        chuyen_nganh_ten: user.chuyen_nganh?.ten_chuyen_nganh || 'N/A',
        deleteFn: 'xoaSinhVien',
        editFn: 'moSuaSinhVienModal'
    }));

    cachedData.combinedUsers = [...giangVienMapped, ...sinhVienMapped].sort((a, b) => a.ho_ten.localeCompare(b.ho_ten));
    renderCombinedUserTable(); // Render the new combined table
}

function renderCombinedUserTable() {
    const search = document.getElementById('userSearchInput').value.toLowerCase();
    const cnFilter = document.getElementById('userChuyenNganhFilter').value;
    const roleFilter = document.getElementById('userRoleFilter').value;

    const filteredUsers = cachedData.combinedUsers.filter(user => {
        const matchesSearch = search === '' || user.ho_ten.toLowerCase().includes(search) || user.ma_so.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
        const matchesCn = cnFilter === '' || user.chuyen_nganh_id == cnFilter;
        const matchesRole = roleFilter === '' || user.vai_tro === roleFilter;
        return matchesSearch && matchesCn && matchesRole;
    });

    const tbody = document.getElementById('tblCombinedUsers');
    tbody.innerHTML = filteredUsers.map(user => {
        const roleText = user.vai_tro === 'giang_vien' 
            ? `<span class="bg-purple-200 text-purple-700 py-1 px-3 rounded-full text-xs font-semibold">Giảng viên</span>`
            : `<span class="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-semibold">Sinh viên</span>`;

        return `
            <tr class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6 text-left whitespace-nowrap">${user.ma_so}</td>
                <td class="py-3 px-6 text-left font-medium">${user.ho_ten}</td>
                <td class="py-3 px-6 text-center">${roleText}</td>
                <td class="py-3 px-6 text-left">${user.email}</td>
                <td class="py-3 px-6 text-left">${user.chuyen_nganh_ten}</td>
                <td class="py-3 px-6 text-left">${user.lop_ten || ''}</td>
                <td class="py-3 px-6 text-center">${createActionButtons(user.id, user.deleteFn, user.editFn)}</td>
            </tr>
        `;
    }).join('');
}
function renderSinhVienTable(data) {
    return createTable(['Mã SV', 'Họ Tên', 'Email', 'Chuyên Ngành', 'Lớp', 'Hành Động'], data.map(sv => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm">${sv.ma_sv}</td>
            <td class="px-6 py-4 text-sm font-medium">${sv.ho_ten}</td>
            <td class="px-6 py-4 text-sm">${sv.email_dang_nhap}</td>
            <td class="px-6 py-4 text-sm">${sv.chuyen_nganh?.ten_chuyen_nganh || 'N/A'}</td>
            <td class="px-6 py-4 text-sm">${sv.lop_hoc?.ten_lop || 'N/A'}</td>
            <td class="px-6 py-4 text-center">${createActionButtons(sv.id, 'xoaSinhVien', 'moSuaSinhVienModal')}</td>
        </tr>
    `).join(''));
}

function renderGiangVienTable(data) {
     return createTable(['ID', 'Họ Tên', 'Email', 'Chuyên Ngành', 'Hành Động'], data.map(gv => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm">${gv.id}</td>
            <td class="px-6 py-4 text-sm font-medium">${gv.ho_ten}</td>
            <td class="px-6 py-4 text-sm">${gv.email_dang_nhap}</td>
            <td class="px-6 py-4 text-sm">${gv.chuyen_nganh?.ten_chuyen_nganh || 'N/A'}</td>
            <td class="px-6 py-4 text-center">${createActionButtons(gv.id, 'xoaGiangVien')}</td>
        </tr>
    `).join(''));
}

function createTable(headers, rowsHtml) {
    return `
    <table class="min-w-full">
        <thead class="bg-gray-50">
            <tr>
                ${headers.map(h => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">${h}</th>`).join('')}
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">${rowsHtml}</tbody>
    </table>`;
}

async function xoaSinhVien(id) {
    if (!confirm(`Bạn có chắc muốn xóa sinh viên có ID=${id}? Hành động này sẽ xóa vĩnh viễn cả hồ sơ và tài khoản đăng nhập của họ.`)) return;
    const { error } = await supabaseClient.from('sinh_vien').delete().eq('id', id);
    if (error) return alert(`Lỗi: ${error.message}`);
    // Reload data for the user management tab
    loadedData.clear();
    await showTab('tai-khoan');
}

// --- STUDENT EDIT MODAL ---
function moSuaSinhVienModal(studentId) {
    const student = cachedData.sinh_vien.find(sv => sv.id === studentId);
    if (!student) {
        alert('Không tìm thấy thông tin sinh viên!');
        return;
    }

    // Populate modal with student data
    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editStudentName').value = student.ho_ten;
    document.getElementById('editStudentMaSV').value = student.ma_sv;

    // Populate and set major dropdown
    populateDropdowns('editStudentChuyenNganh', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', '-- Chọn Chuyên ngành --');
    document.getElementById('editStudentChuyenNganh').value = student.chuyen_nganh_id;

    // Populate and set class dropdown based on the selected major
    filterEditModalLopDropdown();
    document.getElementById('editStudentLopHoc').value = student.lop_id;

    // Show the modal
    document.getElementById('editStudentModal').classList.remove('hidden');
}

function closeEditStudentModal() {
    document.getElementById('editStudentModal').classList.add('hidden');
}

function filterEditModalLopDropdown() {
    const chuyenNganhId = document.getElementById('editStudentChuyenNganh').value;
    const filteredLops = chuyenNganhId 
        ? cachedData.lop_hoc.filter(lop => lop.chuyen_nganh_id == chuyenNganhId) 
        : [];
    populateDropdowns('editStudentLopHoc', filteredLops, 'id', 'ten_lop', '-- Chọn Lớp Sinh Hoạt --');
}

async function luuThayDoiSinhVien() {
    const studentId = document.getElementById('editStudentId').value;
    const chuyenNganhId = document.getElementById('editStudentChuyenNganh').value;
    const lopId = document.getElementById('editStudentLopHoc').value;

    if (!chuyenNganhId || !lopId) {
        return alert('Vui lòng chọn đầy đủ chuyên ngành và lớp học.');
    }

    const { error } = await supabaseClient.from('sinh_vien').update({ chuyen_nganh_id: chuyenNganhId, lop_id: lopId }).eq('id', studentId);
    if (error) return alert('Lỗi khi cập nhật thông tin sinh viên: ' + error.message);

    alert('Cập nhật thông tin sinh viên thành công!');
    closeEditStudentModal();
    await reloadData(['sinh_vien']);
    renderTaiKhoanTabs();
}

// --- APPROVAL MODAL ---
async function showApprovalModal(monHocId, lopId) {
    // Fetch students and grades for this specific class
    const { data: students, error: studentError } = await supabaseClient
        .from('sinh_vien')
        .select('ma_sv, ho_ten, diem!inner(diem_chuyen_can, diem_giua_ky, diem_cuoi_ky, diem_so)')
        .eq('lop_id', lopId)
        .eq('diem.mon_hoc_id', monHocId);

    if (studentError) return hienLoiApi(studentError, 'tải chi tiết bảng điểm');

    const modalBody = document.getElementById('approvalModalBody');
    modalBody.innerHTML = students.map(sv => `
        <tr class="border-b">
            <td class="py-2 px-4">${sv.ma_sv}</td>
            <td class="py-2 px-4 font-medium">${sv.ho_ten}</td>
            <td class="py-2 px-4 text-center">${sv.diem[0]?.diem_chuyen_can ?? 'N/A'}</td>
            <td class="py-2 px-4 text-center">${sv.diem[0]?.diem_giua_ky ?? 'N/A'}</td>
            <td class="py-2 px-4 text-center">${sv.diem[0]?.diem_cuoi_ky ?? 'N/A'}</td>
            <td class="py-2 px-4 text-center font-bold">${sv.diem[0]?.diem_so ?? 'N/A'}</td>
        </tr>
    `).join('');

    // Set the action for the approve button
    const approveBtn = document.getElementById('approveButton');
    approveBtn.onclick = () => approveSubmission(monHocId, lopId);

    // Show the modal
    document.getElementById('approvalModal').classList.remove('hidden');
}

function closeApprovalModal() {
    document.getElementById('approvalModal').classList.add('hidden');
}

async function approveSubmission(monHocId, lopId) {
    if (!confirm('Bạn có chắc chắn muốn duyệt bảng điểm này?')) return;

    const { error } = await supabaseClient
        .from('bang_diem_submission')
        .update({ da_duyet: true, ngay_duyet: new Date().toISOString() })
        .match({ mon_hoc_id: monHocId, lop_id: lopId });

    if (error) return hienLoiApi(error, 'duyệt bảng điểm');

    alert('Duyệt bảng điểm thành công!');
    closeApprovalModal();
    await reloadData(['submissions']);
    renderDuyetDiemTab();
}

// --- EXPORT FUNCTION ---
async function exportApprovedGrades(monHocId, lopId) {
    // 1. Get course and class info from cache for the filename
    const monHoc = cachedData.mon_hoc.find(mh => mh.id === monHocId);
    const lopHoc = cachedData.lop_hoc.find(lh => lh.id === lopId);
    if (!monHoc || !lopHoc) {
        return alert('Không tìm thấy thông tin môn học hoặc lớp học.');
    }
    const fileName = `BangDiem_${monHoc.ten_mon.replace(/\s/g, '_')}_${lopHoc.ten_lop}.csv`;

    // 2. Fetch the detailed grade data
    const { data: students, error: studentError } = await supabaseClient
        .from('sinh_vien')
        .select('ma_sv, ho_ten, email_dang_nhap, chuyen_nganh(ten_chuyen_nganh), diem!inner(diem_chuyen_can, diem_giua_ky, diem_cuoi_ky, diem_so)')
        .eq('lop_id', lopId)
        .eq('diem.mon_hoc_id', monHocId);

    if (studentError) return hienLoiApi(studentError, 'xuất bảng điểm');
    if (!students || students.length === 0) return alert('Không có dữ liệu điểm để xuất.');

    // 3. Build CSV content
    const headers = ['Mã SV', 'Họ Tên', 'Email', 'Chuyên ngành', 'Điểm Chuyên Cần', 'Điểm Giữa Kỳ', 'Điểm Cuối Kỳ', 'Điểm Tổng Kết'];
    const rows = students.map(sv => {
        const diem = sv.diem[0] || {};
        const rowData = [
            `'${sv.ma_sv}`,
            sv.ho_ten,
            sv.email_dang_nhap || '',
            sv.chuyen_nganh?.ten_chuyen_nganh || '',
            diem.diem_chuyen_can ?? '',
            diem.diem_giua_ky ?? '',
            diem.diem_cuoi_ky ?? '',
            diem.diem_so ?? ''
        ];
        return rowData.map(escapeCsvField).join(',');
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

// --- ROSTER MANAGEMENT MODAL ---
function openRosterModal(lichHocId) {
    const lichHoc = cachedData.lich_hoc.find(lh => lh.id === lichHocId);
    if (!lichHoc) return alert('Không tìm thấy lịch học!');

    const lopId = lichHoc.lop_id;
    const monHoc = cachedData.mon_hoc.find(mh => mh.id === lichHoc.mon_hoc_id);
    if (!monHoc) return alert('Không tìm thấy môn học!');

    const chuyenNganhId = monHoc.chuyen_nganh_id;

    // Set modal title
    document.getElementById('rosterModalTitle').innerText = `Quản lý Sĩ số: ${lichHoc.lop_hoc.ten_lop} - ${lichHoc.mon_hoc.ten_mon}`;
    document.getElementById('rosterLopId').value = lopId;
    document.getElementById('rosterLichHocId').value = lichHocId; // Store for context

    // Get all students in the same major
    const studentsInMajor = cachedData.sinh_vien.filter(sv => sv.chuyen_nganh_id === chuyenNganhId);

    const studentListContainer = document.getElementById('rosterStudentList');
    studentListContainer.innerHTML = ''; // Clear previous list

    if (studentsInMajor.length === 0) {
        studentListContainer.innerHTML = `<p class="text-center text-gray-500">Không có sinh viên nào trong chuyên ngành này.</p>`;
    } else {
        studentsInMajor.forEach(sv => {
            const isEnrolled = sv.lop_id === lopId;
            const canChange = sv.lop_id === lopId || sv.lop_id === null; // Can only add unassigned students or remove currently enrolled ones

            const studentHtml = `
                <label for="student-${sv.id}" class="flex items-center p-2 rounded-md hover:bg-gray-200 ${!canChange ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}">
                    <input type="checkbox" id="student-${sv.id}" data-sv-id="${sv.id}" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                           ${isEnrolled ? 'checked' : ''} 
                           ${!canChange ? 'disabled' : ''}>
                    <span class="ml-3 text-sm text-gray-800">
                        ${sv.ho_ten} (${sv.ma_sv})
                        ${sv.lop_id && sv.lop_id !== lopId ? `<span class="text-xs text-red-600 ml-2">[Đã ở lớp ${cachedData.lop_hoc.find(l=>l.id===sv.lop_id)?.ten_lop || 'khác'}]</span>` : ''}
                    </span>
                </label>
            `;
            studentListContainer.innerHTML += studentHtml;
        });
    }

    // Show modal
    document.getElementById('manageRosterModal').classList.remove('hidden');
}

function closeRosterModal() {
    document.getElementById('manageRosterModal').classList.add('hidden');
}

async function saveRosterChanges() {
    const lopId = parseInt(document.getElementById('rosterLopId').value);
    if (!lopId) return alert('Lỗi: Không xác định được lớp học.');

    // Get final list of student IDs that should be in the class
    const finalEnrolledIds = new Set();
    document.querySelectorAll('#rosterStudentList input[type="checkbox"]:checked').forEach(checkbox => {
        finalEnrolledIds.add(parseInt(checkbox.dataset.svId));
    });

    // Get initial list of student IDs that were in the class
    const initialEnrolledIds = new Set(
        cachedData.sinh_vien.filter(sv => sv.lop_id === lopId).map(sv => sv.id)
    );

    const studentsToAdd = [...finalEnrolledIds].filter(id => !initialEnrolledIds.has(id));
    const studentsToRemove = [...initialEnrolledIds].filter(id => !finalEnrolledIds.has(id));

    const promises = [];
    // Batch update for students to add
    if (studentsToAdd.length > 0) {
        promises.push(supabaseClient.from('sinh_vien').update({ lop_id: lopId }).in('id', studentsToAdd));
    }
    // Batch update for students to remove
    if (studentsToRemove.length > 0) {
        promises.push(supabaseClient.from('sinh_vien').update({ lop_id: null }).in('id', studentsToRemove));
    }

    if (promises.length === 0) {
        alert('Không có thay đổi nào để lưu.');
        closeRosterModal();
        return;
    }

    const results = await Promise.all(promises);
    const firstErrorResult = results.find(res => res.error);

    if (firstErrorResult) {
        return alert('Lỗi khi cập nhật sĩ số lớp: ' + firstErrorResult.error.message);
    }

    alert('Cập nhật sĩ số lớp thành công!');
    closeRosterModal();
    // Reload student data and re-render the schedule tab
    loadedData.clear();
    await showTab('lich-hoc');
}

async function xoaGiangVien(id) {
    if (!confirm(`Bạn có chắc muốn xóa giảng viên có ID=${id}? Hành động này sẽ xóa vĩnh viễn hồ sơ, tài khoản đăng nhập và toàn bộ lịch dạy của họ.`)) return;
    const { error } = await supabaseClient.from('giang_vien').delete().eq('id', id);
    if (error) return alert(`Lỗi: ${error.message}`);
    // Reload data for the user management tab
    loadedData.clear();
    await showTab('tai-khoan');
}