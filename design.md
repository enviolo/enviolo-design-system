# Design tokens & principles

Enviolo's design system and design language

Version v0.2

Light and dark mode.

---

## Summary

- Enviolo uses **[shadcn/ui](https://ui.shadcn.com/)** or **[BasecoatUI](https://basecoatui.com/)** – Luma style – as a foundation for the design system.
- It sets its own brand flavoring through specific color tokens and font family in this file.
- It uses Tailwind utilities where possible, and `Taupe` color ramp for grayscales.

The token names below are the ones **shadcn/ui** (React/Tailwind projects) and **BasecoatUI**  
(plain-HTML/CSS projects) both already use, so this maps directly onto  
whichever one a given build uses — no component markup or class names here,  
just the tokens and the reasoning behind them.

## Philosophy

- **Two layers: a brand layer** (fixed Enviolo colors) **and a neutral layer**
(a swappable grayscale ramp). Only the neutral layer should change between
projects or visual refreshes — brand colors stay constant.
- **Prefer the underlying system's own components and defaults.** Override at the
*token* layer (colors, radius, spacing) — restyling individual component
selectors defeats the point of adopting a design system in the first place.
- **No bespoke hex literals in application code.** Everything routes through a  
token, so a rebrand is a one-file edit, not a find-and-replace.
- **Tailwind-first: utility over hardcoded value;** scale/style-pack swap (incl.
Basecoat/shadcn radius & spacing, Luma pill treatment) over bespoke
per-component overrides. Reaching for a literal or one-off tweak is a signal
something's missing upstream, not a green light.

## Deployment

1. Check which stack will be used, to choose design system:
  - React app → **shadcn/ui**
  - Vanilla HTML/CSS/JS → **BasecoatUI**
  - Anything else → confirm with the user before proceeding.
2. shadcn: `npx shadcn@latest init`, then `npx shadcn@latest add <component>` as needed — don't hand-write the boilerplate.
3. BasecoatUI: vendor the CSS into `vendor/`, no CDN calls. Confirm the style pack (e.g. Luma) first.
4. Load order: base library CSS first, this project's token overrides second.
5. Wire tokens in one `:root` block: brand colors → neutral ramp → semantic mapping. No second block elsewhere.
6. Smoke-test one button + one input before building the full UI.
7. Adding a new dependency (Tailwind, a framework) is a decision — confirm with the user, don't default into it.

---

## Brand colors

Almost identical between light and dark — swaps noted below.


| Token        | Value     | Role                                         |
| ------------ | --------- | -------------------------------------------- |
| `--midnight` | `#03161c` | Primary actions, dark text on light surfaces |
| `--coral`    | `#ed9b85` | Secondary accent                             |
| `--dusk`     | `#99635d` | Focus ring, mid-weight accent (light mode)   |
| `--gold`     | `#cec0aa` | Focus ring, mid-weight accent (dark mode)    |
| `--orange`   | `#f2bb9d` | Tertiary accent                              |
| `--white`    | `#FFFFFF` | Base light surface                           |
| `--positive` | `#3FA772` | Success state                                |
| `--negative` | `#E0523F` | Error / destructive state                    |


`--gold` replaces `--dusk` in dark mode — same role, different token. Swap it
in the semantic mapping (e.g. `--ring`), not by redefining `--dusk` itself.

`--primary`/`--primary-foreground` also swap in dark mode: midnight/white
becomes white/midnight, so the primary button stays legible on a dark page
(midnight-on-dark reads as near-invisible). Swap in the semantic mapping, not
by redefining `--midnight`.

An `--ivory` (`#faeac0`) exists only for chart use in dark mode
(`--chart-gradient-a` and `--chart-1`) — treat it as chart-scoped, not a
token to reach for generally.

## Neutral ramp (swappable, per mode)

One ramp per mode, both Tailwind v4.2 families, 50→950. This is the layer
expected to change on a reskin — brand colors above stay put.


| Step | Light — `Taupe` | Dark — `Mist` |
| ---- | --------------- | ------------- |
| 50   | `#fbfaf9`       | `#f9fbfb`     |
| 100  | `#f3f1f1`       | `#f1f3f3`     |
| 200  | `#e8e4e3`       | `#e3e7e8`     |
| 300  | `#d8d2d0`       | `#d0d6d8`     |
| 400  | `#aba09c`       | `#9ca8ab`     |
| 500  | `#7c6d67`       | `#67787c`     |
| 600  | `#5b4f4b`       | `#4b585b`     |
| 700  | `#473c39`       | `#394447`     |
| 800  | `#2b2422`       | `#22292b`     |
| 900  | `#1d1816`       | `#161b1d`     |
| 950  | `#0c0a09`       | `#090b0c`     |


Swap either ramp for a different Tailwind neutral family (`stone`, `zinc`,
`neutral`...) to reskin without touching the semantic mapping below. In dark
mode, the mapping direction inverts: `--background`/`--foreground` point to
the opposite ends of the ramp (near-950 for background, near-50 for
foreground) instead of near-50/near-950.

## Semantic token contract

Both shadcn/ui and basecoatui systems consume identical variable names — this is the layer that makes the tokens portable between them. Wire brand + neutral onto these once, per project:


| Token                                    | Points at                 | Role                                                   |
| ---------------------------------------- | ------------------------- | ------------------------------------------------------ |
| `--background`                           | neutral-50                | Page background                                        |
| `--foreground`                           | neutral-950               | Default text                                           |
| `--card` / `--card-foreground`           | white / neutral-950       | Card surface                                           |
| `--popover` / `--popover-foreground`     | white / neutral-950       | Popovers, tooltips                                     |
| `--primary` / `--primary-foreground`     | brand dark / white        | Primary buttons                                        |
| `--secondary` / `--secondary-foreground` | neutral-100 / neutral-950 | Secondary buttons                                      |
| `--muted` / `--muted-foreground`         | neutral-100 / neutral-500 | De-emphasized surfaces & text                          |
| `--accent` / `--accent-foreground`       | neutral-100 / neutral-950 | Hover/active backgrounds                               |
| `--destructive`                          | `--negative`              | Errors, destructive actions                            |
| `--border` / `--input`                   | neutral-200               | Borders, input outlines                                |
| `--ring`                                 | brand mid-accent          | Focus ring                                             |
| `--radius`                               | `0.625rem`                | Shared base radius both systems build their scale from |


shadcn also defines `--destructive-foreground`, which Basecoat's CDN build
doesn't ship — add it for shadcn projects (usually `--white` or near-white).

## Typography

- Source Sans 3 (Google Fonts), weights 400 (normal) / 500 (medium) / 600
(semibold) — matches both systems' medium/semibold scale, nothing bespoke.
- Fallback stack: `Arial, sans-serif`.
- Use the host system's own type scale (`--text-xs`…`--text-lg` in Basecoat,
Tailwind's `text-*` utilities in shadcn) instead of inventing pixel values.

## Spacing

Both systems share Tailwind's base spacing unit, `--spacing: .25rem` (4px),
referenced as `calc(var(--spacing) * N)`. Express spacing as a multiple of
this unit rather than hardcoding pixel gaps, so it scales with the rest of
the system.

## Radius

- Base: `--radius: 0.625rem` — shadcn's own default, inherited as-is.
- Both systems derive a scale off it (`--radius-sm`, `-lg`, `-xl`, `-2xl`, …).
- A "fully rounded" pill treatment (BasecoatUI's "Luma" style pack) pushes
components' radius up to `--radius-4xl` (2rem) without touching the base
`--radius` value — prefer swapping the style pack / radius scale over
hand-tuning individual component corners.

## Status colors

Neither system ships a built-in "success" variant out of the box —
`--positive` / `--negative` are an Enviolo-specific addition layered on top of
the standard `--destructive` token, used for badges and inline validation.
Keep them in the brand layer (not the neutral one), since they shouldn't
change on a reskin.

## Buttons

Use Basecoat/shadcn's own button component and variant classes as shipped —
don't layer a separate emphasis scale on top, and don't hand-roll what the
official build already provides (its own outline button, `rounded-full` for
a pill shape, etc.).

## Icons

[Tabler Icons](https://tabler.io/icons) — inline SVG (24×24, `stroke="currentColor"`,
`stroke-width="2"`), not a font/sprite. Place as a direct child using the
host system's own slot attribute: `data-icon="inline-start"`/`"inline-end"`
on a button, `data-align="start"` on an `.input-group` icon `<span>`.

## Charts

BasecoatUI (and shadcn's equivalent) expose `--chart-1`…`--chart-5` +
`--chart-bar-radius` for chart/tooltip components. Enviolo wires these onto
the brand layer, not the neutral one:

- `--chart-1` — flat accent for small marks (line strokes, dots, sparklines,
legend/tooltip swatches). `--coral` (light) / `--ivory` (dark) — its own
pair, kept separate from `--ring`'s `--dusk` / `--gold`.
- `--chart-gradient-a` / `--chart-gradient-b` — two-stop gradient for large
fills only (bars, area washes); `a` is the brighter stop, `b` the deeper
one. Light: `--coral` / `--dusk`. Dark: `--ivory` / `--gold`.
- Don't build multi-hue categorical charts straight off the brand ramp — it's
warm and low-diversity, and hasn't been run through a colorblind-safety
check. A single flat accent, or the gradient pair above, is the safe
default per chart.

