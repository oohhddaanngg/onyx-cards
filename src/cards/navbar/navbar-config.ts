import { object, type as struct, optional, string, array, any, type Infer } from 'superstruct';
import { boundedNumber } from '../../utils/validate.js';

export const navItemStruct = object({
  icon: string(),
  label: optional(string()),
  route: string(),
  tap_action: optional(any()),
  hold_action: optional(any()),
  double_tap_action: optional(any()),
});

export const navbarConfigStruct = struct({
  type: string(),
  items: optional(array(navItemStruct)),
  glass_blur: optional(boundedNumber(0, 30)),
  background_color: optional(string()),
  accent_color: optional(string()),
  border_opacity: optional(boundedNumber(0, 1)),
});

export type NavItem = Infer<typeof navItemStruct>;
export type NavbarConfig = Infer<typeof navbarConfigStruct>;
