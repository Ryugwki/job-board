const protect = (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
};

export default protect;
