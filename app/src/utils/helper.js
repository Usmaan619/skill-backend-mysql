const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

module.exports = (() => {
  this.decodeTokenAndGetUser = async (token) => {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  };
  this.getToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.SECRET, {
      expiresIn: "30 day",
    });
  };

  this.hashedPassword = async (passwd) => {
    return await bcrypt.hash(passwd, 10);
  };

  //   this.getToken = (id, email, rememberMe, role = "user") => {
  //     const expiresIn = rememberMe ? "15 days" : "3 days";
  //     return jwt.sign({ id, email, role }, SECRET, { expiresIn });
  //   };

  this.authMiddleware = async (req, res, next) => {
    const token = req.header("authorization");
    if (!token) {
      res.statusCode = 401;
      res.json({ success: false, message: "Please login." });
      return;
    }
    try {
      const data = await this.decodeTokenAndGetUser(token);
      if (!data) {
        res.json({ success: false, message: "Please login again." }, 401);
        return;
      }
      // req.user = await User.findById(data.id);

      next();
    } catch (error) {
      next(error);
    }
  };
  return this;
})();
