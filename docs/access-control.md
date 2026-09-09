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
RLS만으로는 "누가 authenticated가 될 수 있는지"를 막지 못한다. 아래 두 가지는
SQL 마이그레이션으로 할 수 없는 **Supabase 대시보드 수동 설정**이고, 반드시 되어
있어야 한다:

1. Authentication > Settings > "Allow new user signups" 끄기.
2. Authentication > Users에서 관리자 본인 이메일로 유저를 1명 미리 만들어두기
   (Invite user로 만들거나, signups를 켜둔 채로 매직링크 최초 1회 로그인 후 끄기).

이걸 안 하면 아무나 매직링크로 로그인해서 관리자 권한을 갖게 된다.
`ALLOWED_ADMIN_EMAIL` 환경변수(로그인 폼, `proxy.ts`에서 사용)는 이중 방어용일
뿐이고, 실제 경계는 위 Auth 설정이다.

## Redirect URL 설정
Authentication > URL Configuration > Redirect URLs에 아래를 추가해야 매직링크
클릭 후 세션 교환이 된다:
- `${NEXT_PUBLIC_SITE_URL}/auth/confirm` (로컬: `http://localhost:3000/auth/confirm`)
