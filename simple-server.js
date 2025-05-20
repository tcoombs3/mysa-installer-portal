const express = require('express');
const path = require('path');
const app = express();
const PORT = 3030; // Using a different port to avoid conflicts

// Mock data for testing
const demoSites = [
  {
    id: 'rec123456789',
    siteId: 'DEMO-SITE-001',
    clientName: 'Windsurf Demo Client',
    address: '123 Test Street, Demo City',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const demoDevices = [
  {
    id: 'dev123456789',
    name: 'Thermostat Installation',
    status: 'pending',
    siteId: 'DEMO-SITE-001',
    lastUpdated: new Date().toISOString(),
    notes: 'Demo device for testing'
  },
  {
    id: 'dev987654321',
    name: 'Smart Switch Setup',
    status: 'pending',
    siteId: 'DEMO-SITE-001',
    lastUpdated: new Date().toISOString(),
    notes: 'Another demo device for testing'
  }
];

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'demo-static')));

// API Routes
// Mock authentication endpoint
app.post('/api/auth/google', (req, res) => {
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
app.get('/api/auth/status', (req, res) => {
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
app.get('/api/sites', (req, res) => {
  res.json(demoSites);
});

app.get('/api/sites/:siteId', (req, res) => {
  const site = demoSites.find(s => s.siteId === req.params.siteId);
  if (site) {
    res.json(site);
  } else {
    res.status(404).json({ error: 'Site not found' });
  }
});

// Mock devices endpoints
app.get('/api/devices', (req, res) => {
  const { siteId } = req.query;
  if (siteId) {
    const filteredDevices = demoDevices.filter(d => d.siteId === siteId);
    res.json(filteredDevices);
  } else {
    res.json(demoDevices);
  }
});

app.patch('/api/devices/:deviceId', (req, res) => {
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
app.get('/api/qr/:siteId', (req, res) => {
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
app.post('/api/issues', (req, res) => {
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

// Create a simple HTML page for demo
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mysa Installer Portal Demo</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #0078FF;
          border-bottom: 2px solid #0078FF;
          padding-bottom: 10px;
        }
        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        .btn {
          display: inline-block;
          background: #0078FF;
          color: white;
          padding: 10px 15px;
          border-radius: 4px;
          text-decoration: none;
          margin-right: 10px;
          margin-bottom: 10px;
        }
        .btn:hover {
          background: #0057B8;
        }
        pre {
          background: #f4f4f4;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <h1>Mysa Installer Portal Demo</h1>
      
      <div class="card">
        <h2>Demo Views</h2>
        <p>Click the buttons below to view the different interfaces:</p>
        <a href="/admin-dashboard" class="btn">Admin Dashboard</a>
        <a href="/installer/DEMO-SITE-001" class="btn">Installer View</a>
      </div>
      
      <div class="card">
        <h2>API Endpoints</h2>
        <p>The following API endpoints are available for testing:</p>
        <ul>
          <li><strong>GET /api/sites</strong> - List all sites</li>
          <li><strong>GET /api/sites/:siteId</strong> - Get site details</li>
          <li><strong>GET /api/devices?siteId=DEMO-SITE-001</strong> - List devices for a site</li>
          <li><strong>PATCH /api/devices/:deviceId</strong> - Update device status</li>
          <li><strong>GET /api/qr/:siteId</strong> - Get QR code for a site</li>
          <li><strong>POST /api/issues</strong> - Report an issue</li>
        </ul>
      </div>
      
      <div class="card">
        <h2>Test API Calls</h2>
        <button class="btn" onclick="fetchSites()">Get Sites</button>
        <button class="btn" onclick="fetchDevices()">Get Devices</button>
        <button class="btn" onclick="fetchQRCode()">Get QR Code</button>
        <button class="btn" onclick="updateDevice()">Update Device</button>
        <button class="btn" onclick="reportIssue()">Report Issue</button>
        
        <h3>Response:</h3>
        <pre id="response">Click a button to test an API endpoint...</pre>
      </div>
      
      <script>
        async function fetchSites() {
          try {
            const response = await fetch('/api/sites');
            const data = await response.json();
            document.getElementById('response').textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            document.getElementById('response').textContent = 'Error: ' + error.message;
          }
        }
        
        async function fetchDevices() {
          try {
            const response = await fetch('/api/devices?siteId=DEMO-SITE-001');
            const data = await response.json();
            document.getElementById('response').textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            document.getElementById('response').textContent = 'Error: ' + error.message;
          }
        }
        
        async function fetchQRCode() {
          try {
            const response = await fetch('/api/qr/DEMO-SITE-001');
            const data = await response.json();
            document.getElementById('response').textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            document.getElementById('response').textContent = 'Error: ' + error.message;
          }
        }
        
        async function updateDevice() {
          try {
            const response = await fetch('/api/devices/dev123456789', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                status: 'in_progress',
                notes: 'Updated from demo page'
              })
            });
            const data = await response.json();
            document.getElementById('response').textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            document.getElementById('response').textContent = 'Error: ' + error.message;
          }
        }
        
        async function reportIssue() {
          try {
            const response = await fetch('/api/issues', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                siteId: 'DEMO-SITE-001',
                description: 'Test issue from demo page',
                priority: 'medium'
              })
            });
            const data = await response.json();
            document.getElementById('response').textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            document.getElementById('response').textContent = 'Error: ' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Demo server running at http://localhost:${PORT}`);
  console.log('Using mock data for testing');
});
