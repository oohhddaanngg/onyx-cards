import {
  type as struct,
  optional,
  string,
  boolean,
  any,
  type Infer,
} from 'superstruct';
import { boundedNumber } from '../../utils/validate.js';

export const entityCardConfigStruct = struct({
  type: string(),
  entity: optional(string()),
  name: optional(string()),
  icon: optional(string()),
  icon_color: optional(string()),
  show_state: optional(boolean()),
  secondary_info: optional(string()),
  tap_action: optional(any()),
  hold_action: optional(any()),
  glass_blur: optional(boundedNumber(0, 30)),
  background_color: optional(string()),
  accent_color: optional(string()),
  border_opacity: optional(boundedNumber(0, 1)),
  corner_radius: optional(boundedNumber(4, 32)),
});

export type EntityCardConfig = Infer<typeof entityCardConfigStruct>;
