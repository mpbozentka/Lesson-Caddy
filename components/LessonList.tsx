
import React from 'react';
import { Lesson, Student } from '../types';

interface LessonListProps {
  lessons: Lesson[];
  students: Student[];
  onSelectLesson: (lesson: Lesson) => void;
  onNewLesson: () => void;
  onDeleteLesson: (id: string) => void;
}

const LessonList: React.FC<LessonListProps> = ({ lessons, students, onSelectLesson, onNewLesson, onDeleteLesson }) => {
  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.fullName || 'Unknown Student';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">My Lessons</h2>
        <button
          onClick={onNewLesson}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center space-x-2 shadow-lg shadow-emerald-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <span>New Lesson</span>
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M10 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M18 9h.01"/><path d="M18 13h.01"/><path d="M18 17h.01"/></svg>
          </div>
          <h3 className="text-slate-600 font-semibold text-lg">No lessons yet</h3>
          <p className="text-slate-400 mt-1 max-w-xs mx-auto">
            Your swing thoughts and coach's tips will appear here after your first session.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id}
              className="relative group"
            >
              <button
                onClick={() => onSelectLesson(lesson)}
                className="w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="m14 11-1-1v4"/></svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    {new Date(lesson.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-[10px] uppercase font-black text-black tracking-widest">{getStudentName(lesson.studentId)}</span>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{lesson.title}</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                  {lesson.summary 
                    ? lesson.summary.replace(/[#*]/g, '').slice(0, 100) + '...'
                    : `${lesson.recordings.length} recording segments`}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-emerald-600 font-semibold text-sm">
                  <span>View Lesson</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLesson(lesson.id);
                }}
                className="absolute top-4 right-14 p-2 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Delete Lesson"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList;
