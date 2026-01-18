import React, { useState } from 'react';
import { Mail, ArrowRight, BookOpen, GraduationCap, BrainCircuit } from 'lucide-react';

interface AuthViewProps {
  onLogin: (email: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [viewState, setViewState] = useState<'welcome' | 'login'>('welcome');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-200">
          H
        </div>
        <span className="font-bold text-3xl tracking-tight text-slate-800">HistPech</span>
      </div>

      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border overflow-hidden">
        
        {/* Welcome Mode */}
        {viewState === 'welcome' && (
          <div className="p-8 text-center space-y-6">
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-2">
               <GraduationCap size={32} />
            </div>
            
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue !</h1>
                <p className="text-gray-600 leading-relaxed">
                  Ta plateforme de soutien scolaire intelligente, de la 6ème à la Terminale.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 py-4">
                <div className="flex flex-col items-center gap-1">
                    <BookOpen size={20} className="text-blue-500" />
                    <span>Cours</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <BrainCircuit size={20} className="text-purple-500" />
                    <span>IA Tuteur</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <GraduationCap size={20} className="text-green-500" />
                    <span>Réussite</span>
                </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => onLogin('nouveau@eleve.fr')} // Simulates registration
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-md shadow-blue-100 flex items-center justify-center gap-2"
              >
                Commencer l'aventure
                <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={() => setViewState('login')}
                className="w-full bg-white border-2 border-gray-100 hover:border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors"
              >
                J'ai déjà un compte
              </button>
            </div>
          </div>
        )}

        {/* Login Mode */}
        {viewState === 'login' && (
          <div className="p-8">
            <button 
                onClick={() => setViewState('welcome')}
                className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1"
            >
                ← Retour
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connexion</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            placeholder="ton.email@exemple.com"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                    Se connecter
                    <ArrowRight size={18} />
                </button>
            </form>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        © 2024 HistPech AI. Soutien scolaire conforme à l'Éducation Nationale.
      </p>
    </div>
  );
};
