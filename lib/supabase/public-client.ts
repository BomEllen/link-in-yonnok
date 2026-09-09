import { createClient } from "@supabase/supabase-js";

// 공개 메인 페이지 전용 익명 클라이언트. 쿠키를 읽지 않아 정적 렌더링/ISR과 호환된다.
// 세션이 필요한 관리자용 클라이언트(쿠키 기반)는 3단계(로그인)에서 별도로 추가한다.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
