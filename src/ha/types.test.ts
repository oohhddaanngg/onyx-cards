import { describe, it, expect, vi } from 'vitest';
import type { HassEntity } from 'home-assistant-js-websocket';
import { fireEvent, isActive, isAvailable, isToggleable } from './types.js';

function makeEntity(entityId: string, state: string): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes: {},
    last_changed: '',
    last_updated: '',
    context: { id: '', user_id: null, parent_id: null },
  };
}

describe('fireEvent', () => {
  it('dispatches a custom event with the given detail', () => {
    const el = document.createElement('div');
    const handler = vi.fn();
    el.addEventListener('test-event', handler);

    fireEvent(el, 'test-event', { foo: 'bar' });

    expect(handler).toHaveBeenCalledOnce();
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({ foo: 'bar' });
  });

  it('bubbles and composes by default', () => {
    const el = document.createElement('div');
    const handler = vi.fn();
    el.addEventListener('test-event', handler);

    fireEvent(el, 'test-event');

    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it('respects custom bubbles and composed options', () => {
    const el = document.createElement('div');
    const handler = vi.fn();
    el.addEventListener('test-event', handler);

    fireEvent(el, 'test-event', undefined, { bubbles: false, composed: false });

    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.bubbles).toBe(false);
    expect(event.composed).toBe(false);
  });
});

describe('isActive', () => {
  it('returns true for on state', () => {
    expect(isActive(makeEntity('switch.test', 'on'))).toBe(true);
  });

  it('returns false for off state', () => {
    expect(isActive(makeEntity('switch.test', 'off'))).toBe(false);
  });

  it('returns false for unavailable', () => {
    expect(isActive(makeEntity('switch.test', 'unavailable'))).toBe(false);
  });

  it('returns false for unknown', () => {
    expect(isActive(makeEntity('switch.test', 'unknown'))).toBe(false);
  });

  it('returns false for idle', () => {
    expect(isActive(makeEntity('media_player.test', 'idle'))).toBe(false);
  });

  it('returns false for standby', () => {
    expect(isActive(makeEntity('media_player.test', 'standby'))).toBe(false);
  });

  it('returns true for locked (lock domain)', () => {
    expect(isActive(makeEntity('lock.front_door', 'locked'))).toBe(true);
  });

  it('returns false for unlocked (lock domain)', () => {
    expect(isActive(makeEntity('lock.front_door', 'unlocked'))).toBe(false);
  });
});

describe('isAvailable', () => {
  it('returns true for on state', () => {
    expect(isAvailable(makeEntity('switch.test', 'on'))).toBe(true);
  });

  it('returns true for off state', () => {
    expect(isAvailable(makeEntity('switch.test', 'off'))).toBe(true);
  });

  it('returns false for unavailable', () => {
    expect(isAvailable(makeEntity('switch.test', 'unavailable'))).toBe(false);
  });

  it('returns false for unknown', () => {
    expect(isAvailable(makeEntity('switch.test', 'unknown'))).toBe(false);
  });
});

describe('isToggleable', () => {
  it.each(['switch.test', 'input_boolean.test', 'light.test', 'fan.test', 'automation.test', 'script.test'])(
    'returns true for %s',
    (entityId) => {
      expect(isToggleable(entityId)).toBe(true);
    }
  );

  it.each(['sensor.test', 'binary_sensor.test', 'climate.test', 'lock.test', 'cover.test'])(
    'returns false for %s',
    (entityId) => {
      expect(isToggleable(entityId)).toBe(false);
    }
  );
});
