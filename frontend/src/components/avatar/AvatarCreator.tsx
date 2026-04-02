import { useState } from 'react';
import { motion } from 'motion/react';
import Avatar from './Avatar';

interface Props {
  onComplete: (faceId: string, bodyTypeId: string, hairId: string, skinColor: string, hairColor: string) => void;
}

const FACES = ['face_1', 'face_2', 'face_3', 'face_4'];
const BODIES = ['body_1', 'body_2', 'body_3'];
const HAIRS = ['hair_none', 'hair_short', 'hair_long', 'hair_bob', 'hair_curly', 'hair_spiky'];

const FACE_LABELS = ['Rosy', 'Cool', 'Warm', 'Freckled'];
const BODY_LABELS = ['Slim', 'Medium', 'Broad'];
const HAIR_LABELS = ['Bald', 'Short', 'Long', 'Bob', 'Curly', 'Spiky'];

const SKIN_COLORS = ['#ffe0bd', '#f1c27d', '#d4a574', '#8d6e4c', '#8d5524', '#5c3317'];
const SKIN_LABELS = ['Light', 'Fair', 'Medium', 'Tan', 'Brown', 'Deep'];
const HAIR_COLORS = ['#1a1a1a', '#2c1810', '#7b3f00', '#e8c547', '#c0392b', '#888888'];
const HAIR_COLOR_LABELS = ['Black', 'Dark Brown', 'Brown', 'Blonde', 'Red', 'Gray'];

export default function AvatarCreator({ onComplete }: Props) {
  const [selectedFace, setSelectedFace] = useState('face_1');
  const [selectedBody, setSelectedBody] = useState('body_1');
  const [selectedHair, setSelectedHair] = useState('hair_short');
  const [selectedSkin, setSelectedSkin] = useState('#f1c27d');
  const [selectedHairColor, setSelectedHairColor] = useState('#2c1810');

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 flex items-start justify-center p-4 py-8 overflow-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-black text-slate-900 text-center mb-1">Create Your Avatar</h1>
        <p className="text-slate-500 text-center text-sm mb-8">Pick a face and body — you can change outfits later!</p>

        {/* Live preview */}
        <div className="flex justify-center mb-8">
          <Avatar
            faceId={selectedFace}
            bodyTypeId={selectedBody}
            hairId={selectedHair === 'hair_none' ? null : selectedHair}
            skinColor={selectedSkin}
            hairColor={selectedHairColor}
            size="xl"
          />
        </div>

        {/* Hair picker */}
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Choose Hair</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {HAIRS.map((hairId, i) => (
              <motion.button
                key={hairId}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedHair(hairId)}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all ${
                  selectedHair === hairId
                    ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10">
                  <Avatar
                    faceId={selectedFace}
                    bodyTypeId="body_1"
                    hairId={hairId === 'hair_none' ? null : hairId}
                    skinColor={selectedSkin}
                    hairColor={selectedHairColor}
                    faceOnly
                    size="sm"
                  />
                </div>
                <span className="text-[9px] font-black text-slate-500">{HAIR_LABELS[i]}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Hair Color picker */}
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Choose Hair Color</p>
          <div className="flex gap-2 flex-wrap">
            {HAIR_COLORS.map((color, i) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedHairColor(color)}
                title={HAIR_COLOR_LABELS[i]}
                className={`w-9 h-9 rounded-full border-4 transition-all ${
                  selectedHairColor === color
                    ? 'border-brand-primary shadow-md shadow-brand-primary/30 scale-110'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Skin Color picker */}
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Choose Skin Color</p>
          <div className="flex gap-2 flex-wrap">
            {SKIN_COLORS.map((color, i) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedSkin(color)}
                title={SKIN_LABELS[i]}
                className={`w-9 h-9 rounded-full border-4 transition-all ${
                  selectedSkin === color
                    ? 'border-brand-primary shadow-md shadow-brand-primary/30 scale-110'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Face picker */}
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Choose Face</p>
          <div className="grid grid-cols-4 gap-3">
            {FACES.map((faceId, i) => (
              <motion.button
                key={faceId}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedFace(faceId)}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all ${
                  selectedFace === faceId
                    ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12">
                  <Avatar faceId={faceId} skinColor={selectedSkin} faceOnly size="sm" />
                </div>
                <span className="text-[10px] font-black text-slate-500">{FACE_LABELS[i]}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Body picker */}
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Choose Body</p>
          <div className="grid grid-cols-3 gap-3">
            {BODIES.map((bodyId, i) => (
              <motion.button
                key={bodyId}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedBody(bodyId)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                  selectedBody === bodyId
                    ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-14 h-16 overflow-hidden">
                  <Avatar faceId="face_1" bodyTypeId={bodyId} skinColor={selectedSkin} size="sm" />
                </div>
                <span className="text-[10px] font-black text-slate-500">{BODY_LABELS[i]}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onComplete(selectedFace, selectedBody, selectedHair, selectedSkin, selectedHairColor)}
          className="w-full bg-brand-primary text-white font-black text-base py-4 rounded-2xl shadow-lg shadow-brand-primary/30"
        >
          Continue →
        </motion.button>
      </div>
    </div>
  );
}
