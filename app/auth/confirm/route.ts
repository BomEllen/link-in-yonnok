import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 매직링크 클릭 후 도착하는 콜백. PKCE code를 세션으로 교환한다.
// Supabase 대시보드 Authentication > URL Configuration > Redirect URLs에
// `${NEXT_PUBLIC_SITE_URL}/auth/confirm`을 등록해야 동작한다.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
