
import React, { useState } from 'react';
import { Student } from '../types';

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (fullName: string) => void;
  onDeleteStudent: (id: string) => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({ students, onAddStudent, onDeleteStudent }) => {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddStudent(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Student</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Full Name (e.g., Tiger Woods)"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-black"
            required
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>Add</span>
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Student Directory</h2>
        {students.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            No students added yet. Add your first student above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {students.map((student) => (
              <div key={student.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center group transition-all hover:border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                    {student.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-black">{student.fullName}</h3>
                    <p className="text-xs text-slate-400">Joined {new Date(student.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteStudent(student.id)}
                  className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove Student"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManager;
