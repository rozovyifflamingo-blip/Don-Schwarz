
import React from 'react';

interface NeomorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const NeomorphicInput: React.FC<NeomorphicInputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`bg-panel-dark text-slate-100 w-full rounded-md shadow-neo-in p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ${className}`}
      {...props}
    />
  );
};