const express = require('express');
const Airtable = require('airtable');
const router = express.Router();

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const devicesTable = base(process.env.AIRTABLE_DEVICES_TABLE);

// Get devices with optional filtering by siteId
router.get('/', async (req, res) => {
  try {
    const { siteId } = req.query;
    let filterByFormula = '';
    
    // Filter by siteId if provided
    if (siteId) {
      filterByFormula = `{SiteID} = '${siteId}'`;
    }
    
    // Query options
    const options = {
      view: 'Grid view',
      ...(filterByFormula && { filterByFormula })
    };
    
    // Fetch records from Airtable
    const records = await devicesTable.select(options).all();
    
    // Transform records to our API format
    const devices = records.map(record => ({
      id: record.id,
      name: record.get('Name'),
      status: record.get('Status') || 'pending',
      siteId: record.get('SiteID'),
      lastUpdated: record.get('LastUpdated') || new Date().toISOString(),
      notes: record.get('Notes')
    }));
    
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Get a single device by ID
router.get('/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Fetch the device record
    const record = await devicesTable.find(deviceId);
    
    // Transform record to our API format
    const device = {
      id: record.id,
      name: record.get('Name'),
      status: record.get('Status') || 'pending',
      siteId: record.get('SiteID'),
      lastUpdated: record.get('LastUpdated') || new Date().toISOString(),
      notes: record.get('Notes')
    };
    
    res.json(device);
  } catch (error) {
    console.error(`Error fetching device ${req.params.deviceId}:`, error);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
});

// Update a device
router.patch('/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { status, notes, lastUpdated } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'issue'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    // Prepare update fields
    const fields = {};
    if (status) fields.Status = status;
    if (notes !== undefined) fields.Notes = notes;
    if (lastUpdated) fields.LastUpdated = lastUpdated;
    
    // Update the record in Airtable
    const updatedRecord = await devicesTable.update(deviceId, fields);
    
    // Transform record to our API format
    const device = {
      id: updatedRecord.id,
      name: updatedRecord.get('Name'),
      status: updatedRecord.get('Status') || 'pending',
      siteId: updatedRecord.get('SiteID'),
      lastUpdated: updatedRecord.get('LastUpdated') || new Date().toISOString(),
      notes: updatedRecord.get('Notes')
    };
    
    res.json(device);
  } catch (error) {
    console.error(`Error updating device ${req.params.deviceId}:`, error);
    res.status(500).json({ error: 'Failed to update device' });
  }
});

module.exports = router;
