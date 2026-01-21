
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { getCoachResponse } from '../services/geminiService';

interface AICoachProps {
  onClose: () => void;
}

// Funciones de utilidad para la API Live (PCM, Base64)
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AICoach: React.FC<AICoachProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: string, text: string }[]>([
    { role: 'ai', text: 'Toma un respiro profundo. Soy tu coach de bienestar. ¿Cómo te sientes respecto a tu dinero hoy?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const liveSessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isLiveMode]);

  const stopLiveMode = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }
    if (audioContextsRef.current) {
      audioContextsRef.current.input.close();
      audioContextsRef.current.output.close();
      audioContextsRef.current = null;
    }
    for (const source of sourcesRef.current) {
      source.stop();
    }
    sourcesRef.current.clear();
    setIsLiveMode(false);
    setIsLiveConnecting(false);
  };

  const startLiveMode = async () => {
    try {
      setIsLiveConnecting(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Sesión en vivo abierta');
            setIsLiveConnecting(false);
            setIsLiveMode(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextsRef.current) {
              const outCtx = audioContextsRef.current.output;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const s of sourcesRef.current) s.stop();
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Error Live:', e),
          onclose: () => stopLiveMode(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: "Eres el Coach de Bienestar de 'Mis Gastos en Orden'. Habla con tranquilidad y sabiduría en español. Mantén las respuestas cortas y calmantes.",
        },
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Error al iniciar modo en vivo:', err);
      setIsLiveConnecting(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const response = await getCoachResponse(history, userMsg);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-background-dark w-full max-w-lg h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/20 relative">
        <div className="p-6 bg-primary text-white flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined text-3xl ${isLiveMode ? 'animate-pulse text-secondary-green' : ''}`}>
              {isLiveMode ? 'graphic_eq' : 'psychology'}
            </span>
            <div>
              <h3 className="font-bold text-lg">Coach de Bienestar</h3>
              <p className="text-xs opacity-80">{isLiveMode ? 'Voz en Vivo Activa' : 'IA para tu Calma'}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isLiveMode && (
          <div className="absolute inset-0 top-20 bg-primary/95 backdrop-blur-md flex flex-col items-center justify-center text-white z-20 animate-in zoom-in duration-300">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <div className="relative size-32 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl">
                <span className="material-symbols-outlined text-6xl">mic</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Escuchando...</h2>
            <p className="text-white/80 text-center px-10 mb-10">Habla con naturalidad sobre tus sentimientos financieros.</p>
            <button 
              onClick={stopLiveMode}
              className="px-8 py-3 bg-white text-primary rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-transform"
            >
              Detener Voz
            </button>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-background-light dark:bg-background-dark">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex gap-1">
                  <div className="size-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <button 
            onClick={isLiveMode ? stopLiveMode : startLiveMode}
            disabled={isLiveConnecting}
            className={`size-10 rounded-full flex items-center justify-center transition-all ${
              isLiveMode ? 'bg-red-500 text-white animate-pulse' : 'bg-secondary-green/20 text-secondary-green hover:bg-secondary-green hover:text-white'
            } disabled:opacity-50`}
            title="Iniciar Sesión de Voz"
          >
            <span className="material-symbols-outlined">{isLiveConnecting ? 'sync' : 'mic'}</span>
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Comparte lo que tienes en mente..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-full px-5 text-sm focus:ring-primary focus:border-primary dark:text-white transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping || isLiveMode}
            className="size-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 shadow-md"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
