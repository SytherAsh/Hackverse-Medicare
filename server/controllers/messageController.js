// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createMessage(contactNumbers,messageBody) {
    const messagePromises = contactNumbers.map(async (number) => {
        try {
          const message = await client.messages.create({
            body: messageBody,
            from: "+12564834224", // Your Twilio phone number
            to: number,
          });
          console.log(`Message sent to ${number}: ${message.body}`);
        } catch (error) {
          console.error(`Failed to send message to ${number}:, error.message`);
        }
      });
    
    await Promise.all(messagePromises);
}

module.exports = {createMessage};