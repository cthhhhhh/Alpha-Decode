import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Coins } from 'lucide-react';
import Avatar from './avatar/Avatar';

interface ShopItem {
  id: number;
  name: string;
  assetId: string;
  type: 'OUTFIT' | 'PET';
  price: number;
  status: 'locked' | 'owned' | 'equipped';
}

interface Props {
  authToken: string | null;
  coins: number;
  itemAssetMap: Record<number, string>;
  onCoinsUpdate: (newCoins: number) => void;
  onEquip: (outfitId: number | null, petId: number | null) => void;
  hairId?: string | null;
}

type FilterTab = 'all' | 'outfit' | 'pet';

export default function ShopPage({ authToken, coins, onCoinsUpdate, onEquip, hairId }: Props) {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    if (!authToken) return;
    fetch('/api/shop', { headers: { Authorization: `Bearer ${authToken}` } })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, [authToken]);

  const handleBuy = async (item: ShopItem) => {
    if (!authToken) return;
    setError(null);
    const res = await fetch(`/api/shop/buy/${item.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) {
      const msg = await res.text();
      setError(msg || 'Purchase failed');
      return;
    }
    const data: { equippedOutfitId: number | null; equippedPetId: number | null } = await res.json();
    onEquip(data.equippedOutfitId, data.equippedPetId);
    onCoinsUpdate(coins - item.price);
    fetchItems();
  };

  const handleEquip = async (item: ShopItem) => {
    if (!authToken) return;
    const res = await fetch(`/api/wardrobe/equip/${item.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) return;
    const data: { equippedOutfitId: number | null; equippedPetId: number | null } = await res.json();
    onEquip(data.equippedOutfitId, data.equippedPetId);
    fetchItems();
  };

  const visible = items.filter(i => {
    if (filter === 'outfit') return i.type === 'OUTFIT';
    if (filter === 'pet') return i.type === 'PET';
    return true;
  });

  return (
    <div>
      <h2 className="text-3xl font-black mb-1">Shop</h2>
      <p className="text-slate-500 mb-6">Spend your coins on outfits and pets.</p>

      {/* Coins display */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-1.5 bg-brand-yellow/10 border border-brand-yellow/30 px-4 py-2 rounded-full">
          <Coins size={16} className="text-brand-yellow" />
          <span className="font-black text-sm text-slate-800">{coins} coins</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'outfit', 'pet'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-black capitalize transition-all ${
              filter === tab
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'outfit' ? 'Outfits' : 'Pets'}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 font-black text-center py-20 animate-pulse">Loading shop...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {visible.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className={`bg-white rounded-2xl border-2 p-4 flex flex-col items-center gap-3 shadow-sm transition-all ${
                item.status === 'equipped'
                  ? 'border-brand-primary'
                  : item.status === 'owned'
                  ? 'border-slate-300'
                  : 'border-slate-200'
              }`}
            >
              {/* Preview */}
              <div className="w-16">
                {item.type === 'OUTFIT' ? (
                  <Avatar outfitAssetId={item.assetId} faceId="face_1" bodyTypeId="body_1" hairId={hairId} size="sm" />
                ) : (
                  <Avatar petAssetId={item.assetId} size="sm" />
                )}
              </div>

              <div className="text-center">
                <p className="font-black text-sm text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-400 capitalize">{item.type.toLowerCase()}</p>
              </div>

              {/* Status badge + action */}
              {item.status === 'equipped' ? (
                <span className="w-full text-center text-xs font-black text-brand-primary bg-brand-primary/10 py-2 rounded-xl">
                  Equipped ✓
                </span>
              ) : item.status === 'owned' ? (
                <div className="w-full flex flex-col gap-1.5">
                  <span className="text-center text-xs font-black text-slate-400">Owned</span>
                  <button
                    onClick={() => handleEquip(item)}
                    className="w-full text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl transition-colors"
                  >
                    Equip
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  disabled={coins < item.price}
                  className={`w-full text-xs font-black py-2 rounded-xl transition-colors ${
                    coins >= item.price
                      ? 'bg-brand-yellow text-white hover:bg-yellow-500 shadow-sm'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    <Coins size={12} />
                    {item.price} coins
                  </span>
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
