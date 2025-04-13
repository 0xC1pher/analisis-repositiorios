import React, { useState, useEffect } from 'react';

const CodeEditor = ({ content, onChange, language = 'javascript' }) => {
  const [localContent, setLocalContent] = useState(content || '');

  useEffect(() => {
    setLocalContent(content || '');
  }, [content]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const getLanguageClass = () => {
    switch(language) {
      case 'javascript': return 'language-javascript';
      case 'python': return 'language-python';
      case 'html': return 'language-html';
      case 'css': return 'language-css';
      default: return 'language-plaintext';
    }
  };

  return (
    <div className="relative h-full">
      <div className="absolute top-0 right-0 bg-gray-800 text-white px-2 py-1 rounded-bl text-xs">
        {language.toUpperCase()}
      </div>
      <textarea
        className={`w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg focus:outline-none ${getLanguageClass()}`}
        value={localContent}
        onChange={handleChange}
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;