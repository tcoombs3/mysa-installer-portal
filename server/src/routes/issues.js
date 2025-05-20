const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Create a new issue report
router.post('/', async (req, res) => {
  try {
    const { siteId, deviceId, description, priority, reportedBy, contactInfo } = req.body;
    
    // Validate required fields
    if (!siteId || !description) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        requiredFields: ['siteId', 'description'] 
      });
    }
    
    // Validate priority if provided
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        error: 'Invalid priority value',
        validValues: validPriorities
      });
    }
    
    // Generate a unique ticket ID
    const ticketId = `MYSA-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Create ticket data
    const ticketData = {
      ticketId,
      siteId,
      deviceId: deviceId || null,
      description,
      priority: priority || 'medium',
      reportedBy: reportedBy || 'Installer',
      contactInfo: contactInfo || null,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    
    // Send to external ticketing system if configured
    if (process.env.EXTERNAL_TICKET_API_URL) {
      try {
        await axios.post(process.env.EXTERNAL_TICKET_API_URL, ticketData, {
          headers: {
            'Authorization': `Bearer ${process.env.EXTERNAL_TICKET_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (externalError) {
        console.error('Error sending ticket to external system:', externalError);
        // Continue even if external system fails
      }
    }
    
    // For this example, we're not storing tickets in our own database
    // In a real implementation, you might want to store them in a database or Airtable
    
    res.status(201).json({ 
      success: true, 
      message: 'Issue reported successfully',
      ticketId
    });
  } catch (error) {
    console.error('Error reporting issue:', error);
    res.status(500).json({ error: 'Failed to report issue' });
  }
});

module.exports = router;
