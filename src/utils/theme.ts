export function applyGlassConfig(element: HTMLElement, config: Record<string, unknown>): void {
  const props: Record<string, string | undefined> = {
    '--onyx-glass-blur': config.glass_blur != null ? `${config.glass_blur}px` : undefined,
    '--onyx-backdrop-filter': config.glass_blur != null ? `blur(${config.glass_blur}px)` : undefined,
    '--onyx-bg-color': config.background_color as string | undefined,
    '--onyx-border-opacity': config.border_opacity != null ? String(config.border_opacity) : undefined,
    '--onyx-accent-color': config.accent_color as string | undefined,
    '--onyx-radius': config.corner_radius != null ? `${config.corner_radius}px` : undefined,
  };

  for (const [prop, value] of Object.entries(props)) {
    if (value != null) {
      element.style.setProperty(prop, value);
    }
  }
}
