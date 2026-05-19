interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
  documentationURL?: string;
}

export function registerCustomCard(params: CustomCardEntry): void {
  const win = window as unknown as Record<string, unknown>;
  const cards = (win.customCards as CustomCardEntry[]) ?? [];
  win.customCards = cards;
  cards.push(params);
}
