# 🚗 LPR Dataset Hub

**ALL-IN-ONE gateway for License Plate Recognition research.**

🌐 **Live:** [lpr-dataset-hub.vercel.app](https://lpr-dataset-hub.vercel.app/)

Discover, compare, and access 16+ datasets across 10+ countries.
Built for researchers, by researchers.

## Features

- **Dataset Catalog** — Sortable, filterable table with search across 16 datasets
- **Dataset Detail Pages** — Per-dataset pages with metadata, BibTeX citation, and access links
- **SOTA Leaderboard** — Published results from peer-reviewed papers *(in progress)*
- **Dark/Light Theme** — Toggle or auto-detect
- **Outbound Click Tracking** — Know which datasets researchers access
- **Smooth Page Transitions** — Astro ClientRouter

## Access Levels

| Badge | Meaning |
|-------|---------|
| **Public** | Free download, no registration |
| **License** | Requires license agreement form |
| **License (.edu)** | Requires .edu email to request |
| **License (Staff)** | Requires university staff email |

## Development

```bash
npm install --legacy-peer-deps
npm run dev      # Start dev server at localhost:4321
npm run build    # Build static site to dist/
npm run preview  # Preview built site
```

## Tech Stack

- **Astro 6** — Static site generator with content collections
- **React 19** — Interactive islands (search, filter, sort)
- **Tailwind CSS 3** — Utility-first styling
- **Vercel** — Static hosting with edge CDN

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add datasets or SOTA results via Pull Request.

## Acknowledgments

Special thanks to the [AI VIET NAM (AIO)](https://aivietnam.edu.vn/) community and TA [Truong-Binh Duong](https://github.com/duongtruongbinh).

Vibe Coding.

## License

MIT
