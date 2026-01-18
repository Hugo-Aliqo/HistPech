import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ChapterView } from './components/ChapterView';
import { HomeworkTracker } from './components/HomeworkTracker';
import { Settings } from './components/Settings';
import { AuthView } from './components/AuthView';
import { Chapter, UserProfile, Homework, Level } from './types';
import { LayoutDashboard, Settings as SettingsIcon, LogOut, Accessibility, BookOpenCheck } from 'lucide-react';

const INITIAL_USER: UserProfile = {
  name: 'Léo',
  email: '',
  grade: Level.TROISIEME,
  xp: 1450,
  level: 4,
  badges: ['1'],
  completedChapters: [],
  dyslexiaMode: false,
};

const INITIAL_HOMEWORK: Homework[] = [
    { id: '1', subject: 'Histoire', description: 'Réviser le chapitre sur le Néolithique', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], completed: false },
    { id: '2', subject: 'Mathématiques', description: 'Exercices 4 à 10 page 123', dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], completed: false },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [currentView, setCurrentView] = useState<'dashboard' | 'chapter' | 'homework' | 'settings'>('dashboard');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [homeworkList, setHomeworkList] = useState<Homework[]>(INITIAL_HOMEWORK);

  // Mock checking login
  useEffect(() => {
    // In a real app, check auth token in local storage here
  }, []);

  const handleLogin = (email: string) => {
    // In a real app, we would validate credentials here
    setUser(prev => ({ ...prev, email: email }));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setSelectedChapter(null);
    // Optional: Reset user state or keep it cached
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('chapter');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedChapter(null);
  };

  const handleChapterComplete = (id: string, xp: number) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + xp,
      completedChapters: [...prev.completedChapters, id]
    }));
    // Simple notification logic could go here
    alert(`Bravo ! Tu as gagné ${xp} XP !`);
  };

  const toggleDyslexiaMode = () => {
    setUser(prev => ({ ...prev, dyslexiaMode: !prev.dyslexiaMode }));
  };

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // Homework Handlers
  const addHomework = (hw: Omit<Homework, 'id'>) => {
    const newHw = { ...hw, id: Date.now().toString() };
    setHomeworkList(prev => [...prev, newHw]);
  };

  const toggleHomework = (id: string) => {
    setHomeworkList(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const deleteHomework = (id: string) => {
    setHomeworkList(prev => prev.filter(h => h.id !== id));
  };

  // If not authenticated, show Auth View
  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className={`h-screen w-full flex bg-slate-50 overflow-hidden ${user.dyslexiaMode ? 'font-dyslexic tracking-wide' : 'font-sans'}`}>
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r h-full shadow-sm z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">H</div>
          <span className="font-bold text-xl tracking-tight text-slate-800">HistPech</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={handleBackToDashboard}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={20} />
            Tableau de bord
          </button>
          
          <button 
            onClick={() => setCurrentView('homework')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'homework' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BookOpenCheck size={20} />
            Cahier de Textes
          </button>

          <button 
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'settings' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <SettingsIcon size={20} />
            Paramètres
          </button>
        </nav>

        <div className="p-4 border-t space-y-2">
            <button 
                onClick={toggleDyslexiaMode}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${user.dyslexiaMode ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Accessibility size={20} />
                {user.dyslexiaMode ? 'Mode Dys : ON' : 'Mode Dys : OFF'}
            </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b p-4 flex justify-between items-center">
            <span className="font-bold text-lg">HistPech</span>
            <div className="flex gap-2">
                <button onClick={() => setCurrentView('homework')} className="p-2 bg-gray-100 rounded-full">
                    <BookOpenCheck size={20} />
                </button>
                <button onClick={() => setCurrentView('settings')} className="p-2 bg-gray-100 rounded-full">
                    <SettingsIcon size={20} />
                </button>
                <button onClick={handleLogout} className="p-2 bg-red-50 text-red-500 rounded-full">
                    <LogOut size={20} />
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50">
          {currentView === 'dashboard' && (
            <Dashboard 
                user={user} 
                onSelectChapter={handleSelectChapter} 
                homeworkList={homeworkList}
            />
          )}
          
          {currentView === 'chapter' && selectedChapter && (
            <ChapterView 
              chapter={selectedChapter} 
              user={user}
              onBack={handleBackToDashboard} 
              onComplete={handleChapterComplete}
            />
          )}

          {currentView === 'homework' && (
            <HomeworkTracker 
                homeworkList={homeworkList}
                onAdd={addHomework}
                onToggle={toggleHomework}
                onDelete={deleteHomework}
                isDyslexic={user.dyslexiaMode}
            />
          )}

          {currentView === 'settings' && (
            <Settings 
                user={user}
                onUpdateUser={handleUpdateUser}
                isDyslexic={user.dyslexiaMode}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
