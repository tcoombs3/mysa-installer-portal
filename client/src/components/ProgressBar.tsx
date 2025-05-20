import React from 'react';
import { Device } from '../utils/api';

interface ProgressBarProps {
  devices: Device[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ devices }) => {
  // Calculate completion percentage
  const calculateProgress = () => {
    if (!devices.length) return 0;
    
    const completedCount = devices.filter(device => device.status === 'completed').length;
    return Math.round((completedCount / devices.length) * 100);
  };
  
  // Get text representation of progress
  const getProgressText = () => {
    const completedCount = devices.filter(device => device.status === 'completed').length;
    const issueCount = devices.filter(device => device.status === 'issue').length;
    
    return `${completedCount}/${devices.length} completed${issueCount > 0 ? `, ${issueCount} with issues` : ''}`;
  };
  
  const progress = calculateProgress();
  
  // Determine color based on progress
  const getColorClass = () => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-primary';
    if (progress >= 50) return 'bg-blue-400';
    if (progress >= 25) return 'bg-secondary';
    return 'bg-gray-400';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">Installation Progress</span>
        <span className="text-sm font-medium text-gray-700">{getProgressText()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getColorClass()} transition-all duration-500 ease-in-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
