import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Modern Mongoose doesn't need these options
      // useNewUrlParser and useUnifiedTopology are deprecated
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of default 30
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Server will continue running, but database features will not be available.');
    console.error('Please ensure MongoDB is running and the connection string is correct.');
    // Don't exit the process - let the server continue running
    // This allows health checks and other non-DB endpoints to work
    return null;
  }
};

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

export default connectDB;
