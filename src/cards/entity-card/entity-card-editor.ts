import { html, nothing, type CSSResultGroup, css, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { OnyxBaseElement } from '../../shared/base-element.js';
import { fireEvent } from '../../ha/types.js';
import type { LovelaceCardEditor, HaFormSchema } from '../../ha/types.js';
import { loadHaComponents } from '../../utils/loader.js';
import { isVersionAtLeast, MIN_VERSION_EXPANDABLE } from '../../utils/version.js';
import { ENTITY_CARD_EDITOR_NAME } from './const.js';
import type { EntityCardConfig } from './entity-card-config.js';

const SCHEMA: HaFormSchema[] = [
  { name: 'entity', selector: { entity: {} } },
  { name: 'name', selector: { text: {} } },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'icon', selector: { icon: {} }, context: { icon_entity: 'entity' } },
      { name: 'icon_color', selector: { ui_color: {} } },
    ],
  },
  { name: 'show_state', selector: { boolean: {} } },
  { name: 'secondary_info', selector: { text: {} } },
  {
    type: 'expandable',
    name: '',
    title: 'Glass Styling',
    icon: 'mdi:blur',
    schema: [
      {
        name: 'glass_blur',
        selector: { number: { min: 0, max: 30, step: 1, mode: 'slider', unit_of_measurement: 'px' } },
      },
      {
        name: 'border_opacity',
        selector: { number: { min: 0, max: 1, step: 0.05, mode: 'slider' } },
      },
      {
        name: 'corner_radius',
        selector: { number: { min: 4, max: 32, step: 1, mode: 'slider', unit_of_measurement: 'px' } },
      },
      { name: 'accent_color', selector: { ui_color: {} } },
      { name: 'background_color', selector: { ui_color: {} } },
    ],
  },
  { name: 'tap_action', selector: { ui_action: {} } },
  { name: 'hold_action', selector: { ui_action: {} } },
  { name: 'double_tap_action', selector: { ui_action: {} } },
];

const FLAT_GLASS_SCHEMA: HaFormSchema[] = [
  {
    name: 'glass_blur',
    selector: { number: { min: 0, max: 30, step: 1, mode: 'slider', unit_of_measurement: 'px' } },
  },
  {
    name: 'border_opacity',
    selector: { number: { min: 0, max: 1, step: 0.05, mode: 'slider' } },
  },
  {
    name: 'corner_radius',
    selector: { number: { min: 4, max: 32, step: 1, mode: 'slider', unit_of_measurement: 'px' } },
  },
  { name: 'accent_color', selector: { ui_color: {} } },
  { name: 'background_color', selector: { ui_color: {} } },
];

const SCHEMA_FALLBACK: HaFormSchema[] = [
  { name: 'entity', selector: { entity: {} } },
  { name: 'name', selector: { text: {} } },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'icon', selector: { icon: {} }, context: { icon_entity: 'entity' } },
      { name: 'icon_color', selector: { ui_color: {} } },
    ],
  },
  { name: 'show_state', selector: { boolean: {} } },
  { name: 'secondary_info', selector: { text: {} } },
  ...FLAT_GLASS_SCHEMA,
  { name: 'tap_action', selector: { ui_action: {} } },
  { name: 'hold_action', selector: { ui_action: {} } },
  { name: 'double_tap_action', selector: { ui_action: {} } },
];

const LABELS: Record<string, string> = {
  entity: 'Entity',
  name: 'Name',
  icon: 'Icon',
  icon_color: 'Icon Color',
  show_state: 'Show State',
  secondary_info: 'Secondary Info',
  glass_blur: 'Blur Amount',
  border_opacity: 'Border Visibility',
  corner_radius: 'Corner Radius',
  accent_color: 'Accent Color',
  background_color: 'Card Background',
  tap_action: 'Tap Action',
  hold_action: 'Hold Action',
  double_tap_action: 'Double Tap Action',
};

@customElement(ENTITY_CARD_EDITOR_NAME)
export class OnyxEntityCardEditor extends OnyxBaseElement implements LovelaceCardEditor {
  @state() private _config?: EntityCardConfig;
  @state() private _useExpandable = true;

  lovelace?: Record<string, unknown>;

  connectedCallback(): void {
    super.connectedCallback();
    loadHaComponents();
  }

  protected willUpdate(changedProps: PropertyValues): void {
    super.willUpdate(changedProps);
    if (changedProps.has('hass') && this.hass) {
      this._useExpandable = isVersionAtLeast(this.hass.config?.version, MIN_VERSION_EXPANDABLE);
    }
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  setConfig(config: EntityCardConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html`${nothing}`;

    const schema = this._useExpandable ? SCHEMA : SCHEMA_FALLBACK;

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _computeLabel = (schema: HaFormSchema): string => {
    return LABELS[schema.name] ?? schema.name;
  };

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, 'config-changed', { config: ev.detail.value });
  }
}
