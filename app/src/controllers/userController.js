const UserModel = require("../models/userModel");

const express = require("express");
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, user_name, passwd } = req.body;
    const id = await UserModel.createUser(name, email, user_name, passwd);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: id,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await UserModel.loginUser(req?.body?.email, req?.body?.passwd);
    res.json({ user, message: "Login Successfully" });
  } catch (err) {
    next(err);
  }
});

class UserController {
  static async createUser(req, res) {
    try {
      const { name, email, phone } = req.body;
      const userId = await UserModel.createUser(name, email, phone);
      res.status(201).json({ id: userId });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserModel.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.json(user);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;

      await UserModel.updateUser(id, name, email, phone);

      res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await UserModel.deleteUser(id);

      res.status(204).json();
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = router;
