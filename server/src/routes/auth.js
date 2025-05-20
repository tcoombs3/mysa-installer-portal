const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies?.authToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ isAuthenticated: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ isAuthenticated: false, message: 'Invalid token' });
  }
};

// Check if email domain is allowed (Mysa domain)
const isAllowedDomain = (email) => {
  const allowedDomains = ['getmysa.com']; // Add any other allowed domains
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
};

// Google OAuth login
router.post('/google', async (req, res) => {
  const { tokenId } = req.body;
  
  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    
    // Check if user has allowed domain
    if (!isAllowedDomain(email)) {
      return res.status(403).json({ 
        isAuthenticated: false, 
        message: 'Access denied. Only Mysa email addresses are allowed.' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { email, name, picture },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set cookie with token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    
    // Return success response
    res.json({
      isAuthenticated: true,
      user: { email, name, picture }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ 
      isAuthenticated: false, 
      message: 'Authentication failed' 
    });
  }
});

// Check authentication status
router.get('/status', verifyToken, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: req.user
  });
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ success: true });
});

module.exports = router;
