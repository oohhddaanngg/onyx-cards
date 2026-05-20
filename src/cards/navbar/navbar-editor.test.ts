import { describe, it, expect, afterEach } from 'vitest';
import type { HomeAssistant } from '../../ha/types.js';
import './navbar-editor.js';

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

describe('OnyxNavbarEditor', () => {
  let el: HTMLElement;

  afterEach(() => {
    el?.remove();
  });

  async function createEditor(version: string) {
    el = document.createElement('onyx-navbar-editor');
    const editor = el as unknown as Record<string, unknown>;
    (editor.setConfig as (c: Record<string, unknown>) => void)({
      type: 'custom:onyx-navbar',
      items: [{ icon: 'mdi:home', label: 'Home', route: '/lovelace/0' }],
    });
    editor.hass = mockHass(version);
    document.body.appendChild(el);
    await (editor.updateComplete as Promise<boolean>);
    return el;
  }

  it('uses expandable glass schema on modern HA', async () => {
    const editor = await createEditor('2026.5.2');
    const forms = editor.shadowRoot?.querySelectorAll('ha-form') ?? [];
    const glassForm = forms[forms.length - 1] as unknown as {
      schema?: Array<{ type?: string }>;
    };
    expect(glassForm?.schema?.some((s) => s.type === 'expandable')).toBe(true);
  });

  it('uses flat glass schema on HA below 2022.11', async () => {
    const editor = await createEditor('2022.10.5');
    const forms = editor.shadowRoot?.querySelectorAll('ha-form') ?? [];
    const glassForm = forms[forms.length - 1] as unknown as {
      schema?: Array<{ type?: string }>;
    };
    expect(glassForm?.schema?.some((s) => s.type === 'expandable')).toBe(false);
  });
});
