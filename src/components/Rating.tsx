import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsStarHalf } from 'react-icons/bs';

interface RatingProps {
  rating: number;
  count?: number;
  size?: number;
}

const Rating: React.FC<RatingProps> = ({ rating, count, size = 16 }) => {
  const stars = [];
  
  // Generate full, half, and empty stars
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<AiFillStar key={i} className="text-yellow-400" size={size} />);
    } else if (i - 0.5 <= rating) {
      stars.push(<BsStarHalf key={i} className="text-yellow-400" size={size} />);
    } else {
      stars.push(<AiOutlineStar key={i} className="text-yellow-400" size={size} />);
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex">{stars}</div>
      {count !== undefined && (
        <span className="ml-2 text-xs text-gray-500">({count})</span>
      )}
    </div>
  );
};

export default Rating; 