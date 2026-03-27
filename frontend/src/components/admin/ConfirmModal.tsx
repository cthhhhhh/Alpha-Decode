import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Info, Trash2, X,UserCheck2} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelText?: string;
  type: 'danger' | 'info' | 'warning'| 'success'; //danger-> delete, warning->ban, success-> unban
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}: Props) {
  const iconMap = {
    danger: <Trash2 className="text-red-500" size={24} />,
    warning: <AlertTriangle className="text-brand-yellow" size={24} />,
    info: <Info className="text-brand-primary" size={24} />,
    success: <UserCheck2 className="text-green-500" size={24} />
  };

  const buttonColors = {
    danger: 'bg-red-500 hover:bg-red-600 shadow-[0_4px_0_#b91c1c]',
    warning: 'bg-brand-yellow hover:bg-yellow-500 shadow-[0_4px_0_#ca8a04]',
    info: 'bg-brand-primary hover:bg-brand-primary/90 shadow-[0_4px_0_#3d8b02]',
    success: 'bg-green-500 hover:bg-green-600 shadow-[0_4px_0_#15803d]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-50 overflow-hidden"
          >
            {/* Header with icon */}
            <div className="pt-8 pb-4 px-8 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 ${
                type === 'danger' ? 'bg-red-50' : 
                type === 'warning' ? 'bg-brand-yellow/10' :
                type == 'info' ? 'bg-brand-primary/10' : 'bg-green/10'
              }`}>
                {iconMap[type]}
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
              <p className="mt-2 text-slate-500 font-bold leading-relaxed">{message}</p>
            </div>

            {/* Actions */}
            <div className="p-8 pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full py-4 rounded-2xl text-white font-black text-lg transition-all active:translate-y-1 active:shadow-none ${buttonColors[type]}`}
              >
                {confirmLabel.toUpperCase()}
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl text-slate-400 font-black text-lg hover:bg-slate-50 transition-all uppercase tracking-wider"
              >
                {cancelText}
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
