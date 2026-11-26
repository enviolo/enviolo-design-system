# Enviolo Design System

Questions, feedback or updates: **Ricardo Pereira**, [ricardo.pereira@enviolo.com](mailto:ricardo.pereira@enviolo.com)

The design language behind Enviolo's digital products: brand colours, neutral ramps, typography, components and the rules for applying them in light and dark mode.

It is a token-first system and doesn't ship its own component library. It layers Enviolo's brand on two foundations:

- **[shadcn/ui](https://ui.shadcn.com/)** (Luma style) for React / Tailwind projects.
- **Enviolo CSS** ([tokens/components.css](tokens/components.css)) for plain HTML / CSS / JS projects, built on the same tokens.

See [docs/changelog.md]() and github tags for versions.

## Principles

- **Two layers.** Fixed brand colours, plus a swappable neutral ramp.
- **Override at the token layer.** Don't restyle individual components.
- **No hard-coded hex values in application code.** Everything goes through a token, so a rebrand is a one-file edit.

## Run locally

The docs site is plain HTML, CSS and JS. There is nothing to install or build.

- In a browser, just open `index.html`.
- In a IDE, run the CLI below inn terminal, then open  [http://localhost:8765/](http://localhost:8765/).

```sh
nohup python3 serve.py > serve.log 2>&1 &
```

## What's in this repo

| Path | What it is |
| ---- | ---------- |
| [design.md](design.md) | Source of truth: rules, tokens, components, layout, accessibility. |
| [tokens/](tokens/) | `tokens.css` (decided design tokens), `components.css` (plain-HTML components) and the `<enviolo-calendar>` web component. `explore.css` holds colour ramps still being explored; the docs site loads it, products don't. |
| [index.html](index.html), [site/](site/) | Docs site. Overview is `index.html`; Foundations and Components pages are in `site/`. |
| [docs/](docs/) | Project notes: backlog, changelog, research. |
| [CLAUDE.md](CLAUDE.md) | Instructions for AI work on this repo itself. |

## Use it in a project

`design.md` has a hard-rules section for AI tools (§0), but a tool only follows it if told to read it.

1. **Copy** `design.md` and `tokens/tokens.css` into your project. For plain HTML/CSS also copy `tokens/components.css`. React apps use shadcn/ui with `tokens.css` and don't need `components.css`.
2. **Paste this** into your project's instructions file (`CLAUDE.md` for Claude Code; Cursor, Copilot and others have their own). Adjust paths if needed.

```md
## Design system
- Follow `design.md` for all UI work. Its section 0 lists the hard rules.
- Tokens live in `tokens/tokens.css`; web pages also use `tokens/components.css`. Use semantic tokens only; never hard-code colours.
- When a rule is unclear, check design.md and ask instead of inventing tokens.
```

The snippet points at `design.md` and doesn't restate the rules, so it can't go stale.
