import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.example (copy to .env.local)');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Connection options optimized for both local MongoDB and MongoDB Atlas
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maximum number of connections in the pool
      serverSelectionTimeoutMS: 10000, // Timeout for server selection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      const isAtlas = MONGODB_URI.includes('mongodb+srv://');
      const dbType = isAtlas ? 'MongoDB Atlas (Cloud)' : 'MongoDB (Local)';
      console.log(`✓ Frontend API: ${dbType} Connected`);
      return mongoose;
    }).catch((error) => {
      console.error('✗ Frontend API: MongoDB Connection Error:', error.message);
      
      // Provide helpful error messages
      if (error.message.includes('ECONNREFUSED')) {
        console.error('→ Local MongoDB: Ensure MongoDB is installed and running (mongod)');
      } else if (error.message.includes('authentication failed')) {
        console.error('→ MongoDB Atlas: Check username and password in connection string');
      } else if (error.message.includes('network')) {
        console.error('→ MongoDB Atlas: Check network access settings and whitelist your IP');
      }
      
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
