// supabase/functions/bulk-import-students/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// IMPORTANT: Set up CORS to allow requests from your web app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // For testing; in production, use your app's URL, e.g., "https://your-app.com"
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed to handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Get the list of students from the request body
    const { students, defaultPassword } = await req.json();
    if (!students || !Array.isArray(students)) {
      throw new Error("Dữ liệu 'students' không hợp lệ hoặc bị thiếu.");
    }

    const results = { successCount: 0, errorCount: 0, errors: [] };
    const profilesToInsert = [];

    // 3. Process each student
    for (const [index, student] of students.entries()) {
      try {
        // 3a. Create the authentication user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: student.email,
          password: defaultPassword,
          email_confirm: true, // Automatically confirm the email
        });

        if (authError) {
          if (authError.message.includes("already registered")) {
            throw new Error(`Email '${student.email}' đã tồn tại trong hệ thống xác thực.`);
          }
          throw new Error(`Lỗi xác thực: ${authError.message}`);
        }

        // 3b. Prepare the student profile for insertion
        profilesToInsert.push({
          user_id: authData.user.id,
          ma_sv: student.ma_sv,
          ho_ten: student.ho_ten,
          email_dang_nhap: student.email,
          chuyen_nganh_id: student.chuyen_nganh_id,
          lop_id: student.lop_id,
        });

      } catch (e) {
        results.errorCount++;
        results.errors.push(`Dòng ${index + 2} (SV: ${student.ma_sv}): ${e.message}`);
      }
    }

    // 4. Batch insert all successful profiles at once for performance
    if (profilesToInsert.length > 0) {
      const { error: profileError } = await supabaseAdmin
        .from("sinh_vien")
        .insert(profilesToInsert);

      if (profileError) {
        results.errorCount += profilesToInsert.length;
        results.errors.push(`Lỗi nghiêm trọng khi chèn hàng loạt hồ sơ: ${profileError.message}. Có thể một vài tài khoản đã được tạo nhưng không có hồ sơ.`);
      } else {
        results.successCount = profilesToInsert.length;
      }
    }

    // 5. Return the final report
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});