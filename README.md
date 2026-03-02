# Transmute Website

The marketing and documentation website for [Transmute](https://github.com/transmute-app/transmute) — a free, open-source, self-hosted file converter.

**Live at [transmute.sh](https://transmute.sh/)**

## About Transmute

Transmute lets you convert images, video, audio, data, documents, and diagrams on your own hardware — no file size limits, no watermarks, and full privacy. See the [main repository](https://github.com/transmute-app/transmute) for the application itself.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 · TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 3 · `@tailwindcss/typography` |
| Routing | React Router v7 |
| Markdown | react-markdown · remark-gfm · rehype-highlight |
| Linting | ESLint 9 · TypeScript-ESLint |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (or any compatible package manager)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/transmute-app/transmute-app.github.io.git
cd transmute-app.github.io

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Project Structure

```
├── public/
│   ├── docs/           # Markdown documentation served at /docs/*
│   ├── icons/          # Favicons and app icons
│   ├── 404.html        # SPA fallback for GitHub Pages
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/     # Shared layout components (Header, Footer, Layout)
│   ├── hooks/          # Custom hooks (useSEO)
│   ├── pages/          # Route-level page components
│   ├── App.tsx         # Router configuration
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles & Tailwind directives
├── index.html          # HTML shell with SEO meta tags
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Documentation

Documentation lives as Markdown files in [`public/docs/`](public/docs/) and is rendered client-side via `react-markdown`. To add or edit a docs page:

1. Create or modify a `.md` file in `public/docs/`.
2. Update [`public/docs/manifest.json`](public/docs/manifest.json) to include the new page in the sidebar navigation.
3. The page will be accessible at `https://transmute.sh/docs/<filename>`.

## Deployment

This site is deployed to **GitHub Pages** with a custom domain (`transmute.sh`). Pushes to the `main` branch trigger a build and deploy workflow.

To build locally:

```bash
npm run build
```

The output is written to `dist/`.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

For issues with the Transmute application itself, please use the [main repository](https://github.com/transmute-app/transmute/issues).

## License

This project is open source under the [MIT License](https://github.com/transmute-app/transmute/blob/main/LICENSE).
