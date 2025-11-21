import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = '#FF9529' }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? (
            <Star size={14} fill={color} stroke={color} />
          ) : value >= star - 0.5 ? (
            <StarHalf size={14} fill={color} stroke={color} />
          ) : (
            <Star size={14} stroke={color} className="text-gray-300" />
          )}
        </span>
      ))}
      {text && <span className="text-xs text-gray-500 ml-1">{text}</span>}
    </div>
  );
};

export default Rating;