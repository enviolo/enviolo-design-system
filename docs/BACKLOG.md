# Backlog

Work still to do on the design system. Rules and decisions live in `design.md` (open decisions: section 12); this file only tracks the work. Tick an item when it ships on `dev`, and add it to [CHANGELOG.md](CHANGELOG.md) under the version that carries it.

## Decide first

- [x] **Version label.** Settled: the release is tagged `v0.3.12` and every header says v0.3.12. If Rhea replaces Luma, the next release is v0.4.
- [ ] **Enviolo ramp.** Publish it to the brand guidelines (design.md section 12: planned, still draft).
- [ ] **Rollout.** Which product adopts the system first (section 12: not decided).
- [x] **Style: try Rhea against Luma.** Decided: stays Luma. See design.md section 12.
- [x] **Calendar.** Promoted: `<enviolo-calendar>` is now in the web component set (`tokens/components.css` plus `tokens/enviolo-calendar.js`), specified in design.md 7.4, with a docs page at `site/components/calendar.html`. React apps still use react-day-picker.

## Next

- [x] **Light-mode colour exercise.** Done: "Dawn" (Taupe's lightness, warm Enviolo tint) is the default light ramp, alongside Nocturne for dark.
- [ ] **Radius audit.** `docs.css` still has about nine hard-coded `12px` radii (code blocks, table frames, demo frames) that aren't a system value: the radius tiers are `--radius` (10px) and `--radius-xl` (14px). Move each to the right tier. Also check the calendar's 20px band caps and any other one-off radii in `components.css`.
- [ ] **Remove the Tailwind neutral ramps.** Dawn and Nocturne are the defaults now. Still to do: decide whether Taupe, Mist and the other Tailwind neutrals (slate, gray, zinc, neutral, stone, mauve, olive) stay in the Display menu as exploration options or go, and if they go, remove their primitives from `tokens.css` and `docs-base.css`. The status colours (red, amber, green, blue) are also Tailwind primitives; decide separately whether they stay.
- [ ] **Double-check the promoted calendar.** `<enviolo-calendar>` (design.md 7.4, `tokens/components.css` + `tokens/enviolo-calendar.js`) was only verified in headless Chrome screenshots so far. Confirm for real before calling the promotion done: Safari/Firefox, a real phone, a screen reader on the grid, and the Cursor in-IDE browser (see "Not yet verified" below).
- [ ] **Date-range field in the spec.** The calendar has a design.md section now (7.4); the field that opens it (`.range-field`, a button styled as an input, in `sandboxes/html-dashboard/dashboard.css`) still doesn't.
- [ ] **Move shared pieces out of the sandbox.** The popover (`.popover`) and the range field (`.range-field`, a button styled as an input) live in `sandboxes/html-dashboard/dashboard.css`. If another page needs them, they belong in `tokens/components.css`, per the rule in CLAUDE.md.
- [ ] **React calendar test card.** Keep it as the shadcn comparison or remove it. It loads React and react-day-picker from esm.sh, so the dashboard needs internet for that card.
- [ ] **Components missing from `components.css`.** Check which of select, tooltip, dialog, tabs and table the web side needs before the first product adopts the system.
- [ ] **Lint design.md rule 0.** `design.md` research (`docs/research/design-md-best-practices.md`) flags that several AI rules are checkable: no hex/oklch/palette classes in components, one `btn` without `data-variant` per view, `aria-label` on icon-only buttons. Turn these into a stylelint rule, a grep pre-commit hook, or a Claude Code hook, so violations don't rely on prose alone.
- [ ] **Confirm docs-site-only vs product patterns.** `design.md` 7.3 and 9.2 were trimmed (Nov 2026) to keep only general menu/theming rules; the docs site's top nav, topic dropdown, cards-as-links and the Display menu UI stayed site/sandbox-only (`site/assets/docs.js`, `display.js`). Decide if any of these should become real components in `components.css` before the first product needs them.

## Org-wide skill: `/enviolo-design`

Goal: everyone in the org gets the design system in the Claude app and in Notion AI through one `/enviolo-design` skill. Do the steps in this order; each one needs the one before it.

- [ ] **1. Publish the docs site on GitHub Pages.** Prerequisite: people and their AI have to be able to browse it. The site is static with no build step, so `main` at the repo root should work (Pages serves `/` or `/docs`, and `index.html` sits at the root). Check that the relative links hold under the `/enviolo-design-system/` subpath. Open question: can the site be limited to the org (private Pages needs GitHub Enterprise Cloud), or does it have to be public?
- [ ] **2. Add an `llms.txt` index.** A plain-text directory of every page (Overview, Foundations, Components, `design.md`, the token files), with one link and one line of description each, grouped by section. Model it on the [CMS design system's index](https://design.cms.gov/using-ai/llms-txt/llms.txt). It is hand-written, since there is no build, so add "update `llms.txt`" to the new-page steps in CLAUDE.md.
- [ ] **3. Write the skill (`SKILL.md`).** It works as a directory to the pages above and does not restate any rules, because copies drift. On first use in a project it:
  - downloads `design.md` from the repo into the project's `/RULES` folder, or asks the user where to put it if there isn't one;
  - sets up the tokens (`tokens/tokens.css`) at a root `/tokens` folder, or in a better place if the project already has a token store.

  Those two files are the sources of truth the skill and the user's AI work from.
- [ ] **4. Decide how it stays current.** Download from a release tag (for example `v0.3.12`), not from `dev`, so projects only get released versions. Decide how the skill spots a newer release (compare the version in the `design.md` header) and offers an update.
- [ ] **5. Publish to the org.** Check how each app shares skills with an organisation (Claude app, Notion AI) and whether one `SKILL.md` works in both. There is already an org skill, `enviolo-voice`, to follow for packaging and sharing. The Notion connector also has skill upload and download tools.

Open questions: whether `tokens/components.css` should be downloaded too for plain-HTML projects (design.md uses it for websites, and shadcn/ui for React apps); and where tokens go when a project has no obvious store.

## Known issues

- [ ] **Stat card pill wraps.** In the dashboard, a long caption such as "faster vs previous 14 days" wraps and squeezes the status pill into a taller shape (seen on Avg charge cycle at about 1100px wide). Keep the pill on one line.
- [ ] **Display state migration.** `ringApricot` in `site/assets/display.js` moves saved Coral to Apricot once. Remove it after a release or two, when nobody has the old state left.

## Not yet verified

- [ ] Safari and Firefox (date logic and the calendar were only run in Chrome, plus TZ tests for DST).
- [ ] Real phones: the narrow layout was checked at a small window width only.
- [ ] Screen readers on the calendar grid and the popover dialog.
- [ ] The Cursor in-IDE browser, which doesn't follow `file://` links (use localhost there).
