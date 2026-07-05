const SUPABASE_URL = "https://kbiffzsoiyzwgfijgyld.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_b-IC-_b8_WHaG6DNkxqHlQ_WBKSO6Ho";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function chuyenHuongTheoEmail(email) {
    if (email.startsWith('admin')) {
        window.location.href = "admin.html";
    } else if (email.startsWith('gv') || email.includes('teacher')) {
        window.location.href = "teacher.html";
    } else {
        window.location.href = "student.html";
    }
}

function taoSupabaseTam() {
    const { createClient } = supabase;
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
}

