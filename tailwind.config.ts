import type { Config } from "tailwindcss";

// 디자인 토큰 출처: design_handoff_link_in_bio/README.md `## Design Tokens`
// 색상은 CSS 변수(globals.css :root)의 "R G B" triplet을 참조해
// `bg-brand/10` 처럼 Tailwind 불투명도 modifier로 README의 세부 알파값을
// 그대로 재현할 수 있게 했다.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "rgb(var(--color-brand) / <alpha-value>)", // #775537 Old Copper
        "brand-ink": "rgb(var(--color-brand-ink) / <alpha-value>)", // #FBE29D Butter Yellow
        accent: "rgb(var(--color-accent) / <alpha-value>)", // #C0DDDA Nebula
        "accent-ink": "rgb(var(--color-accent-ink) / <alpha-value>)", // #3E5B58
        field: "rgb(var(--color-field) / <alpha-value>)", // #F1F1F1 Seashell
        surface: "rgb(var(--color-surface) / <alpha-value>)", // #FDFBF7 페이지 배경
        upload: "rgb(var(--color-upload) / <alpha-value>)", // #F6F1E8
        ink: "rgb(var(--color-ink) / <alpha-value>)", // #4A3520 본문 잉크
        overlay: "rgb(var(--color-overlay) / <alpha-value>)", // #352516, 시트 오버레이는 /42
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"], // Gowun Batang
        sans: ["var(--font-sans)", "sans-serif"], // Noto Sans KR
        mono: ["ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        nickname: ["25px", { lineHeight: "1.25", letterSpacing: "-0.4px" }],
        bio: ["12.5px", { lineHeight: "1.65" }],
        "category-title": ["17.5px", { lineHeight: "1.3" }],
        "product-title-2col": ["13.5px", { lineHeight: "1.55" }],
        "product-title-3col": ["12px", { lineHeight: "1.55" }],
        "screen-title": ["19px", { lineHeight: "1.3" }],
        "screen-sub": ["10.5px", { lineHeight: "1.4" }],
        "field-label": ["10.5px", { letterSpacing: "0.2px" }],
        input: ["14px", { lineHeight: "1.4" }],
        cta: ["15px", { lineHeight: "1.2" }],
        "btn-sm": ["12.5px", { lineHeight: "1.2" }],
        banner: ["11px", { lineHeight: "1.4", letterSpacing: "-0.2px" }],
        footer: ["10.5px", { lineHeight: "1.7" }],
      },
      borderRadius: {
        card2: "18px", // 상품 카드 (2열)
        card3: "14px", // 상품 카드 (3열)
        upload: "24px", // 업로드 박스
        input: "16px",
        "admin-card": "20px",
        "admin-row": "18px",
        cta: "20px",
        segment: "12px", // 세그먼트/스위치 컨테이너
        "segment-inner": "9px",
      },
      boxShadow: {
        card: "0 2px 10px rgba(119,85,55,.09)", // 상품 카드
        "admin-card": "0 2px 8px rgba(119,85,55,.06)",
        input: "0 1px 4px rgba(119,85,55,.05)",
        cta: "0 6px 18px rgba(119,85,55,.2)",
        "cta-sm": "0 3px 10px rgba(119,85,55,.28)", // 작은 알약 버튼
        toast: "0 8px 24px rgba(53,37,22,.28)",
        knob: "0 1px 3px rgba(53,37,22,.25)", // 스위치 노브
      },
      spacing: {
        touch: "44px", // 최소 터치 타깃
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        sheetUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        toastIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadein: "fadeIn .22s ease",
        "overlay-in": "fadeIn .18s ease",
        "sheet-up": "sheetUp .26s cubic-bezier(.22,.9,.25,1)",
        "toast-in": "toastIn .22s ease",
      },
    },
  },
  plugins: [],
};

export default config;
