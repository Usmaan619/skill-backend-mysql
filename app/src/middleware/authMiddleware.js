const jwt = require("jsonwebtoken");
const { APIError } = require("rest-api-errors");

const decodeTokenAndGetUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (error) {
    throw new APIError(401, "401", "Please login.");
  }
};

const authMiddleware = async (req, res, next) => {
  const token = req.header("authorization");
  if (!token) {
    return next(new APIError(401, "401", "Please login."));
  }

  try {
    const data = await decodeTokenAndGetUser(token);
    if (!data) {
      return next(new APIError(401, "401", "Please login."));
    }

    // req.user = await User.findById(data.id);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  decodeTokenAndGetUser,
  authMiddleware,
};
