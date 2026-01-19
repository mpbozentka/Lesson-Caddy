
import React from 'react';
import { Lesson, Recording, Student } from '../types';
import AudioRecorder from './AudioRecorder';

interface ActiveLessonProps {
  lesson: Lesson;
  student: Student | undefined;
  onAddRecording: (recording: Recording) => void;
  onUpdateLesson: (updates: Partial<Lesson>) => void;
  onFinishLesson: () => void;
  isProcessing: boolean;
}

const ActiveLesson: React.FC<ActiveLessonProps> = ({ 
  lesson, 
  student,
  onAddRecording, 
  onUpdateLesson,
  onFinishLesson,
  isProcessing 
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-100 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            {student?.fullName || 'Guest'}
          </div>
        </div>
        <input 
          type="text"
          value={lesson.title}
          onChange={(e) => onUpdateLesson({ title: e.target.value })}
          className="text-2xl font-bold text-slate-800 bg-transparent border-none focus:ring-0 focus:outline-none p-0 w-full placeholder-slate-300"
          placeholder="Enter session title..."
        />
        <div className="flex items-center text-slate-400 text-sm space-x-4">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {new Date(lesson.date).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 2v10"/><path d="M18.4 6.9a9 9 0 1 1-12.8 0"/><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/></svg>
            {lesson.recordings.length} Segments
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <AudioRecorder onRecordingComplete={onAddRecording} disabled={isProcessing} />
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lesson Notes</label>
            <textarea
              value={lesson.notes || ''}
              onChange={(e) => onUpdateLesson({ notes: e.target.value })}
              placeholder="Jot down swing thoughts, weather, or equipment notes..."
              className="w-full min-h-[120px] bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-black focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          <button
            onClick={onFinishLesson}
            disabled={lesson.recordings.length === 0 || isProcessing}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 border-2 transition-all ${
              lesson.recordings.length > 0 && !isProcessing
                ? 'border-emerald-600 text-emerald-600 hover:bg-emerald-50 shadow-lg shadow-emerald-50'
                : 'border-slate-200 text-slate-300 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Lesson...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>End & Summarize</span>
              </>
            )}
          </button>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-600 uppercase text-xs tracking-wider">Audio Segments</h3>
          
          {lesson.recordings.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <p className="text-slate-400 mb-2">No audio segments yet.</p>
              <p className="text-xs text-slate-300">Tap "Start Note" to begin recording coaching feedback.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lesson.recordings.map((recording, idx) => (
                <div key={recording.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm animate-in slide-in-from-right duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Segment #{idx + 1}</h4>
                      <p className="text-xs text-slate-400">{formatTime(recording.duration)} • {recording.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-emerald-400 w-full opacity-30"></div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                  </div>
                </div>
              )).reverse()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveLesson;
