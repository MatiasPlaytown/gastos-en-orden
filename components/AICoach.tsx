
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { getCoachResponse } from '../services/geminiService';

interface AICoachProps {
  onClose: () => void;
}

const getSafeApiKey = () => {
  try {
    return (globalThis as any).process?.env?.API_KEY || "";
  } catch {
    return "";
  }
};

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
    { role: 'ai', text: 'Hola, respira hondo. Soy tu guía de bienestar. ¿Cómo te sientes respecto a tu economía hoy?' }
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
      try { liveSessionRef.current.close(); } catch {}
      liveSessionRef.current = null;
    }
    if (audioContextsRef.current) {
      try { audioContextsRef.current.input.close(); } catch {}
      try { audioContextsRef.current.output.close(); } catch {}
      audioContextsRef.current = null;
    }
    for (const source of sourcesRef.current) {
      try { source.stop(); } catch {}
    }
    sourcesRef.current.clear();
    setIsLiveMode(false);
    setIsLiveConnecting(false);
  };

  const startLiveMode = async () => {
    const key = getSafeApiKey();
    if (!key) {
      alert("Configurando conexión segura... Por favor, intenta de nuevo en unos segundos.");
      return;
    }

    try {
      setIsLiveConnecting(true);
      const ai = new GoogleGenAI({ apiKey: key });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLiveConnecting(false);
            setIsLiveMode(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              if (!isLiveMode) return;
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
              for (const s of sourcesRef.current) try { s.stop(); } catch {}
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: () => stopLiveMode(),
          onclose: () => stopLiveMode(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: "Eres el Coach de Bienestar de 'Mis Gastos en Orden'. Habla con tranquilidad y sabiduría en español. Sé extremadamente breve y calmante.",
        },
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Error Live:', err);
      setIsLiveConnecting(false);
      alert("No se pudo iniciar la voz. ¿Diste permiso al micrófono?");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-primary/20 relative">
        <div className="p-7 bg-primary text-white flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className={`material-symbols-outlined text-2xl ${isLiveMode ? 'animate-pulse text-secondary-green' : ''}`}>
                {isLiveMode ? 'graphic_eq' : 'psychology'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base">Coach de Bienestar</h3>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">{isLiveMode ? 'Escuchando con voz' : 'Chat inteligente'}</p>
            </div>
          </div>
          <button onClick={() => { stopLiveMode(); onClose(); }} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isLiveMode && (
          <div className="absolute inset-0 top-[88px] bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center text-white z-20 animate-in zoom-in duration-300 px-10 text-center">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <div className="relative size-32 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl">
                <span className="material-symbols-outlined text-6xl">mic</span>
              </div>
            </div>
            <h2 className="text-2xl font-black mb-3">Estoy escuchando...</h2>
            <p className="text-white/80 font-medium mb-12">Cuéntame qué te preocupa hoy o qué te hace sentir bien con tu dinero.</p>
            <button 
              onClick={stopLiveMode}
              className="px-10 py-4 bg-white text-primary rounded-full font-black shadow-xl hover:scale-105 active:scale-95 transition-transform"
            >
              Cerrar voz
            </button>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-background-light dark:bg-slate-900">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex gap-1.5">
                  <div className="size-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          <button 
            onClick={isLiveMode ? stopLiveMode : startLiveMode}
            disabled={isLiveConnecting}
            className={`size-12 rounded-full flex items-center justify-center transition-all ${
              isLiveMode ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
            } disabled:opacity-50`}
            title="Hablar por voz"
          >
            <span className="material-symbols-outlined">{isLiveConnecting ? 'hourglass_top' : 'mic'}</span>
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="¿Qué hay en tu mente?..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full px-6 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary dark:text-white transition-all"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping || isLiveMode}
            className="size-12 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
