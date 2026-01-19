
import React from 'react';
import { Lesson, Student } from '../types';

interface LessonDetailsProps {
  lesson: Lesson;
  student: Student | undefined;
  onBack: () => void;
}

const LessonDetails: React.FC<LessonDetailsProps> = ({ lesson, student, onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-emerald-600 transition-colors font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
        Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="bg-emerald-700 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-emerald-200 font-bold text-xs uppercase tracking-widest mb-1">Lesson Review</div>
              <div className="text-black text-sm font-bold bg-white/20 inline-block px-2 py-0.5 rounded mb-3">{student?.fullName || 'Guest Student'}</div>
              <h2 className="text-3xl font-bold">{lesson.title}</h2>
              <p className="mt-2 text-emerald-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                {new Date(lesson.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm text-center">
              <div className="text-2xl font-bold">{lesson.recordings.length}</div>
              <div className="text-[10px] uppercase font-bold tracking-tighter opacity-70">Logs</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {lesson.notes && (
            <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Session Notes</h4>
              <p className="text-slate-700 italic leading-relaxed whitespace-pre-wrap">{lesson.notes}</p>
            </div>
          )}

          <div className="prose prose-emerald max-w-none prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-600">
            {lesson.summary ? (
              <div className="markdown-content space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">AI Coaching Insights</h4>
                {lesson.summary.split('\n').map((line, i) => {
                   if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-slate-800 border-b pb-2 mb-4">{line.replace('# ', '')}</h1>;
                   if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-700 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                   if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-700 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                   if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 text-slate-600 list-disc">{line.replace(/[-*] /, '')}</li>;
                   if (line.trim() === '') return <div key={i} className="h-2" />;
                   return <p key={i} className="text-slate-600 leading-relaxed">{line}</p>;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-slate-400">
                 <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                 <p>Fetching your lesson summary...</p>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50">
             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Original Audio Notes</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {lesson.recordings.map((rec, i) => (
                 <div key={rec.id} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                   <div className="flex items-center">
                     <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 mr-3">
                       {i+1}
                     </div>
                     <span className="text-sm font-medium text-slate-600">Note {i+1}</span>
                   </div>
                   <span className="text-xs text-slate-400 font-mono">
                     {Math.floor(rec.duration / 60)}:{(rec.duration % 60).toString().padStart(2, '0')}
                   </span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
