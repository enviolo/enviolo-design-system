## Design system
- Follow `design.md` for all UI work. Section 0 lists the hard rules.
- Tokens live in `tokens/tokens.css`. Components use semantic tokens only; never hard-code colours.
- React apps → shadcn/ui. Websites and CMS templates → Enviolo CSS (`tokens/components.css`): `class="btn" data-variant="secondary" data-size="sm"`, never `btn-secondary`. Same token names in both. Don't load Basecoat; if a component is missing from `components.css`, ask or add it there first.
- When a rule is unclear, check design.md §15 (open decisions) and ask instead of inventing tokens.
