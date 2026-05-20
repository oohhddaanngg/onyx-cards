import { describe, it, expect } from 'vitest';
import { isVersionAtLeast, MIN_VERSION_EXPANDABLE } from './version.js';

describe('isVersionAtLeast', () => {
  it('returns true when version equals minimum exactly', () => {
    expect(isVersionAtLeast('2022.11.0', [2022, 11, 0])).toBe(true);
  });

  it('returns true when major exceeds minimum', () => {
    expect(isVersionAtLeast('2023.1.0', [2022, 11, 0])).toBe(true);
  });

  it('returns true when minor exceeds minimum', () => {
    expect(isVersionAtLeast('2022.12.0', [2022, 11, 0])).toBe(true);
  });

  it('returns true when patch exceeds minimum', () => {
    expect(isVersionAtLeast('2022.11.1', [2022, 11, 0])).toBe(true);
  });

  it('returns false when major is below minimum', () => {
    expect(isVersionAtLeast('2021.12.0', [2022, 11, 0])).toBe(false);
  });

  it('returns false when minor is below minimum', () => {
    expect(isVersionAtLeast('2022.10.5', [2022, 11, 0])).toBe(false);
  });

  it('returns false when patch is below minimum', () => {
    expect(isVersionAtLeast('2022.11.0', [2022, 11, 1])).toBe(false);
  });

  it('returns true for two-part version at minimum', () => {
    expect(isVersionAtLeast('2022.11', [2022, 11, 0])).toBe(true);
  });

  it('returns false for undefined version', () => {
    expect(isVersionAtLeast(undefined, [2022, 11, 0])).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isVersionAtLeast('', [2022, 11, 0])).toBe(false);
  });

  it('returns false for non-numeric version string', () => {
    expect(isVersionAtLeast('abc.def.ghi', [2022, 11, 0])).toBe(false);
  });

  it('returns false for single-part version', () => {
    expect(isVersionAtLeast('2022', [2022, 11, 0])).toBe(false);
  });

  it('handles HA beta version format', () => {
    expect(isVersionAtLeast('2024.11.0b0', [2022, 11, 0])).toBe(true);
  });

  it('handles HA dev version format', () => {
    expect(isVersionAtLeast('2024.11.0dev0', [2022, 11, 0])).toBe(true);
  });

  it('returns false for malformed trailing dot', () => {
    expect(isVersionAtLeast('2022.11.', [2022, 11, 0])).toBe(false);
  });

  it('returns false for double dot', () => {
    expect(isVersionAtLeast('2022..11', [2022, 11, 0])).toBe(false);
  });
});

describe('MIN_VERSION_EXPANDABLE', () => {
  it('is [2022, 11, 0]', () => {
    expect(MIN_VERSION_EXPANDABLE).toEqual([2022, 11, 0]);
  });
});
