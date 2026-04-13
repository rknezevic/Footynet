import { api } from './api';

export interface LocationSuggestion {
  name: string;
  mapboxId: string;
  region?: string;
}

let sessionToken = crypto.randomUUID();

export const locationService = {
  async suggest(query: string): Promise<LocationSuggestion[]> {
    if (!query || query.length < 2) return [];
    const response = await api.get('/Location/suggest', {
      params: { q: query, sessionToken },
    });
    const data = response.data;
    return (data.suggestions || [])
      .filter((s: any) => s.feature_type === 'place')
      .map((s: any) => ({
        name: s.name,
        mapboxId: s.mapbox_id,
        region: s.context?.region?.name || '',
      }));
  },

  async retrieve(mapboxId: string): Promise<{ name: string; region: string }> {
    const response = await api.get(`/Location/retrieve/${mapboxId}`, {
      params: { sessionToken },
    });
    sessionToken = crypto.randomUUID();
    const feature = response.data.features?.[0];
    return {
      name: feature?.properties?.name || '',
      region: feature?.properties?.context?.region?.name || '',
    };
  },
};
