function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function hienLoiApi(error, context) {
    const box = document.getElementById('api-error');
    if (!box) return;
    box.style.display = 'block';
    if (error.message && error.message.includes('does not exist')) {
        box.innerHTML = '<b>Lỗi kết nối database:</b> Bảng chưa tồn tại. Chạy file <code>database.sql</code> trong Supabase SQL Editor.';
    } else {
        box.innerHTML = '<b>Lỗi ' + context + ':</b> ' + error.message;
    }
}

function chuyenHuongTheoEmail(email) {
    if (email.startsWith('admin')) {
        window.location.href = "/admin.html";
    } else if (email.startsWith('gv') || email.includes('teacher')) {
        window.location.href = "/teacher.html";
    } else {
        window.location.href = "/student.html";
    }
}

function taoSupabaseTam() {
    // This function creates a temporary Supabase client for special tasks
    // like signing up a new user from the admin page without logging the admin out.
    const { createClient } = supabase;
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
}

async function yeuCauPhien(vaiTro) {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        alert('Vui lòng đăng nhập!');
        window.location.href = '/login.html';
        return null;
    }

    const email = session.user.email || '';

    if (vaiTro === 'admin' && !email.startsWith('admin')) {
        alert('Bạn không có quyền truy cập trang Admin!');
        chuyenHuongTheoEmail(email); // Now calls function from the same file
        return null;
    }

    if (vaiTro === 'gv' && !email.startsWith('gv.') && !email.includes('teacher')) {
        alert('Bạn không có quyền truy cập trang Giảng viên!');
        chuyenHuongTheoEmail(email);
        return null;
    }

    if (vaiTro === 'sv' && (email.startsWith('admin') || email.startsWith('gv.') || email.includes('teacher'))) {
        alert('Bạn không có quyền truy cập trang Sinh viên!');
        chuyenHuongTheoEmail(email);
        return null;
    }

    return session;
}

function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    if (!input) return;
    const button = input.nextElementSibling;
    const icon = button.querySelector('svg');

    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .566-1.89 1.705-3.533 3.33-4.78M15 12a3 3 0 11-6 0 3 3 0 016 0zm-4 4l3-3"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c.677 0 1.34.083 1.984.24M20.542 12C19.268 16.057 15.477 19 12 19c-.677 0-1.34-.083-1.984-.24M3 3l18 18"></path>';
    } else {
        input.type = 'password';
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
    }
}

async function updatePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    const msgEl = document.getElementById('password-update-message');

    if (!newPassword || newPassword.length < 6) {
        msgEl.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
        msgEl.className = 'text-red-600 text-sm mb-4 text-center';
        return;
    }
    if (newPassword !== confirmPassword) {
        msgEl.textContent = 'Mật khẩu nhập lại không khớp.';
        msgEl.className = 'text-red-600 text-sm mb-4 text-center';
        return;
    }
    
    msgEl.textContent = 'Đang cập nhật...';
    msgEl.className = 'text-blue-600 text-sm mb-4 text-center';

    const { error } = await supabaseClient.auth.updateUser({ password: newPassword });

    if (error) {
        msgEl.textContent = `Lỗi: ${error.message}`;
        msgEl.className = 'text-red-600 text-sm mb-4 text-center';
    } else {
        msgEl.textContent = 'Cập nhật mật khẩu thành công!';
        msgEl.className = 'text-green-600 text-sm mb-4 text-center';
        document.getElementById('confirmNewPassword').value = '';
    }
}

async function dangXuat() {
    await supabaseClient.auth.signOut();
    window.location.href = '/login.html';
}
