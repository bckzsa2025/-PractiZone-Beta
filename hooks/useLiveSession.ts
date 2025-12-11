/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// Initialize exclusively from environment variables.
// Fix: Cast import.meta to any to resolve TypeScript error 'Property env does not exist on type ImportMeta'
const API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const useLiveSession = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
  const [error, setError] = useState<string | null>(null);

  // Audio Contexts
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Session Cursor
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);

  const stopSession = useCallback(() => {
    // 1. Close session connection
    if (sessionRef.current) {
        sessionRef.current = null;
    }

    // 2. Stop Input
    if (inputSourceRef.current) inputSourceRef.current.disconnect();
    if (processorRef.current) processorRef.current.disconnect();
    if (inputContextRef.current) inputContextRef.current.close();
    inputContextRef.current = null;

    // 3. Stop Output
    activeSourcesRef.current.forEach(source => source.stop());
    activeSourcesRef.current.clear();
    if (outputContextRef.current) outputContextRef.current.close();
    outputContextRef.current = null;

    setIsConnected(false);
    setIsSpeaking(false);
  }, []);

  const startSession = useCallback(async () => {
    try {
      setError(null);
      
      // Initialize Audio Contexts
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputNodeRef.current = outputContextRef.current.createGain();
      outputNodeRef.current.connect(outputContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are Dr. Setzer's helpful voice assistant. Keep answers concise and friendly.",
        },
        callbacks: {
          onopen: () => {
            console.log("Live Session Opened");
            setIsConnected(true);

            // Start Input Streaming
            if (!inputContextRef.current) return;
            
            const source = inputContextRef.current.createMediaStreamSource(stream);
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Convert Float32 to PCM16
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
              }
              
              // Base64 Encode
              const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64Audio
                  }
                });
              });
            };

            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
            
            inputSourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputContextRef.current) {
               setIsSpeaking(true);
               
               // Decode
               const binaryString = atob(audioData);
               const bytes = new Uint8Array(binaryString.length);
               for(let i=0; i<binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
               
               const float32Data = new Float32Array(bytes.length / 2);
               const dataView = new DataView(bytes.buffer);
               
               for (let i = 0; i < float32Data.length; i++) {
                 float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
               }

               const audioBuffer = outputContextRef.current.createBuffer(1, float32Data.length, 24000);
               audioBuffer.getChannelData(0).set(float32Data);

               const source = outputContextRef.current.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(outputNodeRef.current!);
               
               // Scheduling
               const currentTime = outputContextRef.current.currentTime;
               if (nextStartTimeRef.current < currentTime) {
                 nextStartTimeRef.current = currentTime;
               }
               
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
               
               activeSourcesRef.current.add(source);
               source.onended = () => {
                 activeSourcesRef.current.delete(source);
                 if (activeSourcesRef.current.size === 0) {
                   setIsSpeaking(false);
                 }
               };
            }
          },
          onclose: () => {
            console.log("Live Session Closed");
            stopSession();
          },
          onerror: (err) => {
            console.error("Live Session Error", err);
            setError("Connection error");
            stopSession();
          }
        }
      });
      
      sessionRef.current = await sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start audio session");
      stopSession();
    }
  }, [stopSession]);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return { isConnected, isSpeaking, error, startSession, stopSession };
};