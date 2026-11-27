# LightWave Developer Workbench — Design v0.2

Unofficial LightWave-inspired learning portal. Thai prose with English technical terminology.

## Figma
- [Design file](https://www.figma.com/design/aWIfnz3rPNlThRlrSPlhgM)
- [Modern Dark lesson](https://www.figma.com/design/aWIfnz3rPNlThRlrSPlhgM?node-id=2-60)
- [Classic Light lesson](https://www.figma.com/design/aWIfnz3rPNlThRlrSPlhgM?node-id=5-106)
- [Modern Dark controls](https://www.figma.com/design/aWIfnz3rPNlThRlrSPlhgM?node-id=5-323)
- [Classic Light controls](https://www.figma.com/design/aWIfnz3rPNlThRlrSPlhgM?node-id=5-389)

## Proposed semantic tokens

These are project design tokens, not official LightWave tokens. Shared components use two theme modes.

| Role | Modern Dark | Classic Light |
|---|---|---|
| Chrome | #343638 | #C2C5BD |
| Panel | #3E4143 | #D6D8D0 |
| Header | #4B4E50 | #BCC4BA |
| Canvas | #282A2C | #F6F5EF |
| Viewport | #44484B | #DDE1DB |
| Border | #585C60 | #7C837D |
| Text | #F0F0EF | #222823 |
| Muted | #B9BDC0 | #4B534D |
| Selected | #47647C | #B1C8DB |
| Accent | #9BC7EA | #24577E |
| Control | #4B4E50 | #D1D5CC |
| Input | #252729 | #F1F2ED |
| Bevel light | #696D70 | #F8F9F2 |
| Bevel dark | #1D1F21 | #828980 |
| Focus | #B5D7F0 | #275A85 |
| Highlight | #F2D27B | #73520C |
| Success | #93C8A0 | #23643E |
| Warning | #E2C08B | #84520B |
| Error | #F1A09A | #A22B27 |
| Experimental | #C8B0EA | #69458C |

## UI principles
- Compact text toolbars, course navigator, viewport, lesson inspector and status bar.
- Raised controls: top/left highlight and bottom/right shade; reverse for pressed and recessed input surfaces.
- **Mandatory Thai Looped:** IBM Plex Sans Thai Looped for every Thai text layer (body, heading, label, button and mixed Thai/English); Sarabun as looped fallback. No loopless Thai. IBM Plex Mono for code and numeric values only; any Thai glyphs must use a looped fallback.
- Classic Light: inspired by LightWave 7-era chrome, with a lighter reading canvas.
- Modern Dark: inspired by contemporary LightWave UI.
- 4 px spacing grid, 2 px control radius; preserve keyboard focus and use text labels alongside status colors.
- Responsive layout and browser accessibility still require implementation and QA. Theme switch in Figma is a design concept, not a functioning website.

## Typography
Body 16 px with 1.75 line-height; UI labels 13–14 px; lesson title 30 px SemiBold. The same typography applies to both themes.

## Motion & iconography (v0.1.1)
- Motion tokens: fast 100 ms, normal 160 ms, reveal 180 ms; easing cubic-bezier(.2,.65,.3,1); max route entrance offset 3 px.
- Only animate intentional interaction: control hover/press, selected states, theme surfaces, new route entrance, and supported disclosure expand/collapse. Initial load and progress updates do not replay route entrance. Keep geometry updates, scroll, and layout calculations immediate.
- Respect prefers-reduced-motion; use native details behavior on browsers without progressive disclosure support. No infinite motion, large slides, or blocking transitions.
- Toolbar: 16px inline outline SVG preceding each text label; compact 34px Moon/Sun theme buttons with accessible names and tooltips. Header icon uses the unmodified 256 × 256 PNG LightWave 9.2 Dock Icon by haimengte, distributed under CC BY 3.0: https://commons.wikimedia.org/wiki/File:Lightwave_Icon.png. Render at 28 × 28 CSS px with object-fit: contain in both themes. The PNG is externally hosted at Wikimedia Commons until it can be downloaded and vendored. Do not redraw the emblem as SVG. LightWave marks belong to their respective owner; this is an unofficial educational site.
