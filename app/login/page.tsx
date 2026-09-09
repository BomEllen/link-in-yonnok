import { sendMagicLink } from "./actions";

// 시안에 없는 화면 — 디자인 토큰만 맞춰 최소한으로 구성한다.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center gap-6 bg-surface px-6">
      <div>
        <h1 className="font-display text-screen-title text-ink">로그인</h1>
        <p className="mt-1 text-screen-sub font-light text-ink/55">
          관리자 이메일로 매직링크를 보내드려요
        </p>
      </div>

      <form action={sendMagicLink} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="h-[52px] rounded-input border border-brand/[14%] bg-white px-4 text-input text-ink shadow-input outline-none"
        />
        <button
          type="submit"
          className="h-[52px] rounded-cta bg-brand text-cta font-medium text-brand-ink shadow-cta"
        >
          매직링크 보내기
        </button>
      </form>

      {sent && (
        <p className="text-center text-btn-sm text-ink/66">
          메일함을 확인해주세요. 관리자 계정이면 링크가 도착합니다.
        </p>
      )}
      {error && (
        <p className="text-center text-btn-sm text-ink/66">
          로그인에 실패했어요. 링크를 다시 요청해주세요.
        </p>
      )}
    </main>
  );
}
