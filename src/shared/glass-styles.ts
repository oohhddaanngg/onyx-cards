import { css } from 'lit';

export const glassDarkDefaults = css`
  :host {
    --onyx-glass-blur: 10px;
    --onyx-bg-color: rgba(0, 0, 0, 0.4);
    --onyx-border-color: rgba(255, 255, 255, 0.2);
    --onyx-border-opacity: 0.2;
    --onyx-accent-color: rgba(255, 255, 255, 0.8);
    --onyx-text-primary: rgba(255, 255, 255, 0.95);
    --onyx-text-secondary: rgba(255, 255, 255, 0.6);
    --onyx-icon-active: rgba(255, 255, 255, 0.9);
    --onyx-icon-inactive: rgba(255, 255, 255, 0.4);
    --onyx-radius: 16px;
    --onyx-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --onyx-glow-color: rgba(255, 255, 255, 0.08);
  }
`;

export const glassLightDefaults = css`
  :host {
    --onyx-glass-blur: 10px;
    --onyx-bg-color: rgba(255, 255, 255, 0.3);
    --onyx-border-color: rgba(0, 0, 0, 0.1);
    --onyx-border-opacity: 0.15;
    --onyx-accent-color: rgba(0, 0, 0, 0.7);
    --onyx-text-primary: rgba(0, 0, 0, 0.9);
    --onyx-text-secondary: rgba(0, 0, 0, 0.55);
    --onyx-icon-active: rgba(0, 0, 0, 0.85);
    --onyx-icon-inactive: rgba(0, 0, 0, 0.35);
    --onyx-radius: 16px;
    --onyx-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --onyx-glow-color: rgba(0, 0, 0, 0.04);
  }
`;

export const glassCardStyles = css`
  ha-card {
    background: var(--onyx-bg-color);
    backdrop-filter: blur(var(--onyx-glass-blur));
    -webkit-backdrop-filter: blur(var(--onyx-glass-blur));
    border: 1px solid var(--onyx-border-color);
    border-radius: var(--onyx-radius);
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 var(--onyx-glow-color);
    color: var(--onyx-text-primary);
    overflow: hidden;
    transition:
      box-shadow var(--onyx-transition),
      border-color var(--onyx-transition);
  }
`;
