import { describe, it, expect } from 'vitest';
import { assert, StructError } from 'superstruct';
import { entityCardConfigStruct } from './entity-card-config.js';

describe('entityCardConfigStruct', () => {
  it('accepts minimal valid config', () => {
    expect(() => assert({ type: 'onyx-entity-card' }, entityCardConfigStruct)).not.toThrow();
  });

  it('accepts full valid config', () => {
    const config = {
      type: 'onyx-entity-card',
      entity: 'light.living_room',
      name: 'Living Room',
      icon: 'mdi:lightbulb',
      icon_color: '#ff0000',
      show_state: true,
      secondary_info: 'brightness',
      glass_blur: 15,
      background_color: '#ffffff',
      accent_color: '#aabbcc',
      border_opacity: 0.5,
      corner_radius: 16,
    };
    expect(() => assert(config, entityCardConfigStruct)).not.toThrow();
  });

  it('rejects config missing required type', () => {
    expect(() => assert({ entity: 'light.test' }, entityCardConfigStruct)).toThrow(StructError);
  });

  it('accepts glass_blur at lower boundary (0)', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', glass_blur: 0 }, entityCardConfigStruct)
    ).not.toThrow();
  });

  it('accepts glass_blur at upper boundary (30)', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', glass_blur: 30 }, entityCardConfigStruct)
    ).not.toThrow();
  });

  it('rejects glass_blur below 0', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', glass_blur: -1 }, entityCardConfigStruct)
    ).toThrow();
  });

  it('rejects glass_blur above 30', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', glass_blur: 31 }, entityCardConfigStruct)
    ).toThrow();
  });

  it('accepts border_opacity at lower boundary (0)', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', border_opacity: 0 }, entityCardConfigStruct)
    ).not.toThrow();
  });

  it('accepts border_opacity at upper boundary (1)', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', border_opacity: 1 }, entityCardConfigStruct)
    ).not.toThrow();
  });

  it('rejects border_opacity above 1', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', border_opacity: 1.1 }, entityCardConfigStruct)
    ).toThrow();
  });

  it('accepts corner_radius at lower boundary (4)', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', corner_radius: 4 }, entityCardConfigStruct)
    ).not.toThrow();
  });

  it('accepts corner_radius at upper boundary (32)', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', corner_radius: 32 }, entityCardConfigStruct)
    ).not.toThrow();
  });

  it('rejects corner_radius below 4', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', corner_radius: 3 }, entityCardConfigStruct)
    ).toThrow();
  });

  it('rejects corner_radius above 32', () => {
    expect(() =>
      assert({ type: 'onyx-entity-card', corner_radius: 33 }, entityCardConfigStruct)
    ).toThrow();
  });
});
