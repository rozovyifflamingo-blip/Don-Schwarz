
import React from 'react';

interface NeomorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const NeomorphicButton: React.FC<NeomorphicButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`bg-panel-dark text-slate-300 font-semibold py-2 px-4 rounded-lg shadow-neo-out active:shadow-neo-in focus:outline-none transition-all duration-150 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};