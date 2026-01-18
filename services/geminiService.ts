import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Level, SubjectType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_BASE = `
Tu es "L'Appui Pédagogique", un assistant IA expert pour le système scolaire français (Collège et Lycée).
Ton objectif n'est JAMAIS de donner la réponse directement, mais d'utiliser la méthode socratique.
Guide l'élève par des questions, des indices et des reformulations pour qu'il comprenne par lui-même.

Règles strictes :
1. Adopte un ton encourageant, patient et adapté au niveau scolaire de l'élève.
2. Si l'élève envoie une image (document, carte, texte), analyse-la en détail et aide-le à en extraire les informations clés.
3. Reste strictement dans le cadre des programmes officiels de l'Éducation Nationale (Histoire, Géo, EMC).
4. Refuse poliment de traiter des sujets hors programme ou inappropriés.
5. Sois concis.
`;

export const getGeminiModel = (level: Level, subject: SubjectType) => {
  // Use flash for speed and interactivity, pro for complex document analysis if needed.
  // Using Flash generally for speed in chat.
  return "gemini-2.5-flash-latest";
};

export const streamTutorResponse = async (
  history: { role: string; text: string }[],
  currentMessage: string,
  level: Level,
  subject: SubjectType,
  imagePart?: { inlineData: { data: string; mimeType: string } }
) => {
  const modelId = getGeminiModel(level, subject);
  
  // Construct the conversation history for context
  // Note: For simple streaming in this demo, we are using generateContentStream with tailored prompts.
  // In a full chat object, we'd use ai.chats.create, but here we manually construct context for flexibility with images.

  const contextPrompt = `
    Niveau scolaire : ${level}
    Matière : ${subject}
    
    Historique de la conversation :
    ${history.map(m => `${m.role === 'user' ? 'Élève' : 'Tuteur'}: ${m.text}`).join('\n')}
    
    Nouvelle question de l'élève : ${currentMessage}
  `;

  const parts: any[] = [{ text: contextPrompt }];
  if (imagePart) {
    parts.unshift(imagePart);
  }

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-latest",
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        temperature: 0.7, // Balance between creativity and accuracy
      }
    });

    return responseStream;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
