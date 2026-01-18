import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Volume2, StopCircle, Loader2 } from 'lucide-react';
import { streamTutorResponse } from '../services/geminiService';
import { Level, Message, SubjectType } from '../types';
import { GenerateContentResponse } from '@google/genai';

interface AIChatProps {
  subject: SubjectType;
  level: Level;
  isDyslexic: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ subject, level, isDyslexic }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: `Bonjour ! Je suis ton assistant en ${subject}. Comment puis-je t'aider à comprendre le cours aujourd'hui ?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech Synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSpeak = (text: string) => {
    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      isImage: !!selectedImage
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare image for API if exists
    let imagePart = undefined;
    if (selectedImage) {
      // Extract base64 (remove data:image/xxx;base64, prefix)
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.substring(selectedImage.indexOf(':') + 1, selectedImage.indexOf(';'));
      imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      };
      setSelectedImage(null); // Clear image after sending
    }

    try {
      // Create a temporary model message for streaming
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

      // Get history for context (exclude the very latest message we just added to UI state to avoid duplication if we handle it manually, but logic here passes prev messages)
      const history = messages.map(m => ({ role: m.role, text: m.text }));

      const stream = await streamTutorResponse(history, userMsg.text, level, subject, imagePart);
      
      let fullText = '';
      
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === modelMsgId ? { ...msg, text: fullText } : msg
            )
          );
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Désolé, j'ai rencontré une erreur. Réessaie s'il te plaît." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[600px] border rounded-xl bg-white shadow-sm overflow-hidden ${isDyslexic ? 'font-dyslexic tracking-wide' : ''}`}>
      {/* Header */}
      <div className={`p-4 border-b flex justify-between items-center bg-gray-50`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full animate-pulse bg-green-500`}></div>
          <span className="font-semibold text-gray-700">Assistant IA</span>
        </div>
        <button 
          onClick={() => setMessages([{ id: 'reset', role: 'model', text: 'Conversation réinitialisée.' }])}
          className="text-xs text-gray-500 hover:text-red-500"
        >
          Réinitialiser
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.isImage && <div className="text-xs italic mb-1 opacity-75">[Image envoyée]</div>}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              
              {msg.role === 'model' && msg.text.length > 0 && (
                 <button 
                   onClick={() => handleSpeak(msg.text)}
                   className="mt-2 text-gray-500 hover:text-gray-800 transition-colors"
                   aria-label="Lire le texte"
                 >
                   {isSpeaking ? <StopCircle size={16} /> : <Volume2 size={16} />}
                 </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-2">
                <Loader2 className="animate-spin text-blue-600" size={16} />
                <span className="text-sm text-gray-500">L'IA réfléchit...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        {selectedImage && (
            <div className="mb-2 p-2 bg-gray-50 border rounded-lg flex items-center justify-between">
                <span className="text-xs text-gray-600 truncate">Image sélectionnée</span>
                <button onClick={() => setSelectedImage(null)} className="text-xs text-red-500 hover:underline">Supprimer</button>
            </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors ${selectedImage ? 'text-blue-600 bg-blue-50' : ''}`}
            title="Analyser un document"
          >
            <ImageIcon size={20} />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Pose ta question..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button 
            onClick={sendMessage}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
