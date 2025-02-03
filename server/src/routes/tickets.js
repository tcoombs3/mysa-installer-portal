const express = require('express');
const router = express.Router();
const Airtable = require('airtable');

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

// Create a new ticket
router.post('/', async (req, res) => {
  try {
    const { clientName, email, description, priority, category } = req.body;

    // Create record in Airtable
    const record = await base('Tickets').create({
      'Client Name': clientName,
      'Email': email,
      'Description': description,
      'Priority': priority,
      'Category': category,
      'Status': 'New',
      'Created At': new Date().toISOString()
    });

    // TODO: Create ticket in Gorgias
    // This will be implemented when Gorgias API integration is set up

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating ticket'
    });
  }
});

// Get all tickets
router.get('/', async (req, res) => {
  try {
    const records = await base('Tickets').select({
      maxRecords: 100,
      sort: [{ field: 'Created At', direction: 'desc' }]
    }).all();

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching tickets'
    });
  }
});

// Get a single ticket
router.get('/:id', async (req, res) => {
  try {
    const record = await base('Tickets').find(req.params.id);
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching ticket'
    });
  }
});

// Update a ticket
router.patch('/:id', async (req, res) => {
  try {
    const record = await base('Tickets').update(req.params.id, req.body);
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating ticket'
    });
  }
});

module.exports = router;
