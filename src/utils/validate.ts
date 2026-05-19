import { number, refine, type Struct } from 'superstruct';

export function boundedNumber(min: number, max: number): Struct<number, null> {
  return refine(number(), `number between ${min} and ${max}`, (value) => {
    if (!Number.isFinite(value)) return `Expected a finite number, but received ${value}`;
    if (value < min || value > max) return `Expected a number between ${min} and ${max}, but received ${value}`;
    return true;
  });
}

const CONTROL_CHARS = /[\x00-\x1f\x7f]/;

export function isValidCssColor(value: string): boolean {
  if (value.includes('\\')) return false;
  if (/\b(?:var|env|url)\s*\(/i.test(value)) return false;
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports('color', value);
  }
  return /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

export function isRelativePath(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (path.includes('\\')) return false;
  if (CONTROL_CHARS.test(path)) return false;
  return true;
}
