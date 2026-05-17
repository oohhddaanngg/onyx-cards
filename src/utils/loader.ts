export function loadHaComponents(): void {
  if (!customElements.get('ha-form') || !customElements.get('hui-card-features-editor')) {
    const tileCard = customElements.get('hui-tile-card') as unknown as {
      getConfigElement?: () => unknown;
    };
    tileCard?.getConfigElement?.();
  }
  if (!customElements.get('ha-entity-picker')) {
    const entitiesCard = customElements.get('hui-entities-card') as unknown as {
      getConfigElement?: () => unknown;
    };
    entitiesCard?.getConfigElement?.();
  }
}
