import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 세션(로그인 상태)이 필요한 서버 코드 전용 — Server Component / Server Action에서 쓴다.
// 공개 메인의 익명 조회는 cookies()를 건드리지 않는 lib/supabase/public-client.ts를 쓴다
// (cookies()를 쓰면 그 라우트가 동적 렌더링으로 강제되어 ISR이 깨진다).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서 호출된 경우 — proxy.ts가 세션 갱신을 담당하므로 무시해도 된다.
          }
        },
      },
    }
  );
}
