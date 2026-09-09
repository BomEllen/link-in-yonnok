@AGENTS.md

- Next 16에서 `middleware.ts` → `proxy.ts`로 파일/함수명이 바뀌었다 (`export function proxy`). 이 프로젝트는 `proxy.ts`를 쓴다.
- 로그인은 매직링크가 아니라 **이메일+비밀번호**(`signInWithPassword`)다. 사용자가 한 명뿐이라 매직링크 이메일 발송의 rate limit(429) 문제를 피하려고 바꿨다. 자세한 이유/설정은 `docs/access-control.md` 참고.
