
import React, { useState, useRef, useEffect } from 'react';
import { Recording } from '../types';

interface AudioRecorderProps {
  onRecordingComplete: (recording: Recording) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const newRecording: Recording = {
          id: crypto.randomUUID(),
          blob,
          duration,
          timestamp: new Date(),
        };
        onRecordingComplete(newRecording);
        setDuration(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
      alert('Could not access microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-4">
        {isRecording ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-2">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-red-500 font-bold font-mono text-xl">{formatTime(duration)}</span>
            <span className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Recording Lesson Segment...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M12 2v10"/><path d="M18.4 6.9a9 9 0 1 1-12.8 0"/><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/></svg>
            </div>
            <span className="text-slate-400 font-medium">Ready to record</span>
          </div>
        )}
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 shadow-lg'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRecording ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
            <span>Stop Recording</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            <span>Start Note</span>
          </>
        )}
      </button>
      <p className="mt-3 text-xs text-slate-400 text-center">
        Tip: Record specific segments like "Grip Work" or "Driver Drill" separately.
      </p>
    </div>
  );
};

export default AudioRecorder;
