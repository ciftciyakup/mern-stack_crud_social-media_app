import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // e.g. 'Gmail' or 'Yahoo'
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: options.email,
      subject: options.subject,
      text: options.text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log("E-posta Gönderildi");
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
