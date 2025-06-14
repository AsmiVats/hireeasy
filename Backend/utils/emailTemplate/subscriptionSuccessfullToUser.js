export const subcriptionSuccessfullToUser = (name, from, to, link) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <title>Hireeasy</title>
</head>
<body style=\"font-family: Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0;\">
  <div style=\"width: 100%; max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);\">
    <!-- Brand Header -->
    <div style=\"padding: 20px; text-align: center; border-bottom: 1px solid #ddd;\">
      <div style=\"font-size: 28px; font-weight: bold;text-align: left;\">
        <span style=\"color:#009951;\">Now</span><span style=\"color: #002244;\">Edge</span>
      </div>
      <div style=\"font-size: 18px; margin-top: 10px; color: #333;text-align: left;color:#009951;\">Congratulations! Your Subscription was Successful.</div>
    </div>
    <!-- Body Content -->
    <div style=\"padding: 25px; font-size: 16px; color: #333; line-height: 1.6;\">
      <p>Hi ${name},</p>
      <p>Thank you for choosing Hireeasy. Your subscription is now active.</p>
      <p><strong>What We’ll Get:</strong></p>
      <ul style=\"margin: 0 0 15px 20px; padding: 0;\">
        <li>A personalized walkthrough of Hireeasy</li>
        <li>How we can tailor our solution to your needs</li>
        <li>Answers to any questions you may have</li>
      </ul>
      <div style=\"text-align: center; margin: 24px 0;\">
        <a href="${link}" style=\"background-color: #28a745; color: #fff; padding: 12px 28px; border-radius: 5px; text-decoration: none; font-weight: bold;\">Go to Dashboard</a>
      </div>
      <p><strong>Subscription Period:</strong> ${from} - ${to}</p>
      <p>Best regards,<br>Support Team<br><span style=\"color:#009951; font-weight: bold;\">Now</span><span style=\"color:#002244; font-weight: bold;\">Edge</span></p>
    </div>
    <!-- Footer / Disclaimer -->
    <div style=\"font-size: 14px; color: #666; text-align: center; padding: 20px; border-top: 1px solid #ddd;\">
      Disclaimer: This email and any attachments are intended solely for the recipient and may contain confidential or proprietary information. If you are not the intended recipient, please notify the sender immediately and delete this message. Any unauthorized review, use, disclosure, or distribution of this communication is strictly prohibited.<br><br>
      © Copyright Hireeasy 2025. All rights reserved. Contact us | Privacy Policies
    </div>
  </div>
</body>
</html>`;
};