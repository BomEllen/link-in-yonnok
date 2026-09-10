# 네이밍 매핑표

`design_handoff_link_in_bio/README.md`의 데이터 모델(camelCase)과 실제 DB 컬럼 / 코드 필드명(snake_case)이
다른 지점을 정리한다. TS 타입(`lib/types.ts`)은 변환 레이어 없이 DB 컬럼명을 그대로 쓴다.

## Profile (단일 행)

| README (camelCase) | DB 컬럼 / 코드 필드 (snake_case) | 비고 |
|---|---|---|
| `avatarUrl` | `avatar_url` | 표기만 다름 |
| `nickname` | `nickname` | 동일 |
| `bio` | `bio` | 동일 |
| `bannerEnabled` | `banner_enabled` | 표기만 다름. 기본값 `true` |
| `bannerText` | `banner_text` | 표기만 다름 |
| `defaultColumns` | `default_columns` | 표기만 다름 |
| `businessContactUrl` | `business_contact_url` | 표기만 다름 |
| _(README에 없음)_ | `footer_text` | 4단계 이후 추가. 공개 페이지 푸터 둘째 줄(원래 "© 2026 seoyeon.link" 하드코딩)을 관리 화면에서 편집 가능하게 뺀 필드. 기본값 `© 2026 seoyeon.link` |

## Category

| README | DB / 코드 | 비고 |
|---|---|---|
| `id` | `id` | 동일 |
| `name` | `name` | 동일 |
| `position` | **`order_index`** | **필드명 자체가 바뀜.** 프롬프트 지시로 정렬 컬럼명을 `order_index`로 통일 |
| `hidden` | `hidden` | 동일. `true`면 공개 페이지에서 섹션 전체를 숨김 |
| _(README에 없음)_ | `is_pinned` | "이번달 픽" 기능으로 추가. `true`면 정렬 시 항상 맨 앞(다른 카테고리의 `order_index`와 무관). 보통 한 행만 `true` |

## Link

| README | DB / 코드 | 비고 |
|---|---|---|
| `id` | `id` | 동일 |
| `categoryId` | `category_id` | 표기만 다름. `null`이면 미분류 — 공개 페이지에는 렌더링하지 않고 관리 화면에서만 노출 |
| `thumbnailUrl` | `thumbnail_url` | 표기만 다름 |
| `title` | `title` | 동일 |
| `url` | `url` | 동일 |
| `position` | **`order_index`** | **필드명 자체가 바뀜.** Category와 동일한 이유 |
| `createdAt` | `created_at` | 표기만 다름 |
| _(README에 없음)_ | `pinned_category_id` | "이번달 픽" 기능으로 추가. `category_id`(원래 카테고리)는 그대로 두고, `is_pinned=true`인 카테고리에 "추가로" 소속시키고 싶을 때만 채운다. 링크 하나가 카테고리 두 곳(원래 + 이번달 픽)에 동시에 보일 수 있는 유일한 통로 |

> `thumbnail_label`(디자인 프로토타입의 `coffee bag` 등 플레이스홀더 주석)은 1단계 더미 데이터 단계에서만
> 쓰던 임시 필드였고 DB 스키마에는 포함하지 않았다. `thumbnail_url`이 비어 있으면 카드가 스트라이프
> 플레이스홀더만 보여주고, 값이 있으면 실제 이미지를 렌더링한다(5단계에서 업로드 붙기 전까지는 항상 빈 값).

## 정렬/조회 규칙 (프롬프트 지시, README 외 추가)
- 정렬은 항상 `order_index ASC`. `order_index`가 같은 행이 있을 수 있으므로(드래그
  정렬 중 임시로 겹치는 경우 등) tiebreaker를 둔다 — Category는 `(order_index, id)`,
  Link는 `(order_index, created_at)` 순.
- `Category.hidden = true`→ 공개 메인에서 해당 섹션 통째로 미노출.
- `Link.category_id IS NULL`→ 공개 메인 미노출, 관리 화면 전용.
- 카테고리 정렬은 `is_pinned DESC, order_index ASC, id ASC` — pinned 카테고리가 항상
  최상단, 그 안에서 여러 개면 `order_index`로 tiebreak(현재는 보통 1개뿐).
- `is_pinned=true`인 카테고리의 소속 링크는 `category_id`가 아니라
  `pinned_category_id`로 판단한다 (공개/관리 화면 섹션 빌드 로직 공통 규칙).
- `Profile`은 테이블에 항상 행 1개만 존재.
