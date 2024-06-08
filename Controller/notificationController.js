

// const https = require('https');
const fetch = import('node-fetch').then(module => module.default);
const serviceAccount = require('../config/serviceAccountKey.json');
const { google } = require('google-auth-library');

// const serviceAccount = {
//   client_email:"firebase-adminsdk-olu6x@fitnesshpnotification.iam.gserviceaccount.com",
//   private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzqh4qgcy9myG2\n2LgZlHTEJU71iubbhkVvMkx8GeFIW783xRHnC5zXZqKICFmYiW2a7FuepGHY/90h\n1eGJmL07NAVsdC3LrI2QhlEfsbCRPyqjz9HWWhs39JquUXSjGTHf5StglS6lvPqM\nr7EcoaqmCPw8E489YF5wF5/SeeJO09I8hF3M70htXeo2l9XPGld0BtOcl+iXkf4a\nwvGs+MgA7Ib123CpsqrLJ9X/cASfVLJDlFb8KElcMqtbL/ueyVT9NqjADwoFczvJ\nJ0SyDf9UJGlK0g1DuDKHCna0xqnA4PWwRtHLUGc/IQIGSsykOUvSQTSF9iBhy72D\nIhWryur1AgMBAAECggEABlZlH4M6HWMUPp6o6dAUiVm2jg9DAvHaz6gSzhrcmUCR\nP26eacu9UdTPPWSsAmcwnFMjjTZHtE+cNYYVoVSnsies3E1B00ooKTWvtWI/c/Qq\nNSKOyJSfmqrwbN83Mcyg94CeNdc1UMfYf69v3C5wtlAhU54uApB8bFBNBS/i9XxQ\nsASjw+pn+VlPqc69znL/kGEy/MrPYYJ1+TVTYrkc1g7tP00i1CMxoTgbGoFbOkiA\n9SGpR1DF73ex8YvkpM8bCww+Ul2afD8gbvf0cPI+SISH9iPZDcyjVdbOP9ZO0j2I\nhnNjdWbXDNOCsP1VHdsC7LWPP4ItppgryuSqUQjH2QKBgQDYA8A994aWYcBUF3mw\n9B91xXJUVnkAg8/xEZQC9izKsetDZFdDzlwVOxTtNHRg4Rg4O7Tj3OwHFYLCnLVo\ndI5vJXXJB7TComGGKsReOPUOi0ndkRMh6P1/2258+bKDmQvxzQ3H5fdM0eFDanqk\nIVf9BeCRsVYeY3kljsWewY/t2QKBgQDU69l+QoXcEfOS13Pl/XgR8ydLwPPISZgx\nj5Y9v5K0EFNQqmrwqvFlGLoWw8oWAolNeJ6KBRFR5CuydJQwldANKmpt3mZPfM2y\nLN0qbBCxW5pY7tafpfR1/PV4X0w4ejzbzU5dqkqS+Zp+L7rGIHmDwykFtm3hhE7z\no5UAQ50IfQKBgDr7szd4aiiP4ntTuafG0PxQgKpkvj+Uvmfd2+N/IrXqJQpO0ME0\nDNLDQjCO/SQi8oEQVJFPlqdMiVrofWRbRzU0LlhJIWNwAV8oOFxeAxQIlo/IeEfv\nHaEW4rF/YO4sESXiTtwBgChaur60yW4dqK/vNeWyXYiIsuC9flqeEdXpAoGACBBO\nkluOmkELynniZ8lrrLJawKG0Gde/rdDUTc5djfg4T4vEtQykS8Hd+lK76o16CbcR\nugRrHYDYrs9/dT+XO4hps3OCyGvflmngjmS9VRo1BD03X6B3W6iS21Ywmsr2VxS1\nbRKv9FUDptfD6RD9ySGxAghgrPPH0a5WTEZDQjkCgYBMSshbtw7HTtEAnWdEPbWH\ngh7HTGq8H9R0A2xh5YCMQ+faTjdfB+r8f0jRzzydDLWBYj8I1vJnXdRp9WbGPhzD\nSxi3Q3L/viYrS8BUXALgUh3C5KaAcS26v/xn3i7/M2eAnh0eIUV+E+uvUA56we4W\ngNodK8g7BOzVvL79UawMmQ==\n-----END PRIVATE KEY-----\n"
// };


// const getAccessToken = async () => {
//   // console.log('this functtion is working')
//     const client = new google.auth.JWT(
//         serviceAccount.client_email,
//         null,
//         serviceAccount.private_key,
//         ['https://www.googleapis.com/auth/firebase.messaging']
//     );
//     console.log(client,'this is thw client')
//     const token = await client.authorize();
//     return token.access_token;
// };

exports.sendNotification = async (req, res) => {
    try {
        // const accessToken = await getAccessToken();
      
        const messagePayload = {
            "message": {
                "topic": "matchday",
                "notification": {
                    "title": "Background Message Title",
                    "body": "Background message body"
                },
                "webpush": {
                    "fcm_options": {
                        "link": "https://dummypage.com"
                    }
                }
            }
        };

        const response = await fetch('https://fcm.googleapis.com/v1/projects/fitnesshpnotification/messages:send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messagePayload)
        });

        if (response.ok) {
            res.status(200).json({ message: 'Notification sent successfully' });
        } else {
            res.status(response.status).json({ error: 'Error sending notification' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error, 'this is the error');
    }
};
