import React from 'react';
import { MapPin } from 'lucide-react';

const SearchSuggestions = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  const getLocationName = (suggestion) => {
    if (typeof suggestion === 'string') return suggestion;
    return `${suggestion.name}${suggestion.state ? `, ${suggestion.state}` : ''}, ${suggestion.country}`;
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden z-10">
      {suggestions.map((suggestion, index) => (
        <button
          key={`${suggestion.lat}-${suggestion.lon || index}`}
          onClick={() => onSelect(getLocationName(suggestion))}
          className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center gap-3 text-white"
        >
          <MapPin className="w-4 h-4 text-white/70" />
          <span className="font-medium">
            {getLocationName(suggestion)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;