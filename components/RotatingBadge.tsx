import { LogoBadge } from "@/components/Logo";

/** Il logo come timbro: badge al centro, scritta circolare che gira attorno. */
export default function RotatingBadge({ className, dark = false }: { className?: string; dark?: boolean }) {
  const text = "IRISH PUB · VOMERO · NAPOLI · SLÁINTE · ";
  return (
    <div className={`relative aspect-square ${className ?? ""}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id="badge-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
        </defs>
        <text
          className="font-label"
          style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: "0.22em" }}
          fill={dark ? "#feda14" : "#0a0a0a"}
        >
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[20%]">
        <LogoBadge className="h-full w-full" sizes="96px" />
      </div>
    </div>
  );
}
