// src/app/components/Card.tsx

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 border rounded shadow-md bg-white dark:bg-black ${className}`}>
      {children}
    </div>
  );
};

export default Card;
