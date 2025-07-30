import React, { useState } from 'react';

export default function SearchableSelect({ options, value, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const filtered = options.filter(
    opt =>
      opt.code.toLowerCase().includes(input.toLowerCase()) ||
      opt.name.includes(input)
  );
  return (
    <div className="relative">
      <input
        className="w-full border rounded px-3 py-2"
        placeholder={placeholder}
        value={input}
        onChange={e => setInput(e.target.value)}
        onFocus={e => setInput('')}
      />
      <div className="absolute z-10 bg-white border w-full max-h-48 overflow-auto">
        {filtered.map(opt => (
          <div
            key={opt.code}
            className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${value === opt.code ? 'bg-blue-100' : ''}`}
            onClick={() => {
              onChange(opt.code);
              setInput(opt.code + ' ' + opt.name);
            }}
          >
            <span className="font-mono">{opt.code}</span> <span>{opt.name}</span>
          </div>
        ))}
        {filtered.length === 0 && <div className="px-3 py-2 text-gray-400">无匹配项</div>}
      </div>
    </div>
  );
}