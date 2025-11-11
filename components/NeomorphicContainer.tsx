
import React from 'react';

interface NeomorphicContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const NeomorphicContainer: React.FC<NeomorphicContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-panel-dark rounded-xl shadow-neo-out p-4 transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};