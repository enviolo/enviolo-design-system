# Enviolo Design System

The design language behind Enviolo's digital products: brand colors, neutral color ramps, typography, and the rules for applying them in light and dark mode.

It is a lightweight, token-first system. It doesn't ship its own component library. It builds on established open-source foundations and layers Enviolo's brand on top:

- **[shadcn/ui](https://ui.shadcn.com/)** (Luma style) for React / Tailwind projects
- **[BasecoatUI](https://basecoatui.com/)** (Luma style) for plain HTML / CSS / JS projects

## What's in this repo


| Path                                                         | What it is                                                                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| [design.md](design.md)                                       | The source of truth: philosophy, brand and semantic color tokens, the light and dark neutral ramps, and deployment guidelines. |
| [sandbox/vanilla-html-css-js/](sandbox/vanilla-html-css-js/) | A working reference implementation of the tokens: a fleet dashboard in vanilla HTML, CSS and JS on top of BasecoatUI.          |




### Sandbox

The sandbox shows the tokens applied to real UI. Open [sandbox/vanilla-html-css-js/index.html](sandbox/vanilla-html-css-js/index.html) in a browser. It needs no build step.

- `vendor/basecoat-luma.cdn.min.css` is the vendored base library, loaded first.
- `tokens.css` holds Enviolo's brand tokens and semantic mapping, loaded second.
- `dashboard.css` and `app.js` hold the dashboard layout and behavior.



## Principles

- **Two layers.** Fixed brand colors, plus a swappable neutral ramp.
- **Override at the token layer.** Don't restyle individual components.
- **No hard-coded hex values in application code.** Everything goes through a token, so a rebrand is a one-file edit.

Read [design.md](design.md) for the full details.

## Status

Work in progress (currently v0.2). Tokens and guidelines may change.

## Contact

Questions, feedback or updates: **Ricardo Pereira**, [ricardo.pereira@enviolo.com](mailto:ricardo.pereira@enviolo.com)