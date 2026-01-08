import jwt from 'jsonwebtoken';

const JWT_EXPIRE = '7d'; // Token expires in 7 days

// Helper to get JWT_SECRET with validation
const getJwtSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return JWT_SECRET;
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: JWT_EXPIRE,
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    return null;
  }
};
