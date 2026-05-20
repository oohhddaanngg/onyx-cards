import { describe, it, expect, beforeEach } from 'vitest';
import { registerCustomCard } from './register.js';

describe('registerCustomCard', () => {
  beforeEach(() => {
    delete (window as unknown as Record<string, unknown>).customCards;
  });

  it('creates customCards array on window when absent', () => {
    registerCustomCard({ type: 'test-card', name: 'Test Card', description: 'A test card' });
    const cards = (window as unknown as Record<string, unknown>).customCards as unknown[];
    expect(cards).toBeInstanceOf(Array);
    expect(cards).toHaveLength(1);
  });

  it('appends to an existing customCards array', () => {
    (window as unknown as Record<string, unknown>).customCards = [
      { type: 'existing-card', name: 'Existing', description: 'Already here' },
    ];
    registerCustomCard({ type: 'new-card', name: 'New Card', description: 'A new card' });
    const cards = (window as unknown as Record<string, unknown>).customCards as unknown[];
    expect(cards).toHaveLength(2);
    expect(cards[1]).toMatchObject({ type: 'new-card', name: 'New Card' });
  });

  it('includes optional fields when provided', () => {
    registerCustomCard({
      type: 'test-card',
      name: 'Test Card',
      description: 'A test card',
      preview: true,
      documentationURL: 'https://example.com',
    });
    const cards = (window as unknown as Record<string, unknown>).customCards as unknown[];
    expect(cards[0]).toMatchObject({ preview: true, documentationURL: 'https://example.com' });
  });
});
