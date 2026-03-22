require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 MongoDB Connection Diagnostic Tool');
console.log('=====================================\n');

// Check if MONGODB_CONNECTION is defined
console.log('1. Checking environment variables...');
if (!process.env.MONGODB_CONNECTION) {
    console.error('❌ MONGODB_CONNECTION is not defined in .env file');
    console.log('   Please add: MONGODB_CONNECTION=mongodb://localhost:27017/your-database-name');
    process.exit(1);
} else {
    console.log('✅ MONGODB_CONNECTION found:', process.env.MONGODB_CONNECTION.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
}

// Test MongoDB connection
console.log('\n2. Testing MongoDB connection...');
console.log('   Connecting...');

mongoose.connect(process.env.MONGODB_CONNECTION, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    console.log('   Connection state:', mongoose.connection.readyState);
    console.log('   Database name:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    console.log('   Port:', mongoose.connection.port);
    
    // Close the connection
    return mongoose.connection.close();
})
.catch((error) => {
    console.error('❌ MongoDB connection failed!');
    console.error('   Error type:', error.name);
    console.error('   Error message:', error.message);
    
    // Provide specific troubleshooting based on error
    if (error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 Troubleshooting:');
        console.log('   - Make sure MongoDB is running locally');
        console.log('   - Check if MongoDB is listening on the correct port');
        console.log('   - Try: mongod --version (to check if MongoDB is installed)');
        console.log('   - Try: netstat -an | findstr 27017 (Windows) or lsof -i :27017 (Mac/Linux)');
    } else if (error.message.includes('authentication failed')) {
        console.log('\n💡 Troubleshooting:');
        console.log('   - Check your username and password');
        console.log('   - Verify the database user has correct permissions');
        console.log('   - Check if the authentication database is correct');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.log('\n💡 Troubleshooting:');
        console.log('   - Check if the hostname is correct');
        console.log('   - Verify DNS resolution is working');
        console.log('   - Check your internet connection');
    } else if (error.message.includes('SRV')) {
        console.log('\n💡 Troubleshooting:');
        console.log('   - Check if the SRV record exists');
        console.log('   - Verify the connection string format for MongoDB Atlas');
    }
    
    process.exit(1);
});
