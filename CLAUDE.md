# Working on the Enviolo design system

This repo is the design system itself. `design.md` is the single source of the rules; don't restate them elsewhere, because copies drift. Other projects use the system by copying `design.md` and the token files (see "Use it in a project" in the README), so this file is only for developing it.

## What's where

- `design.md`: rules and spec. `tokens/tokens.css`: tokens. `tokens/components.css`: web components, written as a base class plus attributes (`class="btn" data-variant="secondary" data-size="sm"`).
- `sandboxes/design-system-docs/`: the docs site. `versions/vX.Y/`: archived releases, each with its `design.md`, tokens and sandboxes.



## Workflow

- Work on `dev`. `main` holds released versions only. Merge to `main` and tag (`vX.Y.Z`) only when asked. Commit and push only when asked.
- A version bump touches: the `design.md` header and §16 changelog, the header comments in `tokens/tokens.css` and `tokens/components.css`, the README version log and status line, and the meta line in `sandboxes/design-system-docs/index.html`.
- On release, move the previous version's `design.md`, `tokens/` and `sandboxes/` into `versions/vX.Y/` and replace the root files.



## Tokens

- Components use semantic tokens only; never hard-code colours.
- The docs site keeps its own copy of the tokens in `assets/docs-base.css` (the neutral ramps swap at runtime). When you change a token, change it in both `tokens/tokens.css` and there.



## Docs site

- One HTML file per page, no build step. New page: create the file under `sandboxes/design-system-docs/`, copy the `<head>` and script tags from an existing page (mind the `../` depth), set `data-page` on `<body>`, and add an entry to `TOPICS` in `assets/docs.js`. The nav, sub-nav and Display menu are built from that list.
- To view it, serve the **repo root**: `python3 -m http.server 8765`, then open `http://localhost:8765/sandboxes/design-system-docs/index.html`. Serving only the docs folder breaks it, because pages load `tokens/components.css` from outside.
- IDE-embedded browsers (Cursor) don't follow `file://` links between pages, so use localhost there. Check `lsof -i :8765` before starting, run the server in the background, and stop it when done.

