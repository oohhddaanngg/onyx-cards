import {
  type as struct,
  optional,
  string,
  number,
  boolean,
  any,
  type Infer,
} from 'superstruct';

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
  glass_blur: optional(number()),
  background_color: optional(string()),
  accent_color: optional(string()),
  border_opacity: optional(number()),
  corner_radius: optional(number()),
});

export type EntityCardConfig = Infer<typeof entityCardConfigStruct>;
