# Mysa Installer Portal

A standalone installer portal that reads from and writes to Airtable (mirroring Mysa HQ), guiding installers through a personalized step-by-step installation process via QR codes, and offering an admin interface for managing codes, exporting data, and reporting issues.

## Features

- **Admin Dashboard**: Secure access via Google OAuth for Mysa staff to manage QR codes
- **QR Code Management**: Generate, preview, and download QR codes for installation sites
- **Installer View**: No-login access via QR code scan for step-by-step installation guidance
- **Airtable Integration**: Real-time sync with Airtable for site and device data
- **Issue Reporting**: Built-in system for installers to report issues that generates support tickets

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, React Query
- **Backend**: Node.js, Express.js
- **Authentication**: Google OAuth for admin access
- **Data Storage**: Airtable API integration
- **QR Code Handling**: QR code generation and scanning capabilities

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       └── utils/          # Utility functions and API clients
└── server/                 # Backend Express application
    ├── src/                # Server source code
    │   ├── routes/         # API route handlers
    │   ├── middleware/     # Express middleware
    │   └── config/         # Configuration files
    └── .env.example        # Environment variables template
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Airtable account with access to the required bases
- Google OAuth credentials (for admin authentication)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd windsurf-project
```

2. **Set up the server**

```bash
cd server
npm install
cp .env.example .env  # Copy and configure environment variables
```

3. **Set up the client**

```bash
cd ../client
npm install
```

4. **Configure environment variables**

Edit the `.env` file in the server directory with your Airtable API key, Google OAuth credentials, and other required settings.

### Running the Application

1. **Start the server**

```bash
cd server
npm run dev
```

2. **Start the client**

```bash
cd ../client
npm start
```

3. **Access the application**

- Admin Dashboard: http://localhost:3000/login
- Installer View: http://localhost:3000/installer/:siteId (accessed via QR code)

## Airtable Integration

This application integrates with two Airtable tables:

- **Sites**: Contains information about installation sites (read-only)
- **Devices**: Contains information about devices at each site (read/write)

Refer to the PRD for detailed field mappings and API endpoints.
