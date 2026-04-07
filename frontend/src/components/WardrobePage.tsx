import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  faceId: string | null;
  bodyTypeId: string | null;
  hairId?: string | null;
  skinColor?: string | null;
  hairColor?: string | null;
  equippedOutfitId: number | null;
  equippedPetId: number | null;
  itemAssetMap: Record<number, string>;
  onEquipChange: (outfitId: number | null, petId: number | null) => void;
}

export default function WardrobePage({
  authToken,
  faceId,
  bodyTypeId,
  hairId,
  skinColor,
  hairColor,
  equippedOutfitId,
  equippedPetId,
  itemAssetMap,
  onEquipChange,
}: Props) {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [localOutfit, setLocalOutfit] = useState<number | null>(equippedOutfitId);
  const [localPet, setLocalPet] = useState<number | null>(equippedPetId);

  useEffect(() => {
    setLocalOutfit(equippedOutfitId);
    setLocalPet(equippedPetId);
  }, [equippedOutfitId, equippedPetId]);

  useEffect(() => {
    if (!authToken) return;
    fetch('/api/shop', { headers: { Authorization: `Bearer ${authToken}` } })
      .then(r => r.json())
      .then((data: ShopItem[]) => setItems(data.filter(i => i.status !== 'locked')))
      .catch(() => {});
  }, [authToken]);

  const handleEquip = async (item: ShopItem) => {
    if (!authToken) return;
    const res = await fetch(`/api/wardrobe/equip/${item.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) return;
    const data: { equippedOutfitId: number | null; equippedPetId: number | null } = await res.json();
    setLocalOutfit(data.equippedOutfitId);
    setLocalPet(data.equippedPetId);
    onEquipChange(data.equippedOutfitId, data.equippedPetId);
    setItems(prev => prev.map(i => ({
      ...i,
      status: i.id === item.id ? 'equipped'
        : (item.type === i.type && i.status === 'equipped') ? 'owned'
        : i.status
    })));
  };

  const handleUnequip = async (slot: 'outfit' | 'pet') => {
    if (!authToken) return;
    const res = await fetch(`/api/wardrobe/unequip/${slot}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) return;
    const data: { equippedOutfitId: number | null; equippedPetId: number | null } = await res.json();
    setLocalOutfit(data.equippedOutfitId);
    setLocalPet(data.equippedPetId);
    onEquipChange(data.equippedOutfitId, data.equippedPetId);
    setItems(prev => prev.map(i => ({
      ...i,
      status: (slot === 'outfit' && i.type === 'OUTFIT' && i.status === 'equipped') ? 'owned'
        : (slot === 'pet' && i.type === 'PET' && i.status === 'equipped') ? 'owned'
        : i.status
    })));
  };

  const outfits = items.filter(i => i.type === 'OUTFIT');
  const pets = items.filter(i => i.type === 'PET');

  return (
    <div>
      <h2 className="text-3xl font-black mb-1">Wardrobe</h2>
      <p className="text-slate-500 mb-8">Customize your avatar.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
        {/* Live avatar preview */}
        <div className="flex flex-col items-center bg-white rounded-3xl border-2 border-slate-200 p-6 gap-4 sticky top-24">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Preview</p>
          <Avatar
            faceId={faceId}
            bodyTypeId={bodyTypeId}
            hairId={hairId}
            skinColor={skinColor}
            hairColor={hairColor}
            outfitAssetId={localOutfit ? itemAssetMap[localOutfit] : null}
            petAssetId={localPet ? itemAssetMap[localPet] : null}
            size="lg"
          />
          <div className="w-full space-y-1.5 text-center">
            {localOutfit && (
              <button
                onClick={() => handleUnequip('outfit')}
                className="w-full text-xs font-black text-slate-500 hover:text-red-500 hover:bg-red-50 py-1.5 rounded-xl transition-colors"
              >
                Remove outfit
              </button>
            )}
            {localPet && (
              <button
                onClick={() => handleUnequip('pet')}
                className="w-full text-xs font-black text-slate-500 hover:text-red-500 hover:bg-red-50 py-1.5 rounded-xl transition-colors"
              >
                Remove pet
              </button>
            )}
          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-6">
          {/* Outfits */}
          <section>
            <h3 className="font-black text-lg text-slate-800 mb-3">Outfits</h3>
            {outfits.length === 0 ? (
              <p className="text-sm text-slate-400">No outfits owned yet. Visit the shop!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {outfits.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isEquipped={item.id === localOutfit}
                    onEquip={() => handleEquip(item)}
                    onUnequip={() => handleUnequip('outfit')}
                    faceId={faceId}
                    bodyTypeId={bodyTypeId}
                    hairId={hairId}
                    skinColor={skinColor}
                    hairColor={hairColor}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Pets */}
          <section>
            <h3 className="font-black text-lg text-slate-800 mb-3">Pets</h3>
            {pets.length === 0 ? (
              <p className="text-sm text-slate-400">No pets owned yet. Visit the shop!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pets.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isEquipped={item.id === localPet}
                    onEquip={() => handleEquip(item)}
                    onUnequip={() => handleUnequip('pet')}
                    faceId={faceId}
                    bodyTypeId={bodyTypeId}
                    hairId={hairId}
                    skinColor={skinColor}
                    hairColor={hairColor}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  isEquipped,
  onEquip,
  onUnequip,
  faceId,
  bodyTypeId,
  hairId,
  skinColor,
  hairColor,
}: {
  item: ShopItem;
  isEquipped: boolean;
  onEquip: () => void;
  onUnequip: () => void;
  faceId?: string | null;
  bodyTypeId?: string | null;
  hairId?: string | null;
  skinColor?: string | null;
  hairColor?: string | null;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-2xl border-2 p-3 flex flex-col items-center gap-2 shadow-sm ${
        isEquipped ? 'border-brand-primary' : 'border-slate-200'
      }`}
    >
      <div className="w-14">
        {item.type === 'OUTFIT' ? (
          <Avatar outfitAssetId={item.assetId} faceId={faceId} bodyTypeId={bodyTypeId} hairId={hairId} skinColor={skinColor} hairColor={hairColor} size="sm" />
        ) : (
          <Avatar petAssetId={item.assetId} size="sm" />
        )}
      </div>
      <p className="font-black text-xs text-slate-700 text-center">{item.name}</p>
      {isEquipped ? (
        <button
          onClick={onUnequip}
          className="w-full text-[11px] font-black text-brand-primary bg-brand-primary/10 py-1.5 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          Equipped ✓
        </button>
      ) : (
        <button
          onClick={onEquip}
          className="w-full text-[11px] font-black bg-slate-100 hover:bg-slate-200 text-slate-600 py-1.5 rounded-xl transition-colors"
        >
          Equip
        </button>
      )}
    </motion.div>
  );
}
