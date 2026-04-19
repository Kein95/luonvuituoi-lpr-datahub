# LPR Dataset Hub

**ALL-IN-ONE gateway for License Plate Recognition research.**

Discover, compare, and access 15+ datasets across 10+ countries.

> Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) + [React](https://react.dev)

## Features

- **Dataset Catalog** — Sortable, filterable table with search
- **Dataset Detail Pages** — Per-dataset pages with metadata, BibTeX, and access links
- **SOTA Leaderboard** — Published results from peer-reviewed papers
- **Dark/Light Theme** — Toggle or auto-detect
- **Outbound Click Tracking** — Know which datasets researchers access
- **Smooth Page Transitions** — Astro ClientRouter

## Access Levels

| Badge | Meaning |
|-------|---------|
| **Public** | Free download, no registration |
| **License** | Requires license agreement form |
| **License (.edu)** | Requires .edu email to request |
| **License (staff)** | Requires university staff email |

## Development

```bash
npm install
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

## License

MIT
