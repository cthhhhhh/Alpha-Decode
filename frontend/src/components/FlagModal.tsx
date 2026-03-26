import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flag, X, CheckCircle2 } from 'lucide-react';

interface Props {
    show: boolean;
    contentType: 'LESSON' | 'TERM' | 'QUESTION' | 'QUIZ';
    contentId: number;
    context?: string;
    onClose: () => void;
}

const FlagModal = ({ show, contentType, contentId, context, onClose }: Props) => {
    const [reasons, setReasons] = useState<string[]>([]);
    const [selectedReason, setSelectedReason] = useState('');
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!show) return;
        fetch('/api/flags/reasons')
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then((data: string[]) => setReasons(data))
            .catch(() => setReasons([]));
        // Reset state on open
        setSelectedReason('');
        setDetails('');
        setSubmitted(false);
        setError('');
    }, [show]);

    const handleSubmit = async () => {
        if (!selectedReason) { setError('Please select a reason.'); return; }
        setSubmitting(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required to report. Please log in.');
                setSubmitting(false);
                return;
            }

            const res = await fetch('/api/flags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    contentType,
                    contentId,
                    reason: selectedReason,
                    details,
                    contentContext: context
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const msg = await res.text();
                setError(msg || `Failed to submit report (Error ${res.status}).`);
            }
        } catch (err: any) {
            setError(`Network error: ${err.message || 'Please try again.'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const formatReason = (r: string) =>
        r.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        className="fixed inset-0 z-[201] flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-4"
                                >
                                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Thanks for the report!</h3>
                                    <p className="text-sm text-slate-500 mb-6">We'll review this content shortly.</p>
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-brand-primary text-white py-3 rounded-2xl font-black"
                                    >
                                        Done
                                    </button>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                                                <Flag size={18} className="text-red-500" />
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900">Flag Content</h3>
                                        </div>
                                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Reason dropdown */}
                                    <div className="mb-4">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                                            Reason *
                                        </label>
                                        <select
                                            value={selectedReason}
                                            onChange={e => setSelectedReason(e.target.value)}
                                            className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-brand-primary outline-none transition-colors bg-white"
                                        >
                                            <option value="">Select a reason...</option>
                                            {reasons.map(r => (
                                                <option key={r} value={r}>{formatReason(r)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Details */}
                                    <div className="mb-5">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                                            Details (optional)
                                        </label>
                                        <textarea
                                            value={details}
                                            onChange={e => setDetails(e.target.value)}
                                            placeholder="Any additional context..."
                                            maxLength={300}
                                            rows={3}
                                            className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 focus:border-brand-primary outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-xs text-red-500 font-bold mb-4">{error}</p>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !selectedReason}
                                        className="w-full bg-red-500 text-white py-3 rounded-2xl font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FlagModal;
