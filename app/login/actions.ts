"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const allowedEmail = process.env.ALLOWED_ADMIN_EMAIL?.toLowerCase();

  // 이메일이 관리자 계정이 아니어도 동일한 결과를 보여준다 (계정 존재 여부를 노출하지 않음).
  if (email && allowedEmail && email === allowedEmail) {
    const supabase = await createClient();
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      },
    });
  }

  redirect("/login?sent=1");
}
