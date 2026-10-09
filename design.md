# Enviolo Design System — design.md

The single reference for designing and building Enviolo interfaces across **web, app and AI-assisted development**. Written for people and for AI tools (Claude, Cursor, Claude Code). When generating UI, follow this file before any default habit.

The system is introduced **step by step**: apply it where a product is ready, and don't force it onto existing sites in one go.

- **Version:** v0.3.10 (draft), October 2026
- **Live reference:** the docs site: open `index.html` at the repo root (Overview, Foundations, Components; pages in `docs/`)
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

Three layers. Each layer only changes values in the layer below it, never names.

```
┌─────────────────────────────────────────────────────────┐
│ 3. Enviolo tokens (brand layer)                         │
│    Enviolo ramp · Taupe/Mist neutrals · status ·         │
│    accent & focus · Source Sans 3 · Tabler               │
├─────────────────────────────────────────────────────────┤
│ 2. Shared contract                                      │
│    shadcn token names + Luma style                       │
│    --background --primary --muted --border --ring …      │
├────────────────────────────┬────────────────────────────┤
│ 1a. shadcn/ui              │ 1b. Enviolo CSS            │
│     React apps             │     Web (HTML, CMS)        │
│     <Button variant=…>     │     class="btn" data-…     │
└────────────────────────────┴────────────────────────────┘
        Figma: shadcncraft kit, same variable names
```

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
- **Adding a web component.** Basecoat is a reference, not a dependency. Start from its markup and CSS, then port it into `components.css` with tokens only, in the shadcn vocabulary, and check it in light and dark with any neutral ramp. States follow one rule: a solid fill from a token (see 8.1), never an opacity change or a computed colour mix. Watch for colour mixes in polar spaces (oklch, lch, hsl): Basecoat's secondary hover mixes in OKLCH and turns brown in dark mode, so don't copy that recipe.

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
| Dark mode | Background Neutral 950 · Accent Neutral 800 · Focus Coral · Neutrals Mist | see section 10 |

---

## 3. Tokens

### 3.1 Flow

```
primitives                     mode layer                    semantic                    components
--l-50…950 (Taupe)   ─┐
                      ├─►  --n-50…950  ─────────────►  --background, --primary,  ─►  shadcn / Enviolo CSS
--d-50…950 (Mist)    ─┘   (light → --l, dark → --d)    --muted, --border, …
--enviolo-50…950 ──────────────────────────────────►  --ring, --chart-*, gradients
--red/amber/green/blue-50…950 ─────────────────────►  --destructive, --success, --warning, --info
per-mode overrides (--light-bg, --dark-accent, …) ──►  --background, --accent, --ring
```

- Components only ever read **semantic** tokens.
- Light and dark mode can use **different** neutral ramps (Taupe light, Mist dark).
- Per-mode overrides are optional variables with fallbacks. Removing one restores the default.

### 3.2 Semantic tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `var(--light-bg, #FFFFFF)` | `var(--dark-bg, n-950)` | Page |
| `--foreground` | n-950 | n-50 | Body text |
| `--card` | n-50 | n-900 | Cards, panels |
| `--muted` | n-100 | n-900 | Quiet surfaces, segmented track |
| `--muted-foreground` | n-500 | n-400 | Secondary text |
| `--border` | n-200 | n-800 | Borders, dividers, input outlines |
| `--primary` | n-900 | n-50 | Primary button fill |
| `--primary-foreground` | n-50 | n-900 | Text on primary |
| `--secondary` | n-100 | n-800 | Secondary (muted) button fill |
| `--secondary-foreground` | n-900 | n-50 | Text on secondary |
| `--accent` | `var(--light-accent, n-100)` | `var(--dark-accent, n-800)` | Hover and muted/selected fills |
| `--accent-foreground`, `--card-foreground`, `--popover-foreground` | foreground | foreground | Text on accent, card and popover surfaces |
| `--popover` | background | n-900 | Menus, popovers, dialogs |
| `--input` | n-200 | n-800 | Input borders (shadcn reads it) |
| `--ring` | `var(--light-ring, Enviolo 300)` | `var(--dark-ring, Enviolo 200)` | Focus rings, active fields |
| `--destructive` | red-600 | red-500 | Irreversible actions, errors |
| `--success` | green-600 | green-400 | Confirmations |
| `--warning` | amber-500 | amber-400 | Caution (text on it: amber-950) |
| `--info` | blue-600 | blue-400 | Notices |
| `--destructive-foreground`, `--success-foreground`, `--warning-foreground`, `--info-foreground` | white, white, amber-950, white | white, green-950, amber-950, blue-950 | Text and icons on solid status fills |
| `--primary-hover`, `--secondary-hover`, `--destructive-hover` | n-700, n-200, red-700 | n-200, n-700, red-600 | Button hover fills |
| `--destructive-bg`, `--success-bg`, `--warning-bg`, `--info-bg` | status 50 | status 950 | Solid background of status pills and alerts |
| `--destructive-text`, `--success-text`, `--warning-text`, `--info-text` | status 700 | status 300 | Text on those backgrounds |
| `--chart-1…5` | Enviolo 100, 200, 400, 600, 900 | Enviolo 50, 100, 200, 400, 500 | Chart series, in ramp order |
| `--radius-control` | 999px | 999px | Buttons, inputs, chips |
| `--radius` | 10px | 10px | Small containers |
| `--font` / `--font-mono` | Source Sans 3 / Source Code Pro | same | Type |

Not yet defined but part of shadcn's full theme; add them when the matching components arrive: `--sidebar-*`.

### 3.3 Example (Tailwind v4)

```css
@import "tailwindcss";

@theme {
  --color-enviolo-50: #FAEAC0;  --color-enviolo-100: #F5CAA8; --color-enviolo-200: #E79782;
  --color-enviolo-300: #C88273; --color-enviolo-400: #A96D64; --color-enviolo-500: #865A56;
  --color-enviolo-600: #614749; --color-enviolo-700: #393339; --color-enviolo-800: #20262B;
  --color-enviolo-900: #05191E; --color-enviolo-950: #020D12;
}

:root {
  --background: var(--light-bg, #ffffff);
  --foreground: var(--color-taupe-950);
  --primary: var(--color-taupe-900);
  --primary-foreground: var(--color-taupe-50);
  --secondary: var(--color-taupe-100);
  --muted: var(--color-taupe-100);
  --muted-foreground: var(--color-taupe-500);
  --accent: var(--light-accent, var(--color-taupe-100));
  --border: var(--color-taupe-200);
  --ring: var(--light-ring, var(--color-enviolo-300));
  --destructive: var(--color-red-600);
  --radius: 0.625rem;
  --radius-control: 999px;
}

.dark {
  --background: var(--dark-bg, var(--color-mist-950));
  --foreground: var(--color-mist-50);
  --primary: var(--color-mist-50);
  --primary-foreground: var(--color-mist-900);
  --secondary: var(--color-mist-800);
  --muted: var(--color-mist-900);
  --muted-foreground: var(--color-mist-400);
  --accent: var(--dark-accent, var(--color-mist-800));
  --border: var(--color-mist-800);
  --ring: var(--dark-ring, var(--color-enviolo-200));
  --destructive: var(--color-red-500);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-border: var(--border);
  --color-ring: var(--ring);
}
```

Illustrative only; it shows the pattern, not a complete file.

---

## 4. Colour

### 4.1 Neutrals

Tailwind v4.3 ramps (oklch). In Tailwind projects reference `var(--color-taupe-*)` and `var(--color-mist-*)` instead of copying values.

| Step | Light mode: **Taupe** | Dark mode: **Mist** |
|---|---|---|
| 50 | `oklch(98.6% 0.002 67.8)` | `oklch(98.7% 0.002 197.1)` |
| 100 | `oklch(96% 0.002 17.2)` | `oklch(96.3% 0.002 197.1)` |
| 200 | `oklch(92.2% 0.005 34.3)` | `oklch(92.5% 0.005 214.3)` |
| 300 | `oklch(86.8% 0.007 39.5)` | `oklch(87.2% 0.007 219.6)` |
| 400 | `oklch(71.4% 0.014 41.2)` | `oklch(72.3% 0.014 214.4)` |
| 500 | `oklch(54.7% 0.021 43.1)` | `oklch(56% 0.021 213.5)` |
| 600 | `oklch(43.8% 0.017 39.3)` | `oklch(45% 0.017 213.2)` |
| 700 | `oklch(36.7% 0.016 35.7)` | `oklch(37.8% 0.015 216)` |
| 800 | `oklch(26.8% 0.011 36.5)` | `oklch(27.5% 0.011 216.9)` |
| 900 | `oklch(21.4% 0.009 43.1)` | `oklch(21.8% 0.008 223.9)` |
| 950 | `oklch(14.7% 0.004 49.3)` | `oklch(14.8% 0.004 228.8)` |

- Warm days, cool nights: light mode reads warm (Taupe), dark mode reads cool (Mist). The split is deliberate.
- All other Tailwind neutrals (slate, gray, zinc, neutral, stone, mauve, olive) stay available for exploration only.

### 4.2 Enviolo colour ramp *(draft, not yet published)*

For gradients, chart bars and volumetric effects. Light → dark (50 → 950). It imitates the sky, warm at sunset and cold at midnight, so the hue shifts from warm to teal at the dark end on purpose.

| Step | Name | Hex | L* |
|---|---|---|---|
| 50 | Ivory | `#FAEAC0` | 93 |
| 100 | Apricot | `#F5CAA8` | 84 |
| 200 | Coral | `#E79782` | 70 |
| 300 | Copper | `#C88273` | 61 |
| 400 | Clay | `#A96D64` | 52 |
| 500 | Dusk | `#865A56` | 43 |
| 600 | Twilight | `#614749` | 33 |
| 700 | Coffee | `#393339` | 22 |
| 800 | Nightfall | `#20262B` | 15 |
| 900 | Midnight | `#05191E` | 7 |
| 950 | Pearl Black | `#020D12` | 3 |

Nightfall is the OKLab midpoint between Coffee and Midnight; it closes the 22 → 7 lightness jump. Tokens: `--enviolo-50…950`, Tailwind `--color-enviolo-*`, with name aliases (`--enviolo-coral`, …).

**Gradient recipes** (numbers = ramp steps)
- **Organic hero** (preferred brand moment): dark base `linear-gradient(160deg, 700, 800, 900, 950)` with a Coral radial glow top-right, a soft Ivory light at the corner and a Twilight pool bottom-left. Optional hub ring: conic gradient 50 → 200 → 400 → 600.
- **Sky, sunset to midnight**: `linear-gradient(180deg, 950, 900, 800, 700, 600, 500, 300, 200, 100, 50)`
- **Sunset glow**: `linear-gradient(120deg, 50, 100, 200)`
- **Dusk**: `linear-gradient(120deg, 200, 500, 700)`
- **Night**: `linear-gradient(180deg, 800, 900, 950)`
- **Volume**: `radial-gradient(circle at 34% 30%, 50, 100, 200, 300, 400, 600, 700, 800, 900)` for hubs, spheres and product glow

**Charts**: series follow the ramp order, lightest first, up to five. Light 100 / 200 / 400 / 600 / 900; dark 50 / 100 / 200 / 400 / 500. The pale steps (Ivory, Apricot) have weak contrast against their background and sit close together in dark mode, so label every bar and don't rely on colour alone. A **single series** uses `--chart-3` (Clay in light, Coral in dark), the first step that clears 3:1 in both modes. Charts use flat fills; the one gradient per view is for brand moments.

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

Shared CSS in `tokens/components.css` currently covers **buttons, inputs, search, status pills and cards**. The segmented control, menus and navigation below are specified here but built only in the docs site (`docs/assets/docs.css`) for now; use them as the reference until they move into `components.css`.

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

- **Top navigation**: logo + product name left, topics right. A topic link goes to its **first subtopic**; hovering (or ↓ on the keyboard) opens a **dropdown** listing every subtopic with a one-line description. Current page is highlighted there and its topic marked in the bar.
- **Topic page header**: topic name, then a segmented **sub-nav** of subtopics, then the page title. Non-navigational notes ("More components soon") sit outside the pill as plain text.
- **Cards as links**: overview cards are fully clickable (stretched link), with secondary sub-links layered on top.
- **Dropdown menus**: 272px, 6px padding, 14px radius, menu shadow. Rows are pills: 16px leading slot (checkmark for radio items), label, optional "Default" tag, trailing preview.
- **Direction**: menus anchored bottom-right open **upward**; submenus open **to the side**; on narrow screens submenus overlay the parent with a Back item.
- **Keyboard**: ↑/↓ move, Home/End jump, Esc closes and returns focus, ← opens a side submenu, → returns.
- **Disclosure**: secondary information hides behind a ghost button with a rotating chevron (`aria-expanded`).

---

## 9. Icons

- **Tabler** (outline) by default; Lucide is the supported alternative.
- Stroke 2, round caps and joins, 24px viewBox, `currentColor`.
- Reference icons by semantic name (`share`, `trash`, `download`, `search`, `plus`, `copy`, `settings`, `sliders`, `more`, `check`, `chevron-*`, `sun`, `moon`), never by set. Swapping sets is a one-file change.
- Decorative icons get `aria-hidden="true"`; icon-only buttons get `aria-label` (and `title`).
- No arrow glyphs appended to button text.

---

## 10. Theming and display preferences

- **Theme**: match system by default; users can force light or dark. A quick toggle shows the destination (moon in light mode, sun in dark mode).
- **Display menu** (one place for all preferences, saved locally): theme, font, icons, code font, **Mode settings**. Default options carry a "Default" tag and are listed first in every group.
- **Mode settings**: one submenu per mode, four groups each.

| Group | Token | Light mode options | Dark mode options |
|---|---|---|---|
| Background | `--light-bg` / `--dark-bg` | **White**, Neutral 50, Ivory tint | **Neutral 950**, Pearl Black, Midnight |
| Accent (hover and muted) | `--light-accent` / `--dark-accent` | **Neutral 100**, Ivory, Coral tint | **Neutral 800**, Nightfall, Coral tint |
| Focus (active fields) | `--light-ring` / `--dark-ring` | **Copper** 3.05:1, Coral 2.3:1, Clay 4.15:1 | **Coral** 8.6:1, Ivory 16:1, Apricot 13:1 |
| Neutrals | `--l-*` / `--d-*` | **Taupe** + all Tailwind neutrals | **Mist** + all Tailwind neutrals |

Bold = default. Contrast ratios are against the default background.

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

**Decided (v0.3.5)**
- Light-mode focus is **Copper** (3.05:1 on white, a narrow pass). Coral stays an option in the mode settings.
- Dark-mode focus stays **Coral** (8.6:1).
- Status backgrounds use **solid ramp steps** (50 / 700 light, 950 / 300 dark), not transparent tints.
- **Nightfall** is the final name for Enviolo 800.
- Websites use **Enviolo CSS** (`tokens/components.css`), not the Basecoat library. Basecoat stays a reference for new components (it sets variants with `data-variant` and `data-size`).

---

## 16. Changelog

- **v0.3.10**: cards (`card`, `card-title`, `card-description`) added to `components.css`; status pills follow the base-plus-attribute convention (`class="pill" data-variant="success|warning|info|error"`, was `pill ok`); single-series charts use `--chart-3` and flat fills. The solid focus ring is documented as a deliberate deviation from shadcn's halo. Found by rebuilding the `html-dashboard` sandbox on the v0.3 rules (`sandboxes/html-dashboard/`, shared `tokens/` files, no Basecoat).
- **v0.3.9**: chart series follow the ramp order and take up to five steps (`--chart-1…5`: light 100, 200, 400, 600, 900; dark 50, 100, 200, 400, 500), so Apricot is included. Docs site: one page per topic with shared `assets/`; Colour, Typography and Layout grouped under Foundations (the usual industry term); every value on Foundations can be copied; neutral steps and the status background and text colours are labelled for the current mode; the Display menu lists defaults first.
- **v0.3.8**: Enviolo CSS now uses a base class plus attributes (`class="btn" data-variant="secondary" data-size="sm"`) instead of `btn-secondary btn-sm`, matching shadcn's component and variant split and Basecoat's convention. No visual change.
- **v0.3.7**: added the shadcn tokens `--input`, `--popover`, `--popover-foreground`, `--card-foreground` and `--accent-foreground`, which shadcn/ui components read and v0.3 was missing. Hand-written Enviolo CSS stays the web backbone; Basecoat was evaluated and not adopted.
- **v0.3.6**: web backbone is Enviolo CSS (`tokens/components.css`: buttons, inputs, status pills) instead of Basecoat; Basecoat kept as a reference for new components; button hover is one token-driven rule; overview of the docs site and the AI rules rewritten to match.
- **v0.3.5**: decisions from the open list; button hover is one rule driven by tokens (`--primary-hover`, `--secondary-hover`, `--destructive-hover`), fixing the brown secondary hover seen with Basecoat in dark mode. Copper is the light-mode focus default; status backgrounds are solid ramp steps (`--{status}-bg`, `--{status}-text`, replacing `--status-tint`); Nightfall confirmed; Basecoat buttons verified to use `data-variant` and `data-size`.
- **v0.3.4**: architecture (shadcn/ui for React apps, Basecoat for web, Enviolo token layer on top); AI rules up front; per-mode background, accent and focus; status colours from Tailwind primitives with `--status-tint`; navigation patterns (topic dropdowns, sub-nav, cards as links); open decisions.
- **v0.3.3**: Enviolo ramp (11 steps, Nightfall added), gradients, chart steps; grid and breakpoints.
- **v0.3.2**: confirmed defaults (Source Sans 3, Tabler, Source Code Pro, Taupe/Mist).
- **v0.3.1**: button hierarchy, tokens and Basecoat/shadcn conventions from the button prototype.
