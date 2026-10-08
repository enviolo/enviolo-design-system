## Design system
- Follow `design.md` for all UI work. Section 0 lists the hard rules.
- Tokens live in `tokens/tokens.css`. Components use semantic tokens only; never hard-code colours.
- React apps → shadcn/ui. Websites and CMS templates → Enviolo CSS (`tokens/components.css`): `class="btn" data-variant="secondary" data-size="sm"`, never `btn-secondary`. Same token names in both. Don't load Basecoat; if a component is missing from `components.css`, ask or add it there first.
- When a rule is unclear, check design.md §15 (open decisions) and ask instead of inventing tokens.

## Running the docs site
- The docs site is `sandboxes/design-system-docs/` (one HTML file per page, no build step). To view it, serve the **repo root**: `python3 -m http.server 8765`, then open `http://localhost:8765/sandboxes/design-system-docs/index.html`. Serving only the docs folder breaks it, because pages load `tokens/components.css` from outside.
- IDE-embedded browsers (Cursor) don't follow `file://` links between pages, so use localhost there. Check `lsof -i :8765` before starting, run the server in the background, and stop it when done.
- New page: add the HTML file and an entry to `TOPICS` in `assets/docs.js`; the nav is built from that list.
