"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const allowedEmail = process.env.ALLOWED_ADMIN_EMAIL?.toLowerCase();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  // 이메일이 틀렸는지 비밀번호가 틀렸는지 구분하지 않는다 - 계정 존재 여부를 노출하지 않음.
  // 로그인 자체는 성공했지만 관리자 이메일이 아닌 경우(방어적 이중 체크)도 같은 실패로 처리하고
  // 그 세션은 즉시 종료한다.
  const isAllowedAdmin = !error && !!data.user?.email && data.user.email.toLowerCase() === allowedEmail;

  if (!isAllowedAdmin) {
    if (!error) {
      await supabase.auth.signOut();
    }
    redirect("/login?error=1");
  }

  redirect("/admin");
}
