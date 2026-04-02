import type { ComponentType } from 'react';
import {
  Body1, Body2, Body3,
  Face1, Face2, Face3, Face4,
  HairShort, HairLong, HairLongBack, HairBob, HairBobBack, HairCurly, HairSpiky,
  OutfitCasual, OutfitHoodie, OutfitTrack, OutfitSuit, OutfitSchool, OutfitWinter,
  PetCat, PetDog, PetRabbit,
} from './AvatarAssets';

const FACE_MAP: Record<string, ComponentType<{ headOnly?: boolean; skinColor?: string }>> = {
  face_1: Face1,
  face_2: Face2,
  face_3: Face3,
  face_4: Face4,
};

const BODY_MAP: Record<string, ComponentType<{ skinColor?: string }>> = {
  body_1: Body1,
  body_2: Body2,
  body_3: Body3,
};

// Front hair layers — rendered on top of the face
const HAIR_MAP: Record<string, ComponentType<{ headOnly?: boolean; color?: string }>> = {
  hair_short: HairShort,
  hair_long: HairLong,
  hair_bob: HairBob,
  hair_curly: HairCurly,
  hair_spiky: HairSpiky,
};

// Back hair layers — rendered behind body and face for natural depth
const HAIR_BACK_MAP: Record<string, ComponentType<{ headOnly?: boolean; color?: string }>> = {
  hair_long: HairLongBack,
  hair_bob: HairBobBack,
};

const OUTFIT_MAP: Record<string, ComponentType<{ bodyTypeId?: string }>> = {
  outfit_casual: OutfitCasual,
  outfit_hoodie: OutfitHoodie,
  outfit_track: OutfitTrack,
  outfit_suit: OutfitSuit,
  outfit_school: OutfitSchool,
  outfit_winter: OutfitWinter,
};

const PET_MAP: Record<string, ComponentType> = {
  pet_cat: PetCat,
  pet_dog: PetDog,
  pet_rabbit: PetRabbit,
};

const SIZE_PX = { sm: 48, md: 80, lg: 120, xl: 200 } as const;

interface AvatarProps {
  faceId?: string | null;
  bodyTypeId?: string | null;
  hairId?: string | null;
  outfitAssetId?: string | null;
  petAssetId?: string | null;
  skinColor?: string | null;
  hairColor?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  faceOnly?: boolean;
  className?: string;
}

export default function Avatar({
  faceId,
  bodyTypeId,
  hairId,
  outfitAssetId,
  petAssetId,
  skinColor,
  hairColor,
  size = 'md',
  faceOnly = false,
  className = '',
}: AvatarProps) {
  const px = SIZE_PX[size];
  const FaceComp = FACE_MAP[faceId ?? ''] ?? Face1;
  const BodyComp = BODY_MAP[bodyTypeId ?? ''] ?? Body1;
  const HairComp = hairId ? HAIR_MAP[hairId] ?? null : null;
  const HairBackComp = hairId ? HAIR_BACK_MAP[hairId] ?? null : null;
  const OutfitComp = outfitAssetId ? OUTFIT_MAP[outfitAssetId] ?? null : null;
  const PetComp = petAssetId ? PET_MAP[petAssetId] ?? null : null;

  // petOnly: no face/body/outfit provided — render just the pet in a square container
  const petOnly = !faceId && !bodyTypeId && !outfitAssetId && !!PetComp;
  if (petOnly) {
    return (
      <div style={{ width: px, height: px }} className="flex items-center justify-center">
        <div style={{ width: px * 0.9, height: px * 0.9 }}>
          <PetComp />
        </div>
      </div>
    );
  }

  // faceOnly: render face + front hair cropped to head square (for Header / pickers)
  // Back hair is omitted here — not needed for thumbnails and keeps face clearly visible
  if (faceOnly) {
    return (
      <div className={`relative overflow-hidden w-full h-full ${className}`}>
        <FaceComp headOnly skinColor={skinColor ?? undefined} />
        {HairComp && (
          <div className="absolute inset-0">
            <HairComp headOnly color={hairColor ?? undefined} />
          </div>
        )}
      </div>
    );
  }

  // Full avatar render order:
  // 1. Back hair   — behind everything (sticks out above/beside body)
  // 2. Body        — torso, arms, legs
  // 3. Outfit      — clothes on top of body
  // 4. Face        — head circle on top
  // 5. Front hair  — on top of face
  const bodyH = Math.round(px * 1.6);
  const petSize = Math.round(px * 0.45);

  return (
    <div className={`flex items-end gap-1 ${className}`}>
      <div className="relative shrink-0" style={{ width: px, height: bodyH }}>
        {/* 1. Back hair — behind body */}
        {HairBackComp && (
          <div className="absolute inset-0">
            <HairBackComp color={hairColor ?? undefined} />
          </div>
        )}
        {/* 2. Body */}
        <div className="absolute inset-0">
          <BodyComp skinColor={skinColor ?? undefined} />
        </div>
        {/* 3. Outfit — scaled to match body type */}
        {OutfitComp && (
          <div className="absolute inset-0">
            <OutfitComp bodyTypeId={bodyTypeId ?? undefined} />
          </div>
        )}
        {/* 4. Face */}
        <div className="absolute inset-0">
          <FaceComp skinColor={skinColor ?? undefined} />
        </div>
        {/* 5. Front hair */}
        {HairComp && (
          <div className="absolute inset-0">
            <HairComp color={hairColor ?? undefined} />
          </div>
        )}
      </div>

      {PetComp && (
        <div className="self-end mb-1" style={{ width: petSize, height: petSize }}>
          <PetComp />
        </div>
      )}
    </div>
  );
}
