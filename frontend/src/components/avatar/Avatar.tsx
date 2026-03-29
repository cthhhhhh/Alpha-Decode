import type { ComponentType } from 'react';
import {
  Body1, Body2, Body3,
  Face1, Face2, Face3, Face4,
  HairShort, HairLong, HairCurly, HairSpiky,
  OutfitCasual, OutfitHoodie, OutfitTrack, OutfitSuit, OutfitSchool, OutfitWinter,
  PetCat, PetDog, PetRabbit,
} from './AvatarAssets';

// All face components accept an optional headOnly prop.
// headOnly=true uses a cropped viewBox to show just the face circle (for header / pickers).
const FACE_MAP: Record<string, ComponentType<{ headOnly?: boolean }>> = {
  face_1: Face1,
  face_2: Face2,
  face_3: Face3,
  face_4: Face4,
};

const BODY_MAP: Record<string, ComponentType> = {
  body_1: Body1,
  body_2: Body2,
  body_3: Body3,
};

const HAIR_MAP: Record<string, ComponentType<{ headOnly?: boolean }>> = {
  hair_short: HairShort,
  hair_long: HairLong,
  hair_curly: HairCurly,
  hair_spiky: HairSpiky,
};

const OUTFIT_MAP: Record<string, ComponentType> = {
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
  size = 'md',
  faceOnly = false,
  className = '',
}: AvatarProps) {
  const px = SIZE_PX[size];
  const FaceComp = FACE_MAP[faceId ?? ''] ?? Face1;
  const BodyComp = BODY_MAP[bodyTypeId ?? ''] ?? Body1;
  const HairComp = hairId ? HAIR_MAP[hairId] ?? null : null;
  const OutfitComp = outfitAssetId ? OUTFIT_MAP[outfitAssetId] ?? null : null;
  const PetComp = petAssetId ? PET_MAP[petAssetId] ?? null : null;

  // petOnly: no face/body/outfit provided — render just the pet in a square container
  const petOnly = !faceId && !bodyTypeId && !outfitAssetId && !!PetComp;
  if (petOnly) {
    return (
      <div style={{ width: px, height: px }}
           className="flex items-center justify-center">
        <div style={{ width: px * 0.9, height: px * 0.9 }}>
          <PetComp />
        </div>
      </div>
    );
  }

  // faceOnly: render face + hair cropped to head square (for Header / pickers)
  // Uses 100%/100% so the outer container controls the size.
  if (faceOnly) {
    return (
      <div
        className={`relative overflow-hidden w-full h-full ${className}`}
      >
        <FaceComp headOnly />
        {HairComp && (
          <div className="absolute inset-0">
            <HairComp headOnly />
          </div>
        )}
      </div>
    );
  }

  // Full avatar: all layers share the same viewBox="0 0 100 160" coordinate space,
  // stacked as absolute inset-0 divs inside a px × px*1.6 container.
  const bodyH = Math.round(px * 1.6);
  const petSize = Math.round(px * 0.45);

  return (
    <div className={`flex items-end gap-1 ${className}`}>
      {/* Layered character */}
      <div className="relative shrink-0" style={{ width: px, height: bodyH }}>
        {/* Body layer — neck, torso, legs */}
        <div className="absolute inset-0">
          <BodyComp />
        </div>
        {/* Outfit layer — clothes (transparent in head area) */}
        {OutfitComp && (
          <div className="absolute inset-0">
            <OutfitComp />
          </div>
        )}
        {/* Face layer — head circle + features (transparent in body area) */}
        <div className="absolute inset-0">
          <FaceComp />
        </div>
        {/* Hair layer — on top of face */}
        {HairComp && (
          <div className="absolute inset-0">
            <HairComp />
          </div>
        )}
      </div>

      {/* Pet beside body */}
      {PetComp && (
        <div className="self-end mb-1" style={{ width: petSize, height: petSize }}>
          <PetComp />
        </div>
      )}
    </div>
  );
}
