# Working on the Enviolo design system

This repo is the design system itself. `design.md` is the single source of the rules; don't restate them elsewhere, because copies drift. Other projects use the system by copying `design.md` and the token files (see "Use it in a project" in the README), so this file is only for developing it.

## What's where

- `design.md`: rules and spec. `tokens/tokens.css`: tokens. `tokens/components.css`: web components, written as a base class plus attributes (`class="btn" data-variant="secondary" data-size="sm"`).
- `docs/BACKLOG.md`: work still to do. Check it before starting something new, and update it when an item ships or a new one turns up. `docs/CHANGELOG.md`: what changed, newest first; add a line for every change that ships.
- `index.html` (Overview) and `docs/` (Foundations and Components pages, shared `assets/`): the docs site. `sandboxes/`: example apps built with the system. `versions/vX.Y/`: archived releases, each with its own `design.md`, tokens, docs site and sandboxes.



## Workflow

- Work on `dev`. `main` holds released versions only. Merge to `main` and tag (`vX.Y.Z`) only when asked. Commit and push only when asked.
- A version bump touches: the `design.md` header and §16 changelog, `docs/CHANGELOG.md`, the header comments in `tokens/tokens.css` and `tokens/components.css`, the README version log and status line, the meta line in the root `index.html`, and the footer line in the dashboard sandbox.
- On release, move the previous version's `design.md`, `tokens/`, `index.html`, `docs/` and `sandboxes/` into `versions/vX.Y/` and replace the root files.



## Tokens

- Components use semantic tokens only; never hard-code colours.
- The docs site keeps its own copy of the tokens in `docs/assets/docs-base.css` (the neutral ramps swap at runtime). When you change a token, change it in both `tokens/tokens.css` and there.



## Docs site

- One HTML file per page, no build step. New page: create the file under `docs/<topic>/`, copy the `<head>` and script tags from an existing page there, set `data-page` on `<body>`, and add an entry to `TOPICS` in `docs/assets/docs.js`. The nav and sub-nav are built from that list.
- The Display personalizer (theme, font, per-mode settings) is shared: `docs/assets/display.js` and `display.css`. A sandbox adds it with `theme-init.js` in the head, `display.css` after `components.css`, and `display.js` before its own script; set `window.EnvioloDisplayConfig = { hide: ["icons", "mono"] }` first to drop groups that don't apply. Sandboxes use the `.dark` class (tokens.css); the docs site also sets `data-theme`, and `display.js` sets both.
- To view it, serve the **repo root**: `python3 -m http.server 8765`, then open `http://localhost:8765/`. Serving only the docs folder breaks it, because pages load `tokens/components.css` from outside.
- IDE-embedded browsers (Cursor) don't follow `file://` links between pages, so use localhost there. Check `lsof -i :8765` before starting, run the server in the background, and stop it when done.

