import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getSiteById, getDevicesBySiteId, updateDeviceStatus, reportIssue, Device, IssueReport } from '../utils/api';

// Components
import LoadingSpinner from '../components/LoadingSpinner';
import StepCard from '../components/StepCard';
import ProgressBar from '../components/ProgressBar';
import IssueFormModal from '../components/IssueFormModal';

const InstallerView: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const queryClient = useQueryClient();
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  
  // Fetch site data
  const { 
    data: site, 
    isLoading: siteLoading, 
    error: siteError 
  } = useQuery(
    ['site', siteId],
    () => getSiteById(siteId!),
    {
      enabled: !!siteId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  // Fetch devices data
  const { 
    data: devices, 
    isLoading: devicesLoading, 
    error: devicesError 
  } = useQuery(
    ['devices', siteId],
    () => getDevicesBySiteId(siteId!),
    {
      enabled: !!siteId,
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );
  
  // Update device status mutation
  const updateDeviceMutation = useMutation(
    ({ deviceId, status }: { deviceId: string; status: Device['status'] }) => 
      updateDeviceStatus(deviceId, status),
    {
      onSuccess: () => {
        // Invalidate and refetch devices query
        queryClient.invalidateQueries(['devices', siteId]);
      },
    }
  );
  
  // Update device notes mutation
  const updateNotesMutation = useMutation(
    ({ deviceId, notes }: { deviceId: string; notes: string }) => 
      updateDeviceStatus(deviceId, devices?.find(d => d.id === deviceId)?.status || 'pending', notes),
    {
      onSuccess: () => {
        // Invalidate and refetch devices query
        queryClient.invalidateQueries(['devices', siteId]);
      },
    }
  );
  
  // Handle device status change
  const handleStatusChange = (deviceId: string, status: Device['status']) => {
    updateDeviceMutation.mutate({ deviceId, status });
  };
  
  // Handle device notes update
  const handleAddNotes = (deviceId: string, notes: string) => {
    updateNotesMutation.mutate({ deviceId, notes });
  };
  
  // Handle opening issue modal
  const handleReportIssue = (deviceId: string | null = null) => {
    setSelectedDeviceId(deviceId);
    setIsIssueModalOpen(true);
  };
  
  // Submit issue report
  const handleIssueSubmit = async (issueData: IssueReport) => {
    await reportIssue(issueData);
    setIsIssueModalOpen(false);
    setSelectedDeviceId(null);
  };
  
  // Loading state
  const isLoading = siteLoading || devicesLoading;
  const hasError = siteError || devicesError;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (hasError || !site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative max-w-md w-full">
          <h2 className="font-bold">Error Loading Installation Guide</h2>
          <p className="mt-2">
            We couldn't load the installation information for this site. Please try again or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-primary text-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{site.clientName}</h1>
              <p className="text-white text-opacity-90">{site.address}</p>
              <p className="text-sm text-white text-opacity-80">Site ID: {site.siteId}</p>
            </div>
            <button
              onClick={() => handleReportIssue()}
              className="btn bg-white text-primary hover:bg-gray-100 flex items-center self-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Report Issue
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress Bar */}
        {devices && devices.length > 0 && (
          <div className="mb-8">
            <ProgressBar devices={devices} />
          </div>
        )}
        
        {/* Installation Steps */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Installation Steps</h2>
          
          {devices && devices.length > 0 ? (
            <div className="space-y-4">
              {devices.map((device, index) => (
                <StepCard
                  key={device.id}
                  device={device}
                  index={index}
                  onStatusChange={handleStatusChange}
                  onAddNotes={handleAddNotes}
                  estimatedTime={10}
                  supportLink="https://support.getmysa.com/hc/en-us"
                />
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
              No installation steps found for this site. Please contact support if you believe this is an error.
            </div>
          )}
        </div>
        
        {/* Completion Section */}
        {devices && devices.length > 0 && devices.every(d => d.status === 'completed') && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-green-800 mt-4">Installation Complete!</h3>
            <p className="mt-2 text-green-700">
              Thank you for completing all installation steps. The client has been notified.
            </p>
            <div className="mt-4">
              <a
                href="https://support.getmysa.com/hc/en-us"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Visit Support Center
              </a>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 border-t border-gray-200 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Mysa. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <a
              href="https://support.getmysa.com/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark text-sm"
            >
              Support Center
            </a>
          </div>
        </div>
      </footer>
      
      {/* Issue Modal */}
      {isIssueModalOpen && (
        <IssueFormModal
          isOpen={isIssueModalOpen}
          onClose={() => {
            setIsIssueModalOpen(false);
            setSelectedDeviceId(null);
          }}
          onSubmit={handleIssueSubmit}
          siteId={siteId!}
          deviceId={selectedDeviceId || undefined}
        />
      )}
    </div>
  );
};

export default InstallerView;
