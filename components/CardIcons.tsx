type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const
};

/**
 * Icone a tratto sulla stessa griglia 24. Forme volutamente semplici:
 * devono restare leggibili a 28 px, dove i dettagli fini spariscono.
 */
export const CARD_ICONS = {
  /** pinta con la schiuma */
  pinta: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M6.5 4h11l-1.3 15.2a1.6 1.6 0 0 1-1.6 1.5H9.4a1.6 1.6 0 0 1-1.6-1.5Z" />
      <path d="M6.8 8.2h10.4" />
      <path d="M9.5 4.2c.2-1 1.1-1.6 2.1-1.4.6-.7 1.9-.7 2.5 0 1-.2 1.9.4 2.1 1.4" />
    </svg>
  ),
  /** panino a strati */
  panino: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3.8 10.2C3.8 7.3 7.5 5 12 5s8.2 2.3 8.2 5.2" />
      <path d="M3.8 12.6h16.4M3.8 15.2h16.4" />
      <path d="M3.8 17.6c0 .9.9 1.6 2 1.6h12.4c1.1 0 2-.7 2-1.6" />
    </svg>
  ),
  /** bistecca */
  carne: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M5 13.5C3.6 9.7 6.4 5 11.2 5c4.6 0 8.3 3 8.3 7.1 0 4.4-3.6 6.9-7.6 6.9-3 0-5.7-2-6.9-5.5Z" />
      <circle cx="14.6" cy="11.6" r="2.2" />
      <path d="M8.4 10.6c.8-1.6 2.4-2.6 4.2-2.6" />
    </svg>
  ),
  /** fetta di torta */
  dolce: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3.8 12.4 18.6 7.2l1.6 5.2H3.8Z" />
      <path d="M3.8 12.4v6.4h16.4v-6.4" />
      <path d="M3.8 15.6h16.4" />
      <path d="M17.4 6.6c-.2-1.4.6-2.6 1.9-2.8" />
    </svg>
  ),
  cuore: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 19.6s-7.6-4.6-7.6-10.1A4.2 4.2 0 0 1 12 7.1a4.2 4.2 0 0 1 7.6 2.4c0 5.5-7.6 10.1-7.6 10.1Z" />
    </svg>
  ),
  /** bandiera / vessillo */
  vessillo: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M5.4 21V3.6" />
      <path d="M5.4 4.4c3.6-1.8 6.2 1.6 9.8 0 1.4-.6 2.6-.8 3.6-.6v9.4c-1-.2-2.2 0-3.6.6-3.6 1.6-6.2-1.8-9.8 0" />
    </svg>
  ),
  stella: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="m12 3.8 2.5 5.3 5.8.7-4.2 4 1.1 5.7L12 16.7 6.8 19.5l1.1-5.7-4.2-4 5.8-.7Z" />
    </svg>
  ),
  mappa: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 20.8s6.3-5.5 6.3-10.2a6.3 6.3 0 1 0-12.6 0C5.7 15.3 12 20.8 12 20.8Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </svg>
  )
} as const;

export type CardIconName = keyof typeof CARD_ICONS;
