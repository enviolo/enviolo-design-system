# Enviolo Design System — [design.md](http://design.md)

The single reference for designing and building Enviolo interfaces across **web, app and AI-assisted development**. Written for people and for AI tools (Claude, Cursor, Claude Code). When generating UI, follow this file before any default habit.

- **Version:** v0.6, November 2026
- **Repository:** [github.com/enviolo/enviolo-design-system](https://github.com/enviolo/enviolo-design-system). Latest tokens, components, docs site and changelog; released versions are git tags.

Values (token definitions, hex, ramps) live in `tokens/tokens.css`, the only token file products copy, and are not repeated here. Visual examples are on the docs site in the repository (see section 12).

---

## Rules (read first)

1. **Pick the backbone by surface.** React app → shadcn/ui components. Website, CMS template or plain HTML → Enviolo CSS (`tokens/components.css`), written as a base class plus attributes: `class="btn" data-variant="secondary"`. Never mix both in one surface. If `components.css` doesn't have a component yet, it isn't part of the system: ask, or add it first (section 1).
2. **Use semantic tokens only** (`--background`, `--primary`, `--muted`, `--border`, `--ring`, `--accent`, status tokens). Never hard-code hex, oklch or Tailwind palette classes such as `bg-stone-100` in components.
3. **Never rename tokens.** Enviolo changes values, not names. Keep shadcn naming so components stay drop-in.
4. **One primary action per view.** Choose the second rank by surface: secondary on plain backgrounds, outline on cards, dialogs and imagery. Repeated actions are ghost.
5. **Pills act, corners hold.** Controls use `--radius-4xl` (pill). Containers use soft corners.
6. **Icons by semantic name**, Tabler by default. Label icon-only buttons.
7. **Brand colour is for brand moments only.** The Enviolo ramp goes into gradients, charts and illustrations, never on buttons, text or borders.
8. **Must work in light and dark**, with no horizontal scroll from 320px.
9. **Sentence case**, and actions named by their outcome ("Place order", not "Submit").
10. When unsure, ask rather than invent a new token.

---

## 1. Architecture and defaults

### 1.1 Layers

Each layer only changes values in the layer below it, never names.

| Layer | What it is | Used for |
|---|---|---|
| **Enviolo tokens** | Values: ramps, modes, status, accent, focus, type, icons | Everything Enviolo-specific |
| **Shared contract** | shadcn token names and the **Luma** style (pill controls, soft containers) | Every surface: CSS, Tailwind, Figma |
| **shadcn/ui** | React components copied into our codebase and owned by us | React apps |
| **Enviolo CSS** | Plain HTML/CSS in `tokens/components.css`, in the shadcn vocabulary, modelled on Basecoat. No third-party library is loaded | Websites, CMS templates, static pages |
| **Figma** | shadcncraft kit; variables named exactly like the CSS tokens | Design, handoff |

- React apps run on **Tailwind v4**; the Tailwind mapping in `tokens.css` is for them. Enviolo CSS is plain CSS with no build step.
- Dark mode in production uses the `.dark` **class** on `<html>` (what shadcn expects).
- **Same vocabulary, different syntax.** Variants (primary, secondary, outline, ghost, link, destructive) and sizes (sm, default, lg, icon sizes) mean the same on every surface. Write specs in these names, then translate. Primary is the default in both: shadcn names it `default`, Enviolo CSS omits `data-variant`.

| Intent | shadcn/ui (React) | Enviolo CSS (HTML) |
|---|---|---|
| Primary, default size | `<Button>` | `<button class="btn">` |
| Outline, small | `<Button variant="outline" size="sm">` | `<button class="btn" data-variant="outline" data-size="sm">` |
| Destructive, large | `<Button variant="destructive" size="lg">` | `<button class="btn" data-variant="destructive" data-size="lg">` |

- **Adding a web component:** port it into `components.css` with tokens only, states as a solid token fill (7.1), checked in light and dark.

### 1.2 Defaults

| Setting | Default |
|---|---|
| Theme | Match system |
| UI font | Source Sans 3 |
| Code font | Source Code Pro |
| Icons | Tabler (outline) |
| Style | Luma |
| Light mode | Background White · Accent Neutral 100 · Focus Copper · Neutrals Dawn |
| Dark mode | Background Neutral 950 · Accent Neutral 800 · Focus Orange · Neutrals Nocturne |

---

## 2. Tokens

### 2.1 Flow

Primitives (brand, neutral and status ramps) feed a per-mode layer (light reads `--light-*`, set to Dawn; dark reads `--dark-*`, set to Nocturne), which feeds the semantic tokens. **Components only ever read semantic tokens.** Per-mode overrides (`--light-bg`, `--dark-accent`, …) are optional variables with fallbacks; removing one restores the default. Definitions and a full Tailwind v4 `@theme` example: `tokens/tokens.css`.

### 2.2 Semantic tokens

Names are the contract.

| Token | Use |
|---|---|
| `--background` / `--foreground` | Page, body text |
| `--card` / `--popover` | Cards and panels; menus, popovers, dialogs |
| `--muted` / `--muted-foreground` | Quiet surfaces and segmented track; secondary text |
| `--border` / `--input` | Borders and dividers; input outlines (shadcn reads `--input`) |
| `--primary` / `--primary-foreground` | Primary button fill and its text |
| `--secondary` / `--secondary-foreground` | Secondary (muted) button fill and its text |
| `--accent` / `--accent-foreground` | Hover and selected fills, and text on them |
| `--card-foreground`, `--popover-foreground` | Text on card and popover surfaces |
| `--ring` | Focus rings, active fields |
| `--destructive`, `--success`, `--warning`, `--info` | Fills, icons and borders for status |
| `--{status}-foreground` | Text and icons on solid status fills |
| `--{status}-bg` / `--{status}-text` | Solid background and text of status pills and alerts |
| `--primary-hover`, `--secondary-hover`, `--destructive-hover` | Button hover fills (destructive hovers from `--destructive-bg` to `--destructive-hover`) |
| `--chart-1…5` | Chart series, in ramp order |
| `--radius-4xl` / `--radius` / `--radius-xl` | Controls (pill); small containers; cards, menus and dialogs |
| `--font` / `--font-mono` | Type |

`--sidebar-*` is part of shadcn's full theme but not defined yet; add it when sidebar components arrive.

---

## 3. Colour

### 3.1 Neutrals

Enviolo's own ramps (OKLCH), 11 steps each, with evenly stepped lightness: **Dawn** (light) and **Nocturne** (dark). Reference `var(--dawn-*)` and `var(--nocturne-*)`, never the values (rule 2).

- Warm days, cool nights: light mode reads warm (Dawn), dark mode reads cool (Nocturne). The split is deliberate.

### 3.2 Enviolo colour ramp

For gradients, chart bars and volumetric effects. It imitates the sky, so the hue shifts from warm at the light end to teal at the dark end on purpose.

| Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Name | Ivory | Orange | Coral | Copper | Clay | Dusk | Twilight | Coffee | Nightfall | Midnight | Pearl Black |

Tokens: `--brand-50…950` and name aliases (`--brand-coral`, …). Hex values: `tokens/tokens.css`.

**Gradient recipes** (numbers are ramp steps)

- **Organic hero** (preferred): `linear-gradient(160deg, 700, 800, 900, 950)` with a Coral radial glow top-right, a soft Ivory light at the corner and a Twilight pool bottom-left. Optional hub ring: conic 50 → 200 → 400 → 600.
- **Sky**: `linear-gradient(180deg, 950, 900, 800, 700, 600, 500, 300, 200, 100, 50)`
- **Sunset glow**: `linear-gradient(120deg, 50, 100, 200)` · **Dusk**: `linear-gradient(120deg, 200, 500, 700)` · **Night**: `linear-gradient(180deg, 800, 900, 950)`
- **Volume** (hubs, spheres, product glow): `radial-gradient(circle at 34% 30%, 50, 100, 200, 300, 400, 600, 700, 800, 900)`

**Rules**

- One gradient per view, for a brand moment.
- Never on buttons, text, borders or UI chrome. Primary buttons stay neutral (ink in light, near-white in dark).
- The cool end (Nightfall, Midnight, Pearl Black) pairs with Nocturne in dark mode.

**Charts.** Series follow the ramp, lightest first, up to five: light 100 / 200 / 400 / 600 / 900, dark 50 / 100 / 200 / 400 / 500. The pale steps have weak contrast and sit close together in dark mode, so label every bar and don't rely on colour alone. A single series uses `--chart-3`, the first step that clears 3:1 in both modes. Bars are flat fills. **Sparklines** in stat cards are the exception: one smooth line stroked `--chart-4` to `--chart-3` over a fade from `--chart-3` to transparent. They are decorative; the value is always in text beside them.

### 3.3 Status colours

Primitives: Tailwind v4.3 `red`, `amber`, `green`, `blue`. Each status token takes a darker step in light mode and a lighter one in dark, so contrast holds on both.

- Meaning only: errors, warnings, success, information. Never decoration. Always pair colour with text or an icon.
- Backgrounds and text are solid ramp steps, not tints, so values match Figma one to one: `--{status}-bg` is step 50 (light) / 950 (dark); `--{status}-text` is 700 / 300. The status token itself is for fills, icons and borders.
- shadcn only ships `--destructive`. `--success`, `--warning` and `--info` are Enviolo additions in the same pattern.

---

## 4. Typography

| Role | Family | Fallback |
|---|---|---|
| Interface and content | **Source Sans 3** | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |
| Code and token names | **Source Code Pro** | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |

| Style | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display / H1 | `clamp(2.2rem, 5vw, 3.4rem)` | 800 | 1.02 | -0.03em |
| H2 | 1.6rem | 700 | 1.15 | -0.02em |
| H3 | 1.15rem | 700 | 1.3 | -0.01em |
| Lede | 1.15rem | 400 | 1.5 | 0 |
| Body | 1rem | 400 | 1.5 | 0 |
| Small / meta | 0.875rem | 400 | 1.5 | 0 |
| Button | 0.95rem (sm 0.85, lg 1) | 600 | 1 | 0.005em |
| Menu / group label | 0.8rem | 600 | — | 0 |

- Sentence case everywhere; no all-caps eyebrows. Body copy ≤ ~62 characters per line.
- Mono only for code, hex values and token names. Table numbers use the sans with tabular figures.
- No colour or italics on single words in headlines; hierarchy comes from size and weight.

---

## 5. Shape, spacing, elevation, motion

**Radius.** Pills act, corners hold (Luma). Never give a container a pill radius, and never give a control a container radius.

| Token | Value | Applies to |
|---|---|---|
| `--radius-4xl` | 2rem (32px; a full pill at our control heights, as in Basecoat's Luma `.btn`) | Buttons, inputs, segmented controls, menu items, chips |
| `--radius` | 10px | Small containers |
| `--radius-xl` | 14px (`--radius` + 4px, shadcn's `rounded-xl`) | Cards, menus, dialogs, frames |
| — | 18px | Hero blocks |

**Spacing.** 4px base; steps 4, 8, 12, 16, 24, 32, 48, 72. Button groups 8–10px gap, sections 72px, card padding 18–22px.

**Elevation.** Borders by default. Menus and popovers `0 12px 32px rgba(0,0,0,.16)`; dialogs `0 12px 32px rgba(0,0,0,.12)`; selected segment `0 1px 2px rgba(0,0,0,.08)`.

**Motion.** 150ms colour transitions; menus enter with a 140ms fade and 4px rise. Respect `prefers-reduced-motion`.

---

## 6. Layout and breakpoints

| Layout | Width | Columns | Gutter | Margin | Behaviour |
|---|---|---|---|---|---|
| Mobile | 320–599px | 4 | 16px | 16px | One column; actions stack full width, primary on top |
| Tablet | 600–879px | 8 | 20px | 24px | Two-column layouts hold; large buttons step down to default |
| Desktop | ≥ 880px | 12 | 24px | 24px | Container caps at 1080px and centres |

Tailwind: `--breakpoint-sm: 37.5rem` (600px), `--breakpoint-md: 55rem` (880px), `--container-content: 67.5rem` (1080px).

- Product page: 5 + 7 columns (desktop), 3 + 5 (tablet), stacked (mobile). Cards: 3 / 2 / 1 across.
- Two-column grids use `minmax(0, …)` tracks and `min-width: 0` children.
- No horizontal page scroll from 320px. Wide content (tables, filters, code) scrolls in its own container.
- Left-align content; centre only short, focused moments. Respect `env(safe-area-inset-*)` for fixed elements.
- Component tweaks may use 560 / 480 / 420px, but layout follows the three breakpoints.

---

## 7. Components

`tokens/components.css` covers **buttons, inputs, search, status pills, cards, the segmented control and the calendar**.

### 7.1 Buttons

| Rank | Variant | shadcn | Enviolo CSS | Use |
|---|---|---|---|---|
| 1 | Primary (solid) | `default` | `btn` | The main job of the view. One per view. |
| 2 | Secondary (muted) **or** outline | `secondary` / `outline` | `data-variant="secondary"` / `"outline"` | Supporting action. Same rank; the surface decides. |
| 3 | Ghost | `ghost` | `data-variant="ghost"` | Repeated, low-stakes, skip or defer, icon actions |
| 4 | Link | `link` | `data-variant="link"` | Inline navigation in text |
| — | Destructive | `destructive` | `data-variant="destructive"` | Irreversible only, next to an outline way out. Muted: red text on a pale red fill (`--destructive-bg`, `--destructive-text`), not a solid red |

**Choosing** (ask in order, stop at the first yes): main job → primary. Supports the job and changes something → secondary or outline. Repeated, optional or a way out → ghost. Navigation inside a sentence → link. Irreversible → destructive.

**Secondary or outline: the surface decides**

- Secondary: plain page background, groups next to primary, filters and toggles, mobile second actions with a consequence ("Reset to default").
- Outline: cards, panels, sheets, dialogs and imagery (inverted); dialog cancel; a toolbar action next to a muted control. Avoid full-width outline buttons in mobile forms, because they read like empty inputs.
- For a second action: it has a consequence → secondary; it skips or defers ("Set up later", "Back") → ghost.

**Hard rules**

1. One primary per view; two primaries means two jobs, so split the view.
2. Never mix secondary and outline in one group.
3. Repeated actions (every row, card, toolbar slot) are ghost.
4. Primary goes last: right-aligned on desktop, top of the stack on mobile.
5. Destructive is never the default focus.

**Sizes** (`data-size`): sm 32px / 14px padding · default 40px / 18px · lg 48px / 22px · icon, icon-sm, icon-lg square at the same heights. Icons 18px (16px in sm). Mobile stacks use lg; tablet may step lg down to default.

**States.** Hover is a solid fill from a token, never an opacity change or a computed mix: primary `--primary-hover`, secondary `--secondary-hover`, outline and ghost `--accent`, destructive `--destructive-hover`, link fades to 70%. Focus-visible is `2px solid var(--ring)` with a 2px offset. Disabled is 45% opacity.

**Focus ring.** A solid ring with an offset, not shadcn's border plus 50% halo. Copper only clears 3:1 on white at full opacity (3.05:1, against about 1.7:1 as a halo), and the gap keeps the ring clear of the button's fill. This is a deliberate deviation; don't "fix" it to match shadcn.

**On dark imagery:** primary white with ink text; outline transparent, white text, `rgba(255,255,255,.45)` border.

**Context examples**

| Surface | Primary | Second rank | Ghost |
|---|---|---|---|
| Website hero on imagery | Find a dealer (inverted) | How the hub works (inverted outline) | — |
| Website product page | Find a dealer | Compare hubs (secondary) | Share (icon) |
| Ordering portal | Place order | Save draft (secondary), Add line (outline in toolbar), filters (segmented) | Row actions |
| Dialog | Delete draft (destructive) | Keep draft (outline) | — |
| Course / support cards | Start course (assigned only) | Preview, Download manual (outline on card) | Save for later |
| App onboarding | Connect hub / Save cadence | Reset to default (secondary) | Set up later, Back |

### 7.2 Inputs and controls

- **Input:** pill, 40px (sm 32px), 1px `--border`, `--background` fill, 18px padding; on focus the ring replaces the border.
- **Search:** leading icon 14px from the left, padding-left 38px.
- **Segmented control:** pill track in `--muted`, 4px inset; the selected segment gets `--background`, foreground text and a 1px shadow (`aria-pressed` or `aria-current`). For view switches and filters, not actions. Segments share width evenly when tight, or the track scrolls.
- **Status pill:** `<span class="pill" data-variant="success">` (also `warning`, `info`, `error`); pill radius (`--radius-4xl`), 0.8rem, weight 600; `--{status}-bg` with `--{status}-text` (3.3).
- **Card:** `class="card"` with optional `card-title` and `card-description`; `--card` fill, 1px `--border`, `--radius-xl` (14px), 22px padding, 16px between parts.

### 7.3 Navigation and menus

- **Dropdown menus:** 272px, 6px padding, `--radius-xl` (14px), menu shadow. Rows are pills: 16px leading slot (checkmark for radio items), label, optional "Default" tag, trailing preview.
- **Direction:** menus anchored bottom-right open **upward**; submenus open **to the side**; on narrow screens submenus overlay the parent with a Back item.
- **Keyboard:** ↑/↓ move, Home/End jump, Esc closes and returns focus, ← opens a side submenu, → returns.
- **Disclosure:** secondary information hides behind a ghost button with a rotating chevron (`aria-expanded`).
- **Cards as links:** overview cards are fully clickable (stretched link), with secondary sub-links layered on top.

### 7.4 Calendar

- `<enviolo-calendar>`**:** a dependency-free range-calendar web component (`tokens/enviolo-calendar.js`), styled in `tokens/components.css`. Attributes: `months` (1 or 2, default 2), `week-start` (0 Sun / 1 Mon, default 1), `locale`, `min` / `max` (ISO dates; days outside are disabled), `today`. Property `range = {from, to}`; fires `change` once both ends are picked.
- **Days are pills.** The two range ends are solid `--primary` pills; the days between sit on an `--accent` band painted on the table cell, with rounded caps where a run starts or ends, so the band reads as one continuous shape across a week.
- **Hover follows the button rules (7.1):** a solid token fill. Range ends hover like primary, band days like secondary, other days like ghost.
- **Today** gets a quiet 1px `--border` ring, not a fill, so it never competes with the range.
- **Keyboard** (WAI-ARIA grid): one day holds a roving tabindex. Arrows move a day or week, Home/End to the week's ends, Page Up/Down a month, Shift+Page Up/Down a year, Esc cancels a half-picked range. The first pick starts a range, the second ends it (an earlier second pick swaps the ends).
- React apps use shadcn's `Calendar` (react-day-picker) instead; both read the same tokens.

---

## 8. Icons

- **Tabler** (outline) by default; Lucide is the supported alternative. Stroke 2, round caps and joins, 24px viewBox, `currentColor`.
- Reference icons by semantic name (`share`, `trash`, `download`, `search`, `plus`, `calendar`, `copy`, `filter`, `x`, `settings`, `sliders`, `more`, `check`, `chevron-*`, `sun`, `moon`, `info`, `menu`, `github`), never by set. Swapping sets is a one-file change.
- Decorative icons get `aria-hidden="true"`; icon-only buttons get `aria-label` (and `title`).
- No arrow glyphs appended to button text.

---

## 9. Accessibility and theming

### 9.1 Accessibility

- Visible focus on every interactive element (`:focus-visible` + `--ring`), at ≥ 3:1 against its background. **Coral fails on white** (2.2:1), so the light-mode default is Copper (3.05:1, a narrow pass).
- Text contrast WCAG AA. Check `--muted-foreground` on card and muted surfaces in both modes.
- Touch targets ≥ 40px (32px allowed for icon buttons in dense tables).
- ARIA: menus `role="menu"` with `menuitem` / `menuitemradio` + `aria-checked`; toggles `aria-pressed`; disclosures `aria-expanded`; current page `aria-current="page"`.
- Respect `prefers-reduced-motion`. Never use colour alone to carry meaning.

### 9.2 Theming and display preferences

- **Theme:** match system by default; users can force light or dark. A quick toggle shows the destination (moon in light mode, sun in dark mode).
- Per-mode background, accent and focus are overridable (`--light-bg`/`--dark-bg`, `--light-accent`/`--dark-accent`, `--light-ring`/`--dark-ring`), each with a default (see 1.2).

---

## 10. Copy

- Sentence case, active voice, plain verbs.
- Buttons say what happens: "Place order", "Save draft", "Download manual", not "Submit" or "OK". An action keeps its name through the flow ("Delete draft" → "Draft deleted").
- Escape hatches say what they defer: "Set up later", "Keep draft".
- Destructive confirmations state the consequence and that it can't be undone. Errors say what went wrong and how to fix it.
- Audiences: riders, dealers, mechanics, OEMs. Product terms (stepless, CVP, Automatic, Utility) come from a shared glossary and stay consistent across languages.

---

## 11. Checklist for any new screen

- [ ] Right backbone for the surface (shadcn/ui in React, Enviolo CSS on the web)
- [ ] Only semantic tokens; no raw colours or palette classes
- [ ] One primary action, placed last on desktop, top on mobile; second rank by surface; repeated actions ghost
- [ ] Pill controls, soft-cornered containers
- [ ] Works in light and dark, with Dawn and Nocturne
- [ ] Icons by semantic name; icon-only buttons labelled
- [ ] No horizontal scroll at 320px; two columns hold on tablet where content allows
- [ ] Focus visible and ≥ 3:1; reduced motion respected; text contrast AA
- [ ] Sentence case; actions named by outcome
- [ ] Brand gradient at most once, never on controls

---

## 12. Reference

- **Token values:** `tokens/tokens.css` · **Web component CSS:** `tokens/components.css`
- **Visual examples:** the docs site, in the repository only (copying this file into another project doesn't bring it along). Serve the repo root with `python3 serve.py` (opens the browser), then open `index.html`; Foundations and Components pages are in `site/`.
