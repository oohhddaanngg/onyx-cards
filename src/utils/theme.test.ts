import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { applyGlassConfig } from './theme.js';

describe('applyGlassConfig', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
  });

  afterEach(() => vi.unstubAllGlobals());

  it('sets --onyx-glass-blur and --onyx-backdrop-filter from glass_blur', () => {
    applyGlassConfig(el, { glass_blur: 10 });
    expect(el.style.getPropertyValue('--onyx-glass-blur')).toBe('10px');
    expect(el.style.getPropertyValue('--onyx-backdrop-filter')).toBe('blur(10px)');
  });

  it('sets --onyx-border-opacity from border_opacity', () => {
    applyGlassConfig(el, { border_opacity: 0.5 });
    expect(el.style.getPropertyValue('--onyx-border-opacity')).toBe('0.5');
  });

  it('sets --onyx-radius from corner_radius', () => {
    applyGlassConfig(el, { corner_radius: 20 });
    expect(el.style.getPropertyValue('--onyx-radius')).toBe('20px');
  });

  it('sets --onyx-bg-color from a valid hex background_color', () => {
    vi.stubGlobal('CSS', undefined);
    applyGlassConfig(el, { background_color: '#112233' });
    expect(el.style.getPropertyValue('--onyx-bg-color')).toBe('#112233');
  });

  it('sets --onyx-accent-color from a valid hex accent_color', () => {
    vi.stubGlobal('CSS', undefined);
    applyGlassConfig(el, { accent_color: '#aabbcc' });
    expect(el.style.getPropertyValue('--onyx-accent-color')).toBe('#aabbcc');
  });

  it('removes properties when values are absent', () => {
    applyGlassConfig(el, { glass_blur: 10, border_opacity: 0.5 });
    applyGlassConfig(el, {});
    expect(el.style.getPropertyValue('--onyx-glass-blur')).toBe('');
    expect(el.style.getPropertyValue('--onyx-border-opacity')).toBe('');
  });

  it('ignores non-finite glass_blur', () => {
    applyGlassConfig(el, { glass_blur: NaN });
    expect(el.style.getPropertyValue('--onyx-glass-blur')).toBe('');
    expect(el.style.getPropertyValue('--onyx-backdrop-filter')).toBe('');
  });

  it('ignores non-finite border_opacity', () => {
    applyGlassConfig(el, { border_opacity: Infinity });
    expect(el.style.getPropertyValue('--onyx-border-opacity')).toBe('');
  });

  it('ignores non-finite corner_radius', () => {
    applyGlassConfig(el, { corner_radius: -Infinity });
    expect(el.style.getPropertyValue('--onyx-radius')).toBe('');
  });
});
