import { html, nothing, css, type CSSResultGroup, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { assert } from 'superstruct';
import { OnyxBaseCard } from '../../shared/base-card.js';
import { cardStyles } from '../../shared/card-styles.js';
import { glassCardStyles, glassLightDefaults } from '../../shared/glass-styles.js';
import { registerCustomCard } from '../../utils/register.js';
import { fireEvent, isActive, isAvailable, isToggleable } from '../../ha/types.js';
import { ENTITY_CARD_NAME, ENTITY_CARD_EDITOR_NAME } from './const.js';
import { entityCardConfigStruct, type EntityCardConfig } from './entity-card-config.js';

registerCustomCard({
  type: ENTITY_CARD_NAME,
  name: 'Onyx Entity Card',
  description: 'Premium entity card with liquid glass styling and proper grid integration',
  preview: true,
});

@customElement(ENTITY_CARD_NAME)
export class OnyxEntityCard extends OnyxBaseCard<EntityCardConfig> {
  static get styles(): CSSResultGroup {
    return [
      super.styles,
      cardStyles,
      glassCardStyles,
      glassLightDefaults,
      css`
        :host([light-mode]) {
          --onyx-bg-color: rgba(255, 255, 255, 0.3);
          --onyx-border-color: rgba(0, 0, 0, 0.1);
          --onyx-text-primary: rgba(0, 0, 0, 0.9);
          --onyx-text-secondary: rgba(0, 0, 0, 0.55);
          --onyx-icon-active: rgba(0, 0, 0, 0.85);
          --onyx-icon-inactive: rgba(0, 0, 0, 0.35);
          --onyx-glow-color: rgba(0, 0, 0, 0.04);
        }
        .container {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .container:active {
          transform: scale(0.98);
          transition: transform 0.1s ease;
        }
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--onyx-glow-color);
          flex-shrink: 0;
          transition: background var(--onyx-transition);
        }
        .icon-container.active {
          background: rgba(255, 255, 255, 0.15);
        }
        :host([light-mode]) .icon-container.active {
          background: rgba(0, 0, 0, 0.08);
        }
        .icon-container ha-state-icon {
          --mdc-icon-size: 22px;
          color: var(--onyx-icon-inactive);
          transition: color var(--onyx-transition);
        }
        .icon-container.active ha-state-icon {
          color: var(--onyx-icon-active);
        }
        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          gap: 2px;
        }
        .name {
          font-size: 14px;
          font-weight: 500;
          color: var(--onyx-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.3;
        }
        .state {
          font-size: 12px;
          color: var(--onyx-text-secondary);
          line-height: 1.3;
        }
        .secondary {
          font-size: 11px;
          color: var(--onyx-text-secondary);
          opacity: 0.8;
          line-height: 1.3;
        }
        .not-found {
          padding: 16px;
          color: var(--onyx-text-secondary);
          font-size: 13px;
        }
      `,
    ];
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    await import('./entity-card-editor.js');
    return document.createElement(ENTITY_CARD_EDITOR_NAME);
  }

  public static getStubConfig(hass: HomeAssistant): Record<string, unknown> {
    const entity = Object.keys(hass.states).find(
      (eid) =>
        eid.startsWith('switch.') ||
        eid.startsWith('input_boolean.') ||
        eid.startsWith('light.') ||
        eid.startsWith('sensor.')
    );
    return { type: ENTITY_CARD_NAME, entity: entity ?? '' };
  }

  setConfig(config: EntityCardConfig): void {
    assert(config, entityCardConfigStruct);
    super.setConfig(config);
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) return html``;

    const stateObj = this._stateObj;
    if (!stateObj) return this.renderNotFound();

    const entityId = this._config.entity!;
    const active = isActive(stateObj);
    const available = isAvailable(stateObj);
    const name = this._config.name ?? stateObj.attributes.friendly_name ?? entityId;
    const showState = this._config.show_state !== false;

    let stateDisplay = '';
    if (showState) {
      try {
        stateDisplay = this.hass.formatEntityState(stateObj);
      } catch {
        stateDisplay = stateObj.state;
      }
    }

    return html`
      <ha-card>
        <div
          class="container"
          @click=${this._handleTap}
          role="button"
          tabindex="0"
          aria-label=${name}
        >
          <div class="icon-container ${active ? 'active' : ''}">
            <ha-state-icon
              .hass=${this.hass}
              .stateObj=${stateObj}
              .icon=${this._config.icon}
            ></ha-state-icon>
          </div>
          <div class="info">
            <span class="name">${name}</span>
            ${showState
              ? html`<span class="state" style=${available ? '' : 'opacity: 0.5'}
                  >${stateDisplay}</span
                >`
              : nothing}
            ${this._config.secondary_info
              ? html`<span class="secondary">${this._config.secondary_info}</span>`
              : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _handleTap(): void {
    if (!this._config?.entity || !this.hass) return;

    const action = this._config.tap_action?.action ?? 'toggle';

    if (action === 'toggle' && isToggleable(this._config.entity)) {
      this.hass.callService('homeassistant', 'toggle', {}, { entity_id: this._config.entity });
    } else if (action === 'navigate' && this._config.tap_action?.navigation_path) {
      history.pushState(null, '', this._config.tap_action.navigation_path);
      fireEvent(window as unknown as HTMLElement, 'location-changed', { replace: false });
    } else {
      fireEvent(this, 'hass-more-info', { entityId: this._config.entity });
    }
  }
}

type HomeAssistant = import('../../ha/types.js').HomeAssistant;
