import React, { useState, useEffect } from 'react';
import { Hume } from 'hume';

interface Message {
  type: string;
  data?: any;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // This is where you'd typically set up a listener for new messages
    // For now, we'll just have a placeholder
  }, []);

  return (
    <div className="mt-6 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
      {messages.map((msg, index) => {
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          return (
            <div
              key={msg.type + index}
              className={`p-4 rounded-lg ${
                msg.type === "user_message"
                  ? 'bg-indigo-100 text-indigo-800 ml-8'
                  : 'bg-gray-100 text-gray-800 mr-8'
              }`}
            >
              <div className="font-semibold mb-1">{msg.type === "assistant_message" ? "Hume" : "You"}</div>
              <div>{msg.data?.content}</div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Messages;