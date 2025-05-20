import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { saveAs } from 'file-saver';
import { stringify } from 'csv-stringify/browser/esm';
import { getSites, generateQRCodes, reportIssue, Site, IssueReport } from '../utils/api';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

// Components
import FilterSearch from '../components/FilterSearch';
import QRCard from '../components/QRCard';
import LoadingSpinner from '../components/LoadingSpinner';
import IssueFormModal from '../components/IssueFormModal';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  
  // Fetch sites data
  const { data: sites, isLoading, error, refetch } = useQuery(
    ['sites', searchQuery, clientFilter],
    () => getSites({ 
      search: searchQuery || undefined,
      client: clientFilter || undefined
    }),
    {
      keepPreviousData: true,
    }
  );
  
  // Get unique client names for filter dropdown
  const clientOptions = React.useMemo(() => {
    if (!sites) return [{ label: 'All Clients', value: '' }];
    
    const uniqueClients = Array.from(
      new Set(sites.map(site => site.clientName))
    ).sort();
    
    return [
      { label: 'All Clients', value: '' },
      ...uniqueClients.map(client => ({
        label: client,
        value: client,
      })),
    ];
  }, [sites]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle filter change
  const handleFilterChange = (value: string) => {
    setClientFilter(value);
  };
  
  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  // Handle bulk export of QR codes
  const handleBulkExport = async () => {
    if (!sites || sites.length === 0) return;
    
    try {
      // Generate QR codes for all sites
      const siteIds = sites.map(site => site.siteId);
      const qrCodes = await generateQRCodes(siteIds);
      
      if (!qrCodes) {
        alert('Failed to generate QR codes. Please try again.');
        return;
      }
      
      // Prepare CSV data
      const csvData = sites.map(site => ({
        'Site ID': site.siteId,
        'Client Name': site.clientName,
        'Address': site.address,
        'QR Code URL': qrCodes[site.siteId] || '',
      }));
      
      // Convert to CSV and download
      stringify(csvData, { header: true }, (err, output) => {
        if (err) throw err;
        const blob = new Blob([output], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `qr-codes-export-${new Date().toISOString().slice(0, 10)}.csv`);
      });
    } catch (error) {
      console.error('Export error:', error);
      alert('An error occurred during export. Please try again.');
    }
  };
  
  // Handle issue reporting
  const handleReportIssue = (siteId: string) => {
    setSelectedSiteId(siteId);
    setIsIssueModalOpen(true);
  };
  
  // Submit issue report
  const handleIssueSubmit = async (issueData: IssueReport) => {
    await reportIssue(issueData);
    setIsIssueModalOpen(false);
    setSelectedSiteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Installer Portal Admin</h1>
          <button
            onClick={handleLogout}
            className="btn btn-outline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1zm3 5a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm-6 0a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm3 5a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">QR Code Management</h2>
          
          <button
            onClick={handleBulkExport}
            disabled={!sites || sites.length === 0}
            className="btn btn-primary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Bulk Export QR Codes
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-6">
          <FilterSearch
            onSearch={handleSearch}
            onFilter={handleFilterChange}
            filterOptions={clientOptions}
            placeholder="Search by site ID or address..."
            initialFilter={clientFilter}
            initialQuery={searchQuery}
          />
        </div>
        
        {/* QR Code Cards */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              An error occurred while loading sites. Please try again.
            </div>
          ) : sites && sites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site: Site) => (
                <QRCard
                  key={site.id}
                  siteId={site.siteId}
                  clientName={site.clientName}
                  address={site.address}
                  qrValue={`${window.location.origin}/installer/${site.siteId}`}
                  onReportIssue={handleReportIssue}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No sites found. Try adjusting your search or filter.
            </div>
          )}
        </div>
      </main>
      
      {/* Issue Modal */}
      {isIssueModalOpen && selectedSiteId && (
        <IssueFormModal
          isOpen={isIssueModalOpen}
          onClose={() => {
            setIsIssueModalOpen(false);
            setSelectedSiteId(null);
          }}
          onSubmit={handleIssueSubmit}
          siteId={selectedSiteId}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
