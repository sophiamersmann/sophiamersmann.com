export const PATTERNS = ['cross', 'paper', 'boxes', 'diagonal'] as const;
export type Pattern = (typeof PATTERNS)[number];
