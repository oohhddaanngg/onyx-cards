import { html, nothing, css, type CSSResultGroup, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { OnyxBaseElement } from '../../shared/base-element.js';
import { fireEvent } from '../../ha/types.js';
import type { LovelaceCardEditor, HaFormSchema } from '../../ha/types.js';
import { loadHaComponents } from '../../utils/loader.js';
import { isVersionAtLeast, MIN_VERSION_EXPANDABLE } from '../../utils/version.js';
import { NAVBAR_EDITOR_NAME } from './const.js';
import type { NavbarConfig, NavItem } from './navbar-config.js';

const FLAT_GLASS_SCHEMA: HaFormSchema[] = [
  {
    name: 'glass_blur',
    selector: {
      number: { min: 0, max: 30, step: 1, mode: 'slider' as const, unit_of_measurement: 'px' },
    },
  },
  {
    name: 'border_opacity',
    selector: { number: { min: 0, max: 1, step: 0.05, mode: 'slider' as const } },
  },
  { name: 'accent_color', selector: { ui_color: {} } },
  { name: 'background_color', selector: { ui_color: {} } },
];

const EXPANDABLE_GLASS_SCHEMA: HaFormSchema[] = [
  {
    type: 'expandable',
    name: '',
    title: 'Glass Styling',
    icon: 'mdi:blur',
    schema: FLAT_GLASS_SCHEMA,
  },
];

const GLASS_LABELS: Record<string, string> = {
  glass_blur: 'Blur Amount',
  border_opacity: 'Border Visibility',
  accent_color: 'Accent Color',
  background_color: 'Background Color',
};

const ITEM_ACTION_SCHEMA = [
  { name: 'tap_action', selector: { ui_action: {} } },
  { name: 'hold_action', selector: { ui_action: {} } },
  { name: 'double_tap_action', selector: { ui_action: {} } },
];

const ACTION_LABELS: Record<string, string> = {
  tap_action: 'Tap Action',
  hold_action: 'Hold Action',
  double_tap_action: 'Double Tap Action',
};

@customElement(NAVBAR_EDITOR_NAME)
export class OnyxNavbarEditor extends OnyxBaseElement implements LovelaceCardEditor {
  @state() private _config?: NavbarConfig;
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
        .items-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 16px 0 8px;
          font-weight: 500;
          font-size: 14px;
        }
        .nav-item-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          margin: 4px 0;
          background: var(--card-background-color, #1c1c1c);
          border-radius: 8px;
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
        }
        .nav-item-fields {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .nav-item-fields ha-textfield,
        .nav-item-fields ha-icon-picker {
          width: 100%;
        }
        .action-fields {
          border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
          padding-top: 8px;
          margin-top: 4px;
        }
        .field-row {
          display: flex;
          gap: 8px;
        }
        .field-row > * {
          flex: 1;
        }
        .item-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .icon-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          color: var(--secondary-text-color, #aaa);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.1));
        }
        .icon-btn ha-icon {
          --mdc-icon-size: 18px;
        }
        .add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 8px;
          margin-top: 8px;
          border: 1px dashed var(--divider-color, rgba(255, 255, 255, 0.2));
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
          color: var(--primary-color, #03a9f4);
          font-size: 13px;
        }
        .add-btn:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.05));
        }
        .add-btn ha-icon {
          --mdc-icon-size: 18px;
        }
        .glass-section {
          margin-top: 16px;
        }
      `,
    ];
  }

  setConfig(config: NavbarConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html`${nothing}`;

    const items = this._config.items ?? [];

    return html`
      <div class="items-header">
        <span>Navigation Items</span>
      </div>

      ${items.map(
        (item, index) => html`
          <div class="nav-item-row">
            <div class="nav-item-fields">
              <div class="field-row">
                <ha-icon-picker
                  .hass=${this.hass}
                  .value=${item.icon}
                  .label=${'Icon'}
                  @value-changed=${(ev: CustomEvent) =>
                    this._updateItem(index, 'icon', ev.detail.value)}
                ></ha-icon-picker>
              </div>
              <div class="field-row">
                <ha-textfield
                  .value=${item.label ?? ''}
                  .label=${'Label'}
                  @input=${(ev: Event) =>
                    this._updateItem(index, 'label', (ev.target as HTMLInputElement).value)}
                ></ha-textfield>
                <ha-textfield
                  .value=${item.route}
                  .label=${'Route'}
                  @input=${(ev: Event) =>
                    this._updateItem(index, 'route', (ev.target as HTMLInputElement).value)}
                ></ha-textfield>
              </div>
              <div class="action-fields">
                <ha-form
                  .hass=${this.hass}
                  .data=${item}
                  .schema=${ITEM_ACTION_SCHEMA}
                  .computeLabel=${this._computeActionLabel}
                  @value-changed=${(ev: CustomEvent) => this._updateItemActions(index, ev.detail.value)}
                ></ha-form>
              </div>
            </div>
            <div class="item-actions">
              ${index > 0
                ? html`<button class="icon-btn" @click=${() => this._moveItem(index, -1)}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </button>`
                : nothing}
              ${index < items.length - 1
                ? html`<button class="icon-btn" @click=${() => this._moveItem(index, 1)}>
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </button>`
                : nothing}
              <button class="icon-btn" @click=${() => this._removeItem(index)}>
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          </div>
        `
      )}

      <button class="add-btn" @click=${this._addItem}>
        <ha-icon icon="mdi:plus"></ha-icon>
        Add Navigation Item
      </button>

      <div class="glass-section">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._useExpandable ? EXPANDABLE_GLASS_SCHEMA : FLAT_GLASS_SCHEMA}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._glassChanged}
        ></ha-form>
      </div>
    `;
  }

  private _updateItemActions(index: number, value: NavItem): void {
    const items = [...(this._config!.items ?? [])];
    items[index] = { ...items[index], ...value };
    this._fireConfig({ ...this._config!, items });
  }

  private _updateItem(index: number, field: keyof NavItem, value: string): void {
    const items = [...(this._config!.items ?? [])];
    items[index] = { ...items[index], [field]: value };
    this._fireConfig({ ...this._config!, items });
  }

  private _moveItem(index: number, direction: number): void {
    const items = [...(this._config!.items ?? [])];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    this._fireConfig({ ...this._config!, items });
  }

  private _removeItem(index: number): void {
    const items = [...(this._config!.items ?? [])];
    items.splice(index, 1);
    this._fireConfig({ ...this._config!, items });
  }

  private _addItem(): void {
    const items = [...(this._config!.items ?? [])];
    items.push({ icon: 'mdi:home', label: '', route: '/lovelace/0' });
    this._fireConfig({ ...this._config!, items });
  }

  private _glassChanged(ev: CustomEvent): void {
    const newData = ev.detail.value;
    const items = this._config!.items ?? [];
    this._fireConfig({ ...newData, items });
  }

  private _fireConfig(config: NavbarConfig): void {
    this._config = config;
    fireEvent(this, 'config-changed', { config });
  }

  private _computeLabel = (schema: { name: string }): string => {
    return GLASS_LABELS[schema.name] ?? schema.name;
  };

  private _computeActionLabel = (schema: { name: string }): string => {
    return ACTION_LABELS[schema.name] ?? schema.name;
  };
}
