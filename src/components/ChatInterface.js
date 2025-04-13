import React, { useState, useEffect, useRef } from 'react';
import llamaClient from '../services/LlamaClient';
import MessageBubble from './MessageBubble';

const ChatInterface = ({ repoData }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const result = await llamaClient.sendMessage(inputMessage);

      if (result?.success) {
        setMessages(prev => [...prev, { 
          text: result.content, 
          sender: 'bot' 
        }]);
      } else {
        setError(result?.error || 'Error al procesar la respuesta');
      }
    } catch (err) {
      setError("Error de conexión con el servicio");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <div className="max-w-md px-4">
              <h3 className="text-lg font-medium mb-2">Chat de Análisis de Código</h3>
              <p className="text-sm">
                Haz preguntas sobre {repoData?.name || 'el repositorio'} y recibe análisis detallados del modelo IA.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                text={message.text}
                sender={message.sender}
              />
            ))}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe tu pregunta sobre el código..."
            className="flex-1 px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors text-sm font-medium"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

// DONE