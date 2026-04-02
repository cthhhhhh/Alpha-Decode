import { CheckCircle, FileText } from 'lucide-react';
import type { Draft } from './types';

interface ApprovedTabProps {
  drafts: Draft[];
}

export function ApprovedTab({ drafts }: ApprovedTabProps) {
  const approved = drafts.filter(d => d.status === 'APPROVED');

  if (approved.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <h3 className="font-black text-slate-700 text-lg mb-1">No Approved Drafts Yet</h3>
        <p className="text-slate-400 font-bold text-sm">Approved content will appear here once an admin reviews your submissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-black text-slate-500 uppercase tracking-wide">{approved.length} Approved</p>
      {approved.map(draft => {
        let questionCount = 0;
        try { questionCount = JSON.parse(draft.questionsJson).length; } catch { /* empty */ }
        return (
          <div key={draft.id} className="bg-white rounded-2xl border-2 border-green-100 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-3xl shrink-0">{draft.emoji || '📄'}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-black text-slate-800 truncate">{draft.title}</h3>
                    <span className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full bg-green-100 text-green-700 uppercase tracking-wide flex items-center gap-1">
                      <CheckCircle size={9} /> Published
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-semibold line-clamp-2">{draft.story}</p>
                </div>
              </div>
              <div
                className="w-5 h-5 rounded-full shrink-0 mt-1 border-2 border-white shadow-sm"
                style={{ background: draft.colour }}
              />
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <FileText size={12} /> {questionCount} question{questionCount !== 1 ? 's' : ''}
              </span>
              {draft.approvedLessonId && (
                <span className="text-xs font-bold text-slate-400">
                  Lesson ID: #{draft.approvedLessonId}
                </span>
              )}
              <span className="text-xs font-bold text-slate-300">
                Approved {new Date(draft.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
