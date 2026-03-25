import { motion } from 'motion/react';

export function ConfirmModal({ 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  confirmClass = 'bg-brand-primary text-white', 
  onConfirm, 
  onCancel 
}: {
  title: string; 
  message: string; 
  confirmLabel?: string; 
  confirmClass?: string;
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7"
      >
        <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-2xl border-2 border-slate-200 font-black text-slate-500 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-2xl font-black transition-opacity hover:opacity-90 shadow-sm ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
