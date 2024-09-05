import React from 'react';
import { convertBase64ToBlob, getBrowserSupportedMimeType } from 'hume';
import { Hume } from 'hume';

// audio playback queue
const audioQueue: Blob[] = [];
// flag which denotes whether audio is currently playing or not
let isPlaying = false;
// the current audio element to be played
let currentAudio: HTMLAudioElement | null = null;
// mime type supported by the browser the application is running in
const mimeType: MimeType = (() => {
  const result = getBrowserSupportedMimeType();
  return result.success ? result.mimeType : MimeType.WEBM;
})();

function playAudio(): void {
  if (!audioQueue.length || isPlaying) return;
  isPlaying = true;
  const audioBlob = audioQueue.shift();
  if (!audioBlob) return;
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
  }
}

export {
  handleWebSocketMessageEvent,
  playAudio,
  audioQueue,
  isPlaying,
  currentAudio,
};