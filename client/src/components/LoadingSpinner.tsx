import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 ${colorClasses[color as keyof typeof colorClasses]} ${sizeClasses[size]}`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
