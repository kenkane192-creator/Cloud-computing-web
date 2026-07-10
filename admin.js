// --- CONFIG & STATE ---
const TABS = [
    { id: 'dashboard', name: 'Bảng điều khiển' },
    { id: 'tai-khoan', name: 'Tổng quan Tài khoản' },
    { id: 'chuyen-nganh', name: 'Quản lý Chuyên Ngành' },
    { id: 'mon-hoc', name: 'Quản lý Môn Học' },
    { id: 'lich-hoc', name: 'Quản lý Lịch Học' },
    { id: 'duyet-diem', name: 'Duyệt Bảng Điểm' },
    { id: 'sinh-vien', name: 'Cấp tài khoản SV' },
    { id: 'giang-vien', name: 'Cấp tài khoản GV' },
];
let cachedData = {
    giang_vien: [],
    sinh_vien: [],
    chuyen_nganh: [],
    mon_hoc: [],
    lop_hoc: [],
    lich_hoc: [],
    combinedUsers: [],
    submissions: []
};
let studentChart = null; // To hold chart instance

// --- INITIALIZATION ---
window.onload = async function() {
    const session = await yeuCauPhien('admin');
    if (!session) return;
    
    setupTabs();
    await loadAndRenderAll(); // New master function
    
    // Default to the first tab
    switchTab(TABS[0].id); 
};

// --- UI SETUP ---
function setupTabs() {
    const nav = document.getElementById('tab-nav');
    nav.innerHTML = '';
    TABS.forEach(tab => {
        const a = document.createElement('a');
        a.href = '#';
        a.id = `btn-tab-${tab.id}`;
        a.className = 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300';
        a.textContent = tab.name;
        a.onclick = (e) => {
            e.preventDefault();
            switchTab(tab.id);
        };
        nav.appendChild(a);
    });
}

function switchTab(tabId) {
    TABS.forEach(tab => {
        const content = document.getElementById(`tab-${tab.id}`);
        const button = document.getElementById(`btn-tab-${tab.id}`);
        if (tab.id === tabId) {
            content.classList.add('active');
            button.classList.remove('text-gray-500', 'border-transparent');
            button.classList.add('text-indigo-600', 'border-indigo-500');
        } else {
            content.classList.remove('active');
            button.classList.remove('text-indigo-600', 'border-indigo-500');
            button.classList.add('text-gray-500', 'border-transparent');
        }
    });

    // Refresh dashboard every time it's viewed
    if (tabId === 'dashboard') {
        renderDashboard();
    }
}

// --- MASTER DATA HANDLING ---
async function loadAndRenderAll() {
    const [
        { data: chuyenNganhData, error: cnError },
        { data: monHocData, error: mhError },
        { data: lopHocData, error: lhError },
        { data: giangVienData, error: gvError },
        { data: sinhVienData, error: svError },
        { data: lichHocData, error: lichError },
        { data: submissionData, error: submissionError }
    ] = await Promise.all([
        supabaseClient.from('chuyen_nganh').select('*').order('id', { ascending: true }),
        supabaseClient.from('mon_hoc').select('*, chuyen_nganh(ten_chuyen_nganh)').order('id', { ascending: true }),
        supabaseClient.from('lop_hoc').select('*'),
        supabaseClient.from('giang_vien').select('*, chuyen_nganh(ten_chuyen_nganh)').order('id', { ascending: true }),
        supabaseClient.from('sinh_vien').select('*, chuyen_nganh(ten_chuyen_nganh)').order('id', { ascending: true }),
        supabaseClient.from('lich_hoc').select('*, mon_hoc(ten_mon), lop_hoc(ten_lop), giang_vien(ho_ten)').order('id', { ascending: true }),
        supabaseClient.from('bang_diem_submission').select('*, mon_hoc(ten_mon), lop_hoc(ten_lop), giang_vien(ho_ten)').order('ngay_gui', { ascending: false })
    ]);

    // Handle potential errors
    if (cnError) return hienLoiApi(cnError, 'tải chuyên ngành');
    if (mhError) return hienLoiApi(mhError, 'tải môn học');
    if (lhError) return hienLoiApi(lhError, 'tải lớp học');
    if (gvError) return hienLoiApi(gvError, 'tải giảng viên');
    if (svError) return hienLoiApi(svError, 'tải sinh viên');
    if (lichError) return hienLoiApi(lichError, 'tải lịch học');
    if (submissionError) return hienLoiApi(submissionError, 'tải bảng điểm đã nộp');

    // Cache all data
    cachedData.chuyen_nganh = chuyenNganhData || [];
    cachedData.mon_hoc = monHocData || [];
    cachedData.lop_hoc = lopHocData || [];
    cachedData.giang_vien = giangVienData || [];
    cachedData.sinh_vien = sinhVienData || [];
    cachedData.lich_hoc = lichHocData || [];
    cachedData.submissions = submissionData || [];

    // Populate UI components with cached data
    populateAllDropdowns();
    renderChuyenNganhTab();
    renderMonHocTab();
    renderLichHocTab();
    renderTaiKhoanTabs();
    renderDuyetDiemTab();
    renderDashboard();
}

function populateAllDropdowns() {
    populateDropdowns('monHocChuyenNganh', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', '-- Chọn Chuyên ngành --');
    populateDropdowns('svChuyenNganh', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', '-- Chọn Chuyên ngành --');
    populateDropdowns('gvChuyenNganh', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', '-- Chọn Chuyên ngành --');
    populateDropdowns('lichHocChuyenNganh', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', '-- Lọc GV theo chuyên ngành --');
    populateDropdowns('userChuyenNganhFilter', cachedData.chuyen_nganh, 'id', 'ten_chuyen_nganh', 'Tất cả chuyên ngành');
    populateDropdowns('lichHocMonHoc', cachedData.mon_hoc, 'id', 'ten_mon', '-- Chọn Môn học --');
    populateDropdowns('lichHocLop', cachedData.lop_hoc, 'id', 'ten_lop', '-- Chọn Lớp học --');
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

function filterGiangVienDropdown() {
    const chuyenNganhId = document.getElementById('lichHocChuyenNganh').value;
    const filteredGVs = chuyenNganhId ? cachedData.giang_vien.filter(gv => gv.chuyen_nganh_id == chuyenNganhId) : [];
    populateDropdowns('lichHocGiangVien', filteredGVs, 'id', 'ho_ten', '-- Chọn Giảng viên --');
}

function createActionButtons(id, deleteFnName, editFnName = null) {
    return `
        <div class="flex item-center justify-center space-x-4">
            <button class="w-5 h-5 text-gray-500 hover:text-blue-600">
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
            ? `<button class="text-gray-400 cursor-not-allowed text-sm">Hoàn tất</button>`
            : `<button onclick="showApprovalModal(${sub.mon_hoc_id}, ${sub.lop_id})" class="text-blue-600 hover:underline text-sm">Xem & Duyệt</button>`;

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
    await loadAndRenderAll();
}

async function xoaChuyenNganh(id) {
    if (!confirm(`Bạn có chắc chắn muốn xóa chuyên ngành có ID=${id}? Hành động này không thể hoàn tác.`)) return;
    const { error } = await supabaseClient.from('chuyen_nganh').delete().eq('id', id);
    if (error) return alert('Lỗi: ' + error.message);
    await loadAndRenderAll();
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
    await loadAndRenderAll();
}

async function xoaMonHoc(id) {
    if (!confirm(`Bạn có chắc chắn muốn xóa môn học có ID=${id}?`)) return;
    const { error } = await supabaseClient.from('mon_hoc').delete().eq('id', id);
    if (error) return alert('Lỗi: ' + error.message);
    await loadAndRenderAll();
}

// --- LỊCH HỌC ---
function renderLichHocTab() {
    const WEEKDAYS = { 1: 'Thứ 2', 2: 'Thứ 3', 3: 'Thứ 4', 4: 'Thứ 5', 5: 'Thứ 6', 6: 'Thứ 7', 7: 'Chủ Nhật' };
    const tbody = document.getElementById('tblLichHoc');
    tbody.innerHTML = cachedData.lich_hoc.map(lh => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${lh.mon_hoc.ten_mon}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lh.lop_hoc.ten_lop}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${WEEKDAYS[lh.ngay_trong_tuan]} - Ca ${lh.ca_hoc}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lh.giang_vien.ho_ten}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">${createActionButtons(lh.id, 'xoaLichHoc')}</td>
        </tr>
    `).join('');
}

async function themLichHoc() {
    const lichHoc = {
        mon_hoc_id: document.getElementById('lichHocMonHoc').value,
        lop_id: document.getElementById('lichHocLop').value,
        giang_vien_id: document.getElementById('lichHocGiangVien').value,
        ngay_trong_tuan: document.getElementById('ngayTrongTuan').value,
        ca_hoc: document.getElementById('caHoc').value,
        phong_hoc: document.getElementById('phongHoc').value.trim(),
    };

    for (const key in lichHoc) {
        if (!lichHoc[key] && key !== 'phong_hoc') {
            return alert(`Vui lòng điền đầy đủ thông tin! Thiếu: ${key}`);
        }
    }

    const { error } = await supabaseClient.from('lich_hoc').insert([lichHoc]);
    if (error) {
        if (error.code === '23505') return alert('Lỗi: Lịch học bị trùng! Giảng viên hoặc Lớp đã có lịch vào thời điểm này.');
        return alert('Lỗi: ' + error.message);
    }
    await loadAndRenderAll();
}

async function xoaLichHoc(id) {
    if (!confirm(`Bạn có chắc chắn muốn xóa lịch học có ID=${id}?`)) return;
    const { error } = await supabaseClient.from('lich_hoc').delete().eq('id', id);
    if (error) return alert('Lỗi: ' + error.message);
    await loadAndRenderAll();
}

// --- TÀI KHOẢN ---
async function taoTaiKhoanSV() {
    const [ma_sv, ho_ten, email, password, chuyen_nganh_id] = 
        ['svMa', 'svTen', 'svEmail', 'svPassword', 'svChuyenNganh'].map(id => document.getElementById(id).value.trim());
    const msg = document.getElementById('sv-msg');
    
    try {
        if (!ma_sv || !ho_ten || !email || !password || !chuyen_nganh_id) throw new Error('Vui lòng điền đầy đủ thông tin.');
        if (email.startsWith('admin') || email.startsWith('gv')) throw new Error('Email sinh viên không hợp lệ.');
        
        msg.style.color = 'blue'; msg.innerText = 'Đang tạo...';

        const tam = taoSupabaseTam();
        const { data: authData, error: authError } = await tam.auth.signUp({ email, password });

        if (authError) throw authError;
        
        if (authData.user) {
            const { error: profileError } = await supabaseClient
                .from('sinh_vien')
                .insert([{ ma_sv, ho_ten, email_dang_nhap: email, chuyen_nganh_id, user_id: authData.user.id }]);
            if (profileError) throw new Error('Tài khoản đã tạo, nhưng lưu hồ sơ SV thất bại: ' + profileError.message);
        }

        msg.style.color = 'green';
        msg.innerText = 'Tạo tài khoản SV thành công: ' + authData.user.email;
        ['svMa', 'svTen', 'svEmail', 'svPassword', 'svChuyenNganh'].forEach(id => document.getElementById(id).value = '');
        await loadAndRenderAll();

    } catch (e) {
        msg.style.color = 'red'; msg.innerText = e.message;
    }
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
        await loadAndRenderAll();

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
        chuyen_nganh_ten: user.chuyen_nganh?.ten_chuyen_nganh || 'N/A',
        deleteFn: 'xoaSinhVien'
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
                <td class="py-3 px-6 text-center">${createActionButtons(user.id, user.deleteFn)}</td>
            </tr>
        `;
    }).join('');
}
function renderSinhVienTable(data) {
    return createTable(['Mã SV', 'Họ Tên', 'Email', 'Chuyên Ngành', 'Hành Động'], data.map(sv => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm">${sv.ma_sv}</td>
            <td class="px-6 py-4 text-sm font-medium">${sv.ho_ten}</td>
            <td class="px-6 py-4 text-sm">${sv.email_dang_nhap}</td>
            <td class="px-6 py-4 text-sm">${sv.chuyen_nganh?.ten_chuyen_nganh || 'N/A'}</td>
            <td class="px-6 py-4 text-center">${createActionButtons(sv.id, 'xoaSinhVien')}</td>
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
    if (!confirm(`Bạn có chắc muốn xóa sinh viên có ID=${id}? Việc này sẽ xóa hồ sơ nhưng không xóa tài khoản login.`)) return;
    const { error } = await supabaseClient.from('sinh_vien').delete().eq('id', id);
    if (error) return alert(`Lỗi: ${error.message}`);
    await loadAndRenderAll();
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
    await loadAndRenderAll(); // Refresh all data
}

async function xoaGiangVien(id) {
    if (!confirm(`Bạn có chắc muốn xóa giảng viên có ID=${id}? Việc này sẽ xóa hồ sơ nhưng không xóa tài khoản login.`)) return;
    const { error } = await supabaseClient.from('giang_vien').delete().eq('id', id);
    if (error) return alert(`Lỗi: ${error.message}`);
    await loadAndRenderAll();
}