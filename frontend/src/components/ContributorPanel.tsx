import React from "react";

interface Props {
  onBack: () => void;
}

const ContributorPanel: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-4 py-4 border-b border-slate-200 bg-white flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
        >
          ← Back
        </button>
        <h1 className="text-lg font-black text-slate-900">Contributor Panel</h1>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Contributor tools are coming soon. For now, you can keep testing the
            rest of the app.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ContributorPanel;

