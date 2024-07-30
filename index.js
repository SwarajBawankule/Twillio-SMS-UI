require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS package
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

const accountSid = process.env.TWILIO_SID; // Your Twilio Account SID from .env
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Twilio Auth Token from .env
const client = new twilio(accountSid, authToken);

// Use CORS middleware
app.use(cors());

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle SMS sending
app.post('/send-sms', (req, res) => {
  const { to, message } = req.body;

  client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number from .env
    to: to,
    body: message
  })
  .then((message) => res.send(`Message sent with SID: ${message.sid}`))
  .catch((error) => res.status(500).send(`Failed to send message: ${error.message}`));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
