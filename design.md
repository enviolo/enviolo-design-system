# Enviolo Design System — design.md

The single reference for designing and building Enviolo interfaces across **web, app and AI-assisted development**. Written for people and for AI tools (Claude, Cursor, Claude Code). When generating UI, follow this file before any default habit.

The system is introduced **step by step**: apply it where a product is ready, and don't force it onto existing sites in one go.

- **Version:** v0.3.12 (draft), October 2026
- **Visual reference:** the docs site lives in this repo (`index.html`, `site/`), not hosted yet — copying this file into another project doesn't bring it along. See §16.
- **Status:** structure and defaults confirmed; the Enviolo colour ramp is a draft and not yet published

---

## 0. Rules for AI-assisted development (read first)

1. **Pick the backbone by surface.** React app → shadcn/ui components. Website, CMS template or plain HTML → Enviolo CSS (`tokens/components.css`), written as a base class plus attributes: `class="btn" data-variant="secondary"`. Never mix both in one surface. If `components.css` doesn't have a component yet, it isn't part of the system: ask, or add it first (see section 1).
2. **Use semantic tokens only** (`--background`, `--primary`, `--muted`, `--border`, `--ring`, `--accent`, status tokens). Never hard-code hex, oklch or Tailwind palette classes such as `bg-stone-100` in components.
3. **Never rename tokens.** Enviolo changes values, not names. Keep shadcn naming so components stay drop-in.
4. **One primary action per view.** Choose the second rank by surface: secondary on plain backgrounds, outline on cards, dialogs and imagery. Repeated actions are ghost.
5. **Pills act, corners hold.** Controls use `--radius-control` (pill). Containers use soft corners.
6. **Icons by semantic name**, Tabler by default. Label icon-only buttons.
7. **Brand colour is for brand moments only.** The Enviolo ramp goes into gradients, charts and illustrations, never on buttons, text or borders.
8. **Must work in light and dark** with any neutral ramp, with no horizontal scroll from 320px.
9. **Sentence case**, and actions named by their outcome ("Place order", not "Submit").
10. When unsure, check the open decisions (section 15) and ask rather than invent a new token.

---

## 1. Architecture

Three layers — Enviolo tokens, a shared contract of shadcn names and the Luma style, and the two backbones (shadcn/ui, Enviolo CSS) that consume it. Each layer only changes values in the layer below it, never names.

| Layer | What it is | Used for |
|---|---|---|
| **shadcn/ui** | React components copied into our codebase and owned by us | React apps |
| **Enviolo CSS** | Plain HTML/CSS classes in `tokens/components.css`, modelled on Basecoat and built on the same tokens and the Luma look, in the shadcn vocabulary. No third-party library is loaded | Websites, CMS templates, static pages |
| **Shared contract** | shadcn token names and the **Luma** style (pill controls, soft containers) | Every surface, CSS, Tailwind, Figma |
| **Enviolo tokens** | Values: ramps, modes, status, accent, focus, type, icons | Everything Enviolo-specific |
| **Figma** | shadcncraft kit; variables named exactly like the CSS tokens | Design, handoff |

**Implementation notes**
- React apps run on **Tailwind v4**; the Tailwind mapping in `tokens.css` is for them. Enviolo CSS is plain CSS with no build step. Both read the same tokens.
- Dark mode in production: use the **`.dark` class** on `<html>` (what shadcn expects and what `tokens.css` uses). The docs-site sandbox uses `data-theme`; don't copy that.
- **Same vocabulary, different syntax.** Variants (primary, secondary, outline, ghost, link, destructive) and sizes (sm, default, lg, icon sizes) mean the same on every surface. Write specs and tickets in these names, then translate:

| Intent | shadcn/ui (React) | Enviolo CSS (HTML) |
|---|---|---|
| Primary, default size | `<Button>` | `<button class="btn">` |
| Outline, small | `<Button variant="outline" size="sm">` | `<button class="btn" data-variant="outline" data-size="sm">` |
| Destructive, large | `<Button variant="destructive" size="lg">` | `<button class="btn" data-variant="destructive" data-size="lg">` |

  Primary is the default in both: shadcn names it `default`, Enviolo CSS omits `data-variant`. Same split as shadcn's component plus variant prop, and as Basecoat.
- **Adding a web component**: port it into `components.css` with tokens only, states as a solid token fill (see 8.1), checked in light and dark. Maintainer detail (what to port from, what to watch for) lives in `CLAUDE.md`.

---

## 2. Default setup

| Setting | Enviolo default | Alternatives (exploration only) |
|---|---|---|
| Theme | Match system | Light, dark |
| UI font | Source Sans 3 | Urbanist, IBM Plex Sans, system |
| Code font | Source Code Pro | System mono |
| Icons | Tabler (outline) | Lucide (shadcn's default) |
| Style | Luma | — |
| Light mode | Background White · Accent Neutral 100 · Focus Copper · Neutrals Taupe | see section 10 |
| Dark mode | Background Neutral 950 · Accent Neutral 800 · Focus Apricot · Neutrals Mist | see section 10 |

---

## 3. Tokens

### 3.1 Flow

Primitives (neutral, Enviolo and status ramps) feed a per-mode layer — light reads `--l-*` (Taupe), dark reads `--d-*` (Mist) — which feeds the semantic tokens below. **Components only ever read semantic tokens.** Per-mode overrides (`--light-bg`, `--dark-accent`, …) are optional variables with fallbacks; removing one restores the default. Full definitions: `tokens/tokens.css`.

### 3.2 Semantic tokens

Names are the contract — never rename them. Values live in `tokens/tokens.css`.

| Token | Use |
|---|---|
| `--background` | Page |
| `--foreground` | Body text |
| `--card` | Cards, panels |
| `--muted` | Quiet surfaces, segmented track |
| `--muted-foreground` | Secondary text |
| `--border` | Borders, dividers, input outlines |
| `--primary` | Primary button fill |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary (muted) button fill |
| `--secondary-foreground` | Text on secondary |
| `--accent` | Hover and muted/selected fills |
| `--accent-foreground`, `--card-foreground`, `--popover-foreground` | Text on accent, card and popover surfaces |
| `--popover` | Menus, popovers, dialogs |
| `--input` | Input borders (shadcn reads it) |
| `--ring` | Focus rings, active fields |
| `--destructive` | Irreversible actions, errors |
| `--success` | Confirmations |
| `--warning` | Caution |
| `--info` | Notices |
| `--destructive-foreground`, `--success-foreground`, `--warning-foreground`, `--info-foreground` | Text and icons on solid status fills |
| `--primary-hover`, `--secondary-hover`, `--destructive-hover` | Button hover fills |
| `--destructive-bg`, `--success-bg`, `--warning-bg`, `--info-bg` | Solid background of status pills and alerts |
| `--destructive-text`, `--success-text`, `--warning-text`, `--info-text` | Text on those backgrounds |
| `--chart-1…5` | Chart series, in ramp order |
| `--radius-control` | Buttons, inputs, chips (pill) |
| `--radius` | Small containers |
| `--font` / `--font-mono` | Type |

Not yet defined but part of shadcn's full theme; add them when the matching components arrive: `--sidebar-*`.

### 3.3 Example

A full Tailwind v4 `@theme` + `:root`/`.dark` wiring example lives in `tokens/tokens.css` — this file doesn't duplicate it.

---

## 4. Colour

### 4.1 Neutrals

Tailwind v4.3 ramps (oklch), 11 steps each. Never type the values (rule 2) — reference `var(--color-taupe-*)` (light) and `var(--color-mist-*)` (dark); full values in `tokens/tokens.css`.

- Warm days, cool nights: light mode reads warm (Taupe), dark mode reads cool (Mist). The split is deliberate.
- All other Tailwind neutrals (slate, gray, zinc, neutral, stone, mauve, olive) stay available for exploration only.

### 4.2 Enviolo colour ramp *(draft, not yet published)*

For gradients, chart bars and volumetric effects. Light → dark (50 → 950). It imitates the sky, warm at sunset and cold at midnight, so the hue shifts from warm to teal at the dark end on purpose.

| Step | Name | L* |
|---|---|---|
| 50 | Ivory | 93 |
| 100 | Apricot | 84 |
| 200 | Coral | 70 |
| 300 | Copper | 61 |
| 400 | Clay | 52 |
| 500 | Dusk | 43 |
| 600 | Twilight | 33 |
| 700 | Coffee | 22 |
| 800 | Nightfall | 15 |
| 900 | Midnight | 7 |
| 950 | Pearl Black | 3 |

Nightfall is the OKLab midpoint between Coffee and Midnight; it closes the 22 → 7 lightness jump. Tokens: `--enviolo-50…950`, Tailwind `--color-enviolo-*`, with name aliases (`--enviolo-coral`, …). Hex values: `tokens/tokens.css`.

**Gradient recipes** (numbers = ramp steps)
- **Organic hero** (preferred brand moment): dark base `linear-gradient(160deg, 700, 800, 900, 950)` with a Coral radial glow top-right, a soft Ivory light at the corner and a Twilight pool bottom-left. Optional hub ring: conic gradient 50 → 200 → 400 → 600.
- **Sky, sunset to midnight**: `linear-gradient(180deg, 950, 900, 800, 700, 600, 500, 300, 200, 100, 50)`
- **Sunset glow**: `linear-gradient(120deg, 50, 100, 200)`
- **Dusk**: `linear-gradient(120deg, 200, 500, 700)`
- **Night**: `linear-gradient(180deg, 800, 900, 950)`
- **Volume**: `radial-gradient(circle at 34% 30%, 50, 100, 200, 300, 400, 600, 700, 800, 900)` for hubs, spheres and product glow

**Charts**: series follow the ramp order, lightest first, up to five. Light 100 / 200 / 400 / 600 / 900; dark 50 / 100 / 200 / 400 / 500. The pale steps (Ivory, Apricot) have weak contrast against their background and sit close together in dark mode, so label every bar and don't rely on colour alone. A **single series** uses `--chart-3` (Clay in light, Coral in dark), the first step that clears 3:1 in both modes. Bars use flat fills; the one gradient per view is for brand moments. **Sparklines** (the trend lines in stat cards) are a deliberate exception: one smooth line whose stroke runs from `--chart-4` to `--chart-3`, over a fade from `--chart-3` to transparent, so the recent end reads brightest. They stay decorative; the value is always in text beside them.

**Rules**
- One gradient per view, for a brand moment.
- Never on buttons, text, borders or UI chrome. Primary buttons stay neutral (ink in light, near-white in dark).
- The cool end (Nightfall, Midnight, Pearl Black) pairs with Mist in dark mode.

### 4.3 Status colours

Primitives: Tailwind v4.3 `red`, `amber`, `green`, `blue` (50–950). Each status token takes a darker step in light mode and a lighter step in dark mode, so contrast holds on both backgrounds (see the table in 3.2).

- Meaning only: errors, warnings, success, information. Never decoration.
- Background and text: solid ramp steps, so the values match Figma one to one. `--{status}-bg` is step 50 in light and 950 in dark; `--{status}-text` is step 700 in light and 300 in dark. The status token itself (`--success`, …) is for fills, icons and borders.
- Always pair colour with text or an icon.
- shadcn only ships `--destructive`. `--success`, `--warning` and `--info` are Enviolo additions in the same naming pattern.

---

## 5. Typography

| Role | Family | Fallback |
|---|---|---|
| Interface and content | **Source Sans 3** | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |
| Code and token names | **Source Code Pro** | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |

Both come from Adobe's Source family, so proportions match.

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

- Sentence case everywhere; no all-caps eyebrows.
- Body copy ≤ ~62 characters per line.
- Mono only for code, hex values and token names. Numbers in tables use the sans with tabular figures.
- No colour or italics on single words in headlines; hierarchy comes from size and weight.

---

## 6. Shape, spacing, elevation

**Radius.** Pills act, corners hold (from the Luma style).

| Token | Value | Applies to |
|---|---|---|
| `--radius-control` | 999px | Buttons, inputs, segmented controls, menu items, chips |
| `--radius` | 10px | Small containers |
| — | 12–14px | Cards, menus, dialogs, frames |
| — | 18px | Hero blocks |

Never give a container a pill radius, and never give a control a container radius.

**Spacing.** 4px base. Core steps: 4, 8, 12, 16, 24, 32, 48, 72. Button groups: 8–10px gap. Sections: 72px. Card padding 18–22px.

**Elevation.** Borders by default. Menus and popovers: `0 12px 32px rgba(0,0,0,.16)`. Dialogs: `0 12px 32px rgba(0,0,0,.12)`. Selected segment: `0 1px 2px rgba(0,0,0,.08)`.

**Motion.** 150ms colour transitions; menus enter with 140ms fade + 4px rise. Respect `prefers-reduced-motion`.

---

## 7. Layout and breakpoints

| Layout | Width | Columns | Gutter | Margin | Behaviour |
|---|---|---|---|---|---|
| Mobile | 320–599px | 4 | 16px | 16px | One column; actions stack full width, primary on top |
| Tablet | 600–879px | 8 | 20px | 24px | Two-column layouts hold; large buttons step down to default |
| Desktop | ≥ 880px | 12 | 24px | 24px | Container caps at 1080px and centres |

```css
@theme {
  --breakpoint-sm: 37.5rem;      /* 600px  tablet  */
  --breakpoint-md: 55rem;        /* 880px  desktop */
  --container-content: 67.5rem;  /* 1080px */
}
```

- Product page: 5 + 7 (desktop), 3 + 5 (tablet), stacked (mobile). Cards: 3 / 2 / 1 across.
- Two-column grids use `minmax(0, …)` tracks and `min-width: 0` children.
- No horizontal page scroll from 320px. Wide content (tables, filters, code) scrolls in its own container.
- Left-aligned content; centre only short, focused moments.
- Respect `env(safe-area-inset-*)` for fixed elements.
- Component tweaks (menus, small grids) may use 560 / 480 / 420px, but layout follows the three breakpoints.

---

## 8. Components

Shared CSS in `tokens/components.css` currently covers **buttons, inputs, search, status pills, cards and the segmented control**. Menus and navigation below are specified here but built only in the docs site (`site/assets/docs.css`) for now; use them as the reference until they move into `components.css`.

### 8.1 Buttons

| Rank | Variant | shadcn | Enviolo CSS | Use |
|---|---|---|---|---|
| 1 | Primary (solid) | `variant="default"` | `btn` | The main job of the view. One per view. |
| 2 | Secondary (muted) **or** outline | `secondary` / `outline` | `data-variant="secondary"` / `"outline"` | Supporting action. Same rank, pick by surface. |
| 3 | Ghost | `ghost` | `data-variant="ghost"` | Repeated, low-stakes, skip/defer, icon actions |
| 4 | Link | `link` | `data-variant="link"` | Inline navigation in text |
| — | Destructive | `destructive` | `data-variant="destructive"` | Irreversible only, next to an outline way out |

**Choosing a type** (ask in order, stop at the first yes)
1. Is it the main thing people come here to do? → Primary, one per view.
2. Does it support the main job and change something? → Secondary on plain backgrounds, outline on cards, dialogs and imagery.
3. Is it repeated, optional or a way out? → Ghost.
4. Is it navigation inside a sentence? → Link. Irreversible? → Destructive, next to an outline way out.

**Secondary or outline: the surface decides**
- Secondary: plain page background, groups next to primary, filters and toggles, mobile second actions with a consequence ("Reset to default").
- Outline: on cards, panels, sheets, dialogs and imagery (inverted); dialog cancel; a toolbar action next to a muted control.
- Avoid full-width outline buttons in mobile forms, because they read like empty inputs.

**Ghost or secondary for the second action**: has a consequence → secondary; skips or defers ("Set up later", "Back") → ghost.

**Hard rules**
1. One primary per view; two primaries means two jobs, so split the view.
2. Never mix secondary and outline in one group.
3. Repeated actions (every row, card, toolbar slot) are ghost.
4. Primary goes last: right-aligned on desktop, top of the stack on mobile.
5. Destructive is never the default focus.

**Sizes** (`data-size`): sm 32px / 14px padding · default 40px / 18px · lg 48px / 22px · icon, icon-sm, icon-lg square at the same heights. Icons 18px (16px in sm). Mobile stacks use lg; tablet may step lg down to default.

**States**: hover is a solid fill from a token, never an opacity change or a computed mix (primary `--primary-hover`, two ramp steps; secondary `--secondary-hover`, one step; outline and ghost `--accent`; destructive `--destructive-hover`; link fades to 70%) · focus-visible `2px solid var(--ring)`, offset 2px · disabled 45% opacity.

**Focus ring**: a solid 2px ring with a 2px offset, not shadcn's border plus 3px halo at 50% opacity. Copper only clears 3:1 on white at full opacity (3.05:1, against about 1.7:1 as a 50% halo), and the gap keeps the ring clear of the button's own fill and border. Treat it as a deliberate deviation; don't "fix" it to match shadcn.

**On dark imagery**: primary white with ink text; outline transparent, white text, `rgba(255,255,255,.45)` border.

**Migration from the legacy system**: solid → primary; outline → outline on cards and imagery, secondary in plain-page groups; ghost → ghost. Audit pages for extra primaries.

### 8.2 Inputs and controls

- **Input**: pill, 40px (sm 32px), 1px `--border`, `--background` fill, 18px padding; on focus the ring replaces the border.
- **Search**: leading icon 14px from the left, padding-left 38px.
- **Segmented control**: pill track in `--muted`, 4px inset; the selected segment gets `--background`, foreground text and a 1px shadow (`aria-pressed` or `aria-current`). For view switches and filters, not actions. Segments share width evenly when tight, or the track scrolls.
- **Status pill**: `<span class="pill" data-variant="success">` (also `warning`, `info`, `error`); 999px, 0.8rem, weight 600; solid `--{status}-bg` background with `--{status}-text` (see 4.3).
- **Card**: `class="card"` with optional `card-title` and `card-description`; `--card` fill, 1px `--border`, 14px radius, 22px padding, 16px between parts. A card is a container, so it never gets a pill radius.

### 8.3 Navigation and menus

- **Dropdown menus**: 272px, 6px padding, 14px radius, menu shadow. Rows are pills: 16px leading slot (checkmark for radio items), label, optional "Default" tag, trailing preview.
- **Direction**: menus anchored bottom-right open **upward**; submenus open **to the side**; on narrow screens submenus overlay the parent with a Back item.
- **Keyboard**: ↑/↓ move, Home/End jump, Esc closes and returns focus, ← opens a side submenu, → returns.
- **Disclosure**: secondary information hides behind a ghost button with a rotating chevron (`aria-expanded`).
- **Cards as links**: overview cards are fully clickable (stretched link), with secondary sub-links layered on top.

The docs site's own top nav (topic dropdowns, sub-nav) is a site-specific pattern built in `site/assets/docs.css`, not yet promoted here — reuse it only if a product needs the same topic-dropdown shape.

---

## 9. Icons

- **Tabler** (outline) by default; Lucide is the supported alternative.
- Stroke 2, round caps and joins, 24px viewBox, `currentColor`.
- Reference icons by semantic name (`share`, `trash`, `download`, `search`, `plus`, `calendar`, `copy`, `filter`, `x`, `settings`, `sliders`, `more`, `check`, `chevron-*`, `sun`, `moon`), never by set. Swapping sets is a one-file change.
- Decorative icons get `aria-hidden="true"`; icon-only buttons get `aria-label` (and `title`).
- No arrow glyphs appended to button text.

---

## 10. Theming and display preferences

- **Theme**: match system by default; users can force light or dark. A quick toggle shows the destination (moon in light mode, sun in dark mode).
- Per-mode background, accent and focus are overridable (`--light-bg`/`--dark-bg`, `--light-accent`/`--dark-accent`, `--light-ring`/`--dark-ring`), each with a documented default (see §11 for focus contrast). Defaults and allowed options live in `site/assets/display.js`; the "one Display menu with Mode settings" UI that exposes them is a docs-site/sandbox pattern, not yet a product component.

---

## 11. Accessibility

- Visible focus on every interactive element (`:focus-visible` + `--ring`). Focus indicators need ≥ 3:1 against their background; **Coral fails on white** (2.3:1), so the light-mode default is Copper (3.05:1, a narrow pass).
- Text contrast WCAG AA. Check `--muted-foreground` on card and muted surfaces for every neutral ramp and both modes.
- Touch targets ≥ 40px (32px allowed for icon buttons in dense tables).
- Respect `prefers-reduced-motion`.
- ARIA: menus `role="menu"` with `menuitem` / `menuitemradio` + `aria-checked`; toggles `aria-pressed`; disclosures `aria-expanded`; current page `aria-current="page"`.
- Never use colour alone to carry meaning.

---

## 12. Copy

- Sentence case, active voice, plain verbs.
- Buttons say what happens: "Place order", "Save draft", "Download manual", not "Submit" or "OK".
- An action keeps its name through the flow ("Delete draft" → "Draft deleted").
- Escape hatches say what they defer: "Set up later", "Keep draft".
- Destructive confirmations state the consequence and that it can't be undone.
- Errors say what went wrong and how to fix it.
- Audiences: riders, dealers, mechanics, OEMs. Product terms (stepless, CVP, Automatic, Utility) come from a shared glossary and stay consistent across languages.

---

## 13. Context examples

| Surface | Primary | Second rank | Ghost |
|---|---|---|---|
| Website hero on imagery | Find a dealer (inverted) | How the hub works (inverted outline) | — |
| Website product page | Find a dealer | Compare hubs (secondary) | Share (icon) |
| Ordering portal | Place order | Save draft (secondary), Add line (outline in toolbar), filters (segmented) | Row actions |
| Dialog | Delete draft (destructive) | Keep draft (outline) | — |
| Course / support cards | Start course (assigned only) | Preview, Download manual (outline on card) | Save for later |
| App onboarding | Connect hub / Save cadence | Reset to default (secondary) | Set up later, Back |

---

## 14. Checklist for any new screen

- [ ] Right backbone for the surface (shadcn/ui in React, Enviolo CSS on the web)
- [ ] Only semantic tokens; no raw colours or palette classes
- [ ] One primary action, placed last on desktop, top on mobile
- [ ] Second rank chosen by surface; repeated actions are ghost
- [ ] Pill controls, soft-cornered containers
- [ ] Works in light and dark, with Taupe/Mist and any other neutral ramp
- [ ] Icons by semantic name; icon-only buttons labelled
- [ ] No horizontal scroll at 320px; two columns hold on tablet where content allows
- [ ] Focus visible and ≥ 3:1; reduced motion respected; text contrast AA
- [ ] Sentence case; actions named by outcome
- [ ] Brand gradient at most once, never on controls

---

## 15. Open decisions

| Topic | Question | Current state |
|---|---|---|
| Enviolo ramp | Publish to the Enviolo brand guidelines | Planned, still draft |
| Rollout | Which product adopts the system first | Not decided; step by step, per product readiness |

**Decided — don't reverse**
- Light-mode focus is **Copper** (3.05:1 on white, a narrow pass). Coral stays an option in the mode settings.
- Dark-mode focus is **Apricot** (13:1 on Neutral 950). Coral stays an option in the mode settings.
- Status backgrounds use **solid ramp steps**, not transparent tints.
- **Nightfall** is the final name for Enviolo 800.
- Websites use **Enviolo CSS** (`tokens/components.css`), not the Basecoat library. Basecoat stays a reference for new components (it sets variants with `data-variant` and `data-size`).

---

## 16. Reference index

Values and history don't live in this file, to avoid drift. Find them here:

- **Token values**: `tokens/tokens.css` (all token definitions, including the Tailwind v4 `@theme` example)
- **Web component CSS**: `tokens/components.css`
- **Visual examples**: the docs site, this repo only — open `index.html` at the repo root for the Overview, `site/foundations/` and `site/components/` for the rest (serve the repo root, e.g. `python3 -m http.server 8765`)
- **History**: `docs/CHANGELOG.md`
- **Planned work**: `docs/BACKLOG.md`
