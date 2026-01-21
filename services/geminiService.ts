
import { GoogleGenAI, Type } from "@google/genai";

// Función segura para obtener la API Key sin romper el hilo principal si process no existe aún
const getApiKey = () => {
  try {
    return (globalThis as any).process?.env?.API_KEY || "";
  } catch {
    return "";
  }
};

const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

export const generatePeacePill = async () => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Genera una 'píldora de paz' financiera breve y calmante en español. Debe ser una sola frase de consejo o aliento sobre el dinero, centrada en la conciencia plena (mindfulness), e incluir un dato breve sobre cómo los pequeños ahorros suman. Máximo 30 palabras.",
      config: {
        systemInstruction: "Eres un coach de bienestar financiero que habla con tranquilidad y sabiduría. Usa un tono cálido y alentador en español. Evita tecnicismos.",
      }
    });
    return response.text || "Los pequeños pasos llevan a grandes horizontes. La claridad comienza con la conciencia.";
  } catch (error) {
    console.error("Error generating peace pill:", error);
    return "Tu camino financiero está despejado y en calma hoy. Respira profundo.";
  }
};

export const parseExpense = async (input: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza esta descripción de gasto en español: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER, description: "El monto numérico" },
            category: { type: Type.STRING, description: "Categoría del gasto en español" },
            merchant: { type: Type.STRING, description: "Nombre del comercio" },
            note: { type: Type.STRING, description: "Una nota breve y amable" }
          },
          required: ["amount", "category"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error parsing expense:", error);
    return null;
  }
};

export const getCoachResponse = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "Eres el Coach de Bienestar de 'Mis Gastos en Orden'. Tu objetivo es ayudar a los usuarios a sentirse en paz con sus finanzas en español. Nunca juzgues. Ofrece consejos prácticos y calmantes. Responde siempre en español de forma concisa.",
      }
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error in coach chat:", error);
    return "Estoy aquí para escucharte. Veamos esto paso a paso.";
  }
};
