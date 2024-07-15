const Notification = require('../Model/notificationModal');
const asyncHandler = require('express-async-handler')

// Create a new notification
// exports.createNotification =asyncHandler(async (req, res) => {
//     try {
//         const { name, image, planId } = req.body;
//         console.log(req.body,'this is the body')
//         const newNotification = new Notification({
//             name,
//             image,
//             planId
//         });

//         const savedNotification = await newNotification.save();
//         res.status(201).json(savedNotification);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// Delete a notification by ID
exports.deleteNotification = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const deletedNotification = await Notification.findByIdAndDelete(id);
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch all notifications
exports.getAllNotifications = asyncHandler(async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
