import React, { useState } from 'react';
import { StopCircleIcon, MicIcon } from 'lucide-react';
import { convertBlobToBase64, getAudioStream, ensureSingleValidAudioTrack, getBrowserSupportedMimeType } from 'hume';
import { ChatSocket } from 'hume/api/resources/empathicVoice/resources/chat';

interface ControlsProps {
  socket: ChatSocket | null;
}

const Controls: React.FC<ControlsProps> = ({ socket }) => {
  const [isRecording, setIsRecording] = useState(false);
  let recorder: MediaRecorder | null = null;
  let audioStream: MediaStream | null = null;

  const startRecording = async () => {
    if (!socket) return;

    const mimeType = getBrowserSupportedMimeType();
    audioStream = await getAudioStream();
    ensureSingleValidAudioTrack(audioStream);

    recorder = new MediaRecorder(audioStream, { mimeType: mimeType.success ? mimeType.mimeType : 'audio/webm' });

    recorder.ondataavailable = async ({ data }) => {
      if (data.size < 1) return;
      const encodedAudioData = await convertBlobToBase64(data);
      const audioInput = { data: encodedAudioData };
      socket.sendUserInput(JSON.stringify({ type: 'audio_input', ...audioInput }));
    };

    recorder.start(100);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      recorder = null;
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }
    setIsRecording(false);
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`w-full px-6 py-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 flex items-center justify-center ${
        isRecording ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
      }`}
    >
      {isRecording ? (
        <>
          <StopCircleIcon className="w-5 h-5 mr-2" />
          Stop Recording
        </>
      ) : (
        <>
          <MicIcon className="w-5 h-5 mr-2" />
          Start Recording
        </>
      )}
    </button>
  );
};

export default Controls;