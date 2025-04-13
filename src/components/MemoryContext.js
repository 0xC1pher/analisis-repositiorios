import React, { useState } from 'react';

const MemoryContext = ({ chunks, onAddChunk, onRemoveChunk }) => {
  const [newChunk, setNewChunk] = useState('');

  const handleAddChunk = () => {
    if (newChunk.trim()) {
      onAddChunk(newChunk);
      setNewChunk('');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex flex-col">
      <div className="font-bold text-lg mb-4">Contexto de Memoria</div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {chunks.map((chunk, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{chunk}</div>
              <button 
                onClick={() => onRemoveChunk(index)}
                className="text-gray-400 hover:text-red-500 ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Añade nuevo chunk de contexto..."
          rows="3"
          value={newChunk}
          onChange={(e) => setNewChunk(e.target.value)}
        />
        <button
          onClick={handleAddChunk}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Guardar Chunk
        </button>
      </div>
    </div>
  );
};

export default MemoryContext;