# Changelog

What changed in the repo, newest first: the spec, the tokens, the docs site and the sandboxes. Versions are git tags (see the README version log).

The spec-level history for v0.3.1 to v0.3.11 is kept in full in `design.md` section 16, so it travels with `design.md` into other projects. The entries below summarise it and link there for the detail.

Planned work is in [BACKLOG.md](BACKLOG.md).

## Unreleased

Nothing yet.

## v0.3.12 (tag `v0.3.12`, 2026-10-09)

- **Tokens:** the dark-mode focus ring now defaults to **Apricot** (Enviolo 100, 13:1 on Neutral 950), was Coral. Coral and Ivory stay as options in the Display menu. Light mode is unchanged (Copper). Saved Display state with the old Coral default moves to Apricot once.
- **Dashboard sandbox:** one "Dates" field replaces the From and To inputs and the separate calendar button. One click opens the range calendar.
- **Dashboard sandbox:** `<enviolo-calendar>`, a dependency-free range calendar web component (test build), used as the date picker popover. It has a keyboard-navigable grid, pill days, a rounded range band, and hover that follows the button hover rules (primary ends, secondary on the band, accent elsewhere).
- **Dashboard sandbox:** a React test card using react-day-picker for comparison. The filter summary now shows only the day count.
- **Docs:** added `docs/BACKLOG.md` and `docs/CHANGELOG.md`, linked from `CLAUDE.md`.
- **Version:** every header now says v0.3.12. A `v0.3` tag pushed earlier the same day was removed; use `v0.3.12`.

## v0.3.1 to v0.3.11

The design system rebuilt around shadcn/ui for React apps and hand-written Enviolo CSS for the web, with the Enviolo token layer on top. Details in `design.md` section 16.

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

## v0.2 (tag `v0.2`, 2026-10-08)

Brand and semantic colour tokens, Taupe and Mist neutral ramps, light and dark mode, shadcn and Basecoat routers. v0.1 was earlier Basecoat testing. Archived in `versions/v0.2/`.
