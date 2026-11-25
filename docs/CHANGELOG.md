# Changelog

What changed in the repo, newest first: the spec, the tokens, the docs site and the sandboxes. Versions are git tags (see the README version log).

The spec-level history for v0.3.1 to v0.3.11 used to live in `design.md` and is now in git history (see the tags). The entries below summarise it.

Planned work is in [BACKLOG.md](BACKLOG.md).

## Unreleased

- **Components › Buttons restructured after Basecoat's button page.** Intro preview, then Usage (Include CSS, Add your button HTML, Variants, Sizes, React, Accessibility) and Examples (Size, Default, Outline, Secondary, Ghost, Destructive, Link, Icon, With icon, States), each example a rendered stage with its code. The four-type cards and "Also available" are gone; their Use for / Avoid guidance moved to Patterns › Buttons as "Variants in use". `site/components/buttons.html`, `site/patterns/buttons.html`, `site/assets/docs.css`.
- **Destructive button is muted,** like shadcn's base-nova style and Basecoat: red text (`--destructive-text`) on a pale red fill (`--destructive-bg`), hovering to `--destructive-hover` (red-100 light, red-900 dark). It was solid red. Still a solid token fill, no opacity. `tokens/tokens.css`, `tokens/components.css`, `site/assets/docs-base.css`, design.md 7.1.
- **Overview: "How the system is built" cards are outline only.** The fill made them look clickable; they aren't links. `site/assets/docs.css`.
- **Nocturne is the default dark neutral ramp, replacing Mist.** Mist's lightness profile with the Enviolo night tint, so the stock token mapping and components work unchanged on shadcn, Basecoat and native. 950 is Pearl Black (`#020D12`), 900 is the new Midnight, and the tint fades to a near-white 50. Mist stays available in the Display menu. `tokens/tokens.css` (`--nocturne-*`, `--d-*`), `site/assets/docs-base.css`, `site/assets/display.js`, design.md and the Overview copy updated.
- **Colour page: swatch lightness is now OKLCH L (e.g. `L 77`), not CIE L\*,** so the labels use the same scale as the tokens and the ramp spacing. `site/foundations/colour.html`.
- **Brand ramp recalibrated between Coral and Midnight.** Lightness (OKLCH) is now evenly stepped: about 7.6 points per step from Copper (67.5%) down to Midnight (21.8%), where Midnight's move to `#0B1D22` had squeezed Nightfall and Midnight to 4.7 points and left Coffee at 9.7. Hue and chroma are unchanged. Coral, Copper and Midnight are unchanged, so the light-mode Copper focus (3.05:1) holds. Clay `#A96D64` to `#AA6E65`, Dusk `#865A56` to `#895D58`, Twilight `#614749` to `#674C4E`, Coffee `#393339` to `#443E44`, Nightfall `#20262B` to `#272D32`. Coffee and Nightfall are the visible changes (about 4 and 3 lightness points lighter). Clay focus contrast is 4.1:1 (was 4.15). Update brand and print files to match. `tokens/tokens.css`, `site/assets/docs-base.css`, `site/assets/docs.css`, the Colour page.
- **Apricot is now Orange, `#F9C1A3`** (Enviolo 100; was Apricot `#F5CAA8`). Lightness is calibrated to sit halfway between Ivory and Coral (about 8.5 points each side; hue and chroma kept). The dark-mode focus ring default follows: Orange, 12.3:1 on Pearl Black (was 13:1). Renamed in the Display menu, `--enviolo-apricot` is now `--enviolo-orange`, and the Colour page and design.md are updated. Saved Display choices of "Apricot" fall back to the new default. The internal `ringApricot` migration flag keeps its name so it doesn't re-run. `tokens/tokens.css`, `site/assets/docs-base.css`, `site/assets/display.js`.
- **Coral (Enviolo 200) is `#ED9B85`** (237, 155, 133; CMYK 4/49/44/0 in Adobe), the brand value, replacing a slightly drifted `#E79782`. Contrast notes updated: Coral focus is 2.2:1 on white and 9.0:1 on Pearl Black in dark mode. The hero gradients' Coral glow was updated too. `tokens/tokens.css`, `site/assets/docs-base.css`, `site/assets/docs.css`, the Colour and Typography pages.
- **Midnight (Enviolo 900) changes from `#05191E` to `#0B1D22`** (`oklch(21.8% 0.026 217)`, L* 7 to 10), about 2 lightness points lighter, so it doubles as Nocturne 900. The brand ramp, charts, gradients and the Midnight dark-background option pick it up. Update print and brand files to match.
- **Tooltips on the bottom-right icon buttons** (GitHub, info): "Open GitHub", "About this site". Shown on hover and keyboard focus, hidden while the info panel is open. The theme toggle has none; its icon and `aria-label` already say what it does. Replaces the slow native `title` tooltips. `site/assets/display.css`, `site/assets/display.js`, `site/assets/docs.js`.
- **GitHub link** in the bottom-right corner, next to the info icon, theme toggle and Display button. New `github` icon (Tabler and Lucide). `site/assets/docs.js`, `site/assets/display.js`, design.md 8.
- **Docs site: no Overview button.** The logo and "Design System" already link to the Overview, so the nav button (and the mobile menu's Overview link) are gone.
- **New Patterns topic.** `site/patterns/` holds how components combine on real screens. Buttons moves there: "Choosing a type", the in-context examples, migration and rules of thumb (`site/patterns/buttons.html`). Components › Buttons keeps the variants, sizes, states and a new Implementation section (attributes, shadcn/ui name map, plain HTML and React samples, accessibility), checked against the shadcn/ui and Basecoat button docs. `site/assets/docs.js` TOPICS, `site/assets/docs.css` (code blocks, implementation list).
- **Docs site: Foundations and Components index pages.** Each topic has its own page listing its subpages as ghost cards (name and one line, no border or fill until hover) in two columns, one column under 600px, built from `TOPICS`. The top nav's topic links now go to these pages instead of the first subpage. Components ends with a "More components soon" card. `site/foundations/index.html`, `site/components/index.html`, `site/assets/docs.js`, `site/assets/docs.css`.
- **`serve.py`:** `python3 serve.py` serves the repo root on port 8765 and opens the browser (`python3 -m http.server 8765` still works, without opening it). README, `CLAUDE.md` and design.md 13 updated.
- **Docs site: mobile menu.** Under 640px the top nav's topic links fold into a menu button (`menu` icon) that opens a panel listing every page, grouped by topic. Desktop nav unchanged. `site/assets/docs.js`, `site/assets/docs.css`, `site/assets/display.js`. design.md 8 updated for the new icon.

## v0.4.1

Released 2026-11-24.

Patch: no rule or path changes since v0.4, only a refactor, a docs-site fix pass and an info panel.

- **`design.md` refactored (414 to about 350 lines, no rule changes).** Sections merged and renumbered: architecture and defaults are 1, tokens 2, colour 3, typography 4, shape and motion 5, layout 6, components 7 (buttons 7.1, calendar 7.4), icons 8, accessibility and theming 9, copy 10, checklist 11, open decisions 12, reference 13. Token tables compressed, the context examples moved under 7.1, the legacy migration note and duplicated button guidance removed. References in README, `CLAUDE.md`, backlog, changelog, sandboxes and docs site updated.
- **`versions/` folder removed.** Old versions are read from their git tags (`git show v0.2:design.md`). The v0.1 folder, which was never tagged, stays in git history. README and `CLAUDE.md` updated.
- **`sandboxes/` is now local-only, gitignored.** It's an example app, not part of the shipped system; README and `CLAUDE.md` updated.
- **Docs site: Colour page now fills the width** like every other page. A grid item with `width:auto` and auto margins shrinks to its content's natural width instead of the column's; `.wrap` now sets `width:100%` so it always fills then caps at 1080px regardless of a page's content.
- **Docs site: "About this site" moves from an Overview-only accordion to an info icon** in the bottom-right corner, next to the theme toggle and Display button. Opens a small card (with a heading) instead of an inline disclosure, and now describes the whole site, not just the Overview page. New `info` icon (Tabler and Lucide), design.md 8 updated.
- **Fixed:** empty colour swatches (Neutrals, Status colours) showed a stray `site/` instead of being blank, left over from a bad find-and-replace. `site/assets/docs.js`.
- **Fixed:** the new info icon button had no background fill; it was missing the `settings-trigger` class its neighbours use.
- **README:** Principles section restored after the v0.4 rewrite dropped it; Contact moved to the top.

## v0.4

Released 2026-11-24.

Minor bump because file paths moved: projects that copy files by path need to update them (`site/` for docs assets, `tokens/enviolo-calendar.js` for the calendar).

- **Style decided: Luma stays.** Rhea was tried as a replacement and dropped, so v0.4 has no style change. design.md section 12.
- **Calendar promoted to a real component.** `<enviolo-calendar>` moves out of the dashboard sandbox into `tokens/components.css` plus `tokens/enviolo-calendar.js`, with a spec (design.md 7.4) and a docs page (`site/components/calendar.html`). The sandbox now loads the shared files instead of its own copies.
- **Docs site: topic pages (Foundations, Components) get a left sidebar.** Replaces the horizontal pill subnav. Flush to the viewport edge, sticky under the top nav, collapses to a horizontal strip under 880px. `site/assets/docs.js`, `site/assets/docs.css`.
- **Docs site: top nav bar spans the full width** instead of a centred 1080px container.
- **`design.md` trimmed (about 260 lines changed).** Duplicated values and docs-site-only content removed, so tokens and the docs site hold the detail. No rule changes. Research in `docs/research/design-md-best-practices.md`.
- **`CLAUDE.md`:** updated for the `site/` layout and the release workflow. Backlog gains items for linting design.md rule 0, deciding which trimmed docs-site patterns become real components, a spec section for the date-range field, and re-checking the calendar outside headless Chrome.
- **Docs pages moved to `site/`:** `assets/`, `foundations/` and `components/` now live in `site/`; `index.html` stays at the root (GitHub Pages and AWS friendly), and `docs/` holds only project notes (backlog, changelog). Paths in `CLAUDE.md`, `README.md`, `design.md` and the dashboard sandbox updated.

## v0.3.12

Released 2026-10-09.

- **Tokens:** the dark-mode focus ring now defaults to **Apricot** (Enviolo 100, 13:1 on Neutral 950), was Coral. Coral and Ivory stay as options in the Display menu. Light mode is unchanged (Copper). Saved Display state with the old Coral default moves to Apricot once.
- **Dashboard sandbox:** one "Dates" field replaces the From and To inputs and the separate calendar button. One click opens the range calendar.
- **Dashboard sandbox:** `<enviolo-calendar>`, a dependency-free range calendar web component (test build), used as the date picker popover. It has a keyboard-navigable grid, pill days, a rounded range band, and hover that follows the button hover rules (primary ends, secondary on the band, accent elsewhere).
- **Dashboard sandbox:** a React test card using react-day-picker for comparison. The filter summary now shows only the day count.
- **Dashboard sandbox:** the stat-card sparklines are redrawn at their real pixel size (they were stretched, which warped the stroke and squashed the end dot). Each is now one smooth line with a gradient stroke (`--chart-4` to `--chart-3`) over a fade, as a deliberate exception to flat chart fills (design.md 4.2).
- **Docs:** added `docs/BACKLOG.md` and `docs/CHANGELOG.md`, linked from `CLAUDE.md`.
- **Docs:** the Overview's backbone cards are shorter, and the shadcn/ui card now links to shadcn/ui.
- **Version:** every header now says v0.3.12. A `v0.3` tag pushed earlier the same day was removed; use `v0.3.12`.

## v0.3.1 to v0.3.11

The design system rebuilt around shadcn/ui for React apps and hand-written Enviolo CSS for the web, with the Enviolo token layer on top. Older detail is in git history.

- **v0.3.11:** segmented control moved into `components.css`; icon names `filter`, `x`, `calendar`; dashboard time-range filter and icon-style selector.
- **v0.3.10:** cards in `components.css`; status pills use `class="pill" data-variant="…"`; single-series charts use `--chart-3` with flat fills; the solid focus ring documented as a deliberate deviation from shadcn. Dashboard sandbox rebuilt on the v0.3 rules.
- **v0.3.9:** chart series follow the ramp order, up to five steps (`--chart-1…5`); docs site split into one page per topic with Foundations grouping; copy-to-clipboard and mode-aware labels; Display menu lists defaults first.
- **v0.3.8:** Enviolo CSS uses a base class plus attributes (`class="btn" data-variant="secondary" data-size="sm"`). No visual change.
- **v0.3.7:** shadcn tokens `--input`, `--popover`, `--popover-foreground`, `--card-foreground`, `--accent-foreground` added. Basecoat evaluated and not adopted.
- **v0.3.6:** Enviolo CSS (`tokens/components.css`) is the web backbone instead of Basecoat; button hover is one token-driven rule.
- **v0.3.5:** decisions from the open list: Copper as the light-mode focus default, solid status backgrounds (`--{status}-bg`, `--{status}-text`), Nightfall confirmed; hover tokens fix the brown secondary hover seen with Basecoat in dark mode.
- **v0.3.4:** architecture (shadcn/ui, Enviolo CSS, token layer); AI rules up front; per-mode background, accent and focus; navigation patterns; open decisions.
- **v0.3.3:** Enviolo ramp (11 steps, Nightfall added), gradients, chart steps, grid and breakpoints.
- **v0.3.2:** confirmed defaults (Source Sans 3, Tabler, Source Code Pro, Taupe and Mist).
- **v0.3.1:** button hierarchy, tokens and Basecoat/shadcn conventions from the button prototype.

## v0.2

Released 2026-10-08.

Brand and semantic colour tokens, Taupe and Mist neutral ramps, light and dark mode, shadcn and Basecoat routers. v0.1 was earlier Basecoat testing. Read it from the `v0.2` tag.
