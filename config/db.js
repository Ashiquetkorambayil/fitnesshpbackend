const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ashiquetk860628:lomKLxmyRFyEc2SG@gymadmin.gmvkych.mongodb.net/?retryWrites=true&w=majority&appName=gymadmin');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

 // 'mongodb://localhost:27017'