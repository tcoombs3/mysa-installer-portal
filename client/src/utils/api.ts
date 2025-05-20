import axios from 'axios';

// Types for Airtable data
export interface Site {
  id: string;
  siteId: string;
  clientName: string;
  address: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'issue';
  siteId: string;
  lastUpdated: string;
  notes?: string;
}

export interface IssueReport {
  siteId: string;
  deviceId?: string;
  description: string;
  reportedBy?: string;
  priority: 'low' | 'medium' | 'high';
  contactInfo?: string;
}

// API functions for sites
export const getSites = async (filters?: Record<string, string>): Promise<Site[]> => {
  try {
    const response = await axios.get('/api/sites', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching sites:', error);
    return [];
  }
};

export const getSiteById = async (siteId: string): Promise<Site | null> => {
  try {
    const response = await axios.get(`/api/sites/${siteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching site ${siteId}:`, error);
    return null;
  }
};

// API functions for devices
export const getDevicesBySiteId = async (siteId: string): Promise<Device[]> => {
  try {
    const response = await axios.get(`/api/devices`, {
      params: { siteId }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching devices for site ${siteId}:`, error);
    return [];
  }
};

export const updateDeviceStatus = async (
  deviceId: string,
  status: Device['status'],
  notes?: string
): Promise<Device | null> => {
  try {
    const response = await axios.patch(`/api/devices/${deviceId}`, {
      status,
      notes,
      lastUpdated: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating device ${deviceId}:`, error);
    return null;
  }
};

// API functions for QR codes
export const getQRCode = async (siteId: string): Promise<string | null> => {
  try {
    const response = await axios.get(`/api/qr/${siteId}`);
    return response.data.qrCodeUrl;
  } catch (error) {
    console.error(`Error fetching QR code for site ${siteId}:`, error);
    return null;
  }
};

export const generateQRCodes = async (siteIds: string[]): Promise<{ [siteId: string]: string } | null> => {
  try {
    const response = await axios.post('/api/qr/generate', { siteIds });
    return response.data.qrCodes;
  } catch (error) {
    console.error('Error generating QR codes:', error);
    return null;
  }
};

// API function for reporting issues
export const reportIssue = async (issueData: IssueReport): Promise<{ success: boolean; ticketId?: string }> => {
  try {
    const response = await axios.post('/api/issues', issueData);
    return { success: true, ticketId: response.data.ticketId };
  } catch (error) {
    console.error('Error reporting issue:', error);
    return { success: false };
  }
};
