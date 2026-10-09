# Backlog

Work still to do on the design system. Rules and decisions live in `design.md` (open decisions: section 15); this file only tracks the work. Tick an item when it ships on `dev`, and add it to [CHANGELOG.md](CHANGELOG.md) under the version that carries it.

## Decide first

- [x] **Version label.** Settled: the release is tagged `v0.3.12` and every header says v0.3.12. If Rhea replaces Luma, the next release is v0.4.
- [ ] **Enviolo ramp.** Publish it to the brand guidelines (design.md section 15: planned, still draft).
- [ ] **Rollout.** Which product adopts the system first (section 15: not decided).
- [ ] **Style: try Rhea against Luma.** Luma is the current style in the shared contract (pill controls, soft containers; design.md sections 1, 2 and 6). Try Rhea on the dashboard sandbox in light and dark, then decide whether it replaces Luma. It would touch the radius rule, the component CSS and the docs copy that names Luma. If it succeeds, that is the v0.4 release.
- [ ] **Calendar.** `<enviolo-calendar>` is a test build in the dashboard sandbox. Promote it into the web component set (`tokens/components.css` plus a script), or keep it sandbox-only and use react-day-picker in React apps.

## Next

- [ ] **Calendar and date-range field in the spec.** Neither has a design.md section or a docs page yet. Cover the pill days, the rounded range band, the button-style hover and the keyboard model.
- [ ] **Move shared pieces out of the sandbox.** The popover (`.popover`) and the range field (`.range-field`, a button styled as an input) live in `sandboxes/html-dashboard/dashboard.css`. If another page needs them, they belong in `tokens/components.css`, per the rule in CLAUDE.md.
- [ ] **React calendar test card.** Keep it as the shadcn comparison or remove it. It loads React and react-day-picker from esm.sh, so the dashboard needs internet for that card.
- [ ] **Components missing from `components.css`.** Check which of select, tooltip, dialog, tabs and table the web side needs before the first product adopts the system.

## Known issues

- [ ] **Stat card pill wraps.** In the dashboard, a long caption such as "faster vs previous 14 days" wraps and squeezes the status pill into a taller shape (seen on Avg charge cycle at about 1100px wide). Keep the pill on one line.
- [ ] **Display state migration.** `ringApricot` in `docs/assets/display.js` moves saved Coral to Apricot once. Remove it after a release or two, when nobody has the old state left.

## Not yet verified

- [ ] Safari and Firefox (date logic and the calendar were only run in Chrome, plus TZ tests for DST).
- [ ] Real phones: the narrow layout was checked at a small window width only.
- [ ] Screen readers on the calendar grid and the popover dialog.
- [ ] The Cursor in-IDE browser, which doesn't follow `file://` links (use localhost there).
