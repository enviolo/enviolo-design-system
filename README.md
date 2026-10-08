# Enviolo Design System

The design language behind Enviolo's digital products: brand colors, neutral color ramps, typography, components and the rules for applying them in light and dark mode.

It is a lightweight, token-first system. It doesn't ship its own component library. It builds on established open-source foundations and layers Enviolo's brand on top:

- **[shadcn/ui](https://ui.shadcn.com/)** (Luma style) for React / Tailwind projects
- **Enviolo CSS** ([tokens/components.css](tokens/components.css)) for plain HTML / CSS / JS projects, built on the same tokens and the Luma look. [BasecoatUI](https://basecoatui.com/) is a reference for new components, not a dependency.

## What's in this repo

| Path | What it is |
| ---- | ---------- |
| [design.md](design.md) | The source of truth for the current version: rules, tokens, components, layout, accessibility and open decisions. |
| [tokens/tokens.css](tokens/tokens.css) | Production-ready token file built from design.md, for Tailwind v4 projects. |
| [tokens/components.css](tokens/components.css) | Plain-HTML component styles (buttons, inputs, status pills) built on the tokens. The web backbone; used by the docs site. |
| [sandboxes/](sandboxes/) | Working references for the current version. |
| [versions/](versions/) | Previous versions, each in its own folder with its design.md and sandboxes. |
| [CLAUDE.md](CLAUDE.md) | Instructions for AI-assisted work on this repo itself (workflow, versions, docs site). Not for projects that use the system. |

### Sandboxes

Sandboxes show the tokens applied to real UI. Open the `index.html` in a browser; no build step is needed.

The docs site spans several files. Opening `index.html` from disk works in normal browsers; for IDE-embedded browsers see [Run the docs site locally](#run-the-docs-site-locally).

| Sandbox | Version | What it is |
| ------- | ------- | ---------- |
| [design-system-docs](sandboxes/design-system-docs/index.html) | v0.3 (current) | Design system tester and documentation site, one page per topic: Overview, Foundations (colour, typography, layout) and Components (buttons). Shared styles and scripts live in its `assets/` folder; the nav is built by `assets/docs.js`. |
| [html-dashboard](versions/v0.2/sandboxes/html-dashboard/index.html) | v0.2 | A fleet dashboard in vanilla HTML, CSS and JS on top of BasecoatUI. |

### Run the docs site locally

The docs site is plain HTML, CSS and JavaScript, so there is no install or build step. It needs Python 3 only to serve it.

From the repo root:

```
python3 -m http.server 8765
```

Then open <http://localhost:8765/sandboxes/design-system-docs/index.html>. Stop the server with `Ctrl+C`.

- **Serve the repo root, not the docs folder.** The pages load `tokens/components.css` from outside their folder, so serving the folder alone leaves buttons and inputs unstyled.
- **Why a server at all.** The site is one HTML file per page. Normal browsers can open `index.html` straight from disk, but some IDE-embedded browsers (Cursor's, for one) don't follow links between local `file://` pages. Over `http://localhost` they do.
- **Port already in use.** Pick another, for example `python3 -m http.server 8766`, and change the port in the URL.
- **Editing.** Reload the page to see changes. Display choices (theme, font, ramps) are saved in the browser for each address, so `localhost` and a `file://` copy keep separate settings.
- **Adding a page.** Create the HTML file under `sandboxes/design-system-docs/`, copy the `<head>` and script tags from an existing page (mind the `../` depth), set `data-page` on `<body>`, and add an entry to `TOPICS` in `assets/docs.js`. The nav, sub-nav and Display menu are built from that list.

## Use it in a project

`design.md` is the source of truth, and it has a hard-rules section written for AI tools (§0). A tool only follows it if something tells it to read it, so add a short pointer to the instructions file your AI tool reads.

1. **Copy the files into your project:** `design.md`, `tokens/tokens.css`, and for plain HTML/CSS projects `tokens/components.css`. React apps use shadcn/ui with `tokens.css` and don't need `components.css`.
2. **Paste this snippet** into your project's instructions file. Claude Code reads `CLAUDE.md`; Cursor, Copilot and other tools use their own rules or instructions files (check your tool's docs for the name). Adjust the paths if you put the files elsewhere.

```md
## Design system
- Follow `design.md` for all UI work. Its section 0 lists the hard rules.
- Tokens live in `tokens/tokens.css`; web pages also use `tokens/components.css`. Use semantic tokens only; never hard-code colours.
- When a rule is unclear, check design.md §15 (open decisions) and ask instead of inventing tokens.
```

The snippet only points at `design.md` and doesn't restate the rules, so it can't go out of date when the rules change.

## Principles

- **Two layers.** Fixed brand colors, plus a swappable neutral ramp.
- **Override at the token layer.** Don't restyle individual components.
- **No hard-coded hex values in application code.** Everything goes through a token, so a rebrand is a one-file edit.

Read [design.md](design.md) for the full details.

## Version log

Versions are git tags. `main` holds released versions only; work in progress lives on `dev`.

| Version | Tag | design.md | Sandbox | Summary |
| ------- | --- | --------- | ------- | ------- |
| v0.3 | _pending_ | [design.md](design.md) | [design-system-docs](sandboxes/design-system-docs/index.html) | Architecture (shadcn/ui for React apps, Enviolo CSS for web, Enviolo token layer on top); AI rules up front; Enviolo ramp (11 steps); per-mode background, accent and focus; status colours; gradients and chart steps; layout grid and breakpoints; navigation patterns. Adds `tokens/tokens.css` and `tokens/components.css`. Current: v0.3.9. |
| v0.2 | `v0.2` | [versions/v0.2/design.md](versions/v0.2/design.md) | [html-dashboard](versions/v0.2/sandboxes/html-dashboard/index.html) | Brand and semantic colour tokens, Taupe/Mist neutral ramps, light and dark mode, shadcn and BasecoatUI routers. (v0.1 was earlier BasecoatUI testing.) |

The detailed history inside v0.3 is in design.md §16, numbered v0.3.1 to v0.3.9.

## Status

Work in progress (currently v0.3.9). Tokens and guidelines may change.

## Contact

Questions, feedback or updates: **Ricardo Pereira**, [ricardo.pereira@enviolo.com](mailto:ricardo.pereira@enviolo.com)
