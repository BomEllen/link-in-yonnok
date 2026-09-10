"use server";

// 6단계: URL 붙여넣기 시 og:title / og:image 자동 추출.
// 브라우저에서 직접 fetch하면 대상 사이트의 CORS 정책에 막히므로 서버에서 처리한다.
// 실패하면(사이트가 막거나, og 태그가 없거나, 네트워크 에러) 조용히 null을 돌려주고
// 호출 쪽에서 사용자가 직접 입력하게 둔다 - 에러를 throw하지 않는다.

const FETCH_TIMEOUT_MS = 6000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const USER_AGENT = "Mozilla/5.0 (compatible; LinkInBioBot/1.0)";

function matchMetaContent(html: string, property: string): string | null {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // property="og:title" content="..." 순서와 content="..." property="og:title" 순서 둘 다 지원.
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*property=["']${escaped}["']`, "i"),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match) return match[1];
  }
  return null;
}

function matchTitleTag(html: string): string | null {
  return html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'");
}

export async function fetchLinkMetadata(rawUrl: string): Promise<{
  title: string | null;
  imageDataUrl: string | null;
}> {
  const empty = { title: null, imageDataUrl: null };

  let pageUrl: URL;
  try {
    pageUrl = new URL(rawUrl);
  } catch {
    return empty;
  }
  if (pageUrl.protocol !== "http:" && pageUrl.protocol !== "https:") {
    return empty;
  }

  try {
    const pageRes = await fetch(pageUrl.toString(), {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!pageRes.ok) return empty;

    const html = await pageRes.text();
    const rawTitle = matchMetaContent(html, "og:title") ?? matchTitleTag(html);
    const title = rawTitle ? decodeHtmlEntities(rawTitle).trim() || null : null;

    const rawImage = matchMetaContent(html, "og:image");
    let imageDataUrl: string | null = null;

    if (rawImage) {
      try {
        const imageUrl = new URL(decodeHtmlEntities(rawImage), pageUrl).toString();
        const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
        const contentType = imgRes.headers.get("content-type") ?? "";
        if (imgRes.ok && contentType.startsWith("image/")) {
          const buffer = await imgRes.arrayBuffer();
          if (buffer.byteLength > 0 && buffer.byteLength <= MAX_IMAGE_BYTES) {
            const base64 = Buffer.from(buffer).toString("base64");
            imageDataUrl = `data:${contentType};base64,${base64}`;
          }
        }
      } catch {
        // 이미지만 실패해도 제목은 살린다.
      }
    }

    return { title, imageDataUrl };
  } catch {
    return empty;
  }
}
