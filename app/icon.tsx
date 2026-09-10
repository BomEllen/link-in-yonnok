import { ImageResponse } from "next/og";

// 브라우저 탭 파비콘. README 브랜드 컬러(Old Copper/Butter Yellow)로 만든
// 심플한 모노그램 - 도메인(seoyeon.link)의 첫 글자를 쓴다.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#775537",
          color: "#FBE29D",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
