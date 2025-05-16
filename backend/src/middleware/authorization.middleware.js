import asyncHandler from "../utils/asyncHandler.js";

const authorize = (role) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(new Error("Unauthorized: No user found", { status: 401 }));
    }

    if (user.role !== role) {
      return next(
        new Error("Forbidden: Insufficient permissions", { status: 403 })
      );
    }

    next();
  });
};

export default authorize;
