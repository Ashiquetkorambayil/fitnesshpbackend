const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://tecnaviswebsolutions:XcsP1AQoaczFkL0R@cluster0.yxamk2w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        // await mongoose.connect('mongodb+srv://ashiquetk860628:JxYXct9qJ7F3xszE@gymadmin.gmvkych.mongodb.net/?retryWrites=true&w=majority&appName=gymadmin');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

