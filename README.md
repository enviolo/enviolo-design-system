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
| [CLAUDE.md](CLAUDE.md) | Snippet that points AI tools at design.md and the tokens. |

### Sandboxes

Sandboxes show the tokens applied to real UI. Open the `index.html` in a browser; no build step is needed.

| Sandbox | Version | What it is |
| ------- | ------- | ---------- |
| [design-system-docs](sandboxes/design-system-docs/index.html) | v0.3 (current) | Design system tester and documentation site: colour, typography, buttons, layout. |
| [html-dashboard](versions/v0.2/sandboxes/html-dashboard/index.html) | v0.2 | A fleet dashboard in vanilla HTML, CSS and JS on top of BasecoatUI. |

## Principles

- **Two layers.** Fixed brand colors, plus a swappable neutral ramp.
- **Override at the token layer.** Don't restyle individual components.
- **No hard-coded hex values in application code.** Everything goes through a token, so a rebrand is a one-file edit.

Read [design.md](design.md) for the full details.

## Version log

Versions are git tags. `main` holds released versions only; work in progress lives on `dev`.

| Version | Tag | design.md | Sandbox | Summary |
| ------- | --- | --------- | ------- | ------- |
| v0.3 | _pending_ | [design.md](design.md) | [design-system-docs](sandboxes/design-system-docs/index.html) | Architecture (shadcn/ui for React apps, Enviolo CSS for web, Enviolo token layer on top); AI rules up front; Enviolo ramp (11 steps); per-mode background, accent and focus; status colours; gradients and chart steps; layout grid and breakpoints; navigation patterns. Adds `tokens/tokens.css` and `tokens/components.css`. Current: v0.3.8. |
| v0.2 | `v0.2` | [versions/v0.2/design.md](versions/v0.2/design.md) | [html-dashboard](versions/v0.2/sandboxes/html-dashboard/index.html) | Brand and semantic colour tokens, Taupe/Mist neutral ramps, light and dark mode, shadcn and BasecoatUI routers. (v0.1 was earlier BasecoatUI testing.) |

The detailed history inside v0.3 is in design.md §16, numbered v0.3.1 to v0.3.8.

## Status

Work in progress (currently v0.3.8). Tokens and guidelines may change.

## Contact

Questions, feedback or updates: **Ricardo Pereira**, [ricardo.pereira@enviolo.com](mailto:ricardo.pereira@enviolo.com)
