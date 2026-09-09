"use client";

import { useMemo, useState } from "react";
import { dummyCategories, dummyLinks, dummyProfile } from "@/lib/dummy-data";
import type { Category } from "@/lib/types";
import { getDomain } from "@/lib/utils";
import { CategorySection } from "./components/CategorySection";
import { ColumnToggle } from "./components/ColumnToggle";
import { ProfileHeader } from "./components/ProfileHeader";
import { SearchBar } from "./components/SearchBar";
import { ShareSheet } from "./components/ShareSheet";
import { SiteFooter } from "./components/SiteFooter";
import { StickyBanner } from "./components/StickyBanner";

function buildDefaultOpen(categories: Category[]): Record<string, boolean> {
  const visible = [...categories]
    .filter((c) => !c.hidden)
    .sort((a, b) => a.order_index - b.order_index);
  const map: Record<string, boolean> = {};
  // README: 기본값은 "마지막 섹션만 접힌 상태"
  visible.forEach((c, i) => {
    map[c.id] = i !== visible.length - 1;
  });
  return map;
}

export default function PublicMainPage() {
  const profile = dummyProfile;
  const [query, setQuery] = useState("");
  const [cols, setCols] = useState<2 | 3>(profile.default_columns);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    buildDefaultOpen(dummyCategories)
  );
  const [shareOpen, setShareOpen] = useState(false);

  const isSearching = query.trim().length > 0;

  const visibleCategories = useMemo(
    () =>
      [...dummyCategories]
        .filter((c) => !c.hidden)
        .sort((a, b) => a.order_index - b.order_index),
    []
  );

  const sections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return visibleCategories
      .map((category) => {
        const links = dummyLinks
          // README: Link.category_id가 null인 미분류 링크는 공개 페이지에 렌더링하지 않는다.
          .filter((l) => l.category_id === category.id)
          .sort((a, b) => a.order_index - b.order_index)
          .filter(
            (l) =>
              !needle ||
              l.title.toLowerCase().includes(needle) ||
              getDomain(l.url).toLowerCase().includes(needle)
          );
        return { category, links };
      })
      .filter(({ links }) => !isSearching || links.length > 0);
  }, [visibleCategories, query, isSearching]);

  const totalResults = sections.reduce((sum, s) => sum + s.links.length, 0);

  return (
    <div className="overflow-x-hidden">
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
    </div>
  );
}
