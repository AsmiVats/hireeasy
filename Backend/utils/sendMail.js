import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const email = process.env.NODEMAILER_GMAIL;
const password = process.env.NODEMAILER_GMAIL_PASS;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email, // Your email
    pass: password, // Your app-specific password (not your actual password)
  },
});

export const sendMail = async (from, to, subject, text) => {
  // Mail options

  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: from,
      to: to, // Receiver's email
      subject: subject,
      text: text,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
        reject(err);
      } else {
        console.log("Email sent:", info.response);
        resolve(info.response);
      }
    });
  });
};

export const sendMail1 = async (from, to, subject, htmlContent) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: htmlContent, // Changed from 'text' to 'html'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
        reject(error); // Fixed 'err' to 'error'
      } else {
        console.log("Email sent:", info.response);
        resolve(info.response);
      }
    });
  });
};
