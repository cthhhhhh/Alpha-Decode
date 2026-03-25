import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, BookA, Plus, Edit2, Trash2 } from 'lucide-react';
import type { Lesson, Term } from './types';
import { authHeaders } from './utils';
import { ConfirmModal } from './ConfirmModal';

export function ContentTab() {
  const [subTab, setSubTab] = useState<'lessons' | 'terms'>('lessons');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: '', story: '', emoji: '' });

  const [showTermModal, setShowTermModal] = useState(false);
  const [editTerm, setEditTerm] = useState<Term | null>(null);
  const [termForm, setTermForm] = useState({ term: '', definition: '', example: '', difficulty: 'easy' });

  const [confirmDelete, setConfirmDelete] = useState<{ id: number; type: 'lesson' | 'term' } | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    const [lr, tr] = await Promise.all([fetch('/api/lessons/'), fetch('/api/terms/')]);
    if (lr.ok) setLessons(await lr.json());
    if (tr.ok) setTerms(await tr.json());
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

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
    if (res.ok) setLessons(l => l.filter(x => x.id !== id));
    else alert('Failed to delete — check permissions');
    setConfirmDelete(null);
  };

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

  if (loading) return <div className="text-center p-12 text-slate-400 font-bold animate-pulse">Loading content...</div>;

  return (
    <div>
      {confirmDelete && (
        <ConfirmModal
          title={`Delete ${confirmDelete.type === 'lesson' ? 'Lesson' : 'Term'}`}
          message={`Are you sure you want to permanently delete this ${confirmDelete.type}?`}
          confirmLabel="Delete"
          confirmClass="bg-red-500 text-white"
          onConfirm={() => confirmDelete.type === 'lesson' ? executeDeleteLesson(confirmDelete.id) : executeDeleteTerm(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="flex gap-2 mb-6">
        {[{ k: 'lessons', label: 'Lessons', icon: <BookOpen size={14} /> }, { k: 'terms', label: 'Glossary Terms', icon: <BookA size={14} /> }].map(t => (
          <button key={t.k} onClick={() => setSubTab(t.k as 'lessons' | 'terms')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${subTab === t.k ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {subTab === 'lessons' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-slate-800 text-lg">Lessons ({lessons.length})</h2>
            <button onClick={openAddLesson} className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-opacity shadow-sm">
              <Plus size={15} /> Add Lesson
            </button>
          </div>
          <div className="space-y-2">
            {lessons.map(l => (
              <div key={l.id} className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{l.emoji || '📚'}</span>
                  <div>
                    <p className="font-black text-slate-800">{l.title}</p>
                    <p className="text-xs text-slate-400 font-medium truncate max-w-xs">{l.story || 'No description'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditLesson(l)} className="p-2 text-blue-500 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all"><Edit2 size={15} /></button>
                  <button onClick={() => setConfirmDelete({ id: l.id, type: 'lesson' })} className="p-2 text-red-500 bg-white rounded-xl border-2 border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {showLessonModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-black text-slate-800 mb-5">{editLesson ? 'Edit Lesson' : 'New Lesson'}</h3>
            <div className="space-y-3">
              <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-primary outline-none" placeholder="Title" value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} />
              <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-primary outline-none" placeholder="Emoji (e.g. 🔥)" value={lessonForm.emoji} onChange={e => setLessonForm(f => ({ ...f, emoji: e.target.value }))} />
              <textarea className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-primary outline-none resize-none h-24" placeholder="Description / story" value={lessonForm.story} onChange={e => setLessonForm(f => ({ ...f, story: e.target.value }))} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowLessonModal(false)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 font-black text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSaveLesson} className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white font-black hover:opacity-90 transition-opacity shadow-sm">Save</button>
            </div>
          </motion.div>
        </div>
      )}

      {showTermModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-black text-slate-800 mb-5">{editTerm ? 'Edit Term' : 'New Term'}</h3>
            <div className="space-y-3">
              <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-primary outline-none" placeholder="Term (e.g. Rizz)" value={termForm.term} onChange={e => setTermForm(f => ({ ...f, term: e.target.value }))} />
              <textarea className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-primary outline-none resize-none h-20" placeholder="Definition" value={termForm.definition} onChange={e => setTermForm(f => ({ ...f, definition: e.target.value }))} />
              <textarea className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-primary outline-none resize-none h-16" placeholder="Example usage" value={termForm.example} onChange={e => setTermForm(f => ({ ...f, example: e.target.value }))} />
              <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-primary outline-none bg-white" value={termForm.difficulty} onChange={e => setTermForm(f => ({ ...f, difficulty: e.target.value }))}>
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
    </div>
  );
}
