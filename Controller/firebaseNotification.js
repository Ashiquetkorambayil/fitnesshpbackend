const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseServiceAccount.json');
const asyncHandler = require('express-async-handler')

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.PROJECT_ID,
    });
  }

  exports.Notification = asyncHandler(async(req,res)=>{
    const registrationToken = req.body.token;
  const message = {
    token: registrationToken,
    notification: {
      title: req.body.title,
      body: req.body.body,
    },
    android: {
      priority: "high", // Set high priority for Android notifications
    },
    apns: {
      payload: {
        aps: {
          "content-available": 1, // Ensure high priority for background notifications
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Notification failed");
  }
  })