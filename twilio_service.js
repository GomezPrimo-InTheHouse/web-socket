
import dotenv from 'dotenv';
dotenv.config();

import client from "./twilio_client.js";


export const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,  // Ejemplo: +5491122334455
    });
    console.log("✅ SMS enviado:", response.sid);
    return response;
  } catch (error) {
    console.error("❌ Error enviando SMS:", error);
    throw error;
  }
};

export default sendSMS;
