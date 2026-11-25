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

1. **Hero + esplosione** (`components/HeroExplode.tsx`): il panino Oca Nera scontornato davanti alla
   scritta gigante; allo scroll si scompone strato per strato (145 fotogrammi in `public/explode/`),
   con le etichette degli ingredienti. Inclinazione 3D col mouse.
2. Manifesto "Pub, Public House!" con le parole che si accendono allo scroll
3. Scaffale 3D con 8 panini gourmet (`lib/panini.ts`)
4. Storia in 4 capitoli a scorrimento orizzontale
5. Menu completo stile lavagna (`lib/menu.json`, esportato da dishcovery.menu)
6. Bancone, galleria Instagram a nastri, contatti + mappa

## Come è fatta l'animazione del panino

1. Foto reale dell'Oca Nera → GPT Image 2.6 (Higgsfield): scatto da studio del panino intero, poi
   lo stesso panino "esploso" su giallo #FEDA14.
2. Kling 3.0 Pro (Higgsfield) con primo e ultimo fotogramma → video di 6 s.
3. Higgsfield video background remover → stesso video su nero.
4. Difference matte (giallo vs nero) → fotogrammi WebP con canale alpha.
   Script: vedi la cronologia del progetto; per rifarla servono i due MP4.

## Dati

- `lib/site.ts` — contatti, servizi, pagamenti, **orari (da compilare)**
- `lib/menu.json` — menu completo; immagini in `public/menu/`
- `lib/panini.ts` — selezione dello scaffale; le descrizioni brevi vanno validate dal locale
- `public/foto/` — foto della galleria e della storia (dal sito attuale)
