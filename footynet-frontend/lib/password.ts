// Password rules, kept in sync with RegisterDtoValidator on the backend.
// Each rule's key is a translation key in the "passwordRules" namespace.
export const PASSWORD_RULES = [
  { key: 'minLength', test: (p: string) => p.length >= 8 },
  { key: 'uppercase', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'digit', test: (p: string) => /[0-9]/.test(p) },
] as const;

export const isPasswordValid = (password: string) => PASSWORD_RULES.every(r => r.test(password));
