
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
  onStudentsClick: () => void;
  activeView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick, onStudentsClick, activeView }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button 
            onClick={onHomeClick}
            className="flex items-center space-x-2 group"
          >
            <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="m14 11-1-1v4"/><path d="M15 15h-2"/><path d="M11 11h2"/><path d="M8 11h1"/><path d="M15 11h1"/></svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Caddy Notes</h1>
          </button>
          
          <nav className="flex items-center space-x-1 bg-emerald-800/50 p-1 rounded-xl border border-emerald-600/30">
            <button 
              onClick={onHomeClick}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeView === 'list' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:bg-white/10'}`}
            >
              Lessons
            </button>
            <button 
              onClick={onStudentsClick}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeView === 'students' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:bg-white/10'}`}
            >
              Students
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {children}
      </main>
    </div>
  );
};

export default Layout;
