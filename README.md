# Onyx Cards

Premium custom Lovelace cards for Home Assistant. Liquid glass aesthetics with proper sections view grid integration - the thing nobody else has built yet.

## Why

Every existing card library makes you choose: look good (Nodalia, Prism) but break the grid, or integrate properly (Mushroom, native tiles) but look generic. Onyx Cards does both. Dynamic `getGridOptions()`, `height: 100%` grid fill, and glassmorphism styling that adapts to dark and light themes.

## Cards

### Entity Card (`custom:onyx-entity-card`)

Works with any entity. Tap toggles switches, input_booleans, lights, fans, automations, and scripts. All other domains - sensors, locks, covers, etc. - open more-info on tap.

```yaml
type: custom:onyx-entity-card
entity: switch.living_room
```

Visual editor supports: entity picker, name/icon overrides, show/hide state, secondary info text, glass blur intensity, border visibility, corner radius, accent/background colors, and tap/hold/double-tap actions.

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

## Gestures

All cards support three gesture types. Hold and double-tap are opt-in - configure the action to enable them.

**Entity card with hold action:**
```yaml
type: custom:onyx-entity-card
entity: light.bedroom
tap_action:
  action: toggle
hold_action:
  action: more-info
```

**Entity card with double-tap to activate a scene:**
```yaml
type: custom:onyx-entity-card
entity: light.living_room
tap_action:
  action: toggle
double_tap_action:
  action: perform-action
  perform_action: scene.turn_on
  target:
    entity_id: scene.movie_night
```

**Navbar item with hold to open more-info on a specific entity:**
```yaml
type: custom:onyx-navbar
items:
  - icon: mdi:lightbulb
    label: Lights
    route: /lovelace/lights
    hold_action:
      action: more-info
      entity: light.bedroom
```

The `entity` field on an action config lets navbar items (which have no entity of their own) open more-info or toggle a specific entity on hold or double-tap.

## Action Types

| Action | Description |
|---|---|
| `none` | Do nothing |
| `toggle` | Toggle the entity. Falls back to more-info if entity is not toggleable. |
| `more-info` | Open the more-info dialog |
| `navigate` | Navigate to a dashboard path |
| `url` | Open a URL in a new tab |
| `perform-action` | Call a Home Assistant service |
| `call-service` | Legacy alias for `perform-action` (still works for existing YAML) |
| `assist` | Open the voice assistant dialog |

```yaml
# navigate
tap_action:
  action: navigate
  navigation_path: /lovelace/lights

# url
tap_action:
  action: url
  url_path: https://example.com

# perform-action
hold_action:
  action: perform-action
  perform_action: light.turn_on
  data:
    brightness_pct: 100
  target:
    entity_id: light.bedroom

# call-service (legacy)
hold_action:
  action: call-service
  service: light.turn_on
  service_data:
    brightness_pct: 100

# assist
double_tap_action:
  action: assist
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

## Config Reference

### Entity Card

| Key | Type | Default | Description |
|---|---|---|---|
| `entity` | string | required | Entity ID |
| `name` | string | entity name | Display name override |
| `icon` | string | entity icon | MDI icon override |
| `icon_color` | string | - | Icon color |
| `show_state` | boolean | `true` | Show state text |
| `secondary_info` | string | - | Secondary text line |
| `tap_action` | ActionConfig | `toggle` | Tap behavior |
| `hold_action` | ActionConfig | `more-info` | Hold behavior |
| `double_tap_action` | ActionConfig | `none` | Double-tap behavior |
| `glass_blur` | 0-30 | `10` | Backdrop blur in px |
| `background_color` | string | auto | Card background |
| `border_opacity` | 0-1 | `0.2` | Border visibility |
| `accent_color` | string | auto | Active state accent |
| `corner_radius` | 4-32 | `16` | Border radius in px |

### Navigation Bar

| Key | Type | Default | Description |
|---|---|---|---|
| `items` | NavItem[] | `[]` | Navigation items |
| `glass_blur` | 0-30 | `10` | Backdrop blur in px |
| `background_color` | string | auto | Bar background |
| `border_opacity` | 0-1 | `0.2` | Top border visibility |
| `accent_color` | string | auto | Active item accent |

**NavItem fields:**

| Key | Type | Default | Description |
|---|---|---|---|
| `icon` | string | required | MDI icon |
| `label` | string | - | Label text |
| `route` | string | required | Navigation path |
| `tap_action` | ActionConfig | navigate to `route` | Tap behavior |
| `hold_action` | ActionConfig | `none` | Hold behavior |
| `double_tap_action` | ActionConfig | `none` | Double-tap behavior |

### ActionConfig

| Key | Type | Description |
|---|---|---|
| `action` | string | Action type (see Action Types table) |
| `entity` | string | Entity override for this action (useful for navbar items) |
| `navigation_path` | string | Path for `navigate` action |
| `navigation_replace` | boolean | Use `replaceState` instead of `pushState` |
| `url_path` | string | URL for `url` action |
| `perform_action` | string | Service in `domain.service` format for `perform-action` |
| `data` | object | Service data for `perform-action` |
| `target` | object | Service target for `perform-action` |
| `service` | string | Service for `call-service` (legacy) |
| `service_data` | object | Service data for `call-service` (legacy) |
| `pipeline_id` | string | Assist pipeline ID |
| `start_listening` | boolean | Auto-start listening in assist |

## Glass Styling

All cards share a glassmorphism styling system driven by CSS custom properties. Configure via the visual editor or YAML. Cards read `hass.themes.darkMode` and adjust all color defaults automatically. Explicit config values always override auto-detection.

Theme authors can set defaults via HA theme YAML:

| Property | Default (dark) | Description |
|---|---|---|
| `--onyx-glass-blur` | `10px` | Backdrop blur intensity |
| `--onyx-bg-color` | `rgba(0, 0, 0, 0.4)` | Card background color |
| `--onyx-border-color` | `rgba(255, 255, 255, 0.2)` | Border color |
| `--onyx-border-opacity` | `0.2` | Border opacity |
| `--onyx-accent-color` | HA `--primary-color` | Active state accent |
| `--onyx-text-primary` | `rgba(255, 255, 255, 0.95)` | Primary text color |
| `--onyx-text-secondary` | `rgba(255, 255, 255, 0.6)` | Secondary text color |
| `--onyx-icon-active` | `rgba(255, 255, 255, 0.9)` | Active icon color |
| `--onyx-icon-inactive` | `rgba(255, 255, 255, 0.4)` | Inactive icon color |
| `--onyx-radius` | `16px` | Corner radius |
| `--onyx-transition` | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` | Transition timing |
| `--onyx-glow-color` | `rgba(255, 255, 255, 0.08)` | Inner highlight glow |

All properties switch to appropriate light-mode defaults automatically.

## FAQ

**How long is a hold?** 500ms. The device vibrates (on mobile) at the threshold to confirm the hold registered. The action fires when you release.

**Why does single-tap feel delayed when I configure double-tap?** There is a 250ms window after each tap to detect whether a second tap follows. If you configure `double_tap_action`, single-tap will wait that long before firing.

**Can I use a URL tap action with a double-tap action?** No. URL tap actions fire immediately to preserve browser user activation (required for `window.open`). When tap is a URL, the 250ms double-tap detection window does not run, so double-tap can never fire. Put the URL on `double_tap_action` and use a different action type (navigate, toggle, etc.) for tap.

**Why doesn't my URL action work from the editor preview?** Browsers require a direct user gesture to open a new tab. URL actions work correctly from real taps - the editor preview is not a real gesture.

**Can a navbar item open more-info on an entity I'm not navigating to?** Yes. Set `hold_action: { action: more-info, entity: light.bedroom }` on the item. The `entity` field on an action config overrides the card-level entity for that specific action.

**Can I edit the navbar in the visual editor?** Yes. In dashboard edit mode, the navbar switches from fixed-bottom positioning to an inline preview in its grid slot. Click Edit on the card's action controls to open the visual editor. The bar returns to its fixed position when you exit edit mode.

**Does keyboard navigation support hold actions?** Yes. Hold Enter for 500ms to trigger a hold action. Space always fires a tap. Keyboard double-tap is not supported (Enter and Space are tap or hold only).

**What is the difference between `perform-action` and `call-service`?** The same thing. Home Assistant renamed the concept in 2024. `perform-action` is the current name. `call-service` still works and is equivalent - useful if you have existing YAML you don't want to rewrite.

## Installation

### Manual

1. Download `onyx-cards.js` from the latest release
2. Copy to `/config/www/onyx-cards.js`
3. Add as a Lovelace resource: Settings > Dashboards > Resources > Add `/local/onyx-cards.js` (JavaScript Module)

### HACS (custom repository)

1. Open HACS in Home Assistant
2. Click the three-dot menu (top right) and select "Custom repositories"
3. Add `https://github.com/oohhddaanngg/onyx-cards` with category "Dashboard"
4. Search for "Onyx Cards" in the HACS Frontend store and install
5. Restart Home Assistant
6. Add the resource if HACS does not do it automatically: Settings > Dashboards > Resources > Add `/hacsfiles/onyx-cards/onyx-cards.js` (JavaScript Module)

## Development

```sh
git clone https://github.com/oohhddaanngg/onyx-cards.git
cd onyx-cards
npm install
npm run build    # production build
npm run dev      # watch mode
```

Built with Lit 3, TypeScript, and Vite. Output is a single ES module bundle at `dist/onyx-cards.js`.

### Testing

```sh
npm run test:run      # run all tests once
npm test              # watch mode (interactive dev, not for CI)
npm run test:coverage # run with v8 coverage report
npm run typecheck     # type-check all source and test files
```

Tests use Vitest with happy-dom. Test files are colocated with source as `*.test.ts`.

## License

MIT
