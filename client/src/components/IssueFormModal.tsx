import React, { useState } from 'react';
import { IssueReport } from '../utils/api';

interface IssueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issueData: IssueReport) => Promise<void>;
  siteId: string;
  deviceId?: string;
}

const IssueFormModal: React.FC<IssueFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  siteId,
  deviceId
}) => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssueReport['priority']>('medium');
  const [contactInfo, setContactInfo] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Please provide a description of the issue');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit({
        siteId,
        deviceId,
        description,
        priority,
        reportedBy: reportedBy.trim() || undefined,
        contactInfo: contactInfo.trim() || undefined
      });
      
      // Reset form and close modal on success
      setDescription('');
      setPriority('medium');
      setContactInfo('');
      setReportedBy('');
      onClose();
    } catch (err) {
      setError('Failed to submit issue. Please try again.');
      console.error('Issue submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Report an Issue
                </h3>
                
                <form onSubmit={handleSubmit} className="mt-4">
                  {error && (
                    <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label">
                      Issue Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      className="form-input"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue you're experiencing..."
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="priority" className="form-label">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="form-input"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as IssueReport['priority'])}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="reportedBy" className="form-label">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="reportedBy"
                      className="form-input"
                      value={reportedBy}
                      onChange={(e) => setReportedBy(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="contactInfo" className="form-label">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      id="contactInfo"
                      className="form-input"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Phone or email (optional)"
                    />
                  </div>
                  
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Issue'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueFormModal;
