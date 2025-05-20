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
