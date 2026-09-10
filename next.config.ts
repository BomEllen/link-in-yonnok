import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 서버를 LAN IP(폰 등 다른 기기)로 접속할 때 /_next/* 요청이 기본적으로
  // 차단되는 것을 풀어준다. 공유기가 이 IP를 바꾸면(DHCP) 여기도 같이 바꿔야 함 -
  // `npm run dev` 실행 시 터미널에 뜨는 "Network:" 주소를 보고 맞추면 된다.
  allowedDevOrigins: ["192.168.219.111"],
};

export default nextConfig;
