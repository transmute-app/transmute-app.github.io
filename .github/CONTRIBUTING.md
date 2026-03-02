# Contributing to the Transmute Website

Thanks for your interest in improving the [Transmute](https://transmute.sh/) website! Contributions of all kinds are welcome — bug fixes, new documentation, design improvements, and more.

## Getting Started

1. **Fork** this repository and clone your fork locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. The site will be available at `http://localhost:5173`.

## Making Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/my-change
   ```
2. Make your changes.
3. Run the linter and fix any issues:
   ```bash
   npm run lint
   ```
4. Build to verify there are no errors:
   ```bash
   npm run build
   ```
5. Commit your changes and push to your fork.
6. Open a pull request against `main`.

## Documentation

Docs live as Markdown files in `public/docs/`. To add or update a page:

1. Create or edit a `.md` file in `public/docs/`.
2. Update `public/docs/manifest.json` so it appears in the sidebar.
3. The page will be served at `https://transmute.sh/docs/<filename>`.

## Reporting Issues

- **Website issues** — open an issue in [this repository](https://github.com/transmute-app/transmute-app.github.io/issues).
- **Application issues** — open an issue in the [main Transmute repository](https://github.com/transmute-app/transmute/issues).

## Code Style

- TypeScript is used throughout; avoid `any` types when possible.
- Tailwind CSS for styling — avoid writing custom CSS unless necessary.
- Keep components small and focused.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](https://github.com/transmute-app/transmute/blob/main/LICENSE).
