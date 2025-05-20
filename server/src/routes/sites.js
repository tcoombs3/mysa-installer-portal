const express = require('express');
const Airtable = require('airtable');
const router = express.Router();

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const sitesTable = base(process.env.AIRTABLE_SITES_TABLE);

// Get all sites with optional filtering
router.get('/', async (req, res) => {
  try {
    const { search, client } = req.query;
    let filterByFormula = '';
    
    // Build filter formula if search or client filter is provided
    if (search && client) {
      filterByFormula = `AND({ClientName} = '${client}', OR(SEARCH('${search}', {SiteID}), SEARCH('${search}', {Address})))`;
    } else if (search) {
      filterByFormula = `OR(SEARCH('${search}', {SiteID}), SEARCH('${search}', {Address}))`;
    } else if (client) {
      filterByFormula = `{ClientName} = '${client}'`;
    }
    
    // Query options
    const options = {
      view: 'Grid view',
      ...(filterByFormula && { filterByFormula })
    };
    
    // Fetch records from Airtable
    const records = await sitesTable.select(options).all();
    
    // Transform records to our API format
    const sites = records.map(record => ({
      id: record.id,
      siteId: record.get('SiteID'),
      clientName: record.get('ClientName'),
      address: record.get('Address'),
      qrCode: record.get('QRCode'),
      createdAt: record.get('CreatedAt'),
      updatedAt: record.get('UpdatedAt')
    }));
    
    res.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

// Get a single site by ID
router.get('/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    
    // Query Airtable for the site
    const records = await sitesTable.select({
      filterByFormula: `{SiteID} = '${siteId}'`,
      maxRecords: 1
    }).all();
    
    if (records.length === 0) {
      return res.status(404).json({ error: 'Site not found' });
    }
    
    const record = records[0];
    
    // Transform record to our API format
    const site = {
      id: record.id,
      siteId: record.get('SiteID'),
      clientName: record.get('ClientName'),
      address: record.get('Address'),
      qrCode: record.get('QRCode'),
      createdAt: record.get('CreatedAt'),
      updatedAt: record.get('UpdatedAt')
    };
    
    res.json(site);
  } catch (error) {
    console.error(`Error fetching site ${req.params.siteId}:`, error);
    res.status(500).json({ error: 'Failed to fetch site' });
  }
});

module.exports = router;
