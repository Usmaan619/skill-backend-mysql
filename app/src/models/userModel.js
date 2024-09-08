const { APIError } = require("rest-api-errors");
const { connectToDatabase } = require("../../config/db");
const { hashedPassword, getToken } = require("../utils/helper");
const bcrypt = require("bcrypt");
require("dotenv").config();
class UserModel {
  static async withConnection(callback) {
    const connection = await connectToDatabase();
    try {
      return await callback(connection);
    } catch (err) {
      throw err;
    } finally {
      connection.end();
    }
  }

  static async createUser(name, email, user_name, passwd) {
    return this.withConnection(async (connection) => {
      const hashPasswd = await hashedPassword(passwd);
      const [result] = await connection.execute(
        "INSERT INTO users (name, email, user_name, passwd ) VALUES (?, ?, ?, ?)",
        [name, email, user_name, hashPasswd]
      );
      return result.insertId;
    });
  }

  static async loginUser(emailOrUsername, passwd) {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE email = ? OR user_name = ? ",
        [emailOrUsername, emailOrUsername]
      );

      if (!rows.length) {
        throw new APIError(404, "404", "User not found, please register");
      }

      const users = rows[0];

      const isValidPassword = await bcrypt.compare(passwd, users?.passwd);

      if (!isValidPassword) {
        throw new APIError(400, "400", "Invalid password");
      }

      let both;

      if (users.email) both = users.email;
      if (users.user_name) both = users.user_name;
      // Generate JWT token
      const token = getToken(users?.id, both);

      // Return token without sensitive info
      delete users.passwd;
      return { ...users, token };
    });
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
