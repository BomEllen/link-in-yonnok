import { Share2 } from "lucide-react";
import type { Profile } from "@/lib/types";

// README Screen 1 - 2. 프로필 블록
export function ProfileHeader({
  profile,
  onShare,
}: {
  profile: Profile;
  onShare: () => void;
}) {
  return (
    <div className="relative overflow-hidden px-6 pt-[26px]">
      <div
        className="pointer-events-none absolute -right-[60px] -top-10 h-[180px] w-[180px] rounded-full bg-accent opacity-[.35] blur-[2px]"
        aria-hidden
      />
      <div className="relative flex items-start justify-between">
        <div className="h-[78px] w-[78px] shrink-0 overflow-hidden rounded-full border border-brand/[18%] bg-avatar-placeholder">
          {profile.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element -- Storage 공개 URL
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShare}
            aria-label="페이지 공유"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-brand/20 bg-white text-brand"
          >
            <Share2 size={16} strokeWidth={2} />
          </button>
          <a
            href={profile.business_contact_url}
            className="flex h-[38px] items-center rounded-full bg-brand px-4 text-btn-sm font-medium text-brand-ink"
          >
            비즈니스 제안
          </a>
        </div>
      </div>
      <div className="relative mt-[14px]">
        <h1 className="font-display text-nickname text-ink">{profile.nickname}</h1>
        <p className="mt-1 text-bio font-light text-ink/66">{profile.bio}</p>
      </div>
    </div>
  );
}
