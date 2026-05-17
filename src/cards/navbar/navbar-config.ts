import { object, optional, string, number, array, type Infer } from 'superstruct';

export const navItemStruct = object({
  icon: string(),
  label: optional(string()),
  route: string(),
});

export const navbarConfigStruct = object({
  type: string(),
  items: optional(array(navItemStruct)),
  glass_blur: optional(number()),
  background_color: optional(string()),
  accent_color: optional(string()),
  border_opacity: optional(number()),
});

export type NavItem = Infer<typeof navItemStruct>;
export type NavbarConfig = Infer<typeof navbarConfigStruct>;
