# design.md: index or rulebook?

Research note, 23 November 2026. Question: should `design.md` be a short index of links to the docs site (the "URL index" pattern), or a full set of rules, as it is now? If the rules stay, does the file need refactoring?

## Short answer

- **Keep the rules in `design.md`.** An index-only file is the wrong model for this system. The current file is the right kind of thing.
- **Refactor it anyway.** About 40% of its 510 lines are values copied from `tokens.css`, history, and docs-site detail. That content doesn't help an agent build UI, and it drifts.
- **Add a short index at the end.** It complements the rules and doesn't replace them.
- **Target:** about 250–300 lines, rules and reasoning only, with values and history linked from the file instead of copied into it.

## 1. What the sources say

### Two patterns are in use

| Pattern | What it is | Built for |
|---|---|---|
| **Index** (llms.txt style) | A small Markdown file of links with one-line notes. The agent fetches the detail when it needs it. | Public websites and developer docs that an agent can fetch ([llmstxt.org](https://llmstxt.org/)) |
| **Spec** (Google DESIGN.md style) | One file with machine-readable tokens plus prose that explains *why* and *how to apply* them. | Design systems that an agent has to follow ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)) |

The index pattern solves a different problem. llms.txt says it helps "agents use a website": the file stays small, and the detail "is fetched only when needed." That only works when the linked pages can be fetched and are easy for an agent to read.

### Google's DESIGN.md spec (alpha, open-sourced April 2026)

This is the closest thing to a standard for this exact file.

- **Two layers in one file.** YAML front matter holds the tokens (`colors`, `typography`, `rounded`, `spacing`, `motion`, `components`), and Markdown prose explains them. In the spec's words: "The tokens are the normative values; the prose provides context for how to apply them." The README puts it as: "Tokens give agents exact values. Prose tells them *why* those values exist and how to apply them."
- **Canonical sections, in order:** Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Motion, Voice & Content Strategy, Components, Do's and Don'ts. All are optional, but the ones present must follow this order.
- **Linking is built in.** `@components/button.html#button-primary` points from a rule to a file. The linter flags broken paths and anchors.
- **Tooling:** `npx @google/design.md lint | diff | export`. Lint checks WCAG AA contrast on component colour pairs, broken token references, orphaned tokens and section order. Export writes Tailwind v4 `@theme` or W3C DTCG tokens.
- **No length limit, and no exclusion list.** The spec is rules-plus-rationale by design. It is not an index.

The spec is alpha and "expect[s] changes to the format", so treat it as a direction, not a contract.

### Guidance on agent instruction files (CLAUDE.md, AGENTS.md)

This guidance covers the *always-loaded* file. `design.md` is not always loaded (see section 2), but the same principles apply.

- **Size.** Anthropic's own target is "under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence" ([memory docs](https://code.claude.com/docs/en/memory)). The community ceiling is about 300 lines ([HumanLayer](https://humanlayer.com/blog/writing-a-good-claude-md)). None of these numbers comes from measurement; they are heuristics.
- **Progressive disclosure.** Keep the always-loaded file small and route to deeper docs by task ([Thoughtworks Radar: agent instruction bloat](https://www.thoughtworks.com/en-sg/radar/techniques/agent-instruction-bloat), [two-layer pattern](https://dev.to/demandt/a-two-layer-documentation-pattern-for-ai-coding-agents-4k32)).
- **What belongs inline.** Anthropic's test asks whether the agent could find this by reading the code, and whether it would actually go and look. If both answers are yes, leave it out. Keep decisions that aren't visible in the code, and anything you've had to correct twice.
- **Pointers over copies.** "Prefer pointers to copies" (HumanLayer). Copied values go stale.
- **Enforce, don't only describe.** "Never send an LLM to do a linter's job" (HumanLayer). "If something has to happen every time, make it a hook, a deny rule, or a managed setting" (Anthropic). Thoughtworks: "convert any instructions you can into deterministic hooks or checks."
- **Imports don't save context.** A CLAUDE.md `@design.md` import loads the whole file every session (Anthropic memory docs).

## 2. Why index-only is wrong here

1. **The docs site isn't reachable from consuming projects.** It runs on localhost from this repo. A project that copies `design.md` (README, "Use it in a project") would get links that lead nowhere. Index-only only works with a hosted site.
2. **HTML pages are poor agent input.** The site is interactive HTML with a JS personalizer. An agent fetching it gets markup and scripts, not rules. llms.txt solves this with `.md` versions of each page, which would mean building and maintaining a second copy of the docs.
3. **The site describes. `design.md` decides.** The repo's own CLAUDE.md says `design.md` is "the single source of the rules." Moving the rules into the site would make the HTML the source and the Markdown the copy. That inverts the dependency.
4. **The valuable content is judgement, not values.** The button decision tree (8.1), "secondary vs outline: the surface decides", "the solid focus ring is a deliberate deviation, don't fix it", and the ramp's "brand moments only" rule are exactly the decisions an agent can't recover by reading the code. They belong inline.
5. **The routing layer already exists.** The README snippet (3 lines in the consuming project's CLAUDE.md, pointing to `design.md`) *is* the index layer. It's the correct pattern, and nothing more is needed there.

Where an index does help: the end of `design.md`, pointing to the token files and to docs pages for visual examples. If the site is hosted later, add an `llms.txt` there.

## 3. Audit of the current design.md

510 lines, about 34 KB (roughly 8–9k tokens). Each section, sorted by what an agent building UI needs:

| Section | Lines | Verdict |
|---|---|---|
| 0 AI rules | 13 | **Keep.** This is the Do's and Don'ts core. |
| 1 Architecture | 43 | **Keep, trim.** Layer table and backbone choice are essential. The ASCII diagram and the Basecoat porting note are maintainer detail (move to CLAUDE.md or a contributing note). |
| 2 Default setup | 13 | **Keep.** |
| 3.1 Token flow | 16 | **Shorten.** The primitive-to-semantic chain is maintainer detail. Agents only need "components read semantic tokens." |
| 3.2 Semantic tokens | 33 | **Keep names and uses, drop value columns.** The names are the contract. The values live in `tokens.css`. |
| 3.3 Tailwind example | 55 | **Move out.** It's a copy of `tokens.css` and says itself that it's "illustrative only." Link to the file. |
| 4.1 Neutral ramps | 21 | **Drop the oklch table.** Agents must never type these values (rule 2). Keep the two bullets on warm days and cool nights. |
| 4.2 Enviolo ramp | 35 | **Keep names, recipes and rules. Drop the hex column** (it's in `tokens.css`). |
| 4.3 Status | 9 | **Keep.** |
| 5 Typography | 25 | **Keep.** The type scale isn't tokenised yet, so this table is the only source. Tokenise it later. |
| 6 Shape, spacing, elevation | 19 | **Keep.** Same reason: these aren't tokens yet. |
| 7 Layout | 22 | **Keep.** |
| 8.1 Buttons | 39 | **Keep.** This is the most valuable section. |
| 8.2 Inputs | 7 | **Keep.** |
| 8.3 Navigation | 9 | **Check.** Top nav, topic dropdowns and sub-nav describe the *docs site*. Keep only if products use them. Menu keyboard and direction rules are general, so keep those. |
| 9 Icons | 8 | **Keep.** |
| 10 Theming | 16 | **Split.** "Match system, toggle shows destination" is product guidance. The per-mode Display menu options are a docs-site and sandbox feature, so move them out. |
| 11 Accessibility | 8 | **Keep.** |
| 12 Copy | 9 | **Keep.** This is Google's "Voice & Content Strategy". |
| 13 Context examples | 11 | **Keep.** Worked examples help agents a lot. |
| 14 Checklist | 13 | **Keep**, or merge into section 0. |
| 15 Open decisions | 15 | **Keep "Decided" as one-line "don't reverse" notes without version tags.** Open questions stay. |
| 16 Changelog | 14 | **Move out.** `docs/CHANGELOG.md` already holds it. Keeping both breaks the repo's own "don't restate" rule. |

Rough savings: about 55 lines (3.3) + 20 (4.1) + 14 (16) + 20 (value columns, diagram, flow) + 10–20 (docs-site-only 8.3 and 10) ≈ **120–140 lines**. That leaves about 370 lines. Tightening sections 1 and 3 brings it toward 300.

Other findings:

- **"Live reference: open `index.html` at the repo root"** doesn't work in a consuming project, so the header points to nowhere there. Replace it with a hosted URL, or say plainly that the site lives in the design-system repo.
- **Rules that a tool could check**, from section 0: no hex, oklch or palette classes in components; one `btn` without `data-variant` per view; `aria-label` on icon-only buttons. Each could be a stylelint rule, a grep in a pre-commit hook, or a Claude Code hook. That catches violations that prose alone misses.
- **Section 0 is already in the right place.** Rules first, short and numbered, matches the advice on attention at the start of a file.

## 4. Recommended structure

Three layers. Each layer has one job and points to the next instead of copying it.

```
Consuming project
  CLAUDE.md / AGENTS.md   3 lines: "for UI work, follow design.md"  ← already in README
        │
        ▼
  design.md               rules, decisions, reasoning, token NAMES, examples
  (~250–300 lines)        self-contained, works offline, no fetch needed
        │
        ▼
  tokens/*.css            values (source of truth)
  docs site               visual reference, live examples, full component pages
  docs/CHANGELOG.md       history
```

Proposed outline for `design.md`, following Google's section order so a later move to their format costs little:

1. **Header**: version, status, one line saying where values and history live
2. **Rules for AI (Do's and Don'ts)**: current section 0, plus the checklist from section 14
3. **Overview / architecture**: backbone by surface, layer table, the vocabulary translation table
4. **Colors**: semantic token names and uses, neutral split, Enviolo ramp names, gradient recipes and chart rules, status rules
5. **Typography**
6. **Layout**: breakpoints, grid, spacing
7. **Elevation, shapes, motion**
8. **Voice and copy**
9. **Components**: buttons (decision tree, hard rules, states), inputs, menus, plus context examples
10. **Accessibility**
11. **Decisions: don't reverse**: short reasoning, no version numbers
12. **Open questions**
13. **Reference index**: links to `tokens.css`, `components.css`, the docs pages, and `docs/CHANGELOG.md`

## 5. Optional: adopt Google's DESIGN.md format

Not needed now, but worth trying when the token set settles.

- **Gains:** a contrast lint for every component colour pair, a broken-reference check, export to Tailwind v4 `@theme` and DTCG (useful for the Figma variable sync), and compatibility with Stitch and other tools that read the format.
- **Costs:** the format is alpha and still changing. Its `components` token model (backgroundColor, textColor, rounded, padding) can't express light and dark modes, per-mode overrides, or the two-ramp neutral swap. `tokens.css` would remain the real source, so the YAML would be a third copy unless `tokens.css` is generated from it.
- **Cheap version:** only rename and reorder the sections to match the spec, which the outline above already does. Add front matter later.

## 6. Next steps

1. Trim `design.md` as in section 3. This is a content edit with no rule changes, so it can ship as v0.3.13.
2. Update the version-bump list in CLAUDE.md: once section 16 moves out, `design.md` only needs its header changed.
3. Decide whether 8.3 (top nav, sub-nav) and the Display menu are product patterns or docs-site patterns.
4. Add a backlog item for checks that enforce section 0 (hex, oklch and palette-class lint).
5. Later: host the docs site, then add `llms.txt` and `.md` versions of the pages.

## Sources

- [google-labs-code/design.md](https://github.com/google-labs-code/design.md) (README and `docs/spec.md`, alpha)
- [llmstxt.org](https://llmstxt.org/) (llms.txt proposal)
- [Claude Code: memory](https://code.claude.com/docs/en/memory) and [best practices](https://code.claude.com/docs/en/best-practices) (Anthropic)
- [Writing a good CLAUDE.md](https://humanlayer.com/blog/writing-a-good-claude-md) (HumanLayer)
- [Agent instruction bloat](https://www.thoughtworks.com/en-sg/radar/techniques/agent-instruction-bloat) (Thoughtworks Technology Radar)
- [A two-layer documentation pattern for AI coding agents](https://dev.to/demandt/a-two-layer-documentation-pattern-for-ai-coding-agents-4k32) (dev.to)
- [DesignSpecs: a DESIGN.md dataset](https://arxiv.org/html/2611.17713) (arXiv, background)
