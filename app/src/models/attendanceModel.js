const moment = require("moment");
const { connectToDatabase } = require("../../config/db");

class AttendanceModel {
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

  static async createAttendance(attendanceData) {
    return this.withConnection(async (connection) => {
      const [result] = await connection.execute(
        "INSERT INTO attendance (employee_id, attendance_date, present, profile_img) VALUES (?, ?, ?, ?)",
        [
          attendanceData?.employee_id,
          moment().format("YYYY-MM-DD"), // Using current date if not provided
          attendanceData?.present ?? "false", // Defaulting to false if not provided
          attendanceData?.profile_img ?? null, // Setting to null if not provided
        ]
      );
      return result.insertId;
    });
  }

  static async getAllAttendances() {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.execute("SELECT * FROM attendance");

      rows.forEach((row) => {
        delete row?.profile_img;
      });
      return rows;
    });
  }

  static async getAttendanceByDate(date) {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT * FROM attendance WHERE attendance_date = ?",
        [date]
      );
      return rows;
    });
  }

  static async updateAttendance(id, attendanceData) {
    return this.withConnection(async (connection) => {
      await connection.execute("UPDATE attendance SET ? WHERE id = ?", [
        attendanceData,
        id,
      ]);
    });
  }

  static async getAttendanceById(id) {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT * FROM attendance WHERE attendance_id = ?",
        [id]
      );
      return rows[0];
    });
  }

  static async deleteAttendance(id) {
    return this.withConnection(async (connection) => {
      await connection.execute(
        "DELETE FROM attendance WHERE attendance_id = ?",
        [id]
      );
    });
  }

  static async getAttendancesByEmployee(employeeId) {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT * FROM attendance WHERE employee_id = ?",
        [employeeId]
      );
      return rows;
    });
  }

  static async getAttendancesByDate(date) {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT * FROM attendance WHERE attendance_date = ?",
        [date]
      );
      return rows;
    });
  }
}

module.exports = AttendanceModel;
