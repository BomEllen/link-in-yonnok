import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // 디자인 레퍼런스 프로토타입 — 읽기 전용, 린트/수정 대상 아님
  { ignores: ["design_handoff_link_in_bio/**"] },
  ...coreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
