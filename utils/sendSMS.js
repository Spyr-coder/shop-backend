const africastalking = require('africastalking')({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

exports.sendSMS = async (to, message) => {
  try {
    const sms = africastalking.SMS;
    const result = await sms.send({
      to: [to],
      message,
    });
    console.log('SMS sent:', result);
  } catch (err) {
    console.error('SMS error:', err);
  }
};
