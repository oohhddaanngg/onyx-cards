import { state } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';
import { html, type TemplateResult } from 'lit';
import type {
  HassEntity,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceGridOptions,
} from '../ha/types.js';
import { OnyxBaseElement } from './base-element.js';
import { applyGlassConfig } from '../utils/theme.js';

export abstract class OnyxBaseCard<T extends LovelaceCardConfig>
  extends OnyxBaseElement
  implements LovelaceCard
{
  @state() protected _config?: T;

  protected get _stateObj(): HassEntity | undefined {
    const entityId = (this._config as Record<string, unknown>)?.entity as string | undefined;
    if (!entityId || !this.hass) return undefined;
    return this.hass.states[entityId];
  }

  setConfig(config: T): void {
    this._config = {
      tap_action: { action: 'toggle' },
      hold_action: { action: 'more-info' },
      show_state: true,
      ...config,
    };
  }

  getCardSize(): number {
    return this._computeRows();
  }

  getGridOptions(): LovelaceGridOptions {
    const rows = this._computeRows();
    return {
      columns: 6,
      rows,
      min_columns: 3,
      min_rows: 1,
      max_columns: 12,
    };
  }

  protected _computeRows(): number {
    let rows = 2;
    if ((this._config as Record<string, unknown>)?.secondary_info) rows += 1;
    return rows;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (this._config) {
      applyGlassConfig(this, this._config as unknown as Record<string, unknown>);
    }
  }

  protected renderNotFound(): TemplateResult {
    const entityId = (this._config as Record<string, unknown>)?.entity as string | undefined;
    return html`
      <ha-card>
        <div class="not-found">
          Entity not found: ${entityId ?? 'none'}
        </div>
      </ha-card>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
  }
}
