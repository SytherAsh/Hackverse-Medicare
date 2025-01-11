const { response } = require("express");
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createCall(req, res) {
  try {
    const call = await client.calls.create({
      from: "+12564834224",
      to: "+919152602555",
      url: "http://demo.twilio.com/docs/voice.xml",
    });

    console.log(call.sid); // Log the SID of the created call
    res.status(200).json({ message: "Call initiated successfully", callSid: call.sid });
  } catch (error) {
    console.error("Error creating call:", error.message); // Log the error message
    res.status(500).json({ message: "Failed to initiate call", error: error.message });
  }
}

module.exports = { createCall };
