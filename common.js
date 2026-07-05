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

async function yeuCauPhien(vaiTro) {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        alert('Vui lòng đăng nhập!');
        window.location.href = 'login.html';
        return null;
    }

    const email = session.user.email || '';

    if (vaiTro === 'admin' && !email.startsWith('admin')) {
        alert('Bạn không có quyền truy cập trang Admin!');
        chuyenHuongTheoEmail(email);
        return null;
    }

    if (vaiTro === 'gv' && !email.startsWith('gv') && !email.includes('teacher')) {
        alert('Bạn không có quyền truy cập trang Giảng viên!');
        chuyenHuongTheoEmail(email);
        return null;
    }

    if (vaiTro === 'sv' && (email.startsWith('admin') || email.startsWith('gv') || email.includes('teacher'))) {
        alert('Bạn không có quyền truy cập trang Sinh viên!');
        chuyenHuongTheoEmail(email);
        return null;
    }

    return session;
}
