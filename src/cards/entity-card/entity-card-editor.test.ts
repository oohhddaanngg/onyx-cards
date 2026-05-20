import { describe, it, expect, afterEach } from 'vitest';
import type { HomeAssistant } from '../../ha/types.js';
import './entity-card-editor.js';

function mockHass(version: string): HomeAssistant {
  return {
    config: { version } as HomeAssistant['config'],
    states: {},
    services: {},
    themes: { darkMode: true, theme: 'default' },
    language: 'en',
    locale: {},
    callService: async () => {},
    formatEntityState: () => '',
    formatEntityAttributeValue: () => '',
    hassUrl: (p: string) => p,
  };
}

describe('OnyxEntityCardEditor', () => {
  let el: HTMLElement;

  afterEach(() => {
    el?.remove();
  });

  async function createEditor(version: string) {
    el = document.createElement('onyx-entity-card-editor');
    const editor = el as unknown as Record<string, unknown>;
    (editor.setConfig as (c: Record<string, unknown>) => void)({
      type: 'custom:onyx-entity-card',
      entity: 'light.test',
    });
    editor.hass = mockHass(version);
    document.body.appendChild(el);
    await (editor.updateComplete as Promise<boolean>);
    return el;
  }

  it('uses expandable schema on modern HA', async () => {
    const editor = await createEditor('2026.5.2');
    const haForm = editor.shadowRoot?.querySelector('ha-form') as unknown as {
      schema?: Array<{ type?: string }>;
    };
    expect(haForm?.schema?.some((s) => s.type === 'expandable')).toBe(true);
  });

  it('uses flat schema on HA below 2022.11', async () => {
    const editor = await createEditor('2022.10.5');
    const haForm = editor.shadowRoot?.querySelector('ha-form') as unknown as {
      schema?: Array<{ type?: string }>;
    };
    expect(haForm?.schema?.some((s) => s.type === 'expandable')).toBe(false);
  });
});
