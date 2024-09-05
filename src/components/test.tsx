import React, { useState, useEffect } from 'react';
import { Hume, HumeClient } from 'hume';
import Controls from './Controls';
import Messages from './Messages';
import { ChatSocket } from 'hume/api/resources/empathicVoice/resources/chat/client/Socket';

const AIPanel: React.FC = () => {
  const [client, setClient] = useState<HumeClient | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

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
        

        ws.on('open', handleWebSocketOpenEvent);
        ws.on('message', handleWebSocketMessageEvent);
        ws.on('error', handleWebSocketErrorEvent);
        ws.on('close', handleWebSocketCloseEvent);
      } catch (error) {
        console.error('Error initializing Hume:', error);
      }
    };

    initHume();
  }, []);

  const handleWebSocketOpenEvent = () => {
    console.log('WebSocket connection opened');
  };

  const handleWebSocketMessageEvent = (event: ChatSocket.Response) => {
    // Handle different message types here
    switch (event.type) {
      case "assistant_end":
        console.log("Assistant has finished speaking.");
        // Handle the end of the assistant's response
        break;
        
      case "assistant_message":
        console.log("Assistant message received:", event.message);
        // Process the assistant's response
        break;
        
      case "user_interruption":
        console.log("User interruption detected.");
        // Handle user interruption of the assistant
        break;
        
      case "user_message":
        console.log("User message received:", event.message);
        // Process user input
        break;
        
      case "tool_error":
        console.error("Tool error received:", event.error);
        // Handle errors related to tool invocation
        break;
        
      default:
        console.warn("Unknown message type received:", event);
        // Handle unexpected message types
        break;
    }
    // Process the message
  };

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