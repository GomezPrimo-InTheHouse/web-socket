const express = require("express");
const { sendSMS } = require("../twilio_service.js");

const router = express.Router();

router.post("/send-sms", async (req, res) => {
    console.log("📨 Mensaje recibido:", req.body);
  const { to, message } = req.body;
  try {
    const response = await sendSMS(to, message);
    res.json({ success: true, sid: response.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;  
