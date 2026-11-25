# L'Oca Nera Irish Pub — sito

Nuovo sito one-page di **L'Oca Nera Irish Pub** (Via Gian Lorenzo Bernini 17, Vomero, Napoli),
costruito partendo dalla struttura di `quantumnapoli/kuopburger`.

## Stack

- Next.js 14 (App Router, `output: "export"`: sito statico in `out/`)
- Tailwind CSS, framer-motion, GSAP, three.js (scaffale 3D dei panini)
- Font self-hosted con `@fontsource`: Frank Ruhl Libre (titoli) e Barlow / Barlow Condensed (testo, etichette), gli stessi del sito attuale

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # genera out/ (deploy Netlify: vedi netlify.toml)
```

## Identità

| Token | Colore | Origine |
| --- | --- | --- |
| `brand-black` | `#0a0a0a` | fondo del badge e delle foto |
| `brand-gold` | `#feda14` | cornice gialla delle foto Instagram |
| `brand-orange` | `#fc6e02` | becco dell'oca nel logo |
| `brand-cream` | `#fbf6e9` | sezioni chiare |

Il logo (`public/brand/logo-badge.*`) è ritagliato dal badge presente sulle foto ufficiali.
Serve una versione vettoriale originale dal locale.

## Sezioni

1. Hero con badge che galleggia e segue il mouse (era il panino Kuop)
2. Pub, Public House! + tre card (pub, carne irlandese, dolci)
3. Scaffale 3D con 8 panini gourmet (`lib/panini.ts`)
4. Ticker, storia del vessillo (4 capitoli dal sito attuale)
5. Menu completo, cucina e bancone (`lib/menu.json`, esportato da dishcovery.menu)
6. Sezione bancone (birre, whisky, gin)
7. Galleria con lightbox, Contatti + mappa, servizi, pagamenti, footer

## Dati

- `lib/site.ts` — contatti, servizi, pagamenti, **orari (da compilare)**
- `lib/menu.json` — menu completo; immagini in `public/menu/`
- `lib/panini.ts` — selezione dello scaffale; le descrizioni brevi vanno validate dal locale
- `public/foto/` — foto della galleria e della storia (dal sito attuale)
