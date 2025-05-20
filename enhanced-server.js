const express = require('express');
const path = require('path');
const app = express();
const PORT = 3030;

// Sample data
const demoSites = [
  { 
    id: '1', 
    siteId: 'DEMO-SITE-001', 
    clientName: 'Windsurf Demo Client', 
    address: '123 Test Street, Demo City',
    status: 'active'
  },
  { 
    id: '2', 
    siteId: 'DEMO-SITE-002', 
    clientName: 'Windsurf Demo Client', 
    address: '456 Sample Avenue, Test Town',
    status: 'active'
  }
];

const demoDevices = [
  { 
    id: '1', 
    siteId: 'DEMO-SITE-001', 
    name: 'Living Room Thermostat', 
    status: 'pending',
    notes: '' 
  },
  { 
    id: '2', 
    siteId: 'DEMO-SITE-001', 
    name: 'Bedroom Thermostat', 
    status: 'pending',
    notes: '' 
  },
  { 
    id: '3', 
    siteId: 'DEMO-SITE-001', 
    name: 'Bathroom Thermostat', 
    status: 'pending',
    notes: '' 
  }
];

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/installer/:siteId', (req, res) => {
  const { siteId } = req.params;
  
  // In a real app, we would check if the site exists
  const site = demoSites.find(s => s.siteId === siteId);
  if (!site) {
    return res.status(404).send('Site not found');
  }
  
  // Use absolute path to ensure file is found
  const filePath = path.resolve(__dirname, 'installer-view.html');
  console.log('Serving installer view from:', filePath);
  res.sendFile(filePath);
});

// API Routes for the demo
app.get('/api/sites', (req, res) => {
  res.json(demoSites);
});

app.get('/api/devices', (req, res) => {
  const { siteId } = req.query;
  if (siteId) {
    const filteredDevices = demoDevices.filter(d => d.siteId === siteId);
    return res.json(filteredDevices);
  }
  res.json(demoDevices);
});

app.patch('/api/devices/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  
  const deviceIndex = demoDevices.findIndex(d => d.id === id);
  if (deviceIndex === -1) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  if (status) {
    demoDevices[deviceIndex].status = status;
  }
  
  if (notes) {
    demoDevices[deviceIndex].notes = notes;
  }
  
  res.json(demoDevices[deviceIndex]);
});

app.post('/api/issues', (req, res) => {
  const { siteId, description, priority, reportedBy, contactInfo } = req.body;
  
  // In a real app, we would save this to a database
  const ticketId = 'TICKET-' + Math.floor(Math.random() * 10000);
  
  res.json({
    success: true,
    ticketId,
    message: 'Issue reported successfully'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Admin Dashboard: http://localhost:${PORT}/admin-dashboard`);
  console.log(`Installer View: http://localhost:${PORT}/installer/DEMO-SITE-001`);
});
