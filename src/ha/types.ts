import type { HassConfig, HassEntity, HassServices } from 'home-assistant-js-websocket';

export type { HassEntity } from 'home-assistant-js-websocket';

export interface HaFormSchema {
  name: string;
  selector?: Record<string, unknown>;
  type?: string;
  schema?: HaFormSchema[];
  title?: string;
  icon?: string;
  context?: Record<string, string>;
  flatten?: boolean;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  services: HassServices;
  config: HassConfig;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: {
      entity_id?: string | string[];
      area_id?: string | string[];
      device_id?: string | string[];
      floor_id?: string | string[];
      label_id?: string | string[];
    }
  ) => Promise<void>;
  formatEntityState: (stateObj: HassEntity) => string;
  formatEntityAttributeValue: (stateObj: HassEntity, attribute: string) => string;
  locale: Record<string, unknown>;
  language: string;
  themes: {
    darkMode: boolean;
    theme: string;
  };
  hassUrl: (path: string) => string;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize?(): number | Promise<number>;
  getGridOptions?(): LovelaceGridOptions;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  lovelace?: Record<string, unknown>;
  setConfig(config: LovelaceCardConfig): void;
}

export interface LovelaceGridOptions {
  columns?: number | 'full';
  rows?: number;
  min_columns?: number;
  max_columns?: number;
  min_rows?: number;
  max_rows?: number;
}

export interface ActionConfig {
  action:
    | 'none'
    | 'toggle'
    | 'more-info'
    | 'navigate'
    | 'url'
    | 'perform-action'
    | 'call-service'
    | 'assist';
  entity?: string;
  navigation_path?: string;
  navigation_replace?: boolean;
  url_path?: string;
  perform_action?: string;
  data?: Record<string, unknown>;
  service?: string;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  pipeline_id?: string;
  start_listening?: boolean;
}

export interface ActionableConfig {
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export function fireEvent(
  el: HTMLElement,
  type: string,
  detail?: unknown,
  options?: { bubbles?: boolean; composed?: boolean }
): void {
  const event = new CustomEvent(type, {
    bubbles: options?.bubbles ?? true,
    composed: options?.composed ?? true,
    detail,
  });
  el.dispatchEvent(event);
}

export function isActive(stateObj: HassEntity): boolean {
  const domain = stateObj.entity_id.split('.')[0];
  const { state } = stateObj;
  if (domain === 'lock') return state === 'locked';
  return !['off', 'unavailable', 'unknown', 'idle', 'standby'].includes(state);
}

export function isAvailable(stateObj: HassEntity): boolean {
  return !['unavailable', 'unknown'].includes(stateObj.state);
}

export function isToggleable(entityId: string): boolean {
  const domain = entityId.split('.')[0];
  return ['switch', 'input_boolean', 'light', 'fan', 'automation', 'script'].includes(domain);
}
