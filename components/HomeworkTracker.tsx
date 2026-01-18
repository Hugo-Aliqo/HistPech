import React, { useState } from 'react';
import { Homework } from '../types';
import { Calendar, CheckCircle, Circle, Plus, Trash2, BookOpenCheck } from 'lucide-react';

interface HomeworkTrackerProps {
  homeworkList: Homework[];
  onAdd: (hw: Omit<Homework, 'id'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDyslexic: boolean;
}

const SUBJECT_OPTIONS = ['Histoire', 'Géographie', 'EMC', 'Mathématiques', 'Français', 'Anglais', 'SVT', 'Physique-Chimie', 'Autre'];

export const HomeworkTracker: React.FC<HomeworkTrackerProps> = ({ homeworkList, onAdd, onToggle, onDelete, isDyslexic }) => {
  const [newSubject, setNewSubject] = useState(SUBJECT_OPTIONS[0]);
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newDate) return;
    onAdd({
      subject: newSubject,
      description: newDesc,
      dueDate: newDate,
      completed: false
    });
    setNewDesc('');
    setNewDate('');
  };

  const getDaysRemaining = (dateStr: string) => {
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const sortedHomework = [...homeworkList].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className={`p-6 md:p-10 max-w-5xl mx-auto h-full flex flex-col ${isDyslexic ? 'font-dyslexic' : ''}`}>
      
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
            <BookOpenCheck size={32} />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Cahier de Textes</h1>
            <p className="text-gray-500">Gère tes devoirs et tes échéances.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-0">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus className="text-blue-600" /> Nouveau devoir
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                <select 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                >
                  {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">À faire</label>
                <input 
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ex: Exercice page 42..."
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pour le</label>
                <input 
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button 
                type="submit"
                disabled={!newDesc || !newDate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar">
          {homeworkList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed">
                  <BookOpenCheck size={48} className="mb-2 opacity-50" />
                  <p>Aucun devoir pour le moment !</p>
              </div>
          ) : (
              <div className="space-y-3">
                {sortedHomework.map((hw) => {
                  const daysLeft = getDaysRemaining(hw.dueDate);
                  const isLate = daysLeft < 0 && !hw.completed;
                  const isToday = daysLeft === 0 && !hw.completed;

                  return (
                    <div 
                      key={hw.id}
                      className={`group flex items-center p-4 rounded-xl border transition-all hover:shadow-md ${hw.completed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100'}`}
                    >
                      <button 
                        onClick={() => onToggle(hw.id)}
                        className={`mr-4 transition-colors ${hw.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
                      >
                        {hw.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                hw.subject === 'Histoire' ? 'bg-red-100 text-red-700' :
                                hw.subject === 'Géographie' ? 'bg-blue-100 text-blue-700' :
                                hw.subject === 'EMC' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {hw.subject}
                            </span>
                            {isLate && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1">⚠ En retard</span>}
                            {isToday && <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">À rendre aujourd'hui</span>}
                        </div>
                        <h3 className={`font-medium ${hw.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{hw.description}</h3>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-1 text-sm ${isLate ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                            <Calendar size={14} />
                            {new Date(hw.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </div>
                        <button 
                            onClick={() => onDelete(hw.id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
