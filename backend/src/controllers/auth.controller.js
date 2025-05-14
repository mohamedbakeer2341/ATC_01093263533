import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken as generateCryptoToken } from "../utils/crypto.js";
import { sendVerificationEmail } from "../utils/email.js";

export const signup = async (req, res, next) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("Email already in use");
    error.status = 400;
    return next(error);
  }

  const verificationToken = generateCryptoToken();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = new User({
    email,
    password: await hashPassword(password),
    name,
    verificationToken: verificationToken,
    verificationTokenExpires: verificationExpires,
  });

  await user.save();
  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({ message: "Please check your email for verification" });
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    const error = new Error("Invalid verification token");
    error.status = 400;
    return next(error);
  }

  if (user.verificationTokenExpires < new Date()) {
    const error = new Error("Verification token has expired");
    error.status = 400;
    return next(error);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    return next(error);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    return next(error);
  }

  const token = generateToken({ userId: user._id, email: user.email });
  res.status(200).json({ message: "Login successful", user, token });
};
