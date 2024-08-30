const { connection } = require("../../config/db");

class UserModel {
  static async createUser(name, email, phone) {
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
      [name, email, phone]
    );
    return result.insertId;
  }

  static async getAllUsers() {
    const [rows] = await connection.execute("SELECT * FROM users");
    return rows;
  }

  static async getUserById(id) {
    const [row] = await connection.execute("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    return row[0];
  }

  static async updateUser(id, name, email, phone) {
    await connection.execute(
      "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email, phone, id]
    );
  }

  static async deleteUser(id) {
    await connection.execute("DELETE FROM users WHERE id = ?", [id]);
  }
}

module.exports = UserModel;
