import { useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { TERMS } from '../data';

const Glossary = () => {
    const [query, setQuery] = useState('');
    const filtered = TERMS.filter(
        t =>
            t.term.toLowerCase().includes(query.toLowerCase()) ||
            t.definition.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="py-8">
            {/* Search bar */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search for slang..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-brand-primary outline-none transition-colors font-medium"
                />
            </div>

            {/* Terms grid — uses .duo-card from index.css */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(term => (
                    <motion.div
                        layout
                        key={term.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="duo-card hover:shadow-xl hover:shadow-slate-200/50 transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-black">{term.term}</h3>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase
                ${term.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                    term.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'}`}>
                                {term.difficulty}
                            </span>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">{term.definition}</p>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Example</p>
                            <p className="text-sm italic text-slate-700">"{term.example}"</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Glossary;
