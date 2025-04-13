import React from 'react';

const MessageBubble = ({ text, sender }) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
          sender === 'user'
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">
          {text}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;