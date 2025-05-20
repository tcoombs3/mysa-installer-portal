#!/bin/bash

# Setup script for Mysa Installer Portal

echo "Setting up Mysa Installer Portal..."

# Create .env file for server if it doesn't exist
if [ ! -f "./server/.env" ]; then
  echo "Creating server .env file..."
  cp ./server/.env.example ./server/.env
  echo "Please update the .env file with your actual credentials."
fi

# Create .env file for client if it doesn't exist
if [ ! -f "./client/.env" ]; then
  echo "Creating client .env file..."
  echo "REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id" > ./client/.env
  echo "REACT_APP_API_URL=http://localhost:5000/api" >> ./client/.env
  echo "Please update the .env file with your actual credentials."
fi

echo "Setup complete! You can now start the application."
echo ""
echo "To start the server: cd server && npm run dev"
echo "To start the client: cd client && npm start"
echo ""
echo "Access the application at:"
echo "- Admin Dashboard: http://localhost:3000/login"
echo "- Installer View: http://localhost:3000/installer/:siteId (via QR code)"
