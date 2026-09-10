-- footer_text가 이제 "이 링크는 OOO가 직접 관리합니다" 줄까지 포함한 전체 문구를
-- 담는다 (전에는 앱 코드가 그 줄을 nickname으로 자동 생성하고, footer_text는
-- 둘째 줄만 담당했음 - 사용자가 첫 줄도 직접 편집하고 싶다고 해서 하나로 합침).

-- 새로 생성되는 프로필(로컬 리셋 등)을 위한 기본값 갱신.
alter table public.profiles
  alter column footer_text set default '이 링크는 OOO가 직접 관리합니다
© 2026 seoyeon.link';

-- 이미 존재하는 행(실 서비스)의 footer_text는 예전엔 둘째 줄만 들어있었으므로,
-- 첫 줄을 현재 nickname으로 채워 넣어 화면에 보이던 문구가 그대로 유지되게 한다.
-- 이미 "이 링크는"으로 시작하면(= 이 마이그레이션을 이미 탄 경우) 건드리지 않는다.
update public.profiles
set footer_text = '이 링크는 ' || nickname || '가 직접 관리합니다' || chr(10) || footer_text
where id = 1
  and footer_text not like '이 링크는 %';
