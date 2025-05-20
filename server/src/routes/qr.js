const express = require('express');
const QRCode = require('qrcode');
const Airtable = require('airtable');
const router = express.Router();

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const sitesTable = base(process.env.AIRTABLE_SITES_TABLE);

// Get QR code for a specific site
router.get('/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    
    // Check if site exists
    const records = await sitesTable.select({
      filterByFormula: `{SiteID} = '${siteId}'`,
      maxRecords: 1
    }).all();
    
    if (records.length === 0) {
      return res.status(404).json({ error: 'Site not found' });
    }
    
    // Generate QR code URL
    const installerUrl = `${process.env.CLIENT_URL}/installer/${siteId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(installerUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    res.json({ qrCodeUrl: qrCodeDataUrl });
  } catch (error) {
    console.error(`Error generating QR code for site ${req.params.siteId}:`, error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Generate QR codes for multiple sites
router.post('/generate', async (req, res) => {
  try {
    const { siteIds } = req.body;
    
    if (!siteIds || !Array.isArray(siteIds) || siteIds.length === 0) {
      return res.status(400).json({ error: 'Invalid siteIds parameter' });
    }
    
    // Generate QR codes for each site
    const qrCodes = {};
    
    for (const siteId of siteIds) {
      const installerUrl = `${process.env.CLIENT_URL}/installer/${siteId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(installerUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      qrCodes[siteId] = qrCodeDataUrl;
      
      // Optionally update the QR code in Airtable
      try {
        const records = await sitesTable.select({
          filterByFormula: `{SiteID} = '${siteId}'`,
          maxRecords: 1
        }).all();
        
        if (records.length > 0) {
          await sitesTable.update(records[0].id, {
            QRCode: installerUrl
          });
        }
      } catch (updateError) {
        console.error(`Error updating QR code for site ${siteId}:`, updateError);
        // Continue with other sites even if one update fails
      }
    }
    
    res.json({ qrCodes });
  } catch (error) {
    console.error('Error generating QR codes:', error);
    res.status(500).json({ error: 'Failed to generate QR codes' });
  }
});

module.exports = router;
