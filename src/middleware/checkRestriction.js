export const blockRestrictedAuthor = (req, res, next) => {
  if (req.user.isRestricted) {
    return res
      .status(403)
      .json({ message: "Your author access is restricted" });
  }
  next();
};