const express = require("express");
const UserController = require("../controllers/userController");
const { errorHandler } = require("../utils/errorHandler");
const router = express.Router();

router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

router.use("/emloyee", require("../controllers/emloyeeController"));
router.use("/attend", require("../controllers/attendanceController"));

// catch api all errors
router.use(errorHandler);

module.exports = router;
