const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const DGX_USER = require("../model/dgx_user.model");
const USER_OTP = require("../model/otp.model");
const ROLE = require("../model/role.model");
const { Op } = require("sequelize");

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await DGX_USER.findOne({
      where: { email_id: email },
    });

    if (!user) {
      return res.json({ exists: false });
    }

    return res.json({ exists: true });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ exists: false, error: "Server error" });
  }
};

// Function to generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Function to send the OTP via email (placeholder implementation)
const sendOtpEmail = async (email, otp) => {
  // const transporter = nodemailer.createTransport({
  //   // service: 'gmail',
  //   host: "smtp.zoho.in", // or 'smtp.zoho.com' if using .com domain
  //   port: 465, // use 465 for SSL
  //   secure: true,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_APP_PASSWORD,
  //   },
  // });

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 587, // TLS port (works on Render)
    secure: false, // MUST be false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Zoho sometimes requires this on cloud hosts
    },
  });


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${otp} - OTP for DGX Portal Login Request`,
    text: `Dear User,

Your one-time password (OTP) for the DGX login request is: ${otp}

This code is valid for 10 minutes.

If you did not request this code, please ignore this email.

Regards,
DGX Administration Team`,
  };

  // Send the email
  return transporter.sendMail(mailOptions);
};

// Sign-in function: generates OTP, sends it via email, and stores it in the OTP table
const signin = async (req, res) => {
  try {
    const { email } = req.body;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const user = await DGX_USER.findOne({ where: { email_id: email } });

    if (!user) {
      return res.status(404).send({
        message: "User not found with the provided email.",
        userExists: false,
      });
    }

    const otp = generateOtp();

    await sendOtpEmail(email, otp);

    const otpRecord = await USER_OTP.create({
      otp,
      user_id: user.user_id,
      created_timestamp: new Date(),
      created_by: user.user_id,
    });

    setTimeout(() => {
      deleteOtp(otpRecord.otp_id);
    }, 600000);

    const tempToken = jwt.sign({ email, user_id: user.user_id }, jwtSecretKey, {
      expiresIn: "20m",
    });

    res.status(200).send({
      message: "OTP sent successfully!",
      temp_token: tempToken,
      userExists: true,
    });
  } catch (error) {
    console.error("Error during sign-in process:", error);
    res.status(500).send({
      message: "Failed to send OTP. Please try again later.",
      error: error.message,
    });
  }
};

// / Verify OTP function: validates OTP, marks it as verified, and creates a JWT token for session management

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    // Check if the user exists by email
    const user = await DGX_USER.findOne({ where: { email_id: email } });

    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found with the provided email." });
    }

    // Verify OTP from the database
    const otpRecord = await USER_OTP.findOne({
      where: {
        user_id: user.user_id,
        otp: otp,
      },
    });

    if (!otpRecord) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }

    // Fetch role name from role table
    const role = await ROLE.findOne({
      where: { role_id: user.role_id },
      attributes: ["role_name"],
    });

    if (!role) {
      return res.status(500).send({ message: "Role not found for the user." });
    }

    const roleName = role.role_name;

    // Create a JWT token for a valid session, valid for 1 hour
    const token = jwt.sign(
      {
        email,
        user_id: user.user_id,
        userName: `${user.first_name} ${user.last_name}`,
        roleName,
      },
      jwtSecretKey,
      {
        expiresIn: "20m",
      }
    ); // 20 minutes timeout

    const accessToken = jwt.sign(
      { email: email, user_id: user.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20m" }
    );

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 10 * 60 * 1000,
    });

    const refreshToken = jwt.sign(
      { user_id: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "20m" }
    );

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 20 * 60 * 1000,
    });

    // Respond to the client with a success message and JWT token
    res.status(200).send({
      message: "OTP verified successfully!",
      jwt_token: token,
      roleName: roleName,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send({
      message: "Failed to verify OTP. Please try again later.",
      error: error.message,
    });
  }
};

const signOut = async (request, response) => {
  const accessToken = jwt.sign(
    { email: "", user_id: "" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "0s" }
  );

  response.cookie("access-token", accessToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
    maxAge: 0 * 60 * 1000,
  });

  const refreshToken = jwt.sign(
    { user_id: "" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "0s" }
  );

  response.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
    maxAge: 0 * 60 * 1000,
  });

  response.status(200).send({ message: "Logged out." });
};
// Function to delete OTP after it expires
async function deleteOtp(otpId) {
  try {
    const result = await USER_OTP.destroy({
      where: { otp_id: otpId },
    });
    console.log(`Deleted OTP with ID: ${otpId}`);
  } catch (error) {
    console.error("Error deleting OTP:", error);
  }
}
module.exports = { checkEmail, signin, verifyOtp, signOut };
