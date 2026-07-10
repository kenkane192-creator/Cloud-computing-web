const SUPABASE_URL = "https://kbiffzsoiyzwgfijgyld.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_b-IC-_b8_WHaG6DNkxqHlQ_WBKSO6Ho";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
