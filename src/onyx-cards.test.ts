import { describe, it, expect } from 'vitest';
import './onyx-cards.js';

describe('onyx-cards entrypoint', () => {
  it('registers onyx-entity-card', () => {
    expect(customElements.get('onyx-entity-card')).toBeDefined();
  });

  it('registers onyx-navbar', () => {
    expect(customElements.get('onyx-navbar')).toBeDefined();
  });
});
