import { cx } from "@/lib/utils";

// README Design Tokens - 스위치 12px (40×24)
export function Switch({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative h-6 w-10 shrink-0 rounded-full border-0 p-0 transition-colors",
        checked ? "bg-brand" : "bg-brand/[22%]"
      )}
    >
      <span
        className={cx(
          "absolute left-0 top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white shadow-knob transition-transform",
          checked ? "translate-x-[19px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}
