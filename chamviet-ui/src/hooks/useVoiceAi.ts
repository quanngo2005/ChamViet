import { useState, useRef, useCallback } from "react";

interface UseVoiceAIOptions {
  backendUrl: string;
  onResponse?: (text: string, audioUrl: string) => void;
  onError?: (error: any) => void;
}

export function useVoiceAI({ backendUrl, onResponse, onError }: UseVoiceAIOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiText, setAiText] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await processVoiceFlow(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Không thể truy cập micro:", err);
      onError?.(err);
    }
  }, [onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      // Ngắt các luồng audio cũ của stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, [isRecording]);

  const processVoiceFlow = async (audioBlob: Blob) => {
    try {
      // 1. STT: Chuyển giọng nói thành văn bản
      const formData = new FormData();
      formData.append("file", audioBlob);
      const sttRes = await fetch(`${backendUrl}/api/transcribe`, { method: "POST", body: formData });
      const { text: userText } = await sttRes.json();

      // 2. Classify: Phân loại ý định
      const intentRes = await fetch(`${backendUrl}/api/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_text: userText }),
      });
      const { intent } = await intentRes.json();

      // 3. Logic: Lấy câu trả lời (Demo dùng endpoint explain)
      const aiRes = await fetch(`${backendUrl}/api/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_text: userText }),
      });
      const { text: responseText } = await aiRes.json();
      setAiText(responseText);

      // 4. TTS: Chuyển văn bản AI thành giọng nói
      const ttsRes = await fetch(`${backendUrl}/api/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: responseText }),
      });
      
      const audioBlobWav = await ttsRes.blob();
      const audioUrl = URL.createObjectURL(audioBlobWav);

      onResponse?.(responseText, audioUrl);
    } catch (err) {
      onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isRecording,
    isProcessing,
    aiText,
    startRecording,
    stopRecording,
    resetAiText: () => setAiText("")
  };
}