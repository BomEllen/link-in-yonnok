"use client";

import { createBrowserClient } from "@supabase/ssr";

// 클라이언트 컴포넌트에서 인증된 세션으로 Supabase를 호출할 때 쓴다
// (로그인 쿠키를 그대로 읽어서 Storage 업로드 등에 authenticated 권한을 쓸 수 있게 함).
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
