export const locales = ['hr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'hr';

// The chosen language is kept in this cookie so the server can render the right messages
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
