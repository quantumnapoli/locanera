import raw from "./menu.json";

export type MenuItem = {
  name: string;
  desc: string;
  ingredients: string[];
  price: number | null;
  image: string | null;
  allergens: string[];
};

export type MenuSection = { title: string | null; items: MenuItem[] };

export type MenuGroup = {
  name: string;
  drink: boolean;
  sections: MenuSection[];
};

/**
 * Menu completo esportato da dishcovery.menu (il menu digitale del locale).
 * Per aggiornarlo si rigenera menu.json: i componenti leggono solo da qui.
 */
export const MENU = raw as MenuGroup[];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const formatPrice = (value: number | null) =>
  value === null ? "" : `€ ${value.toFixed(2).replace(".", ",")}`;
