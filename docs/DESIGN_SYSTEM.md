# Design System (v1)

## Layout
- App uses left sidebar navigation + top bar
- Core pages max width: 1200–1400px
- Attack Mode uses 3-column cockpit layout

## Components Style Rules
- Severity colors: S0 critical, S1 high, S2 medium, S3 low, S4 info (exact colors decided in UI kit)
- Buttons: primary, secondary, destructive, ghost
- Tables: sticky header, row hover, pagination

## Accessibility
- Keyboard navigable
- ARIA labels for interactive elements
- Contrast meets WCAG AA minimum

## States
- Loading: skeletons for tables and panels
- Empty: helpful CTA
- Error: show request_id and retry
- Permission: hide action controls + show tooltip on disabled areas