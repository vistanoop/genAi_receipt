import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Connection options optimized for both local MongoDB and MongoDB Atlas
    const options = {
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_TIMEOUT) || 10000,
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2,  // Minimum number of connections in the pool
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    const isAtlas = process.env.MONGODB_URI.includes('mongodb+srv://');
    const dbType = isAtlas ? 'MongoDB Atlas (Cloud)' : 'MongoDB (Local)';
    
    console.log(`✓ ${dbType} Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    console.error('Server will continue running, but database features will not be available.');
    
    // Provide helpful error messages based on error type
    if (error.message.includes('ECONNREFUSED')) {
      console.error('→ Local MongoDB: Ensure MongoDB is installed and running (mongod)');
    } else if (error.message.includes('authentication failed')) {
      console.error('→ MongoDB Atlas: Check username and password in connection string');
    } else if (error.message.includes('network')) {
      console.error('→ MongoDB Atlas: Check network access settings and whitelist your IP');
    }
    
    console.error('→ Connection String Format:');
    console.error('  Local:  mongodb://localhost:27017/genai-receipt');
    console.error('  Atlas:  mongodb+srv://username:password@cluster.mongodb.net/genai-receipt');
    
    // Don't exit the process - let the server continue running
    // This allows health checks and other non-DB endpoints to work
    return null;
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✓ MongoDB reconnected successfully');
});

mongoose.connection.on('connecting', () => {
  console.log('→ Connecting to MongoDB...');
});

export default connectDB;
