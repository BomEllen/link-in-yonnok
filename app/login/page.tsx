import { login } from "./actions";

// 시안에 없는 화면 — 디자인 토큰만 맞춰 최소한으로 구성한다.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center gap-6 bg-surface px-6">
      <div>
        <h1 className="font-display text-screen-title text-ink">로그인</h1>
        <p className="mt-1 text-screen-sub font-light text-ink/55">관리자 계정으로 로그인하세요</p>
      </div>

      <form action={login} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-[52px] rounded-input border border-brand/[14%] bg-white px-4 text-input text-ink shadow-input outline-none"
        />
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="비밀번호"
          className="h-[52px] rounded-input border border-brand/[14%] bg-white px-4 text-input text-ink shadow-input outline-none"
        />
        <button
          type="submit"
          className="h-[52px] rounded-cta bg-brand text-cta font-medium text-brand-ink shadow-cta"
        >
          로그인
        </button>
      </form>

      {error && (
        <p className="text-center text-btn-sm text-ink/66">
          이메일 또는 비밀번호가 올바르지 않습니다.
        </p>
      )}
    </main>
  );
}
