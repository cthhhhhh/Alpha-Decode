import { useState } from 'react';
import { motion } from 'motion/react';

const ROLE_OPTIONS = [
  { role: 'USER',        label: 'User',        color: 'border-slate-300 text-slate-600 hover:bg-slate-50',         active: 'bg-slate-100 border-slate-400 text-slate-800' },
  { role: 'CONTRIBUTOR', label: 'Contributor', color: 'border-blue-200 text-blue-600 hover:bg-blue-50',            active: 'bg-blue-100 border-blue-500 text-blue-800' },
  { role: 'ADMIN',       label: 'Admin',       color: 'border-purple-200 text-purple-600 hover:bg-purple-50',      active: 'bg-purple-100 border-purple-500 text-purple-800' },
];

export function RolePickerModal({ 
  username, 
  currentRole, 
  onConfirm, 
  onCancel 
}: {
  username: string; 
  currentRole: string;
  onConfirm: (role: string) => void; 
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState(currentRole);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7"
      >
        <h3 className="text-xl font-black text-slate-800 mb-1">Change Role</h3>
        <p className="text-slate-400 font-medium text-sm mb-5">Select a new role for <span className="font-black text-slate-600">{username}</span></p>
        <div className="flex flex-col gap-2 mb-6">
          {ROLE_OPTIONS.map(opt => (
            <button
              key={opt.role}
              onClick={() => setSelected(opt.role)}
              className={`w-full py-3 px-4 rounded-2xl border-2 font-black text-left transition-all ${selected === opt.role ? opt.active + ' border-2' : opt.color + ' border-2 bg-white'}`}
            >
              <span className="text-base">{opt.label}</span>
              {opt.role === currentRole && <span className="ml-2 text-xs font-bold opacity-60">(current)</span>}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-2xl border-2 border-slate-200 font-black text-slate-500 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={selected === currentRole}
            className="flex-1 py-2.5 rounded-2xl bg-indigo-500 text-white font-black hover:opacity-90 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
}
