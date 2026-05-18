import { css } from 'lit';

export const glassDarkDefaults = css`
  :host {
    --onyx-glass-blur: 10px;
    --onyx-bg-color: var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.4)));
    --onyx-border-color: var(--ha-card-border-color, var(--divider-color, rgba(255, 255, 255, 0.2)));
    --onyx-border-opacity: 0.2;
    --onyx-accent-color: var(--primary-color, rgba(255, 255, 255, 0.8));
    --onyx-text-primary: var(--primary-text-color, rgba(255, 255, 255, 0.95));
    --onyx-text-secondary: var(--secondary-text-color, rgba(255, 255, 255, 0.6));
    --onyx-icon-active: var(--state-icon-active-color, rgba(255, 255, 255, 0.9));
    --onyx-icon-inactive: var(--state-icon-color, rgba(255, 255, 255, 0.4));
    --onyx-radius: var(--ha-card-border-radius, var(--ha-border-radius-lg, 16px));
    --onyx-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --onyx-glow-color: rgba(255, 255, 255, 0.08);
  }
`;

export const glassLightDefaults = css`
  :host([light-mode]) {
    --onyx-bg-color: var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.3)));
    --onyx-border-color: var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.1)));
    --onyx-border-opacity: 0.15;
    --onyx-accent-color: var(--primary-color, rgba(0, 0, 0, 0.7));
    --onyx-text-primary: var(--primary-text-color, rgba(0, 0, 0, 0.9));
    --onyx-text-secondary: var(--secondary-text-color, rgba(0, 0, 0, 0.55));
    --onyx-icon-active: var(--state-icon-active-color, rgba(0, 0, 0, 0.85));
    --onyx-icon-inactive: var(--state-icon-color, rgba(0, 0, 0, 0.35));
    --onyx-glow-color: rgba(0, 0, 0, 0.04);
  }
`;

export const glassCardStyles = css`
  ha-card {
    background: var(--onyx-bg-color);
    backdrop-filter: var(--onyx-backdrop-filter, var(--ha-card-backdrop-filter, blur(var(--onyx-glass-blur))));
    -webkit-backdrop-filter: var(--onyx-backdrop-filter, var(--ha-card-backdrop-filter, blur(var(--onyx-glass-blur))));
    border: var(--ha-card-border-width, 1px) solid var(--onyx-border-color);
    border-radius: var(--onyx-radius);
    box-shadow: var(
      --ha-card-box-shadow,
      0 4px 24px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 var(--onyx-glow-color)
    );
    color: var(--onyx-text-primary);
    overflow: hidden;
    transition:
      box-shadow var(--onyx-transition),
      border-color var(--onyx-transition);
  }
`;
