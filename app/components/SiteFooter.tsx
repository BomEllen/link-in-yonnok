// README Screen 1 - 8. 푸터
export function SiteFooter({ nickname }: { nickname: string }) {
  return (
    <footer className="px-6 pb-10 pt-[38px] text-center">
      <div className="mx-auto mb-3 h-px w-[26px] bg-brand/25" />
      <p className="text-footer font-light text-ink/55">
        이 링크는 {nickname}가 직접 관리합니다
        <br />© 2026 seoyeon.link
      </p>
    </footer>
  );
}
