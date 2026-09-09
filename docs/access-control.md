# 접근 제어 정책 (3단계 진행 전 결정)

## 결정: authenticated 롤 RLS 정책. service role key는 쓰지 않는다.

`supabase/migrations/*_admin_policies.sql`에서 `profiles`/`categories`/`links`
전체 CRUD를 `authenticated` 롤에게 RLS 정책으로 직접 허용한다.

## 이유
1. 권한 경계가 DB(RLS) 한 곳에만 있다. 나중에 Server Action을 추가하면서 관리자
   체크를 깜빡해도 RLS가 막아준다 — service role 방식은 액션마다 개발자가 직접
   체크를 넣어야 하고, 하나라도 빠지면 그 액션은 무제한 접근이 된다.
2. `.env`에 "털리면 DB 전체가 뚫리는" service_role 키를 추가하지 않아도 된다.
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 두 개로 계속 간다.
3. 나중에 관리 화면에 실시간 구독처럼 브라우저가 Supabase에 직접 붙는 기능을
   추가해도(현재 계획엔 없음) 같은 RLS가 그대로 적용된다.

## 전제: "authenticated = 관리자 본인"이 성립해야 한다
RLS만으로는 "누가 authenticated가 될 수 있는지"를 막지 못한다. 아래는 SQL
마이그레이션으로 할 수 없는 **Supabase 대시보드 수동 설정**이고, 반드시 되어
있어야 한다:

1. Authentication > Settings > "Allow new user signups" 끄기.
2. Authentication > Users에 관리자 본인 이메일 유저를 1명만 만들어두고, **그
   유저에 실제 비밀번호를 직접 설정**해두기. 기존 유저 편집 화면에 비밀번호를
   바로 바꾸는 항목이 안 보이면, 유저를 삭제하고 "Add user"로 다시 만들면서
   비밀번호를 직접 입력 + "Auto Confirm User" 체크로 만드는 게 가장 간단하다.

이걸 안 하면 아무나 회원가입해서 관리자 권한을 갖게 된다.
`ALLOWED_ADMIN_EMAIL` 환경변수(로그인 폼, `proxy.ts`에서 사용)는 이중 방어용일
뿐이고, 실제 경계는 위 Auth 설정 + 그 계정만 아는 비밀번호다.

## 로그인 방식: 이메일 + 비밀번호 (`signInWithPassword`)
사용자가 본인 한 명뿐이라 매직링크(이메일 발송)는 과했고, Supabase 기본 메일
발송 rate limit(429)에 자주 걸려 실사용에 불편했다. `/login`은 이메일+비밀번호
폼이고, 실패 사유(이메일 미존재/비밀번호 오류/관리자 이메일 불일치)를 구분해서
보여주지 않는다 — 전부 "이메일 또는 비밀번호가 올바르지 않습니다" 하나로 응답해
계정 존재 여부를 노출하지 않는다.

## 세션 유지
`@supabase/ssr`의 쿠키 기본 `maxAge`가 400일(브라우저가 허용하는 쿠키 수명
상한)이라 브라우저를 껐다 켜도 로그인이 유지된다. 별도 코드 설정 불필요. 다만
Supabase 대시보드 Authentication > Settings에 세션 강제 만료(session timeout /
time-box) 옵션이 켜져 있으면 이보다 먼저 끊기니 꺼져 있는지 확인.

## Rate Limit
이메일 기반 흐름(매직링크/OTP)을 더 이상 쓰지 않으므로 메일 발송 rate limit은
신경 쓸 필요가 없다. 비밀번호 로그인(`/token` 엔드포인트)의 무차별 대입 방어는
Authentication > Rate Limits의 기본값으로 개인 사용 규모엔 충분하고, 진짜 방어는
rate limit보다 이 계정에만 쓰는 충분히 긴 랜덤 비밀번호다.
