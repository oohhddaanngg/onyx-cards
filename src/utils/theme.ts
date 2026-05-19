import { isValidCssColor } from './validate.js';

export function applyGlassConfig(element: HTMLElement, config: Record<string, unknown>): void {
  const bgColor =
    typeof config.background_color === 'string' && isValidCssColor(config.background_color)
      ? config.background_color
      : undefined;
  const accentColor =
    typeof config.accent_color === 'string' && isValidCssColor(config.accent_color)
      ? config.accent_color
      : undefined;

  const props: Record<string, string | undefined> = {
    '--onyx-glass-blur':
      typeof config.glass_blur === 'number' && Number.isFinite(config.glass_blur)
        ? `${config.glass_blur}px`
        : undefined,
    '--onyx-backdrop-filter':
      typeof config.glass_blur === 'number' && Number.isFinite(config.glass_blur)
        ? `blur(${config.glass_blur}px)`
        : undefined,
    '--onyx-bg-color': bgColor,
    '--onyx-border-opacity':
      typeof config.border_opacity === 'number' && Number.isFinite(config.border_opacity)
        ? String(config.border_opacity)
        : undefined,
    '--onyx-accent-color': accentColor,
    '--onyx-radius':
      typeof config.corner_radius === 'number' && Number.isFinite(config.corner_radius)
        ? `${config.corner_radius}px`
        : undefined,
  };

  for (const [prop, value] of Object.entries(props)) {
    if (value != null) {
      element.style.setProperty(prop, value);
    } else {
      element.style.removeProperty(prop);
    }
  }
}
