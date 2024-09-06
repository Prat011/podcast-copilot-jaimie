import React from 'react';
import { convertBase64ToBlob, getBrowserSupportedMimeType } from 'hume';
import { Hume } from 'hume';

// Audio playback queue
const audioQueue: Blob[] = [];
// Flag which denotes whether audio is currently playing or not
let isPlaying = false;
// The current audio element to be played
let currentAudio: HTMLAudioElement | null = null;
// MIME type supported by the browser the application is running in
const mimeType: string = (() => {
  const result = getBrowserSupportedMimeType();
  return result.success ? result.mimeType : 'audio/webm'; // Fallback to a default MIME type
})();

function playAudio(): void {
  if (!audioQueue.length || isPlaying) return;
  isPlaying = true;
  const audioBlob = audioQueue.shift();
  if (!audioBlob) {
    isPlaying = false;
    return;
  }
  const audioUrl = URL.createObjectURL(audioBlob);
  currentAudio = new Audio(audioUrl);
  currentAudio.play();

  currentAudio.onended = () => {
    isPlaying = false;
    if (audioQueue.length) {
      playAudio();
    }
  };
}

function handleWebSocketMessageEvent(
  message: Hume.empathicVoice.SubscribeEvent
): void {
  switch (message.type) {
    case 'audio_output':
      const audioOutput = message.data;
      const blob = convertBase64ToBlob(audioOutput, mimeType);
      audioQueue.push(blob);
      if (audioQueue.length === 1) {
        playAudio();
      }
      break;
    default:
      break;
  }
}

export {
  handleWebSocketMessageEvent,
  playAudio,
  audioQueue,
  isPlaying,
  currentAudio,
};
