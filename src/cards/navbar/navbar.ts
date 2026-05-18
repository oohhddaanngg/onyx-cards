import { html, nothing, css, type CSSResultGroup, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { assert } from 'superstruct';
import { OnyxBaseElement } from '../../shared/base-element.js';
import { glassLightDefaults } from '../../shared/glass-styles.js';
import { registerCustomCard } from '../../utils/register.js';
import { fireEvent } from '../../ha/types.js';
import { applyGlassConfig } from '../../utils/theme.js';
import type { LovelaceCard, LovelaceGridOptions } from '../../ha/types.js';
import { NAVBAR_NAME, NAVBAR_EDITOR_NAME } from './const.js';
import { navbarConfigStruct, type NavbarConfig } from './navbar-config.js';

registerCustomCard({
  type: NAVBAR_NAME,
  name: 'Onyx Navigation Bar',
  description: 'Floating bottom navigation bar with liquid glass styling',
  preview: true,
});

@customElement(NAVBAR_NAME)
export class OnyxNavbar extends OnyxBaseElement implements LovelaceCard {
  @state() private _config?: NavbarConfig;
  @state() private _currentPath = '';

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      glassLightDefaults,
      css`
        :host {
          display: block;
          height: 100%;
        }
        .navbar {
          position: fixed;
          bottom: 0;
          left: var(--mdc-drawer-width, 0px);
          right: 0;
          z-index: 10;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 16px;
          padding-bottom: max(8px, env(safe-area-inset-bottom));
          background: var(--onyx-bg-color);
          backdrop-filter: var(--onyx-backdrop-filter, var(--ha-card-backdrop-filter, blur(var(--onyx-glass-blur, 10px))));
          -webkit-backdrop-filter: var(--onyx-backdrop-filter, var(--ha-card-backdrop-filter, blur(var(--onyx-glass-blur, 10px))));
          border-top: var(--ha-card-border-width, 1px) solid var(--onyx-border-color, rgba(255, 255, 255, 0.2));
          box-shadow: var(--ha-card-box-shadow, 0 -2px 20px rgba(0, 0, 0, 0.15));
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 12px;
          transition: all var(--onyx-transition, 0.3s cubic-bezier(0.4, 0, 0.2, 1));
          -webkit-tap-highlight-color: transparent;
          min-width: 48px;
        }
        .nav-item:active {
          transform: scale(0.92);
        }
        .nav-item ha-icon {
          --mdc-icon-size: 24px;
          color: var(--onyx-icon-inactive, rgba(255, 255, 255, 0.4));
          transition: color var(--onyx-transition, 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        }
        .nav-item.active ha-icon {
          color: var(--onyx-icon-active, rgba(255, 255, 255, 0.9));
        }
        .nav-item .label {
          font-size: 10px;
          color: var(--onyx-text-secondary, rgba(255, 255, 255, 0.6));
          line-height: 1;
          transition: color var(--onyx-transition, 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        }
        .nav-item.active .label {
          color: var(--onyx-text-primary, rgba(255, 255, 255, 0.95));
        }
        .nav-item.active {
          background: rgba(255, 255, 255, 0.1);
        }
        :host([light-mode]) .nav-item.active {
          background: rgba(0, 0, 0, 0.06);
        }
      `,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._currentPath = window.location.pathname;
    window.addEventListener('popstate', this._onLocationChange);
    window.addEventListener('location-changed', this._onLocationChange);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._onLocationChange);
    window.removeEventListener('location-changed', this._onLocationChange);
  }

  private _onLocationChange = (): void => {
    this._currentPath = window.location.pathname;
  };

  public static async getConfigElement(): Promise<HTMLElement> {
    await import('./navbar-editor.js');
    return document.createElement(NAVBAR_EDITOR_NAME);
  }

  public static getStubConfig(): Record<string, unknown> {
    return {
      type: NAVBAR_NAME,
      items: [
        { icon: 'mdi:home', label: 'Home', route: '/lovelace/0' },
        { icon: 'mdi:lightbulb', label: 'Lights', route: '/lovelace/lights' },
        { icon: 'mdi:cog', label: 'Settings', route: '/config' },
      ],
    };
  }

  setConfig(config: NavbarConfig): void {
    assert(config, navbarConfigStruct);
    this._config = config;
  }

  getCardSize(): number {
    return 1;
  }

  getGridOptions(): LovelaceGridOptions {
    return { rows: 1, columns: 'full', min_columns: 6, min_rows: 1 };
  }

  protected updated(changedProps: import('lit').PropertyValues): void {
    super.updated(changedProps);
    if (this._config) {
      applyGlassConfig(this, this._config as unknown as Record<string, unknown>);
    }
  }

  protected render(): TemplateResult {
    if (!this._config) return html``;

    const items = this._config.items ?? [];

    return html`
      <nav class="navbar">
        ${items.map(
          (item) => html`
            <button
              class="nav-item ${this._isActive(item.route) ? 'active' : ''}"
              @click=${() => this._navigate(item.route)}
              aria-label=${item.label ?? item.route}
            >
              <ha-icon .icon=${item.icon}></ha-icon>
              ${item.label ? html`<span class="label">${item.label}</span>` : nothing}
            </button>
          `
        )}
      </nav>
    `;
  }

  private _navigate(path: string): void {
    if (window.location.pathname === path) return;
    history.pushState(null, '', path);
    fireEvent(this, 'location-changed', { replace: false });
    this._currentPath = path;
  }

  private _isActive(route: string): boolean {
    return this._currentPath === route;
  }
}
