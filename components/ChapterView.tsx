import React, { useState } from 'react';
import { Chapter, UserProfile } from '../types';
import { AIChat } from './AIChat';
import { QuizView } from './QuizView';
import { BookOpen, BookA, Bot, ArrowLeft, BrainCircuit } from 'lucide-react';
import { SUBJECT_BG, SUBJECT_COLORS } from '../constants';

interface ChapterViewProps {
  chapter: Chapter;
  user: UserProfile;
  onBack: () => void;
  onComplete: (id: string, xp: number) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ chapter, user, onBack, onComplete }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'lexicon' | 'ai' | 'quiz'>('content');
  const [completed, setCompleted] = useState(user.completedChapters.includes(chapter.id));

  const handleFinish = () => {
    if (!completed) {
      setCompleted(true);
      onComplete(chapter.id, chapter.xpReward);
    }
  };

  const handleQuizComplete = (score: number) => {
    // Grant bonus XP if quiz is passed with > 50%
    const totalQuestions = chapter.quiz?.length || 1;
    if (score / totalQuestions >= 0.5 && !completed) {
        // We could implement separate XP for quiz later, for now we assume quiz part of chapter completion
        // or just a bonus. Let's trigger a bonus notification in a real app.
    }
  };

  const subjectColor = SUBJECT_COLORS[chapter.subject];
  const subjectBg = SUBJECT_BG[chapter.subject];

  return (
    <div className={`h-full flex flex-col ${user.dyslexiaMode ? 'font-dyslexic leading-relaxed' : ''}`}>
      {/* Chapter Header */}
      <div className={`p-6 ${subjectBg} text-white shadow-md`}>
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
          <ArrowLeft size={20} />
          Retour au tableau de bord
        </button>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-medium opacity-90 px-2 py-1 bg-white/20 rounded mb-2 inline-block">
              {chapter.subject} • {chapter.level}
            </span>
            <h1 className="text-3xl font-bold">{chapter.title}</h1>
          </div>
          {!completed && (
             <div className="bg-white/20 px-3 py-1 rounded text-sm font-semibold backdrop-blur-sm">
                +{chapter.xpReward} XP
             </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white overflow-x-auto">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'content' ? `border-b-2 ${subjectColor} text-gray-900` : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <BookOpen size={18} />
          Cours
        </button>
        <button
          onClick={() => setActiveTab('lexicon')}
          className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'lexicon' ? `border-b-2 ${subjectColor} text-gray-900` : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <BookA size={18} />
          Lexique
        </button>
        {chapter.quiz && chapter.quiz.length > 0 && (
            <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'quiz' ? `border-b-2 ${subjectColor} text-gray-900` : 'text-gray-500 hover:bg-gray-50'}`}
            >
            <BrainCircuit size={18} />
            Quiz
            </button>
        )}
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'ai' ? `border-b-2 ${subjectColor} text-gray-900` : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Bot size={18} />
          Tuteur IA
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
        <div className="max-w-4xl mx-auto h-full">
          {activeTab === 'content' && (
            <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
              <div className="prose max-w-none text-gray-800">
                {/* Simple Markdown rendering replacement for demo */}
                {chapter.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mb-4 text-gray-900">{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className={`text-2xl font-semibold mt-6 mb-3 ${subjectColor.split(' ')[0]}`}>{line.replace('## ', '')}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold mt-4 mb-2 text-gray-800">{line.replace('### ', '')}</h3>;
                  if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc marker:text-gray-400">{line.replace('* ', '')}</li>;
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="mb-2 leading-relaxed">{line}</p>;
                })}
              </div>
              <div className="pt-8 flex justify-end">
                <button
                  onClick={handleFinish}
                  disabled={completed}
                  className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg transform transition hover:scale-105 active:scale-95 ${completed ? 'bg-gray-400 cursor-default' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
                >
                  {completed ? 'Chapitre terminé' : 'Marquer comme terminé'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'lexicon' && (
            <div className="grid gap-4 md:grid-cols-2">
              {chapter.lexicon.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.term}</h3>
                  <p className="text-gray-600">{item.definition}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quiz' && chapter.quiz && (
             <QuizView 
                questions={chapter.quiz} 
                subject={chapter.subject} 
                onComplete={handleQuizComplete}
                xpReward={chapter.xpReward}
             />
          )}

          {activeTab === 'ai' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
                💡 <strong>Mode Tutorat :</strong> L'IA ne te donnera pas la réponse directement. Elle est là pour te faire réfléchir et t'aider à analyser tes documents.
              </div>
              <AIChat subject={chapter.subject} level={chapter.level} isDyslexic={user.dyslexiaMode} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
