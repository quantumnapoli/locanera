import Image from "next/image";

type BadgeProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Il badge rotondo del pub (oca nera col becco arancio tra due cartigli). */
export function LogoBadge({ className, priority, sizes = "96px" }: BadgeProps) {
  return (
    <span className={`relative block aspect-square ${className ?? ""}`}>
      <Image
        src="/brand/logo-badge.webp"
        alt="L'Oca Nera Irish Pub"
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain"
      />
    </span>
  );
}

/** Wordmark testuale: serif pesante come sul cartiglio del badge. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className ?? ""}`}>
      <span className="font-display text-[1.15em] font-black tracking-[-0.01em]">L&apos;Oca Nera</span>
      <span className="mt-[0.3em] font-label text-[0.5em] font-bold uppercase tracking-[0.42em] opacity-70">
        Irish Pub
      </span>
    </span>
  );
}
