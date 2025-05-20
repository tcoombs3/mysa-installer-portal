const express = require('express');
const router = express.Router();
const { demoSites, demoDevices } = require('../data/demo-data');

// Mock authentication endpoint
router.post('/auth/google', (req, res) => {
  res.json({
    isAuthenticated: true,
    user: {
      email: 'demo@getmysa.com',
      name: 'Demo User',
      picture: 'https://via.placeholder.com/150'
    }
  });
});

// Mock auth status endpoint
router.get('/auth/status', (req, res) => {
  res.json({
    isAuthenticated: true,
    user: {
      email: 'demo@getmysa.com',
      name: 'Demo User',
      picture: 'https://via.placeholder.com/150'
    }
  });
});

// Mock sites endpoints
router.get('/sites', (req, res) => {
  res.json(demoSites);
});

router.get('/sites/:siteId', (req, res) => {
  const site = demoSites.find(s => s.siteId === req.params.siteId);
  if (site) {
    res.json(site);
  } else {
    res.status(404).json({ error: 'Site not found' });
  }
});

// Mock devices endpoints
router.get('/devices', (req, res) => {
  const { siteId } = req.query;
  if (siteId) {
    const filteredDevices = demoDevices.filter(d => d.siteId === siteId);
    res.json(filteredDevices);
  } else {
    res.json(demoDevices);
  }
});

router.patch('/devices/:deviceId', (req, res) => {
  const { deviceId } = req.params;
  const { status, notes } = req.body;
  
  const deviceIndex = demoDevices.findIndex(d => d.id === deviceId);
  if (deviceIndex !== -1) {
    demoDevices[deviceIndex] = {
      ...demoDevices[deviceIndex],
      status: status || demoDevices[deviceIndex].status,
      notes: notes !== undefined ? notes : demoDevices[deviceIndex].notes,
      lastUpdated: new Date().toISOString()
    };
    res.json(demoDevices[deviceIndex]);
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

// Mock QR code endpoints
router.get('/qr/:siteId', (req, res) => {
  const { siteId } = req.params;
  const site = demoSites.find(s => s.siteId === siteId);
  if (site) {
    // Return a placeholder QR code data URL
    res.json({ 
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOPSURBVO3BQY4cSRLAQDLQ//8yV0c/JZCoain2xgj+wRj/OMYKx1jjGGscY41jrHGMNY6xxjHWOMYax1jjGGscY41jrHGMNY6xxjHWuHhIgd9UcYfCnQpPKHxTxR0KTyhMFXconDnGGsdY4xhrXHxYxScpPKHwTQrfVPFJCp+k8EkVnxhjjWOscYw1Lr5M4Q6FJyruqLhD4YmKOxTuULhD4QmFOyruUPimY6xxjDWOscbFf5zCExV3KDyhcKfCv+wYaxxjjWOs8T9D4ZsqPlHhToX/0jHWOMYax1jj4ssq/iaFJxSeUJgqnlB4QuGbKv6mY6xxjDWOscbFhyn8TRV3KNxRcYfCnQp3KDyhcEfFv+QYaxxjjWOscfGQwl+m8ITCVHGHwlQxKTyp8ITCnRX/kjPHWOMYaxxjjYt/jMITFXcoPKEwVdyh8ITCnQpTxRMKU8UTCt90jDWOscYx1rj4MIVvqnhCYaq4Q+EOhaniDoWp4g6FOxSeUJgqnlC4U+GbjrHGMdY4xhoXDylMFXcoPKHwRMUdCk9UPKHwTRWfpHCnwicpTBV3KJw5xhrHWOMYa1z8YQpTxR0KU8UdCk9U3KFwp8JUcYfCVPGEwlRxh8JUcYfCmWOscYw1jrHGxUMKU8UdCk9U3KEwVdyhcKfCVHGHwlTxhMJUcYfCVHGHwlRxh8KZY6xxjDWOscbFQwpTxR0KU8UdCk9U3KHwRMUdCndU3KFwR8UdCndU3KFw5hhrHGONY6xx8ZDCb6q4Q+FvUpgq7lCYKu5QmCruUJgqnlA4c4w1jrHGMda4+LCKT1K4Q+GJijsUpoo7FKaKOxSmiicUnqi4Q+HMMdY4xhrHWOPiyxTuUHii4g6FqeIOhScUnqi4Q+GJijsUpoo7FO5UOHOMNYw1jrHGxX+cwh0VdyhMFXcoTBV3KEwVdyhMFXcoPFFxh8KZY6xxjDWOscZ/nMITFXcoTBV3KEwVdyhMFXcoPFFxh8KZY6xxjDWOscbFl1X8TQpTxR0KU8UdCk9U3KEwVdyhMFXcoTBV3KHwTcdY4xhrHGONiw9T+E0VdyhMFXcoTBV3KEwVdyhMFXcoPFFxh8KZY6xxjDWOscbFQ2P84xhrHGONY6xxjDWOscYx1jjGGsdY4xhrHGONY6xxjDWOscYx1jjGGsdY4xhrHGON/wNVAlKJzOm+FAAAAABJRU5ErkJggg=='
    });
  } else {
    res.status(404).json({ error: 'Site not found' });
  }
});

// Mock issues endpoint
router.post('/issues', (req, res) => {
  const { siteId, description } = req.body;
  if (siteId && description) {
    const ticketId = 'DEMO-' + Math.floor(Math.random() * 10000);
    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      ticketId
    });
  } else {
    res.status(400).json({ error: 'Missing required fields' });
  }
});

module.exports = router;
