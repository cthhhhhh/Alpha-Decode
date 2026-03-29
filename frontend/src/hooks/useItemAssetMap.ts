import { useState, useEffect } from 'react';

export function useItemAssetMap(authToken: string | null): Record<number, string> {
  const [assetMap, setAssetMap] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!authToken) {
      setAssetMap({});
      return;
    }
    fetch('/api/shop', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then((items: { id: number; assetId: string }[]) => {
        const map: Record<number, string> = {};
        for (const item of items) {
          map[item.id] = item.assetId;
        }
        setAssetMap(map);
      })
      .catch(() => {});
  }, [authToken]);

  return assetMap;
}
