const UserModel = require("../models/userModel");

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

module.exports = UserController;
