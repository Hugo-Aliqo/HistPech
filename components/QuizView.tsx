import React, { useState } from 'react';
import { QuizQuestion, SubjectType } from '../types';
import { CheckCircle, XCircle, ArrowRight, RefreshCcw, Trophy, BrainCircuit } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  subject: SubjectType;
  onComplete: (score: number) => void;
  xpReward: number;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, subject, onComplete, xpReward }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleValidate = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
      // Play sound effect could go here
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
      onComplete(score + (selectedOption === currentQuestion.correctAnswerIndex ? 1 : 0));
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  // Color logic based on subject
  const getSubjectColor = () => {
    switch (subject) {
      case SubjectType.HISTORY: return 'bg-red-600';
      case SubjectType.GEOGRAPHY: return 'bg-blue-600';
      case SubjectType.EMC: return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const isSuccess = percentage >= 50;

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isSuccess ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
          {isSuccess ? <Trophy size={48} /> : <BrainCircuit size={48} />}
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isSuccess ? 'Félicitations !' : 'Continue tes efforts !'}
        </h2>
        
        <p className="text-xl text-gray-600 mb-8">
          Tu as obtenu un score de <span className="font-bold text-gray-900">{score}/{questions.length}</span> ({percentage}%)
        </p>

        {isSuccess && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
             <div className="bg-yellow-400 text-white p-2 rounded-lg font-bold">+{Math.floor(xpReward / 2)} XP</div>
             <span className="text-yellow-800 font-medium">Bonus de quiz validé !</span>
          </div>
        )}

        <button 
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <RefreshCcw size={20} />
          Recommencer le quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${getSubjectColor()}`} 
          style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 mb-6">
        <div className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">
          Question {currentQuestionIndex + 1}/{questions.length}
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonStyle = "border-gray-200 hover:bg-gray-50 hover:border-gray-300";
            let icon = <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>;

            if (isAnswered) {
              if (index === currentQuestion.correctAnswerIndex) {
                buttonStyle = "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500";
                icon = <CheckCircle className="text-green-600" size={24} />;
              } else if (index === selectedOption) {
                buttonStyle = "bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500";
                icon = <XCircle className="text-red-600" size={24} />;
              } else {
                buttonStyle = "opacity-50 border-gray-100";
              }
            } else if (selectedOption === index) {
              buttonStyle = "border-blue-500 bg-blue-50 ring-1 ring-blue-500 text-blue-800";
              icon = <div className="w-6 h-6 border-[6px] border-blue-600 rounded-full"></div>;
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${buttonStyle}`}
              >
                <span className="font-medium text-lg">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation & Controls */}
      {isAnswered ? (
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-indigo-900">
            <span className="font-bold flex items-center gap-2 mb-2">
              <BrainCircuit size={18} /> Explication :
            </span>
            <p>{currentQuestion.explanation}</p>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-lg transform hover:scale-105 transition-all ${getSubjectColor()}`}
            >
              {isLastQuestion ? 'Voir les résultats' : 'Question suivante'} <ArrowRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleValidate}
            disabled={selectedOption === null}
            className="px-8 py-4 rounded-xl font-bold text-white bg-gray-900 shadow-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Valider la réponse
          </button>
        </div>
      )}

    </div>
  );
};
