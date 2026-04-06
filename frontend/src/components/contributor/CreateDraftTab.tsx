import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Send, Save, X } from 'lucide-react';
import type { Draft } from './types';
import { authHeaders } from '../admin/utils';
import { ConfirmModal } from '../admin/ConfirmModal';

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  INTRO: { label: 'Intro', color: 'bg-blue-100 text-blue-700' },
  SELECT: { label: 'Select', color: 'bg-purple-100 text-purple-700' },
  TRANSLATE: { label: 'Translate', color: 'bg-orange-100 text-orange-700' },
};

const EMPTY_Q_FORM = {
  question_type: 'SELECT' as 'INTRO' | 'SELECT' | 'TRANSLATE',
  title: '',
  content: '',
  explanation: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  wordbank: [''],
  target: '',
};

type QForm = typeof EMPTY_Q_FORM;

function QuestionFormFields({ form, setForm }: { form: QForm; setForm: React.Dispatch<React.SetStateAction<QForm>> }) {
  const inp = 'w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-400 outline-none bg-white';

  const setOption = (i: number, val: string) =>
    setForm(f => { const opts = [...f.options]; opts[i] = val; return { ...f, options: opts }; });
  const addOption = () => setForm(f => ({ ...f, options: [...f.options, ''] }));
  const removeOption = (i: number) =>
    setForm(f => {
      const opts = f.options.filter((_, idx) => idx !== i);
      return { ...f, options: opts, correctAnswer: Math.min(f.correctAnswer, opts.length - 1) };
    });
  const setWb = (i: number, val: string) =>
    setForm(f => { const wb = [...f.wordbank]; wb[i] = val; return { ...f, wordbank: wb }; });
  const addWb = () => setForm(f => ({ ...f, wordbank: [...f.wordbank, ''] }));
  const removeWb = (i: number) =>
    setForm(f => ({ ...f, wordbank: f.wordbank.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-3">
      <input className={inp} placeholder="Question title / prompt" value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      <input className={inp} placeholder="Content (optional extra text)" value={form.content}
        onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
      <input className={inp} placeholder="Explanation (shown after answering)" value={form.explanation}
        onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} />

      {form.question_type === 'SELECT' && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wide">Answer Options</p>
          {form.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name="correctAnswer" checked={form.correctAnswer === i}
                onChange={() => setForm(f => ({ ...f, correctAnswer: i }))}
                className="accent-blue-500 w-4 h-4 shrink-0" title="Mark as correct" />
              <input className={`${inp} flex-1`} placeholder={`Option ${i + 1}`} value={opt}
                onChange={e => setOption(i, e.target.value)} />
              {form.options.length > 2 && (
                <button type="button" onClick={() => removeOption(i)} className="p-1 text-red-400 hover:text-red-600 shrink-0">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
          <p className="text-[10px] text-slate-400 font-bold">● = correct answer</p>
          <button type="button" onClick={addOption} className="text-xs font-black text-blue-500 hover:opacity-70 flex items-center gap-1">
            <Plus size={12} /> Add option
          </button>
        </div>
      )}

      {form.question_type === 'TRANSLATE' && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wide">Target Answer</p>
          <input className={inp} placeholder="Target sentence/phrase" value={form.target}
            onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />
          <p className="text-xs font-black text-slate-500 uppercase tracking-wide pt-1">Word Bank</p>
          {form.wordbank.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={`${inp} flex-1`} placeholder={`Word ${i + 1}`} value={w}
                onChange={e => setWb(i, e.target.value)} />
              {form.wordbank.length > 1 && (
                <button type="button" onClick={() => removeWb(i)} className="p-1 text-red-400 hover:text-red-600 shrink-0">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addWb} className="text-xs font-black text-blue-500 hover:opacity-70 flex items-center gap-1">
            <Plus size={12} /> Add word
          </button>
        </div>
      )}
    </div>
  );
}

interface CreateDraftTabProps {
  drafts: Draft[];
  onDraftsChange: () => void;
  initialEditId?: number | null;
}

export function CreateDraftTab({ drafts, onDraftsChange, initialEditId }: CreateDraftTabProps) {
  const savedDrafts = drafts.filter(d => d.status === 'DRAFT');

  const [editingId, setEditingId] = useState<number | null>(null);

  // Auto-select draft on initial navigation (e.g. from "Revise")
  useEffect(() => {
    if (initialEditId) {
      const draft = savedDrafts.find(d => d.id === initialEditId);
      if (draft && editingId !== initialEditId) {
        loadDraft(draft);
      }
    }
  }, [initialEditId, drafts]); // Run when initialEditId changes or drafts list updates

  const [form, setForm] = useState({ title: '', story: '', emoji: '📄', colour: '#46a302' });
  const [questions, setQuestions] = useState<QForm[]>([]);
  const [showQForm, setShowQForm] = useState(false);
  const [qForm, setQForm] = useState<QForm>({ ...EMPTY_Q_FORM });
  const [editQIdx, setEditQIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [expandedDraftId, setExpandedDraftId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'info' | 'warning' | 'success';
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmLabel: 'Confirm',
    onConfirm: () => { }
  });

  const resetForm = () => {
    setForm({ title: '', story: '', emoji: '📄', colour: '#46a302' });
    setQuestions([]);
    setEditingId(null);
    setShowQForm(false);
    setQForm({ ...EMPTY_Q_FORM });
    setEditQIdx(null);
    setError('');
  };

  const loadDraft = (draft: Draft) => {
    setEditingId(draft.id);
    setForm({ title: draft.title, story: draft.story, emoji: draft.emoji, colour: draft.colour });
    try {
      const qs: QForm[] = JSON.parse(draft.questionsJson).map((q: Record<string, unknown>) => ({
        question_type: (q.question_type as string) || 'SELECT',
        title: (q.title as string) || '',
        content: (q.content as string) || '',
        explanation: (q.explanation as string) || '',
        options: (q.options as string[]) || ['', '', '', ''],
        correctAnswer: (q.correctAnswer as number) ?? 0,
        wordbank: (q.wordbank as string[]) || [''],
        target: (q.target as string) || '',
      }));
      setQuestions(qs);
    } catch {
      setQuestions([]);
    }
    setShowQForm(false);
    setError('');
  };

  const buildQuestionsJson = () => {
    return JSON.stringify(questions.map(q => {
      const base = {
        question_type: q.question_type,
        title: q.title,
        content: q.content,
        explanation: q.explanation,
      };
      if (q.question_type === 'SELECT') return { ...base, options: q.options, correctAnswer: q.correctAnswer };
      if (q.question_type === 'TRANSLATE') return { ...base, target: q.target, wordbank: q.wordbank };
      return base;
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.story.trim()) {
      setError('Title and story are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = { ...form, questionsJson: buildQuestionsJson() };
      const url = editingId ? `/api/drafts/${editingId}` : '/api/drafts';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      setEditingId(saved.id);
      onDraftsChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = () => {
    if (!editingId) return true;
    const original = drafts.find(d => d.id === editingId);
    if (!original) return true;
    if (original.title !== form.title) return true;
    if (original.story !== form.story) return true;
    if (original.emoji !== form.emoji) return true;
    if (original.colour !== form.colour) return true;
    if (original.questionsJson !== buildQuestionsJson()) return true;
    return false;
  };

  const handleSubmit = async () => {
    if (!editingId) { setError('Save the draft first before submitting.'); return; }
    if (isDirty()) { setError('Please save your changes before submitting.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/drafts/${editingId}/submit`, { method: 'POST', headers: authHeaders() });
      if (!res.ok) throw new Error(await res.text());
      resetForm();
      onDraftsChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await fetch(`/api/drafts/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (editingId === id) resetForm();
      onDraftsChange();
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmitClick = () => {
    if (!editingId) { setError('Save the draft first before submitting.'); return; }
    if (isDirty()) { setError('Please save your changes before submitting.'); return; }
    setConfirmConfig({
      isOpen: true,
      title: 'Submit Draft?',
      message: 'Are you ready to submit this draft for admin review? It will be moved to the Pending tab.',
      type: 'success',
      confirmLabel: 'Submit',
      onConfirm: handleSubmit,
    });
  };

  const handleDeleteClick = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Draft?',
      message: 'Are you sure you want to permanently delete this draft? This cannot be undone.',
      type: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () => handleDelete(id),
    });
  };

  const addOrUpdateQuestion = () => {
    if (!qForm.title.trim()) return;
    if (editQIdx !== null) {
      setQuestions(qs => qs.map((q, i) => i === editQIdx ? { ...qForm } : q));
    } else {
      setQuestions(qs => [...qs, { ...qForm }]);
    }
    setQForm({ ...EMPTY_Q_FORM });
    setEditQIdx(null);
    setShowQForm(false);
  };

  const removeQuestion = (idx: number) => setQuestions(qs => qs.filter((_, i) => i !== idx));

  const startEditQ = (idx: number) => {
    setQForm({ ...questions[idx] });
    setEditQIdx(idx);
    setShowQForm(true);
  };

  const inp = 'w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-blue-400 outline-none bg-white';

  return (
    <div className="flex gap-6 h-full">
      {/* Left: saved drafts list */}
      <div className="w-56 shrink-0">
        <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wide">Your Drafts</p>
          </div>
          {savedDrafts.length === 0 ? (
            <p className="px-4 py-6 text-xs text-slate-400 font-bold text-center">No saved drafts yet</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {savedDrafts.map(d => (
                <div key={d.id} className={`group relative ${expandedDraftId === d.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                  <button
                    className="w-full text-left px-4 py-3"
                    onClick={() => {
                      setExpandedDraftId(expandedDraftId === d.id ? null : d.id);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{d.emoji || '📄'}</span>
                      <span className="text-xs font-black text-slate-700 truncate flex-1">{d.title || 'Untitled'}</span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedDraftId === d.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-3 flex gap-2"
                      >
                        <button
                          onClick={() => { loadDraft(d); setExpandedDraftId(null); }}
                          className="flex-1 text-xs font-black text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg py-1.5 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Edit2 size={10} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(d.id)}
                          disabled={deleting === d.id}
                          className="flex-1 text-xs font-black text-red-500 bg-red-50 hover:bg-red-100 rounded-lg py-1.5 flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={10} /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={resetForm}
              className="w-full text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl py-2 flex items-center justify-center gap-1 transition-colors"
            >
              <Plus size={12} /> New Draft
            </button>
          </div>
        </div>
      </div>

      {/* Right: editor */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-lg">
              {editingId ? 'Edit Draft' : 'New Draft'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-bold">
              {error}
            </div>
          )}

          {/* Lesson fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Lesson Title</label>
              <input className={inp} placeholder="e.g. Rizz Basics" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Story / Description</label>
              <textarea className={`${inp} resize-none`} rows={3} placeholder="Describe what students will learn..."
                value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))} />
            </div>
          </div>

          {/* Questions section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wide">
                Questions <span className="text-slate-400 font-bold normal-case">({questions.length})</span>
              </p>
              <button
                onClick={() => { setQForm({ ...EMPTY_Q_FORM }); setEditQIdx(null); setShowQForm(true); }}
                className="text-xs font-black text-blue-500 hover:opacity-70 flex items-center gap-1 transition-opacity"
              >
                <Plus size={12} /> Add Question
              </button>
            </div>

            {/* Question list */}
            {questions.length > 0 && (
              <div className="space-y-2 mb-4">
                {questions.map((q, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ${TYPE_LABELS[q.question_type]?.color ?? 'bg-slate-100 text-slate-600'}`}>
                        {TYPE_LABELS[q.question_type]?.label ?? q.question_type}
                      </span>
                      <span className="text-sm font-bold text-slate-700 truncate">{q.title || '(no title)'}</span>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <button onClick={() => startEditQ(idx)} className="p-1 text-blue-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => removeQuestion(idx)} className="p-1 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question form */}
            <AnimatePresence>
              {showQForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-50 rounded-2xl border-2 border-blue-100 p-4 space-y-3"
                >
                  <div className="flex gap-2">
                    {(['INTRO', 'SELECT', 'TRANSLATE'] as const).map(t => (
                      <button
                        key={t} type="button"
                        onClick={() => setQForm(f => ({ ...f, question_type: t }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${qForm.question_type === t ? TYPE_LABELS[t].color + ' ring-2 ring-offset-1 ring-current' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                      >
                        {TYPE_LABELS[t].label}
                      </button>
                    ))}
                  </div>
                  <QuestionFormFields form={qForm} setForm={setQForm} />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button" onClick={addOrUpdateQuestion}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-colors"
                    >
                      {editQIdx !== null ? 'Update Question' : 'Add Question'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowQForm(false); setQForm({ ...EMPTY_Q_FORM }); setEditQIdx(null); }}
                      className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Save Draft')}
            </button>
            <button
              onClick={handleSubmitClick}
              disabled={submitting || !editingId}
              className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-black text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!editingId ? 'Save the draft first' : 'Submit for admin review'}
            >
              <Send size={15} />
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        {...confirmConfig}
        onClose={() => setConfirmConfig(c => ({ ...c, isOpen: false }))}
      />
    </div>
  );
}
