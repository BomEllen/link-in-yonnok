import { ArrowLeft, Pin } from "lucide-react";
import NextLink from "next/link";
import { getLinksAdminData } from "@/lib/data/admin";
import type { Link } from "@/lib/types";
import { getDomain } from "@/lib/utils";

function LinkRow({ link }: { link: Link }) {
  return (
    <NextLink
      href={`/admin/links/${link.id}`}
      className="flex items-center gap-3 rounded-admin-row bg-white p-2 shadow-admin-card"
    >
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-[10px] bg-thumb-placeholder">
        {link.thumbnail_url && (
          // eslint-disable-next-line @next/next/no-img-element -- Storage 공개 URL
          <img src={link.thumbnail_url} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-ink">{link.title}</p>
        <p className="truncate text-[10.5px] text-ink/45">{getDomain(link.url)}</p>
      </div>
      {link.pinned_category_id && (
        <Pin size={13} className="shrink-0 text-brand" aria-label="이번달 픽" />
      )}
    </NextLink>
  );
}

function LinkGroup({ title, links }: { title: string; links: Link[] }) {
  if (links.length === 0) return null;
  return (
    <section className="mb-5">
      <h2 className="mb-2 flex items-baseline gap-2 text-field-label text-ink/55">
        {title}
        <span className="font-mono text-[10.5px] text-ink/35">{links.length}</span>
      </h2>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <LinkRow key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}

export default async function LinksAdminPage() {
  const { categories, links } = await getLinksAdminData();

  const pinnedCategory = categories.find((c) => c.is_pinned) ?? null;
  const regularCategories = categories.filter((c) => !c.is_pinned);

  const pinnedLinks = pinnedCategory
    ? [...links]
        .filter((l) => l.pinned_category_id === pinnedCategory.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : [];
  const uncategorized = links.filter((l) => !l.category_id);

  return (
    <div className="mx-auto min-h-screen max-w-[420px] bg-surface px-6 pb-16 pt-[22px]">
      <header className="mb-5 flex items-center gap-3">
        <NextLink
          href="/admin"
          aria-label="뒤로가기"
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-brand/20 text-ink"
        >
          <ArrowLeft size={16} />
        </NextLink>
        <div>
          <h1 className="font-display text-screen-title text-ink">링크 관리</h1>
          <p className="text-screen-sub font-light text-ink/55">눌러서 수정 · 삭제</p>
        </div>
      </header>

      {pinnedCategory && <LinkGroup title={pinnedCategory.name} links={pinnedLinks} />}
      {regularCategories.map((category) => (
        <LinkGroup
          key={category.id}
          title={category.name}
          links={links.filter((l) => l.category_id === category.id)}
        />
      ))}
      <LinkGroup title="미분류" links={uncategorized} />

      {links.length === 0 && (
        <p className="py-12 text-center text-[11.5px] text-ink/45">등록된 링크가 없어요</p>
      )}
    </div>
  );
}
