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

## Category

| README | DB / 코드 | 비고 |
|---|---|---|
| `id` | `id` | 동일 |
| `name` | `name` | 동일 |
| `position` | **`order_index`** | **필드명 자체가 바뀜.** 프롬프트 지시로 정렬 컬럼명을 `order_index`로 통일 |
| `hidden` | `hidden` | 동일. `true`면 공개 페이지에서 섹션 전체를 숨김 |

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
| _(README에 없음)_ | `thumbnail_label` | 디자인 프로토타입의 플레이스홀더 주석(`coffee bag` 등)을 담아두는 임시 필드. 실제 이미지 업로드 붙는 5단계 이후 제거 예정 |

## 정렬/조회 규칙 (프롬프트 지시, README 외 추가)
- 정렬은 항상 `order_index ASC`.
- `Category.hidden = true`→ 공개 메인에서 해당 섹션 통째로 미노출.
- `Link.category_id IS NULL`→ 공개 메인 미노출, 관리 화면 전용.
- `Profile`은 테이블에 항상 행 1개만 존재.
