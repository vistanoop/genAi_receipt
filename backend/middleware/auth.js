import { verifyToken } from '../utils/jwt.js';

// Middleware to protect routes that require authentication
export const authenticate = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies?.token || 
                  req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided. Please login.' 
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired token. Please login again.' 
      });
    }

    // Add userId to request object
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication failed.' 
    });
  }
};
