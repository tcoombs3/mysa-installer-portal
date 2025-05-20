#!/bin/bash

# Start both client and server in development mode
echo "Starting Mysa Installer Portal in development mode..."

# Create a temporary .env file for testing if it doesn't exist
if [ ! -f "./server/.env" ]; then
  echo "Creating temporary server .env file for testing..."
  cp ./server/.env.example ./server/.env
fi

if [ ! -f "./client/.env" ]; then
  echo "Creating temporary client .env file for testing..."
  echo "REACT_APP_GOOGLE_CLIENT_ID=test_client_id" > ./client/.env
  echo "REACT_APP_API_URL=http://localhost:5000/api" >> ./client/.env
fi

# Start the server in one terminal
osascript -e 'tell application "Terminal" to do script "cd '$PWD'/server && npm run dev"'

# Start the client in another terminal
osascript -e 'tell application "Terminal" to do script "cd '$PWD'/client && npm start"'

echo "Both client and server are starting..."
echo "Access the application at:"
echo "- Admin Dashboard: http://localhost:3000/login"
echo "- Installer View: http://localhost:3000/installer/DEMO-SITE-001 (Demo site for testing)"

# Create a demo site and device in the server for testing
echo "Setting up demo data..."
mkdir -p ./server/src/data
cat > ./server/src/data/demo-data.js << EOL
// Demo data for testing
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

module.exports = { demoSites, demoDevices };
EOL

# Create mock routes for testing without Airtable
cat > ./server/src/routes/mock-data.js << EOL
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
EOL

# Update server index.js to use mock data for testing
cat > ./server/src/index.js.bak << EOL
$(cat ./server/src/index.js)
EOL

cat > ./server/src/index.js << EOL
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Use mock data routes for testing
app.use('/api', require('./routes/mock-data'));

const PORT = process.env.PORT || 5000;

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log('Using mock data for testing');
});
EOL

echo "Setup complete! The application is now running with mock data for testing."
echo "To restore the original server configuration, run: mv ./server/src/index.js.bak ./server/src/index.js"
