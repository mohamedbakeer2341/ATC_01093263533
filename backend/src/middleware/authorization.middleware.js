import asyncHandler from "../utils/asyncHandler.js";

const authorize = (role) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (user.role !== role) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  });
};

export default authorize;
