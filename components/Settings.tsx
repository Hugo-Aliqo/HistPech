import React, { useState } from 'react';
import { Level, UserProfile } from '../types';
import { User, Mail, GraduationCap, Save, Check } from 'lucide-react';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  isDyslexic: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, isDyslexic }) => {
  const [email, setEmail] = useState(user.email || '');
  const [name, setName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onUpdateUser({ name, email });
      setIsSaving(false);
      setSaveMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  const handleLevelChange = (newLevel: Level) => {
    onUpdateUser({ grade: newLevel });
  };

  return (
    <div className={`p-6 md:p-10 max-w-4xl mx-auto ${isDyslexic ? 'font-dyslexic' : ''}`}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
            <User size={32} className="text-gray-700" />
        </div>
        Paramètres
      </h1>

      <div className="grid gap-8">
        
        {/* Account Section */}
        <section className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
            <Mail className="text-blue-600" size={20} />
            Mon Compte
          </h2>
          
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ton prénom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="eleve@exemple.com"
              />
              <p className="text-xs text-gray-500 mt-1">Utilisé pour sauvegarder ta progression et te connecter.</p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button 
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-70"
              >
                {isSaving ? 'Enregistrement...' : <><Save size={18} /> Enregistrer</>}
              </button>
              {saveMessage && (
                <span className="text-green-600 text-sm font-medium flex items-center gap-1 animate-fade-in">
                  <Check size={16} /> {saveMessage}
                </span>
              )}
            </div>
          </form>
        </section>

        {/* School Level Section */}
        <section className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
            <GraduationCap className="text-indigo-600" size={20} />
            Niveau Scolaire
          </h2>
          
          <p className="text-gray-600 mb-4">Sélectionne ta classe actuelle pour adapter les cours et les exercices.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(Level).map((lvl) => {
               const isSelected = user.grade === lvl;
               return (
                 <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className={`p-4 rounded-xl border-2 transition-all text-center font-medium
                      ${isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                      }
                    `}
                 >
                   {lvl}
                   {isSelected && <div className="text-xs text-indigo-500 mt-1 font-bold">Sélectionné</div>}
                 </button>
               );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
