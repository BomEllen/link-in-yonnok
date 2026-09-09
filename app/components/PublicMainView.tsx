"use client";

import { useMemo, useState } from "react";
import type { Category, Link as LinkItem, Profile } from "@/lib/types";
import { getDomain } from "@/lib/utils";
import { CategorySection } from "./CategorySection";
import { ColumnToggle } from "./ColumnToggle";
import { ProfileHeader } from "./ProfileHeader";
import { SearchBar } from "./SearchBar";
import { ShareSheet } from "./ShareSheet";
import { SiteFooter } from "./SiteFooter";
import { StickyBanner } from "./StickyBanner";

function buildDefaultOpen(categories: Category[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  // README: 기본값은 "마지막 섹션만 접힌 상태"
  categories.forEach((c, i) => {
    map[c.id] = i !== categories.length - 1;
  });
  return map;
}

// 서버 컴포넌트(app/page.tsx)가 Supabase에서 읽어온 데이터를 props로 받아 렌더링한다.
// hidden 카테고리 / 미분류 링크 제외는 이미 RLS + 쿼리 단계에서 끝난 상태로 넘어온다고 가정한다.
export function PublicMainView({
  profile,
  categories,
  links,
}: {
  profile: Profile;
  categories: Category[];
  links: LinkItem[];
}) {
  const [query, setQuery] = useState("");
  const [cols, setCols] = useState<2 | 3>(profile.default_columns);
  const [open, setOpen] = useState<Record<string, boolean>>(() => buildDefaultOpen(categories));
  const [shareOpen, setShareOpen] = useState(false);

  const isSearching = query.trim().length > 0;

  const sections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return categories
      .map((category) => {
        const categoryLinks = links
          .filter((l) => l.category_id === category.id)
          .filter(
            (l) =>
              !needle ||
              l.title.toLowerCase().includes(needle) ||
              getDomain(l.url).toLowerCase().includes(needle)
          );
        return { category, links: categoryLinks };
      })
      .filter(({ links }) => !isSearching || links.length > 0);
  }, [categories, links, query, isSearching]);

  const totalResults = sections.reduce((sum, s) => sum + s.links.length, 0);

  return (
    <div className="mx-auto min-h-screen max-w-[420px] bg-surface">
      {profile.banner_enabled && <StickyBanner text={profile.banner_text} />}

      <ProfileHeader profile={profile} onShare={() => setShareOpen(true)} />

      <div className="mt-[22px] px-6">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="mt-[22px] flex justify-end px-6">
        <ColumnToggle cols={cols} onChange={setCols} />
      </div>

      <div className="mt-3 space-y-[22px] px-6">
        {isSearching && totalResults === 0 ? (
          <div className="py-12 text-center">
            <p className="font-display text-[14px] text-ink">검색 결과가 없어요</p>
            <p className="mt-1 text-[11.5px] text-ink/45">다른 이름으로 찾아보세요</p>
          </div>
        ) : (
          sections.map(({ category, links }) => (
            <CategorySection
              key={category.id}
              category={category}
              links={links}
              cols={cols}
              open={isSearching ? true : (open[category.id] ?? true)}
              onToggle={() =>
                setOpen((prev) => ({
                  ...prev,
                  [category.id]: !(prev[category.id] ?? true),
                }))
              }
            />
          ))
        )}
      </div>

      <SiteFooter nickname={profile.nickname} />

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} shareUrl="seoyeon.link" />
    </div>
  );
}
