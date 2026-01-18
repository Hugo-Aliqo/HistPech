import React from 'react';
import { BADGES, MOCK_CHAPTERS, SUBJECT_COLORS } from '../constants';
import { Chapter, UserProfile, Homework } from '../types';
import { Trophy, Flame, BarChart3, Clock, BookOpenCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  onSelectChapter: (chapter: Chapter) => void;
  homeworkList?: Homework[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onSelectChapter, homeworkList = [] }) => {
  // Stats Data
  const data = [
    { name: 'Histoire', value: 40, color: '#e11d48' },
    { name: 'Géo', value: 30, color: '#2563eb' },
    { name: 'EMC', value: 30, color: '#16a34a' },
  ];

  const pendingHomework = homeworkList.filter(h => !h.completed);

  return (
    <div className={`p-6 md:p-10 max-w-7xl mx-auto ${user.dyslexiaMode ? 'font-dyslexic' : ''}`}>
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bonjour, {user.name} 👋</h1>
          <p className="text-indigo-200">Prêt à continuer ton apprentissage ? Tu es au niveau {user.level} !</p>
          <div className="mt-4 flex items-center gap-4">
             <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                <Flame className="text-orange-400" size={20} />
                <span className="font-bold">5 jours</span>
                <span className="text-sm opacity-70">série</span>
             </div>
             <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                <Trophy className="text-yellow-400" size={20} />
                <span className="font-bold">{user.xp} XP</span>
             </div>
          </div>
        </div>
        <div className="hidden md:block w-32 h-32">
            {/* Simple Pie Chart for visual appeal */}
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="value">
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Chapters */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="text-gray-500" />
                Reprendre les cours
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {MOCK_CHAPTERS.map((chapter) => (
                <div 
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter)}
                  className={`group bg-white rounded-xl border p-5 cursor-pointer hover:shadow-lg transition-all border-l-4 ${chapter.subject === 'Histoire' ? 'border-l-history' : chapter.subject === 'Géographie' ? 'border-l-geo' : 'border-l-emc'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded bg-gray-100 ${SUBJECT_COLORS[chapter.subject].split(' ')[0]}`}>
                        {chapter.subject.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{chapter.level}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                    {chapter.title}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                     <span className="flex items-center gap-1">
                        <Clock size={14} /> 15 min
                     </span>
                     {user.completedChapters.includes(chapter.id) ? (
                         <span className="text-green-600 font-medium flex items-center gap-1">
                             ✓ Terminé
                         </span>
                     ) : (
                         <span className="text-indigo-600 font-medium">Commencer →</span>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Badges & Progress */}
        <div className="space-y-8">
          
          {/* Homework Summary Widget */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
             <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 relative z-10">
                <BookOpenCheck className="text-orange-500" size={20} />
                Devoirs à faire
             </h2>
             {pendingHomework.length > 0 ? (
                 <div className="space-y-3 relative z-10">
                     {pendingHomework.slice(0, 3).map(hw => (
                         <div key={hw.id} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-orange-50 transition-colors">
                             <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                 hw.subject === 'Histoire' ? 'bg-red-500' : 
                                 hw.subject === 'Géographie' ? 'bg-blue-500' : 'bg-gray-400'
                             }`}></div>
                             <div className="flex-1 truncate">
                                 <div className="font-medium text-gray-800 truncate">{hw.description}</div>
                                 <div className="text-xs text-gray-500">
                                    Pour le {new Date(hw.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                 </div>
                             </div>
                         </div>
                     ))}
                     {pendingHomework.length > 3 && (
                         <div className="text-center pt-2 text-xs text-gray-500">
                             + {pendingHomework.length - 3} autres devoirs
                         </div>
                     )}
                 </div>
             ) : (
                 <p className="text-sm text-gray-500">Aucun devoir en attente. Bien joué ! 🎉</p>
             )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Mes Badges
            </h2>
            <div className="space-y-4">
                {BADGES.map(badge => (
                    <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-lg ${user.badges.includes(badge.id) ? badge.color : 'bg-gray-50 opacity-50 grayscale'}`}>
                        <div className="text-2xl">{badge.icon}</div>
                        <div>
                            <div className="font-bold text-sm">{badge.name}</div>
                            <div className="text-xs opacity-80">{badge.description}</div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
             <h3 className="font-bold text-indigo-900 mb-2">Défi Hebdo</h3>
             <p className="text-sm text-indigo-700 mb-4">Complète 3 chapitres d'Histoire cette semaine pour gagner le badge "Révolutionnaire".</p>
             <div className="w-full bg-indigo-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '33%' }}></div>
             </div>
             <p className="text-right text-xs text-indigo-600 mt-1 font-bold">1/3</p>
          </div>
        </div>
      </div>
    </div>
  );
};
