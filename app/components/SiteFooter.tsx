// README Screen 1 - 8. 푸터. 전체 문구를 관리 화면에서 편집 가능(여러 줄 지원).
export function SiteFooter({ footerText }: { footerText: string }) {
  return (
    <footer className="px-6 pb-10 pt-[38px] text-center">
      <div className="mx-auto mb-3 h-px w-[26px] bg-brand/25" />
      <p className="whitespace-pre-line text-footer font-light text-ink/55">{footerText}</p>
    </footer>
  );
}
