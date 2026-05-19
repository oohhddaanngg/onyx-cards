import {
  fireEvent,
  isToggleable,
  type ActionableConfig,
  type HomeAssistant,
  type ActionConfig,
} from '../ha/types.js';
import { isRelativePath, isSafeUrl } from './validate.js';

export function handleAction(
  element: HTMLElement,
  hass: HomeAssistant,
  config: ActionableConfig,
  actionType: 'tap' | 'hold' | 'double_tap'
): void {
  let actionConfig: ActionConfig | undefined;
  if (actionType === 'tap') actionConfig = config.tap_action;
  else if (actionType === 'hold') actionConfig = config.hold_action;
  else actionConfig = config.double_tap_action;

  if (!actionConfig || actionConfig.action === 'none') return;

  const entityId = actionConfig.entity ?? config.entity;

  switch (actionConfig.action) {
    case 'toggle':
      if (entityId && isToggleable(entityId)) {
        hass
          .callService('homeassistant', 'toggle', {}, { entity_id: entityId })
          .catch((err: unknown) => {
            console.warn('[onyx-cards] toggle failed:', err);
          });
      } else if (entityId) {
        fireEvent(element, 'hass-more-info', { entityId });
      }
      break;

    case 'more-info':
      if (entityId) {
        fireEvent(element, 'hass-more-info', { entityId });
      }
      break;

    case 'navigate': {
      const path = actionConfig.navigation_path;
      if (!path || typeof path !== 'string' || !isRelativePath(path)) break;
      const currentFull =
        window.location.pathname + window.location.search + window.location.hash;
      if (currentFull === path) break;
      if (actionConfig.navigation_replace) {
        history.replaceState(null, '', path);
      } else {
        history.pushState(null, '', path);
      }
      fireEvent(element, 'location-changed', { replace: actionConfig.navigation_replace ?? false });
      break;
    }

    case 'url': {
      const url = actionConfig.url_path;
      if (!url || typeof url !== 'string' || !isSafeUrl(url)) break;
      window.open(url, '_blank', 'noopener');
      break;
    }

    case 'perform-action': {
      const performAction = actionConfig.perform_action;
      if (!performAction || typeof performAction !== 'string') break;
      const dotIndex = performAction.indexOf('.');
      if (dotIndex <= 0 || dotIndex === performAction.length - 1) break;
      const domain = performAction.slice(0, dotIndex);
      const service = performAction.slice(dotIndex + 1);
      const data = isPlainObject(actionConfig.data) ? actionConfig.data : {};
      const target = isPlainObject(actionConfig.target)
        ? (actionConfig.target as Parameters<typeof hass.callService>[3])
        : undefined;
      hass.callService(domain, service, data, target).catch((err: unknown) => {
        console.warn('[onyx-cards] perform-action failed:', err);
      });
      break;
    }

    case 'call-service': {
      const svc = actionConfig.service;
      if (!svc || typeof svc !== 'string') break;
      const dotIdx = svc.indexOf('.');
      if (dotIdx <= 0 || dotIdx === svc.length - 1) break;
      const domain = svc.slice(0, dotIdx);
      const service = svc.slice(dotIdx + 1);
      const data = isPlainObject(actionConfig.service_data) ? actionConfig.service_data : {};
      const target = isPlainObject(actionConfig.target)
        ? (actionConfig.target as Parameters<typeof hass.callService>[3])
        : undefined;
      hass.callService(domain, service, data, target).catch((err: unknown) => {
        console.warn('[onyx-cards] call-service failed:', err);
      });
      break;
    }

    case 'assist':
      fireEvent(element, 'hass-action', { config, action: actionType });
      break;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
