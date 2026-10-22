// Verifies the translation files:
//  1. every locale has exactly the same keys as the default locale (hr)
//  2. every static key used in the code, e.g. t('title') after const t = useTranslations('login'), exists
// Run with: npm run check:i18n
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const locales = ['hr', 'en'];

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`]);

const messages = Object.fromEntries(
  locales.map(l => [l, new Set(flatten(JSON.parse(readFileSync(join(root, 'messages', `${l}.json`), 'utf8'))))]));

const errors = [];

for (const l of locales.slice(1)) {
  for (const key of messages[locales[0]]) if (!messages[l].has(key)) errors.push(`${l}.json is missing "${key}"`);
  for (const key of messages[l]) if (!messages[locales[0]].has(key)) errors.push(`${l}.json has extra key "${key}"`);
}

const sourceFiles = dir => readdirSync(dir).flatMap(name => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) return sourceFiles(path);
  return ['.ts', '.tsx'].includes(extname(path)) ? [path] : [];
});

for (const file of ['app', 'components', 'i18n'].flatMap(d => sourceFiles(join(root, d)))) {
  const code = readFileSync(file, 'utf8');
  const namespaces = new Map(
    [...code.matchAll(/const (\w+) = useTranslations\('([\w.]+)'\)/g)].map(m => [m[1], m[2]]));
  for (const [fn, ns] of namespaces) {
    for (const m of code.matchAll(new RegExp(`\\b${fn}\\('([\\w.]+)'`, 'g'))) {
      const key = `${ns}.${m[1]}`;
      if (!messages[locales[0]].has(key)) errors.push(`${file.slice(root.length)}: unknown key "${key}"`);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Translations OK (${messages[locales[0]].size} keys in ${locales.join(', ')})`);
