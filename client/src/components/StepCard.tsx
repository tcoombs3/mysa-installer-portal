import React from 'react';
import { Device } from '../utils/api';

interface StepCardProps {
  device: Device;
  index: number;
  onStatusChange: (deviceId: string, status: Device['status']) => void;
  onAddNotes: (deviceId: string, notes: string) => void;
  estimatedTime?: number; // in minutes
  supportLink?: string;
}

const StepCard: React.FC<StepCardProps> = ({
  device,
  index,
  onStatusChange,
  onAddNotes,
  estimatedTime = 10,
  supportLink
}) => {
  const [showNotes, setShowNotes] = React.useState(false);
  const [notes, setNotes] = React.useState(device.notes || '');

  const handleNotesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNotes(device.id, notes);
    setShowNotes(false);
  };

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'issue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`card mb-4 border-l-4 ${getStatusColor(device.status)}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <span className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
              {index + 1}
            </span>
            {device.name}
          </h3>
          
          {estimatedTime && (
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Est. time: {estimatedTime} min
            </p>
          )}
          
          {device.notes && (
            <p className="text-sm italic mt-2 text-gray-600">
              Notes: {device.notes}
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <select
            value={device.status}
            onChange={(e) => onStatusChange(device.id, e.target.value as Device['status'])}
            className="form-input text-sm py-1"
          >
            <option value="pending">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="issue">Has Issue</option>
          </select>
          
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
              Add Notes
            </button>
            
            {supportLink && (
              <a
                href={supportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-primary-light hover:bg-primary text-white rounded flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Help
              </a>
            )}
          </div>
        </div>
      </div>
      
      {showNotes && (
        <form onSubmit={handleNotesSubmit} className="mt-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input w-full h-24"
            placeholder="Add installation notes or observations..."
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowNotes(false)}
              className="btn btn-outline text-sm py-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-sm py-1"
            >
              Save Notes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StepCard;
