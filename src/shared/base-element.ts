import { LitElement, type CSSResultGroup, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import type { HomeAssistant } from '../ha/types.js';
import { glassDarkDefaults } from './glass-styles.js';

export class OnyxBaseElement extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  private _darkMode?: boolean;

  static get styles(): CSSResultGroup {
    return [glassDarkDefaults];
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass') && this.hass) {
      const isDark = this.hass.themes?.darkMode ?? true;
      if (isDark !== this._darkMode) {
        this._darkMode = isDark;
        this._applyThemeDefaults(isDark);
      }
    }
  }

  private _applyThemeDefaults(isDark: boolean): void {
    if (isDark) {
      this.removeAttribute('light-mode');
    } else {
      this.setAttribute('light-mode', '');
    }
  }

  protected get isDarkMode(): boolean {
    return this._darkMode ?? true;
  }
}
