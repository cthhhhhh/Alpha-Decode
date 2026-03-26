import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, BookA, Plus, Edit2, Trash2, ChevronDown, ChevronUp, CheckCircle2, Tag, AlignLeft } from 'lucide-react';
import type { Lesson, LessonWithQuestions, Question, Term } from './types';
import { authHeaders } from './utils';
import { ConfirmModal } from './ConfirmModal';

// ─── helpers ────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  INTRO:     { label: 'Intro',     color: 'bg-blue-100 text-blue-700' },
  SELECT:    { label: 'Select',    color: 'bg-purple-100 text-purple-700' },
  TRANSLATE: { label: 'Translate', color: 'bg-orange-100 text-orange-700' },
};

const EMPTY_Q_FORM = {
  question_type: 'SELECT' as Question['question_type'],
  title: '',
  content: '',
  explanation: '',
  // SELECT
  options: ['', '', '', ''],
  correctAnswer: 0,
  // TRANSLATE
  wordbank: [''],
  target: '',
};

type QForm = typeof EMPTY_Q_FORM;

// ─── sub-components ──────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_LABELS[type] ?? { label: type, color: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function QuestionFormFields({ form, setForm }: { form: QForm; setForm: React.Dispatch<React.SetStateAction<QForm>> }) {
  const inp = 'w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-primary outline-none';

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
              <input
                type="radio"
                name="correctAnswer"
                checked={form.correctAnswer === i}
                onChange={() => setForm(f => ({ ...f, correctAnswer: i }))}
                className="accent-green-500 w-4 h-4 shrink-0"
                title="Mark as correct"
              />
              <input className={`${inp} flex-1`} placeholder={`Option ${i + 1}`} value={opt}
                onChange={e => setOption(i, e.target.value)} />
              {form.options.length > 2 && (
                <button onClick={() => removeOption(i)} className="p-1 text-red-400 hover:text-red-600 shrink-0">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
          <p className="text-[10px] text-slate-400 font-bold">● = correct answer</p>
          <button onClick={addOption} className="text-xs font-black text-brand-primary hover:opacity-70 flex items-center gap-1">
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
                <button onClick={() => removeWb(i)} className="p-1 text-red-400 hover:text-red-600 shrink-0">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addWb} className="text-xs font-black text-brand-primary hover:opacity-70 flex items-center gap-1">
            <Plus size={12} /> Add word
          </button>
        </div>
      )}
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────
export function ContentTab() {
  const [subTab, setSubTab] = useState<'lessons' | 'terms'>('lessons');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  // lesson form state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: '', story: '', emoji: '' });

  // term form state
  const [showTermModal, setShowTermModal] = useState(false);
  const [editTerm, setEditTerm] = useState<Term | null>(null);
  const [termForm, setTermForm] = useState({ term: '', definition: '', example: '', difficulty: 'easy' });

  // question state
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);
  const [lessonDetail, setLessonDetail] = useState<LessonWithQuestions | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showQModal, setShowQModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [qForm, setQForm] = useState<QForm>(EMPTY_Q_FORM);

  // confirm delete
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; type: 'lesson' | 'term' | 'question' } | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    const [lr, tr] = await Promise.all([fetch('/api/lessons/'), fetch('/api/terms/')]);
    if (lr.ok) setLessons(await lr.json());
    if (tr.ok) setTerms(await tr.json());
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  // ── lesson CRUD ─────────────────────────────────────────────────────────
  const openAddLesson = () => { setEditLesson(null); setLessonForm({ title: '', story: '', emoji: '' }); setShowLessonModal(true); };
  const openEditLesson = (l: Lesson) => { setEditLesson(l); setLessonForm({ title: l.title, story: l.story || '', emoji: l.emoji || '' }); setShowLessonModal(true); };

  const handleSaveLesson = async () => {
    const isEdit = !!editLesson;
    const url = isEdit ? `/api/lessons/${editLesson!.id}` : '/api/lessons/create';
    const method = isEdit ? 'PUT' : 'POST';
    const body = isEdit ? lessonForm : { lesson: lessonForm, questions: [] };
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
    if (res.ok) { setShowLessonModal(false); fetchContent(); }
    else alert('Failed to save lesson');
  };

  const executeDeleteLesson = async (id: number) => {
    const res = await fetch(`/api/lessons/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) { setLessons(l => l.filter(x => x.id !== id)); if (expandedLessonId === id) setExpandedLessonId(null); }
    else alert('Failed to delete — check permissions');
    setConfirmDelete(null);
  };

  // ── term CRUD ──────────────────────────────────────────────────────────
  const openAddTerm = () => { setEditTerm(null); setTermForm({ term: '', definition: '', example: '', difficulty: 'easy' }); setShowTermModal(true); };
  const openEditTerm = (t: Term) => { setEditTerm(t); setTermForm({ term: t.term, definition: t.definition, example: t.example, difficulty: t.difficulty }); setShowTermModal(true); };

  const handleSaveTerm = async () => {
    const isEdit = !!editTerm;
    const res = await fetch(isEdit ? `/api/terms/${editTerm!.id}` : '/api/terms/lessons/0',
      { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(termForm) });
    if (res.ok) { setShowTermModal(false); fetchContent(); }
    else alert('Failed to save term');
  };

  const executeDeleteTerm = async (id: number) => {
    const res = await fetch(`/api/terms/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) setTerms(t => t.filter(x => x.id !== id));
    else alert('Failed to delete — check permissions');
    setConfirmDelete(null);
  };

  // ── question panel ─────────────────────────────────────────────────────
  const toggleQuestions = async (lessonId: number) => {
    if (expandedLessonId === lessonId) { setExpandedLessonId(null); setLessonDetail(null); return; }
    setExpandedLessonId(lessonId);
    setLessonDetail(null);
    setLoadingQuestions(true);
    const res = await fetch(`/api/lessons/questions/${lessonId}`);
    if (res.ok) setLessonDetail(await res.json());
    else alert('Failed to load questions');
    setLoadingQuestions(false);
  };

  const refreshQuestions = async () => {
    if (!expandedLessonId) return;
    const res = await fetch(`/api/lessons/questions/${expandedLessonId}`);
    if (res.ok) setLessonDetail(await res.json());
  };

  // ── question CRUD ──────────────────────────────────────────────────────
  const openAddQuestion = () => {
    setEditQuestion(null);
    setQForm(EMPTY_Q_FORM);
    setShowQModal(true);
  };

  const openEditQuestion = (q: Question) => {
    setEditQuestion(q);
    setQForm({
      question_type: q.question_type,
      title: q.title,
      content: q.content || '',
      explanation: q.explanation,
      options: q.options?.length ? [...q.options] : ['', '', '', ''],
      correctAnswer: q.correctAnswer ?? 0,
      wordbank: q.wordbank?.length ? [...q.wordbank] : [''],
      target: q.target || '',
    });
    setShowQModal(true);
  };

  const buildQBody = (form: QForm, isEdit: boolean) => {
    const base = { question_type: form.question_type, title: form.title, content: form.content, explanation: form.explanation };
    if (form.question_type === 'SELECT') return { ...base, options: form.options.filter(o => o.trim()), correctAnswer: form.correctAnswer };
    if (form.question_type === 'TRANSLATE') return { ...base, wordbank: form.wordbank.filter(w => w.trim()), target: form.target };
    return base;
  };

  const handleSaveQuestion = async () => {
    const quizId = lessonDetail?.quiz?.id;
    if (!quizId && !editQuestion) { alert('Quiz not found'); return; }

    const isEdit = !!editQuestion;
    const url = isEdit ? `/api/questions/${editQuestion!.id}` : `/api/questions/quiz/${quizId}`;
    const method = isEdit ? 'PUT' : 'POST';
    const body = buildQBody(qForm, isEdit);

    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
    if (res.ok) { setShowQModal(false); await refreshQuestions(); }
    else alert('Failed to save question — check permissions');
  };

  const executeDeleteQuestion = async (id: number) => {
    const res = await fetch(`/api/questions/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) await refreshQuestions();
    else alert('Failed to delete question');
    setConfirmDelete(null);
  };

  if (loading) return <div className="text-center p-12 text-slate-400 font-bold animate-pulse">Loading content...</div>;

  const inp = 'w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-primary outline-none';

  return (
    <div>
      {confirmDelete && (
        <ConfirmModal
          title={`Delete ${confirmDelete.type === 'lesson' ? 'Lesson' : confirmDelete.type === 'term' ? 'Term' : 'Question'}`}
          message={`Are you sure you want to permanently delete this ${confirmDelete.type}?`}
          confirmLabel="Delete"
          confirmClass="bg-red-500 text-white"
          onConfirm={() => {
            if (confirmDelete.type === 'lesson') executeDeleteLesson(confirmDelete.id);
            else if (confirmDelete.type === 'term') executeDeleteTerm(confirmDelete.id);
            else executeDeleteQuestion(confirmDelete.id);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Sub-tab switcher */}
      <div className="flex gap-2 mb-6 select-none">
        {[{ k: 'lessons', label: 'Lessons', icon: <BookOpen size={14} /> }, { k: 'terms', label: 'Glossary Terms', icon: <BookA size={14} /> }].map(t => (
          <button key={t.k} onClick={() => setSubTab(t.k as 'lessons' | 'terms')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${subTab === t.k ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── LESSONS TAB ── */}
      {subTab === 'lessons' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-slate-800 text-lg">Lessons ({lessons.length})</h2>
            <button onClick={openAddLesson} className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-opacity shadow-sm">
              <Plus size={15} /> Add Lesson
            </button>
          </div>

          <div className="space-y-3">
            {lessons.map(l => (
              <div key={l.id} className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Lesson row */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{l.emoji || '📚'}</span>
                    <div>
                      <p className="font-black text-slate-800">{l.title}</p>
                      <p className="text-xs text-slate-400 font-medium truncate max-w-xs">{l.story || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => toggleQuestions(l.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${expandedLessonId === l.id ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                      {expandedLessonId === l.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      Questions
                    </button>
                    <button onClick={() => openEditLesson(l)} className="p-2 text-blue-500 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all"><Edit2 size={15} /></button>
                    <button onClick={() => setConfirmDelete({ id: l.id, type: 'lesson' })} className="p-2 text-red-500 bg-white rounded-xl border-2 border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
                  </div>
                </div>

                {/* Question panel */}
                <AnimatePresence>
                  {expandedLessonId === l.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t-2 border-slate-100 bg-slate-50 overflow-hidden"
                    >
                      <div className="p-4">
                        {loadingQuestions ? (
                          <p className="text-slate-400 text-sm font-bold animate-pulse text-center py-4">Loading questions...</p>
                        ) : (
                          <>
                            <div className="flex justify-between items-center mb-3">
                              <p className="text-xs font-black text-slate-500 uppercase tracking-wide">
                                Questions ({lessonDetail?.quiz?.questions?.length ?? 0})
                              </p>
                              <button onClick={openAddQuestion}
                                className="flex items-center gap-1 px-3 py-1.5 bg-brand-primary text-white rounded-xl text-xs font-black hover:opacity-90 shadow-sm">
                                <Plus size={12} /> Add Question
                              </button>
                            </div>

                            {!lessonDetail?.quiz?.questions?.length ? (
                              <p className="text-slate-400 text-sm text-center py-4 font-bold">No questions yet</p>
                            ) : (
                              <div className="space-y-2">
                                {lessonDetail.quiz.questions.map((q, idx) => (
                                  <div key={q.id} className="bg-white border-2 border-slate-200 rounded-xl p-3 flex items-start justify-between gap-3 shadow-sm">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-xs font-black text-slate-400">#{idx + 1}</span>
                                        <TypeBadge type={q.question_type} />
                                      </div>
                                      <p className="text-sm font-black text-slate-800 truncate">{q.title}</p>
                                      {q.question_type === 'SELECT' && q.options && (
                                        <div className="mt-1.5 space-y-0.5">
                                          {q.options.map((opt, i) => (
                                            <div key={i} className={`flex items-center gap-1.5 text-xs font-bold ${i === q.correctAnswer ? 'text-green-600' : 'text-slate-400'}`}>
                                              {i === q.correctAnswer ? <CheckCircle2 size={11} /> : <span className="w-[11px]" />}
                                              {opt}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {q.question_type === 'TRANSLATE' && (
                                        <div className="mt-1.5 space-y-0.5">
                                          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                                            <Tag size={11} /> Target: {q.target}
                                          </div>
                                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <AlignLeft size={11} /> Wordbank: {q.wordbank?.join(', ')}
                                          </div>
                                        </div>
                                      )}
                                      {q.explanation && (
                                        <p className="mt-1 text-[11px] text-slate-400 italic truncate">💡 {q.explanation}</p>
                                      )}
                                    </div>
                                    <div className="flex gap-1.5 shrink-0">
                                      <button onClick={() => openEditQuestion(q)} className="p-1.5 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors border border-slate-200"><Edit2 size={13} /></button>
                                      <button onClick={() => setConfirmDelete({ id: q.id, type: 'question' })} className="p-1.5 text-red-500 rounded-lg hover:bg-red-50 transition-colors border border-slate-200"><Trash2 size={13} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TERMS TAB ── */}
      {subTab === 'terms' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-slate-800 text-lg">Glossary Terms ({terms.length})</h2>
            <button onClick={openAddTerm} className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-black hover:opacity-90 shadow-sm">
              <Plus size={15} /> Add Term
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {terms.map(t => (
              <div key={t.id} className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-black text-slate-800">{t.term}</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${t.difficulty === 'easy' ? 'bg-green-100 text-green-700' : t.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{t.difficulty}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEditTerm(t)} className="p-1.5 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => setConfirmDelete({ id: t.id, type: 'term' })} className="p-1.5 text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{t.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LESSON MODAL ── */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-black text-slate-800 mb-5">{editLesson ? 'Edit Lesson' : 'New Lesson'}</h3>
            <div className="space-y-3">
              <input className={inp} placeholder="Title" value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} />
              <input className={inp} placeholder="Emoji (e.g. 🔥)" value={lessonForm.emoji} onChange={e => setLessonForm(f => ({ ...f, emoji: e.target.value }))} />
              <textarea className={`${inp} resize-none h-24`} placeholder="Description / story" value={lessonForm.story} onChange={e => setLessonForm(f => ({ ...f, story: e.target.value }))} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowLessonModal(false)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 font-black text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSaveLesson} className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white font-black hover:opacity-90 transition-opacity shadow-sm">Save</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── TERM MODAL ── */}
      {showTermModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-black text-slate-800 mb-5">{editTerm ? 'Edit Term' : 'New Term'}</h3>
            <div className="space-y-3">
              <input className={inp} placeholder="Term (e.g. Rizz)" value={termForm.term} onChange={e => setTermForm(f => ({ ...f, term: e.target.value }))} />
              <textarea className={`${inp} resize-none h-20`} placeholder="Definition" value={termForm.definition} onChange={e => setTermForm(f => ({ ...f, definition: e.target.value }))} />
              <textarea className={`${inp} resize-none h-16`} placeholder="Example usage" value={termForm.example} onChange={e => setTermForm(f => ({ ...f, example: e.target.value }))} />
              <select className={`${inp} bg-white`} value={termForm.difficulty} onChange={e => setTermForm(f => ({ ...f, difficulty: e.target.value }))}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowTermModal(false)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 font-black text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSaveTerm} className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white font-black hover:opacity-90 shadow-sm">Save</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── QUESTION MODAL ── */}
      {showQModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-800 mb-5">{editQuestion ? 'Edit Question' : 'New Question'}</h3>

            {/* Type selector — only shown when creating */}
            {!editQuestion && (
              <div className="mb-4">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">Question Type</p>
                <div className="flex gap-2">
                  {(['INTRO', 'SELECT', 'TRANSLATE'] as const).map(t => (
                    <button key={t} onClick={() => setQForm(f => ({ ...f, question_type: t }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-black border-2 transition-all ${qForm.question_type === t ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {editQuestion && (
              <div className="mb-4">
                <TypeBadge type={editQuestion.question_type} />
              </div>
            )}

            <QuestionFormFields form={qForm} setForm={setQForm} />

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowQModal(false)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 font-black text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSaveQuestion} className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white font-black hover:opacity-90 transition-opacity shadow-sm">Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
