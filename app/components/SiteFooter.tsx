// README Screen 1 - 8. 푸터. 둘째 줄(footerText)은 관리 화면에서 편집 가능.
export function SiteFooter({ nickname, footerText }: { nickname: string; footerText: string }) {
  return (
    <footer className="px-6 pb-10 pt-[38px] text-center">
      <div className="mx-auto mb-3 h-px w-[26px] bg-brand/25" />
      <p className="text-footer font-light text-ink/55">
        이 링크는 {nickname}가 직접 관리합니다
        <br />
        {footerText}
      </p>
    </footer>
  );
}
