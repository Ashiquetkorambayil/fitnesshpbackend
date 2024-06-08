const asyncHandler = require('express-async-handler')


const projectId = 'fitnesshpnotification'


exports.theNotification = asyncHandler(async(req,res)=>{
    const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
    const accessToken = "d2267163c042da7e774622dd79707c121e8d47af"; 
    const notification = {
      title: "Background Message Title",
      body: "Background message body"
    };
    const message = {
      notification: notification,
      token: "123456" // Replace with the device token you want to send the message to
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ message: message })
      });
      
      if (response.ok) {
        console.log("Message sent successfully");
      } else {
        console.error("Failed to send message:", await response.text());
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
})