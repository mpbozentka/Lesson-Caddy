
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LessonList from './components/LessonList';
import ActiveLesson from './components/ActiveLesson';
import LessonDetails from './components/LessonDetails';
import StudentManager from './components/StudentManager';
import { Lesson, Recording, Student } from './types';
import { summarizeLesson } from './services/geminiService';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'active' | 'details' | 'students' | 'select-student'>('list');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Persistence
  useEffect(() => {
    const savedLessons = localStorage.getItem('golf_lessons_meta');
    if (savedLessons) {
      try {
        const parsed = JSON.parse(savedLessons);
        setLessons(parsed.map((l: any) => ({
          ...l,
          date: new Date(l.date),
          recordings: l.recordings.map((r: any) => ({ ...r, timestamp: new Date(r.timestamp) }))
        })));
      } catch (e) { console.error("Failed to load lessons", e); }
    }

    const savedStudents = localStorage.getItem('golf_students');
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents);
        setStudents(parsed.map((s: any) => ({ ...s, createdAt: new Date(s.createdAt) })));
      } catch (e) { console.error("Failed to load students", e); }
    }
  }, []);

  useEffect(() => {
    const metaOnly = lessons.map(({ recordings, ...rest }) => ({
      ...rest,
      recordings: recordings.map(({ id, duration, timestamp }) => ({ id, duration, timestamp }))
    }));
    localStorage.setItem('golf_lessons_meta', JSON.stringify(metaOnly));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('golf_students', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (fullName: string) => {
    const newStudent: Student = {
      id: crypto.randomUUID(),
      fullName,
      createdAt: new Date(),
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("Are you sure? This will not delete past lessons for this student but will remove them from the directory.")) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm("Are you sure you want to delete this lesson? This cannot be undone.")) {
      setLessons(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleStartLessonFlow = () => {
    if (students.length === 0) {
      alert("Please add a student profile first!");
      setCurrentView('students');
    } else {
      setCurrentView('select-student');
    }
  };

  const handleSelectStudentForLesson = (studentId: string) => {
    const newLesson: Lesson = {
      id: crypto.randomUUID(),
      studentId,
      title: `Session: ${new Date().toLocaleDateString()}`,
      date: new Date(),
      recordings: [],
      notes: '',
      status: 'active'
    };
    setActiveLesson(newLesson);
    setCurrentView('active');
  };

  const handleAddRecording = (recording: Recording) => {
    if (activeLesson) {
      setActiveLesson(prev => prev ? { ...prev, recordings: [...prev.recordings, recording] } : null);
    }
  };

  const handleUpdateActiveLesson = (updates: Partial<Lesson>) => {
    if (activeLesson) {
      setActiveLesson(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleFinishLesson = async () => {
    if (!activeLesson || activeLesson.recordings.length === 0) return;
    setIsProcessing(true);
    try {
      const summary = await summarizeLesson(activeLesson.recordings);
      const completedLesson: Lesson = { ...activeLesson, summary, status: 'completed' };

      // Save to Supabase
      const student = students.find(s => s.id === activeLesson.studentId);
      const { error } = await supabase
        .from('Lesson-Caddy table')
        .insert([
          {
            Student: student?.fullName || 'Unknown Student',
            summary: summary,
            date: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error("Error saving to Supabase:", error);
      } else {
        console.log("Successfully saved to Supabase");
      }

      setLessons(prev => [completedLesson, ...prev]);
      setActiveLesson(completedLesson);
      setCurrentView('details');
    } catch (err) {
      alert("Something went wrong while summarizing.");
    } finally { setIsProcessing(false); }
  };

  const activeStudent = activeLesson ? students.find(s => s.id === activeLesson.studentId) : undefined;

  return (
    <Layout
      onHomeClick={() => setCurrentView('list')}
      onStudentsClick={() => setCurrentView('students')}
      activeView={currentView}
    >
      {currentView === 'list' && (
        <LessonList
          lessons={lessons}
          students={students}
          onSelectLesson={(l) => { setActiveLesson(l); setCurrentView(l.status === 'active' ? 'active' : 'details'); }}
          onNewLesson={handleStartLessonFlow}
          onDeleteLesson={handleDeleteLesson}
        />
      )}

      {currentView === 'select-student' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-slate-800">Who is this lesson for?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => handleSelectStudentForLesson(s.id)}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left font-bold text-lg flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                  {s.fullName.charAt(0)}
                </div>
                <span className="text-black">{s.fullName}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentView('list')}
            className="text-slate-400 font-medium hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
      )}

      {currentView === 'active' && activeLesson && (
        <ActiveLesson
          lesson={activeLesson}
          student={activeStudent}
          onAddRecording={handleAddRecording}
          onUpdateLesson={handleUpdateActiveLesson}
          onFinishLesson={handleFinishLesson}
          isProcessing={isProcessing}
        />
      )}

      {currentView === 'details' && activeLesson && (
        <LessonDetails
          lesson={activeLesson}
          student={activeStudent}
          onBack={() => setCurrentView('list')}
        />
      )}

      {currentView === 'students' && (
        <StudentManager
          students={students}
          onAddStudent={handleAddStudent}
          onDeleteStudent={handleDeleteStudent}
        />
      )}
    </Layout>
  );
};

export default App;
