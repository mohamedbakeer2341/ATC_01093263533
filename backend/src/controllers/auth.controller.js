import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken as generateCryptoToken } from "../utils/crypto.js";
import { sendVerificationEmail } from "../utils/email.js";
import cloudinary from "../utils/cloudinary.js";
// import redisClient from "../utils/redis.js";

export const createAdmin = async (req, res, next) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.status = 400;
    return next(error);
  }

  const admin = await User.create({
    email,
    password: await hashPassword(password),
    name,
    role: "admin",
    isVerified: true,
  });

  return res.status(201).json({
    success: true,
    data: {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    message: "Admin created successfully",
  });
};

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

  res.status(201).json({
    success: true,
    message: "Please check your email for verification",
  });
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

  res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
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

  const token = generateToken({
    userId: user._id,
    email: user.email,
    role: user.role,
  });
  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
    },
  });
};

export const uploadProfilePicture = async (req, res, next) => {
  const { userId } = req.user;
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    return next(error);
  }

  if (!req.file) {
    const error = new Error("No file uploaded");
    error.status = 400;
    return next(error);
  }

  if (
    user.profilePicture &&
    typeof user.profilePicture === "string" &&
    user.profilePicture.includes("cloudinary.com") &&
    user.profilePicture.includes("/upload/")
  ) {
    try {
      const parts = user.profilePicture.split("/upload/");
      if (parts.length > 1 && parts[1]) {
        const versionAndPublicId = parts[1];
        const pathParts = versionAndPublicId.split("/");
        let oldPublicId;
        if (pathParts[0].match(/^v\d+$/)) {
          oldPublicId = pathParts.slice(1).join("/").split(".")[0];
        } else {
          oldPublicId = versionAndPublicId.split(".")[0];
        }

        if (oldPublicId) {
          await cloudinary.uploader.destroy(oldPublicId);
        }
      }
    } catch (e) {
      const error = new Error(
        "Error trying to delete old profile picture from Cloudinary (non-fatal):"
      );
      error.status = 500;
      return next(error);
    }
  }

  user.profilePicture = req.file.path;
  await user.save();

  const profileData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    profilePicture: user.profilePicture,
  };
  return res.json({ success: true, data: profileData });
};

export const changePassword = async (req, res, next) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    return next(error);
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.status = 401;
    return next(error);
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
};

export const getUserProfile = async (req, res, next) => {
  const { userId } = req.user;
  // const cacheKey = `user_profile_${userId}`;

  // const cachedProfile = await redisClient.get(cacheKey);
  // if (cachedProfile) {
  //   return res.json({ success: true, data: JSON.parse(cachedProfile) });
  // }

  const user = await User.findById(userId).lean();

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    return next(error);
  }

  const profileData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    profilePicture: user.profilePicture,
  };
  // await redisClient.setEx(cacheKey, 1800, JSON.stringify(profileData));
  return res.json({ success: true, data: profileData });
};
