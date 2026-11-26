# Enviolo design system

Note: [CLAUDE.md](CLAUDE.md) is for AI and Claude agents. Use [README.md](README.md) for human read.

This repo is the design system itself. `design.md` is the single source of the rules; don't restate them elsewhere, because copies drift. Other projects use the system by copying `design.md` and the token files (see "Use it in a project" in the README), so this file is only for developing it.

## What's where

- `design.md`: rules and spec. `tokens/tokens.css`: decided tokens only. `tokens/explore.css`: colour ramps being explored (the docs site's Display menu previews them; products never copy it). Promote a ramp by moving it into `tokens.css`. `tokens/components.css`: web components, written as a base class plus attributes (`class="btn" data-variant="secondary" data-size="sm"`).
- `docs/BACKLOG.md`: work still to do. Check it before starting something new, and update it when an item ships or a new one turns up. `docs/CHANGELOG.md`: what changed, newest first; add a line for every change that ships.
- `index.html` (Overview) and `site/` (Foundations and Components pages, shared `assets/`): the docs site, the frontend. `docs/`: project notes (backlog, changelog, research), not served. `sandboxes/`: example apps built with the system, gitignored — local only, not part of the shipped repo.



## Workflow

- Work on `dev`. `main` holds released versions only. Merge to `main` and tag (`vX.Y.Z`) only when asked. Commit and push only when asked.
- A version bump touches: the `design.md` header, `docs/CHANGELOG.md`, the header comments in `tokens/tokens.css` and `tokens/components.css`, the meta line in the root `index.html`, and the footer line in the dashboard sandbox.
- Notion mirrors the backlog and changelog (hub page "Design system & AI"). When you add, finish or remove an item in `docs/BACKLOG.md`, do the same in the Notion "(DS) Backlog database" (short action-style Name, Status, current Sprint; Done tasks get Due set to the day they were done, so the burn-up chart tracks them). When a version is released, add it to the Notion "Change logs" database (Product: Design system & AI; `[key release]` prefix for minor versions). Notion details are in the user's memory.
- Old versions are not archived in folders: read them from their git tag (`git show v0.2:design.md`).



## Tokens

- Components use semantic tokens only; never hard-code colours.
- The docs site loads `tokens/tokens.css` and `tokens/explore.css` directly (no copy), so a token change is made once. Display reads the ramp values from that CSS at runtime and swaps `--light-*` / `--dark-*` to point at the chosen ramp.



## Adding a web component

- Basecoat is a reference, not a dependency. Start from its markup and CSS, then port it into `components.css` with tokens only, in the shadcn vocabulary, and check it in light and dark with any neutral ramp.
- States follow one rule: a solid fill from a token (design.md 7.1), never an opacity change or a computed colour mix.
- Watch for colour mixes in polar spaces (oklch, lch, hsl): Basecoat's secondary hover mixes in OKLCH and turns brown in dark mode, so don't copy that recipe.



## Docs site

- One HTML file per page, no build step. New page: create the file under `site/<topic>/`, copy the `<head>` and script tags from an existing page there, set `data-page` on `<body>`, and add an entry to `TOPICS` in `site/assets/docs.js`. The nav, sidebar and topic index grid are built from that list (`data-topic-grid` on a topic's `index.html`).
- The right-hand "On this page" TOC is built automatically in `docs.js` from each page's `section > .section-head > h2` and `section > h3`; ids are generated if missing. Keep headings in that structure and the TOC needs no upkeep. It hides below 1280px and on topic index pages.
- A component page follows Basecoat's order (reference: `site/components/buttons.html`): a preview, then **Usage** (Include CSS, Add your HTML, Variants, Sizes, React, Accessibility), then **Examples** (one rendered stage plus its code per variant, then States). Guidance on when to pick a variant goes on a Patterns page (`site/patterns/`), not the component page. Where we lack something shadcn or Basecoat has, say so in one line instead of inventing it.
- The Display personalizer (theme, font, per-mode settings) is shared: `site/assets/display.js` and `display.css`. A sandbox adds it with `theme-init.js` in the head, `display.css` after `components.css`, and `display.js` before its own script; set `window.EnvioloDisplayConfig = { hide: ["icons", "mono"] }` first to drop groups that don't apply. Display lists a ramp when its tokens are loaded: `tokens/tokens.css` gives Dawn and Nocturne, and adding `tokens/explore.css` adds the exploration ramps. Sandboxes use the `.dark` class (tokens.css); the docs site also sets `data-theme`, and `display.js` sets both.
- To view it, run `python3 serve.py` from the **repo root**: it serves on `http://localhost:8765/` and opens the browser. Serving only the site folder breaks it, because pages load `tokens/components.css` from outside.
- IDE-embedded browsers (Cursor) don't follow `file://` links between pages, so use localhost there. Check `lsof -i :8765` before starting, run the server in the background, and stop it when done.

