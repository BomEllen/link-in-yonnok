# Handoff: 개인용 Link-in-Bio 페이지 (모바일)

## Overview
20대 여성 타깃(카페·뷰티·여행/라이프 콘텐츠)의 개인 link-in-bio 서비스. 모바일 전용(375–414px)이며 세 화면으로 구성된다.

1. **메인 페이지** — 방문자가 보는 공개 페이지. 프로필, 검색, 카테고리별 상품 그리드.
2. **등록 화면** — 운영자가 새 링크를 사진/제목/URL 3개 입력만으로 빠르게 등록.
3. **페이지 관리 화면** — 프로필 편집, 카테고리 이름·순서·표시 여부, 페이지 설정.

## About the Design Files
이 폴더의 `Link in Bio.dc.html`은 **디자인 레퍼런스(HTML 프로토타입)** 다. 의도한 화면 구성과 동작을 보여주기 위한 것이며 그대로 배포할 프로덕션 코드가 아니다. 실제 구현은 대상 코드베이스의 기존 환경(React / Next.js / Vue / SwiftUI / Flutter 등)과 기존 컴포넌트·스타일 패턴을 사용해 **이 디자인을 재현**하는 방향으로 진행한다. 아직 코드베이스가 없다면 프로젝트에 가장 적합한 프레임워크를 선택해 구현한다.

파일은 단일 HTML로 열리며, 세 화면이 나란히 배치된 아트보드 형태다. 브라우저에서 열어 실제 인터랙션(검색 필터, 아코디언, 2/3열 전환, 공유 시트, 등록 폼 검증, 카테고리 순서 변경)을 직접 조작해 볼 수 있다.

## Fidelity
**High-fidelity.** 컬러, 타이포그래피, 간격, 라운딩, 그림자, 인터랙션이 모두 확정값이다. 픽셀 단위로 재현하되, 컴포넌트는 코드베이스의 기존 라이브러리/패턴으로 구현한다.

예외: 모든 이미지(프로필 사진, 상품 썸네일)는 사선 스트라이프 **플레이스홀더**이며, 그 위에 얹힌 `coffee bag`, `lip balm` 같은 모노스페이스 라벨은 "여기에 어떤 사진이 들어가는지"를 표시한 디자인 주석이다. 실제 이미지로 교체하며 라벨은 제거한다.

---

## Design Tokens

### Colors
| 역할 | 값 | 이름 |
|---|---|---|
| Primary / 브랜드 | `#775537` | Old Copper |
| Primary 위 텍스트·강조 | `#FBE29D` | Butter Yellow |
| Secondary 액센트 | `#C0DDDA` | Nebula |
| Secondary 위 텍스트 | `#3E5B58` | — |
| 뉴트럴 필드 배경 | `#F1F1F1` | Seashell |
| 페이지 배경 (앱 화면) | `#FDFBF7` | — |
| 캔버스 배경 (아트보드 밖) | `#EDE7DF` | — |
| 업로드 박스 배경 | `#F6F1E8` | — |
| 본문 잉크 | `#4A3520` | — |
| 보조 텍스트 | `rgba(74,53,32,.66)` / `.55` / `.45` / `.35` |
| 보더 | `rgba(119,85,55,.14)` (입력) / `.08` (카드) / `.16`–`.20` (아웃라인 버튼) |
| 점선 보더 | `1.5px dashed rgba(119,85,55,.3)`–`.35` |
| 썸네일 플레이스홀더 | `repeating-linear-gradient(135deg,#E7DCCB 0 7px,#F4EFE6 7px 14px)` |
| 프로필 플레이스홀더 | `repeating-linear-gradient(135deg,#E4D9C8 0 6px,#F1F1F1 6px 12px)` |
| 토스트 배경 | `#4A3520`, 텍스트 `#FBE29D` |
| 오버레이 | `rgba(53,37,22,.42)` |

### Typography
- 제목/감성 서체: **Gowun Batang** (Google Fonts, 400/700) — 닉네임, 카테고리 제목, 화면 타이틀, 시트 제목
- 본문/UI: **Noto Sans KR** (300/400/500/700)
- 코드성 라벨(플레이스홀더 주석, 아트보드 번호): `ui-monospace, Menlo, monospace`

스케일 (모두 실제 사용값):
| 용도 | 값 |
|---|---|
| 닉네임 | Gowun Batang 400 / 25px / 1.25 / letter-spacing -.4px |
| 한 줄 소개 | Noto Sans 300 / 12.5px / 1.65 |
| 카테고리 섹션 제목 | Gowun Batang 400 / 17.5px |
| 상품 제목 (2열) | Noto Sans 400 / 13.5px / 1.55 |
| 상품 제목 (3열) | Noto Sans 400 / 12px / 1.55 |
| 화면 타이틀 (등록/관리) | Gowun Batang 400 / 19px |
| 화면 서브 | Noto Sans 300 / 10.5px |
| 필드 라벨 | Noto Sans 400 / 10.5px, color `rgba(74,53,32,.55)`, letter-spacing .2px |
| 입력 텍스트 | Noto Sans 400 / 13.5–14px |
| Primary CTA | Noto Sans 500 / 14.5–15px |
| 작은 버튼 | Noto Sans 500 / 11.5–12.5px |
| 배너 문구 | Noto Sans 300 / 11px / 1.4, letter-spacing -.2px, `#FFFFFF`, **가운데 정렬** |
| 푸터 | Noto Sans 300 / 10.5px / 1.7 |

### Radius
- 화면(디바이스) 34px · 카드 18px(2열) / 14px(3열) · 업로드 박스 24px
- 입력 16px · 관리 카드 20px · 관리 행 18px · CTA 18–20px
- 알약 버튼 = height/2 (19px @38px, 16px @32px) · 아이콘 버튼 원형
- 스위치 12px (40×24) · 세그먼트 컨테이너 12px, 내부 9px

### Shadows
- 디바이스: `0 18px 44px rgba(93,66,39,.16), 0 2px 6px rgba(93,66,39,.08)`
- 상품 카드: `0 2px 10px rgba(119,85,55,.09)`
- 관리 카드/행: `0 2px 8px rgba(119,85,55,.06)`
- 입력: `0 1px 4px rgba(119,85,55,.05)`
- Primary CTA: `0 6px 18px rgba(119,85,55,.2)` · 작은 알약: `0 3px 10px rgba(119,85,55,.28)`
- 토스트: `0 8px 24px rgba(53,37,22,.28)` · 스위치 노브: `0 1px 3px rgba(53,37,22,.25)`

### Spacing
화면 좌우 패딩 22–24px. 섹션 간 22px. 카드 그리드 gap 12px(2열) / 9px(3열). 폼 필드 간 16px. 입력 높이 52px, 작은 버튼 30–38px, CTA 52–56px. 최소 터치 타깃은 44px 이상 유지(아이콘 버튼 26–38px는 카드 내부 보조 컨트롤로, 실제 구현 시 히트 영역을 44px로 확장 권장).

---

## Screen 1 — 메인 페이지 (방문자)

**Purpose:** 방문자가 프로필을 확인하고, 검색 또는 카테고리 탐색으로 외부 상품 링크로 이동.

**Layout:** 375×812 스크롤 컨테이너 하나. 위에서 아래로: 스티키 배너 → 프로필 블록 → 검색바 → 열 수 토글 → 카테고리 섹션들 → 푸터.

### Components
1. **스티키 안내 배너** — `position: sticky; top: 0; z-index: 30`. 배경 `#775537`, padding 9px 18px, `display:flex; align-items:center; justify-content:center; gap:8px`. 왼쪽에 5px 원형 dot(`#FBE29D`), 텍스트 "제휴 링크를 통한 판매 발생시 소정의 수수료를 제공받습니다." (11px, `#FFFFFF`, 가운데 정렬). 관리 화면 토글로 노출 on/off.
2. **프로필 블록** — padding 26px 24px 0. 배경 장식: 우상단에 180px 원, `#C0DDDA`, opacity .35, blur 2px (`position:absolute; top:-40px; right:-60px`).
   - 아바타 78px 원형, 보더 `1px solid rgba(119,85,55,.18)`, 스트라이프 플레이스홀더.
   - 우측 상단 액션 행: 공유 아이콘 버튼(38px 원형, 흰 배경, 보더 `rgba(119,85,55,.2)`, 글리프 `↗`) + "비즈니스 제안" 알약 버튼(높이 38px, padding 0 16px, `#775537` 배경 / `#FBE29D` 텍스트, 12.5px).
   - 닉네임 + 한 줄 소개 (관리 화면에서 편집한 값).
3. **검색바** — 높이 46px, radius 23px, 배경 `#F1F1F1`, 보더 `rgba(119,85,55,.1)`, padding 0 16px. 좌측 15px 돋보기 SVG(stroke `#A0906F`, width 2), placeholder "상품 · 링크 제목 검색". 입력값이 있으면 우측에 20px 원형 `✕` 클리어 버튼.
4. **열 수 토글** — 리스트 우측 상단 정렬. 컨테이너: padding 3px, radius 12px, 배경 `#F1F1F1`, 보더 `rgba(119,85,55,.1)`. 버튼 2개(2열 30×24, 3열 34×24), 선택된 쪽만 흰 배경. 라벨 대신 세로 막대 픽토그램: 2열은 6×11px 막대 2개, 3열은 4.5×11px 막대 3개, gap 2px. 선택 색 `#775537`, 비선택 `rgba(74,53,32,.3)`.
5. **카테고리 섹션 (아코디언)** — 헤더는 전폭 버튼: 제목(Gowun Batang 17.5px) + 개수 칩(10.5px mono, `#775537` on `#FBE29D`, padding 2px 6px, radius 9px) + 우측 caret `▲`/`▼` (11px, `rgba(74,53,32,.45)`). 헤더 하단 여백 12px.
6. **상품 카드** — 그리드 아이템. 카드 전체 `aspect-ratio: 3/4`, `display:flex; flex-direction:column`, 흰 배경, 보더 `rgba(119,85,55,.06)`, overflow hidden.
   - 썸네일: `flex:1; min-height:0`, 스트라이프 플레이스홀더, padding 7px, 좌하단에 8px mono 라벨(흰 배경 .75 alpha, radius 4px).
   - 캡션: 고정 높이 — 2열 64px / 3열 53px, padding 9px 11px 11px (3열 7px 8px 9px). 제목은 2줄 클램프(`-webkit-line-clamp:2`) + 말줄임, 고정 라인 박스 42px(2열) / 37px(3열). **링크 주소 줄은 없음.**
   - 카드 전체가 외부 링크(새 탭)로 이동.
7. **검색 결과 없음** — 중앙 정렬, "검색 결과가 없어요"(Gowun Batang 14px) + "다른 이름으로 찾아보세요"(11.5px).
8. **푸터** — padding 38px 24px 40px, 가운데 정렬. 26×1px 구분선(`rgba(119,85,55,.25)`) 후 "이 링크는 OOO가 직접 관리합니다 / © 2026 seoyeon.link" 2줄.
9. **공유 바텀시트** — 오버레이 `rgba(53,37,22,.42)`, 시트는 `#FDFBF7`, radius 26px 26px 0 0, padding 10px 20px 26px. 상단 38×4px 핸들. 제목 "페이지 공유"(15px Gowun Batang). 타깃 4개(카카오톡/인스타/메시지/더보기): 1:1 정사각 타일, radius 16px, `#F1F1F1`. 하단 링크 복사 행: `#F1F1F1` radius 14px, 모노스페이스 URL + "복사" 버튼(`#775537`/`#FBE29D`, radius 10px).

**참고:** 아이콘은 모두 임시 글리프(`↗ ◍ ◐ ✉ ⋯ ✎ ⠿`)다. 구현 시 코드베이스의 아이콘 세트로 교체한다.

---

## Screen 2 — 등록 화면 (관리자)

**Purpose:** 새 링크를 사진 / 제목 / URL 3개 입력으로 최단 경로 등록. 스크롤 없이 한 화면에서 완결.

**Layout:** 375×812 세로 flex. 헤더(고정) → 폼(flex:1) → 하단 CTA 영역(고정).

### Components
1. **헤더** — padding 22px 22px 14px. 좌측 34px 원형 뒤로 버튼(`←`), 타이틀 "새 링크 등록"(19px Gowun Batang) + 서브 "사진 · 제목 · 링크만 있으면 끝". 우측에 3단계 진행 인디케이터: 16×3px 막대 3개(gap 4px). 각 막대는 사진/제목/URL 입력 완료 시 `#775537`, 미완료 `rgba(119,85,55,.18)`.
2. **썸네일 업로드 (빈 상태)** — 전폭 `aspect-ratio: 1`, radius 24px, `1.5px dashed rgba(119,85,55,.35)`, 배경 `#F6F1E8`. 중앙 세로 스택: 50px 원형 `#FBE29D` 안에 `+`(26px, `#775537`) → "사진 추가"(14px Gowun Batang) → "탭해서 앨범에서 선택 · 1:1 권장"(10.5px).
3. **썸네일 업로드 (채워진 상태)** — 동일 크기 1:1, 스트라이프 이미지, 좌하단 `thumbnail 1:1` 라벨, 우상단 30px 원형 삭제 버튼(`rgba(53,37,22,.55)` 배경, `✕`). 전환 시 fadeIn .2s.
4. **제목 필드** — 라벨 "제목", 입력 높이 52px radius 16px 흰 배경, placeholder "상품명을 입력하세요".
5. **링크 필드** — 라벨 "링크", 동일 스타일 컨테이너 안에 입력 + 우측 "붙여넣기" 버튼(높이 36px, radius 12px, `#C0DDDA` 배경 / `#3E5B58` 텍스트). 클릭 시 클립보드 값을 필드에 채운다(프로토타입은 샘플 URL 주입).
6. **카테고리 chips (선택)** — 라벨 "카테고리" + 회색 "선택" 힌트. chip: 높이 36px, padding 0 15px, radius 18px. 미선택 흰 배경 / 보더 `rgba(119,85,55,.16)` / 텍스트 `rgba(74,53,32,.7)`, 선택 시 `#775537` 배경 / `#FBE29D` 텍스트. 단일 선택, 같은 chip 재탭 시 해제. **목록과 순서는 관리 화면의 카테고리 목록에서 파생된다.**
7. **하단 CTA** — 배경 `linear-gradient(to top,#FDFBF7 60%,transparent)`. 버튼 전폭 56px radius 20px. 세 입력이 모두 채워지면 활성(`#775537`/`#FBE29D`, 라벨 "등록하기"), 아니면 비활성(`rgba(119,85,55,.16)` / `rgba(74,53,32,.42)`, 라벨 "사진 · 제목 · 링크를 채워주세요"). 아래 힌트 "등록하면 메인 페이지 맨 위에 추가됩니다".
8. **성공 토스트** — CTA 위 98px 지점, 좌우 22px, `#4A3520` 배경 / `#FBE29D` 텍스트, radius 16px, "✓ 등록 완료 · 메인 페이지에 추가했어요". `toastIn` .22s ease로 등장, 2.2초 후 사라지며 폼 초기화.

**Validation:** 사진 + 제목(trim) + URL(trim) 모두 필요. 비활성 상태에서 탭은 무동작. 실제 구현에서는 URL 형식 검증과 og:image/og:title 자동 추출(붙여넣기 시 썸네일·제목 자동 채움)을 추가하면 "타이핑 최소화" 의도가 더 강해진다.

---

## Screen 3 — 페이지 관리 (관리자)

**Purpose:** 공개 페이지의 프로필과 카테고리 구조를 관리. 변경은 메인에 즉시 반영.

**Layout:** 375×812 세로 flex. 헤더(고정) → 스크롤 본문 → 하단 저장 바(고정).

### Components
1. **헤더** — "페이지 관리"(19px Gowun Batang) + "변경 사항은 바로 메인에 반영됩니다". 우측 "미리보기" 아웃라인 버튼(높이 32px, radius 16px).
2. **프로필 카드** — 흰 카드 radius 20px padding 16px.
   - 62px 원형 아바타, 우하단에 24px 원형 `✎` 배지(`#FBE29D`, 2px 흰 보더).
   - 우측 스택: "사진 변경"(32px, `#775537`/`#FBE29D`) / "기본 이미지로"(30px 아웃라인).
   - 1px 구분선 후 닉네임 입력(44px), 한 줄 소개 입력(44px). 배경 `#FDFBF7`, radius 14px. 값은 메인 화면 프로필에 실시간 반영.
3. **카테고리 목록** — 섹션 라벨 "카테고리" + 힌트 "끌어서 순서 변경 · 눈 아이콘으로 숨기기". 각 행: 흰 카드 radius 18px padding 12px 13px, 좌측부터
   - 그립 글리프 `⠿` (`rgba(74,53,32,.28)`, `cursor: grab`)
   - **이름 인라인 입력** (Gowun Batang 14px, 보더/배경 없음, focus 시 배경 `#F6F1E8`) + 메타 "N개 링크 · 이름 탭해서 수정" (숨김 상태면 "숨김 · N개 링크")
   - 순서 버튼 `▲` `▼` (26px, radius 9px). 첫/마지막 행에서는 해당 버튼 색이 `rgba(74,53,32,.2)`로 죽는다.
   - 표시 스위치 40×24, on `#775537` / off `rgba(119,85,55,.22)`, 노브 18px 흰 원. 숨김 행은 전체 opacity .55.
   - 하단에 "＋ 카테고리 추가" 점선 버튼(높이 48px, radius 18px).
4. **페이지 설정 카드** — 두 행, 1px 구분선.
   - "상단 안내 배너 / 제휴 수수료 문구 노출" + 스위치 → 메인의 스티키 배너 노출 제어
   - "기본 보기 / 방문자에게 처음 보이는 열 수" + 2·3 세그먼트 → 메인 그리드 열 수 제어
5. **하단 바** — 56×52px 아웃라인 `＋` 버튼(새 링크 등록 화면 진입) + 전폭 "변경 사항 저장"(52px, radius 18px, `#775537`/`#FBE29D`).

**드래그 앤 드롭:** 디자인에는 그립 아이콘이 있지만 실제 재정렬은 `▲`/`▼` 버튼으로 동작한다. 구현 시 포인터 드래그(dnd-kit 등)로 확장하고 그립을 핸들로 쓰면 된다.

---

## Interactions & Behavior
- **검색**: 입력 즉시 필터(제목 + 도메인, 대소문자 무시). 검색어가 있으면 모든 카테고리가 자동 펼쳐지고, 매칭 0개인 카테고리는 목록에서 제거된다. 전체 결과가 0이면 빈 상태 메시지.
- **아코디언**: 헤더 탭으로 섹션 접기/펼치기. 펼침 시 `fadeIn .22s ease`. 기본값: 마지막 섹션만 접힌 상태.
- **열 수 전환**: 2↔3열. 열 수에 따라 radius, gap, 캡션 padding, 제목 크기, 캡션 고정 높이가 함께 변한다(위 표 참조).
- **공유 시트**: 오버레이 fadeIn .18s, 시트 `sheetUp .26s cubic-bezier(.22,.9,.25,1)`. 오버레이 탭으로 닫기.
- **등록 폼**: 상단 3단 인디케이터가 입력 상태를 실시간 반영. 제출 → 토스트 2.2초 → 폼 초기화.
- **관리 화면**: 모든 편집이 즉시 메인에 반영(낙관적 로컬 상태). "변경 사항 저장"은 서버 커밋 지점.

## State Management
프로토타입의 단일 상태 트리(실제 구현에서는 공개 페이지/관리자 화면으로 분리하고 서버 상태와 동기화):

| 상태 | 타입 | 용도 |
|---|---|---|
| `query` | string | 메인 검색어 |
| `open` | `{[categoryId]: boolean}` | 아코디언 펼침 |
| `cols` | `2 \| 3` | 그리드 열 수 |
| `shareOpen` | boolean | 공유 시트 |
| `order` | `string[]` | 카테고리 순서 (id 배열) |
| `hidden` | `{[categoryId]: boolean}` | 카테고리 숨김 |
| `names` | `{[categoryId]: string}` | 카테고리 이름 오버라이드 |
| `nick`, `bio` | string | 프로필 텍스트 |
| `bannerOn` | boolean | 상단 배너 노출 |
| `photo`, `title`, `url`, `cat` | boolean/string | 등록 폼 입력 |
| `toast` | boolean | 등록 완료 토스트 |

파생값: 메인 섹션 목록 = `order` → 카테고리 조회 → `names` 적용 → `hidden` 제외 → 검색 필터. 등록 화면 chip 목록 = 같은 정렬·이름이 적용된 카테고리 제목 배열.

**데이터 모델 제안**
- `Profile { avatarUrl, nickname, bio, bannerEnabled, bannerText, defaultColumns, businessContactUrl }`
- `Category { id, name, position, hidden }`
- `Link { id, categoryId (nullable), thumbnailUrl, title, url, position, createdAt }`

필요 동작: 카테고리 CRUD + 재정렬(position 일괄 업데이트), 링크 CRUD, 이미지 업로드(1:1 크롭), URL 메타데이터 조회(og:image/og:title), 관리자 화면 인증.

## Assets
- 실제 이미지 없음. 프로필/썸네일은 모두 CSS 사선 스트라이프 플레이스홀더이며, 위에 얹힌 mono 라벨(`coffee bag`, `lip balm`, `stay photo`, `shirt`, `dripper`, `canister`, `glass`, `ampoule`, `suncream`, `cushion`, `luggage`, `pouch`)은 들어갈 사진의 설명이다. 실제 이미지로 교체하고 라벨 제거.
- 아이콘: 검색 돋보기만 인라인 SVG, 나머지는 임시 텍스트 글리프 → 코드베이스 아이콘 세트로 교체.
- 폰트: Google Fonts — Gowun Batang, Noto Sans KR. (Cormorant Garamond도 로드되어 있으나 현재 미사용, 제거 가능.)
- 샘플 상품/도메인 텍스트는 모두 더미 카피다.

## Files
- `Link in Bio.dc.html` — 세 화면 전체가 담긴 인터랙티브 디자인 프로토타입. 상단 `<style>`에 폰트/키프레임, 이후 마크업(인라인 스타일), 파일 하단 클래스에 상태 로직.
- `color-palette.png` — 디자인 기준 컬러 레퍼런스 (Old Copper / Butter Yellow / Nebula / Seashell).
- `screenshots/01-main.png`, `02-register.png`, `03-manage.png` — 각 화면 캡처(375×812 기준, 2x). 스크롤 영역은 화면에 보이는 만큼만 담겨 있으므로 전체 내용은 HTML 프로토타입에서 확인.
