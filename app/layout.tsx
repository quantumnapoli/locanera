import type { Metadata, Viewport } from "next";

import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/frank-ruhl-libre/700.css";
import "@fontsource/frank-ruhl-libre/900.css";

import SiteLoader from "@/components/SiteLoader";
import { SITE } from "@/lib/site";

import "./globals.css";

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0a0a0a"
};

export const metadata: Metadata = {
  title: "L'Oca Nera Irish Pub | Un pò di Irlanda nel cuore di Napoli",
  description:
    "L'Oca Nera Irish Pub al Vomero, Napoli: Guinness alla spina, panini gourmet, carne irlandese e dolci fatti in casa. Via Gian Lorenzo Bernini 17.",
  openGraph: {
    title: "L'Oca Nera Irish Pub",
    description: "Un pò di Irlanda nel cuore di Napoli. Non un semplice pub, ma una Public House.",
    images: ["/foto/sala.webp"],
    locale: "it_IT",
    type: "website"
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  name: SITE.fullName,
  image: "/foto/sala.webp",
  telephone: SITE.phone,
  email: SITE.email,
  servesCuisine: ["Irish", "Burger", "Italian"],
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    postalCode: SITE.address.cap,
    addressLocality: SITE.address.city,
    addressCountry: "IT"
  },
  sameAs: [SITE.socials.instagram, SITE.socials.facebook],
  hasMenu: SITE.menuUrl
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
