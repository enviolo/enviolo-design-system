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
| [index.html](index.html), [docs/](docs/) | The documentation site. Open `index.html` for the Overview; the Foundations and Components pages live in `docs/`. |
| [sandboxes/](sandboxes/) | Working references for the current version. |
| [versions/](versions/) | Previous versions, each in its own folder with its design.md and sandboxes. |
| [CLAUDE.md](CLAUDE.md) | Instructions for AI-assisted work on this repo itself (workflow, versions, docs site). Not for projects that use the system. |

### Sandboxes

Sandboxes show the tokens applied to real UI. Open a sandbox's `index.html` in a browser; no build step is needed. The documentation site itself is the `index.html` at the repo root.

Developing in an IDE browser? Cursor's, for one, doesn't follow links between local files. Serve the repo root with `python3 -m http.server 8765` and open `http://localhost:8765/`. More in [CLAUDE.md](CLAUDE.md).

| Sandbox | Version | What it is |
| ------- | ------- | ---------- |
| [html-dashboard](sandboxes/html-dashboard/index.html) | v0.3 (current) | The fleet dashboard rebuilt on the v0.3 rules: shared `tokens/` files, `components.css` for buttons, inputs, pills, cards and the segmented control, a time-range filter that drives the stats and the ramp-coloured charts, the Display personalizer, and and two calendar tests driving the time range: shadcn's React calendar (react-day-picker from a CDN) and a dependency-free `<enviolo-calendar>` web component, which also powers the date picker popover at the top. |
| [html-dashboard](versions/v0.2/sandboxes/html-dashboard/index.html) | v0.2 | The original fleet dashboard, on top of BasecoatUI. |

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
| v0.3.12 | `v0.3.12` | [design.md](design.md) | [docs site](index.html), [html-dashboard](sandboxes/html-dashboard/index.html) | Architecture (shadcn/ui for React apps, Enviolo CSS for web, Enviolo token layer on top); AI rules up front; Enviolo ramp (11 steps); per-mode background, accent and focus; status colours; gradients and chart steps; layout grid and breakpoints; navigation patterns. Adds `tokens/tokens.css` and `tokens/components.css`. Current: v0.3.11. |
| v0.2 | `v0.2` | [versions/v0.2/design.md](versions/v0.2/design.md) | [html-dashboard](versions/v0.2/sandboxes/html-dashboard/index.html) | Brand and semantic colour tokens, Taupe/Mist neutral ramps, light and dark mode, shadcn and BasecoatUI routers. (v0.1 was earlier BasecoatUI testing.) |

The detailed history inside v0.3 is in design.md §16, numbered v0.3.1 to v0.3.12.

## Status

Work in progress (currently v0.3.12). Tokens and guidelines may change.

## Contact

Questions, feedback or updates: **Ricardo Pereira**, [ricardo.pereira@enviolo.com](mailto:ricardo.pereira@enviolo.com)
