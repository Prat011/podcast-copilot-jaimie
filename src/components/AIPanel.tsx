import React, { useState, useEffect } from 'react';
import { Hume, HumeClient } from 'hume';
import Controls from './Controls';
import Messages from './Messages';
import {
  handleWebSocketMessageEvent,
  playAudio,
  audioQueue,
  isPlaying,
  currentAudio,
} from './AudioOutputHandling';
import { handleWebSocketOpenEvent, captureAudio } from './AudioInputHandling';

const AIPanel: React.FC = () => {
  const [client, setClient] = useState<HumeClient | null>(null);
  const [socket, setSocket] = useState<HumeClient.empathicVoice.chat.Socket | null>(null);

  useEffect(() => {
    const initHume = async () => {
      try {
        const humeClient = new HumeClient({
          apiKey: process.env.REACT_APP_HUME_API_KEY || '',
          secretKey: process.env.REACT_APP_HUME_SECRET_KEY || '',
        });
        setClient(humeClient);

        const ws = await humeClient.empathicVoice.chat.connect({
          configId: process.env.REACT_APP_HUME_CONFIG_ID || undefined,
        });
        setSocket(ws);

        ws.on('open', () => handleWebSocketOpenEvent(ws));
        ws.on('message', (message) => handleWebSocketMessageEvent(message));
        ws.on('error', (error) => handleWebSocketErrorEvent(error));
        ws.on('close', () => handleWebSocketCloseEvent());
      } catch (error) {
        console.error('Error initializing Hume:', error);
      }
    };

    initHume();
  }, []);

  const handleWebSocketErrorEvent = (error: Error) => {
    console.error('WebSocket error:', error.message);
  };

  const handleWebSocketCloseEvent = () => {
    console.log('WebSocket connection closed');
  };

  return (
    <div className="w-1/3 p-6">
      <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col">
        <Controls socket={socket} />
        <Messages />
      </div>
    </div>
  );
};

export default AIPanel;