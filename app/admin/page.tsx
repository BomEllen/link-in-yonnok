import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

// 자리 표시자 — 프로필/카테고리 관리 UI는 4단계에서 들어간다.
// 여기 도달했다는 것 자체가 proxy.ts의 /admin 보호를 통과했다는 뜻이다.
export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <h1 className="font-display text-screen-title text-ink">관리자 페이지</h1>
      <p className="text-btn-sm text-ink/55">
        {user?.email} 로 로그인됨 · 4단계에서 실제 관리 화면이 들어갑니다
      </p>
      <form action={logout}>
        <button
          type="submit"
          className="h-9 rounded-full border border-brand/20 px-4 text-btn-sm text-ink/66"
        >
          로그아웃
        </button>
      </form>
    </main>
  );
}
