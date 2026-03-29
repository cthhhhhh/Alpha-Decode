import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { DraftDetail, DraftQuestion } from './types';
import { authHeaders } from './utils';

const EMPTY_Q: DraftQuestion = {
  question_type: 'SELECT',
  title: '',
  content: '',
  explanation: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  wordbank: [''],
  target: '',
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  INTRO:     { label: 'Intro',     color: 'bg-blue-100 text-blue-700' },
  SELECT:    { label: 'Select',    color: 'bg-purple-100 text-purple-700' },
  TRANSLATE: { label: 'Translate', color: 'bg-orange-100 text-orange-700' },
};

interface Props {
  editingDraft?: DraftDetail | null;
  onSaved: () => void;
}

function QuestionFormFields({ form, setForm }: { form: DraftQuestion; setForm: (fn: (f: DraftQuestion) => DraftQuestion) => void }) {
  const inp = 'w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-400 outline-none';

  const opts = form.options ?? [];
  const wb = form.wordbank ?? [];

  return (
    <div className="space-y-3">
      <input className={inp} placeholder="Question title / prompt" value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      <input className={inp} placeholder="Content (optional extra text)" value={form.content ?? ''}
        onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
      <input className={inp} placeholder="Explanation (shown after answering)" value={form.explanation}
        onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} />

      {form.question_type === 'SELECT' && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wide">Answer Options</p>
          {opts.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name={`correctAnswer-${i}`} checked={form.correctAnswer === i}
                onChange={() => setForm(f => ({ ...f, correctAnswer: i }))}
                className="accent-blue-500 w-4 h-4 shrink-0" title="Mark as correct" />
              <input className={`${inp} flex-1`} placeholder={`Option ${i + 1}`} value={opt}
                onChange={e => setForm(f => {
                  const o = [...(f.options ?? [])]; o[i] = e.target.value; return { ...f, options: o };
                })} />
              {opts.length > 2 && (
                <button onClick={() => setForm(f => {
                  const o = (f.options ?? []).filter((_, idx) => idx !== i);
                  return { ...f, options: o, correctAnswer: Math.min(f.correctAnswer ?? 0, o.length - 1) };
                })} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
              )}
            </div>
          ))}
          <p className="text-[10px] text-slate-400 font-bold">● = correct answer</p>
          <button onClick={() => setForm(f => ({ ...f, options: [...(f.options ?? []), ''] }))}
            className="text-xs font-black text-blue-500 hover:opacity-70 flex items-center gap-1">
            <Plus size={12} /> Add option
          </button>
        </div>
      )}

      {form.question_type === 'TRANSLATE' && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wide">Target Answer</p>
          <input className={inp} placeholder="Target sentence/phrase" value={form.target ?? ''}
            onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />
          <p className="text-xs font-black text-slate-500 uppercase tracking-wide pt-1">Word Bank</p>
          {wb.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={`${inp} flex-1`} placeholder={`Word ${i + 1}`} value={w}
                onChange={e => setForm(f => {
                  const b = [...(f.wordbank ?? [])]; b[i] = e.target.value; return { ...f, wordbank: b };
                })} />
              {wb.length > 1 && (
                <button onClick={() => setForm(f => ({ ...f, wordbank: (f.wordbank ?? []).filter((_, idx) => idx !== i) }))}
                  className="p-1 text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
              )}
            </div>
          ))}
          <button onClick={() => setForm(f => ({ ...f, wordbank: [...(f.wordbank ?? []), ''] }))}
            className="text-xs font-black text-blue-500 hover:opacity-70 flex items-center gap-1">
            <Plus size={12} /> Add word
          </button>
        </div>
      )}
    </div>
  );
}

export function CreateDraftTab({ editingDraft, onSaved }: Props) {
  const [lessonForm, setLessonForm] = useState({ title: '', story: '', emoji: '', colour: '#3b82f6' });
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editingDraft) {
      setLessonForm({
        title: editingDraft.title,
        story: editingDraft.story,
        emoji: editingDraft.emoji,
        colour: editingDraft.colour,
      });
      setQuestions(editingDraft.questions.map(q => ({ ...EMPTY_Q, ...q })));
      setExpandedQ(null);
    } else {
      setLessonForm({ title: '', story: '', emoji: '', colour: '#3b82f6' });
      setQuestions([]);
      setExpandedQ(null);
    }
    setError('');
    setSuccess('');
  }, [editingDraft]);

  const addQuestion = () => {
    const newQ = { ...EMPTY_Q };
    setQuestions(q => [...q, newQ]);
    setExpandedQ(questions.length);
  };

  const removeQuestion = (i: number) => {
    setQuestions(q => q.filter((_, idx) => idx !== i));
    setExpandedQ(null);
  };

  const updateQuestion = (i: number, fn: (f: DraftQuestion) => DraftQuestion) => {
    setQuestions(qs => qs.map((q, idx) => idx === i ? fn(q) : q));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!lessonForm.title.trim()) { setError('Title is required.'); return; }
    if (!lessonForm.story.trim()) { setError('Story / description is required.'); return; }
    if (!lessonForm.emoji.trim()) { setError('Emoji is required.'); return; }

    setSaving(true);
    try {
      const url = editingDraft ? `/api/drafts/${editingDraft.id}` : '/api/drafts';
      const method = editingDraft ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify({ ...lessonForm, questions }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to save draft');
      }
      setSuccess(editingDraft ? 'Draft updated successfully!' : 'Draft created successfully!');
      if (!editingDraft) {
        setLessonForm({ title: '', story: '', emoji: '', colour: '#3b82f6' });
        setQuestions([]);
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const inp = 'w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-400 outline-none';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <h3 className="font-black text-slate-700">Lesson Details</h3>
        <input className={inp} placeholder="Title (e.g. Rizz Explained)" value={lessonForm.title}
          onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} />
        <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="Story / description shown to learners"
          value={lessonForm.story} onChange={e => setLessonForm(f => ({ ...f, story: e.target.value }))} />
        <div className="flex gap-3">
          <input className={`${inp} flex-1`} placeholder="Emoji (e.g. 🔥)" value={lessonForm.emoji}
            onChange={e => setLessonForm(f => ({ ...f, emoji: e.target.value }))} />
          <div className="flex items-center gap-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wide whitespace-nowrap">Colour</label>
            <input type="color" value={lessonForm.colour}
              onChange={e => setLessonForm(f => ({ ...f, colour: e.target.value }))}
              className="w-10 h-10 rounded-xl cursor-pointer border-2 border-slate-200 p-0.5" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-700">Questions ({questions.length})</h3>
          <button onClick={addQuestion}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all">
            <Plus size={13} /> Add Question
          </button>
        </div>

        <AnimatePresence>
          {questions.map((q, i) => {
            const typeCfg = TYPE_LABELS[q.question_type] ?? TYPE_LABELS.SELECT;
            const isOpen = expandedQ === i;
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                  onClick={() => setExpandedQ(isOpen ? null : i)}>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ${typeCfg.color}`}>
                    {typeCfg.label}
                  </span>
                  <p className="flex-1 text-sm font-bold text-slate-700 truncate">
                    {q.title || <span className="text-slate-400 italic">Untitled question</span>}
                  </p>
                  <button onClick={e => { e.stopPropagation(); removeQuestion(i); }}
                    className="p-1 text-red-400 hover:text-red-600 shrink-0"><Trash2 size={13} /></button>
                  {isOpen ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                        <div className="flex gap-2">
                          {(['INTRO', 'SELECT', 'TRANSLATE'] as const).map(t => (
                            <button key={t} onClick={() => updateQuestion(i, f => ({ ...f, question_type: t }))}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${q.question_type === t ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                        <QuestionFormFields form={q} setForm={fn => updateQuestion(i, fn)} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {error && <p className="text-sm font-bold text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      {success && <p className="text-sm font-bold text-green-600 bg-green-50 rounded-xl px-4 py-3">{success}</p>}

      <button onClick={handleSave} disabled={saving}
        className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-lg hover:bg-blue-600 active:translate-y-0.5 disabled:opacity-60 transition-all shadow-[0_4px_0_#1d4ed8]">
        {saving ? 'Saving...' : editingDraft ? 'Update Draft' : 'Save Draft'}
      </button>
    </div>
  );
}
