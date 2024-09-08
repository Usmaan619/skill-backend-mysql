const express = require("express");
const UserController = require("../controllers/userController");
const { errorHandler } = require("../utils/errorHandler");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.use("/user", require("../controllers/userController"));
router.use("/emloyee", require("../controllers/emloyeeController"));
router.use(
  "/attend",
  // authMiddleware,
  require("../controllers/attendanceController")
);

// catch api all errors
router.use(errorHandler);

module.exports = router;
