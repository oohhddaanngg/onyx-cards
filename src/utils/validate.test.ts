import { describe, it, expect, afterEach, vi } from 'vitest';
import { assert } from 'superstruct';
import { boundedNumber, isValidCssColor, isRelativePath, isSafeUrl } from './validate.js';

describe('boundedNumber', () => {
  it('accepts values within range', () => {
    const s = boundedNumber(0, 30);
    expect(() => assert(0, s)).not.toThrow();
    expect(() => assert(15, s)).not.toThrow();
    expect(() => assert(30, s)).not.toThrow();
  });

  it('rejects value below minimum', () => {
    expect(() => assert(-1, boundedNumber(0, 30))).toThrow();
  });

  it('rejects value above maximum', () => {
    expect(() => assert(31, boundedNumber(0, 30))).toThrow();
  });

  it('rejects NaN', () => {
    expect(() => assert(NaN, boundedNumber(0, 30))).toThrow();
  });

  it('rejects Infinity', () => {
    expect(() => assert(Infinity, boundedNumber(0, 30))).toThrow();
  });

  it('rejects non-number types', () => {
    expect(() => assert('10' as unknown as number, boundedNumber(0, 30))).toThrow();
  });
});

describe('isValidCssColor', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('accepts 3-digit hex', () => {
    expect(isValidCssColor('#fff')).toBe(true);
  });

  it('accepts 6-digit hex', () => {
    expect(isValidCssColor('#ff00aa')).toBe(true);
  });

  it('accepts 8-digit hex with alpha', () => {
    expect(isValidCssColor('#ff00aa80')).toBe(true);
  });

  it('rejects value with backslash injection', () => {
    expect(isValidCssColor('red\\;background:url(evil)')).toBe(false);
  });

  it('rejects var() function', () => {
    expect(isValidCssColor('var(--evil)')).toBe(false);
  });

  it('rejects url() function', () => {
    expect(isValidCssColor('url(http://evil.com)')).toBe(false);
  });

  it('rejects env() function', () => {
    expect(isValidCssColor('env(EVIL)')).toBe(false);
  });

  it('regex fallback rejects named colors when CSS is undefined', () => {
    vi.stubGlobal('CSS', undefined);
    expect(isValidCssColor('red')).toBe(false);
  });

  it('regex fallback accepts hex when CSS is undefined', () => {
    vi.stubGlobal('CSS', undefined);
    expect(isValidCssColor('#ff0000')).toBe(true);
  });
});

describe('isRelativePath', () => {
  it('accepts a valid relative path', () => {
    expect(isRelativePath('/lovelace/0')).toBe(true);
  });

  it('rejects path not starting with /', () => {
    expect(isRelativePath('lovelace/0')).toBe(false);
  });

  it('rejects protocol-relative URL', () => {
    expect(isRelativePath('//evil.com')).toBe(false);
  });

  it('rejects path containing backslash', () => {
    expect(isRelativePath('/path\\evil')).toBe(false);
  });

  it('rejects path containing null byte', () => {
    expect(isRelativePath('/path\x00evil')).toBe(false);
  });
});

describe('isSafeUrl', () => {
  it('accepts https URL', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
  });

  it('accepts http URL', () => {
    expect(isSafeUrl('http://example.com')).toBe(true);
  });

  it('rejects javascript: URL', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects data: URL', () => {
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('rejects an invalid URL', () => {
    expect(isSafeUrl('not a url')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isSafeUrl('')).toBe(false);
  });
});
