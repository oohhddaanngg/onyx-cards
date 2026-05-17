# Onyx Cards

Premium custom Lovelace cards for Home Assistant. Liquid glass aesthetics with proper sections view grid integration - the thing nobody else has built yet.

## Why

Every existing card library makes you choose: look good (Nodalia, Prism) but break the grid, or integrate properly (Mushroom, native tiles) but look generic. Onyx Cards does both. Dynamic `getGridOptions()`, `height: 100%` grid fill, and glassmorphism styling that adapts to dark and light themes.

## Cards

### Entity Card (`custom:onyx-entity-card`)

Handles switches, input_booleans, sensors, lights, locks, fans, and automations. Tap to toggle switchable entities, tap for more-info on sensors.

```yaml
type: custom:onyx-entity-card
entity: switch.living_room
```

Visual editor supports: entity picker, name/icon overrides, show/hide state, secondary info text, glass blur intensity, border visibility, corner radius, accent/background colors, and tap/hold actions.

### Navigation Bar (`custom:onyx-navbar`)

Floating bottom navigation bar. Fixed position, same glass styling system, safe area inset support for notched devices.

```yaml
type: custom:onyx-navbar
items:
  - icon: mdi:home
    label: Home
    route: /lovelace/0
  - icon: mdi:lightbulb
    label: Lights
    route: /lovelace/lights
  - icon: mdi:cog
    label: Settings
    route: /config
```

## Grid Integration

The core differentiator. Onyx cards return dynamic `getGridOptions()` based on content, never `rows: "auto"`. Cards always fill their grid cells with `height: 100%` and flex-stretch layouts. The stacking pattern works:

```
+----------------+ +----------------+
|                | |  Card B        |
|   Card A       | |  (2 rows)      |
|  (4 rows)      | +----------------+
|                | |  Card C        |
|                | |  (2 rows)      |
+----------------+ +----------------+
```

## Glass Styling

All cards share a glassmorphism styling system driven by CSS custom properties. Configure via the visual editor or YAML:

| Config Key | Default | Description |
|---|---|---|
| `glass_blur` | `10` | Backdrop blur in px (0-30) |
| `background_color` | auto | Card background (RGBA recommended) |
| `border_opacity` | `0.2` | Border visibility (0-1) |
| `accent_color` | auto | Accent color for active states |
| `corner_radius` | `16` | Border radius in px (4-32) |

Cards auto-detect dark/light mode and adjust defaults. Explicit config values always override auto-detection.

Theme authors can set defaults via HA theme YAML using `--onyx-*` CSS custom properties.

## Installation

### Manual

1. Download `onyx-cards.js` from the latest release
2. Copy to `/config/www/onyx-cards.js`
3. Add as a Lovelace resource: Settings > Dashboards > Resources > Add `/local/onyx-cards.js` (JavaScript Module)

### HACS (coming soon)

Will be available through HACS once the project is public.

## Development

```sh
git clone https://github.com/oohhddaanngg/onyx-cards.git
cd onyx-cards
npm install
npm run build    # production build
npm run dev      # watch mode
```

Built with Lit 3, TypeScript, and Vite. Output is a single ES module bundle at `dist/onyx-cards.js`.

## License

MIT
