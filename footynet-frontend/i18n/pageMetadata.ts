import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// Browser tab title for a route, e.g. "Oglasi · FootyNet", from the "pageTitles" messages namespace.
// Used by the small layout.tsx next to each page: the pages are client components, which can't export
// metadata. Written out in full ("absolute") because a nested route whose parent layout also sets a
// title (player/jobs → player/jobs/[id]) would otherwise lose the root layout's "%s · FootyNet" template.
export function pageTitle(key: string) {
  return async (): Promise<Metadata> => {
    const t = await getTranslations('pageTitles');
    return { title: { absolute: `${t(key)} · FootyNet` } };
  };
}
