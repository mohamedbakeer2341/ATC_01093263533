import { verifyToken } from "../utils/jwt.js";
import asyncHandler from "../utils/asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("No token provided");
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  req.user = decoded;
  next();
});

export default authenticate;
