const { connectToDatabase } = require("../../config/db");
const moment = require("moment");
class AttendanceModel {
  static async createAttendance(attendanceData) {
    const connection = await connect();
    try {
      const [result] = await connection.execute(
        "INSERT INTO attendance (employee_id, attendance_date, present, profile_img) VALUES (?, ?, ?, ?)",
        [
          attendanceData?.employee_id,
          moment().format("YYYY-MM-DD"), // Using current date if not provided
          attendanceData?.present ?? false, // Defaulting to false if not provided
          attendanceData?.profile_img ?? null, // Setting to null if not provided
        ]
      );
      connection.end();
      return result.insertId;
    } catch (err) {
      connection.end();
      throw err;
    }
  }
  static async getAllAttendances() {
    const conn = await connectToDatabase();
    const [rows] = await conn.execute("SELECT * FROM attendance");
    conn.end();
    return rows;
  }

  static async getAttendanceByDate(date) {
    const conn = await connect();
    const [rows] = await conn.execute(
      "SELECT * FROM attendance WHERE attendance_date = ?",
      [date]
    );
    conn.end();
    return rows;
  }

  //   static async createAttendance(attendanceData) {
  //     const conn = await connect();
  //     const [result] = await conn.execute(
  //       "INSERT INTO attendance SET ?",
  //       attendanceData
  //     );
  //     conn.end();
  //     return result.insertId;
  //   }

  static async updateAttendance(id, attendanceData) {
    const conn = await connect();
    await conn.execute("UPDATE attendance SET ? WHERE id = ?", [
      attendanceData,
      id,
    ]);
    conn.end();
  }
  static async getAttendanceById(id) {
    const connection = await connect();
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM attendance WHERE attendance_id = ?",
        [id]
      );
      connection.end();
      return rows[0];
    } catch (err) {
      connection.end();
      throw err;
    }
  }

  static async deleteAttendance(id) {
    const connection = await connect();
    try {
      await connection.execute(
        "DELETE FROM attendance WHERE attendance_id = ?",
        [id]
      );
      connection.end();
    } catch (err) {
      connection.end();
      throw err;
    }
  }

  static async getAttendancesByEmployee(employeeId) {
    const connection = await connect();
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM attendance WHERE employee_id = ?",
        [employeeId]
      );
      connection.end();
      return rows;
    } catch (err) {
      connection.end();
      throw err;
    }
  }

  static async getAttendancesByDate(date) {
    const connection = await connect();
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM attendance WHERE attendance_date = ?",
        [date]
      );
      connection.end();
      return rows;
    } catch (err) {
      connection.end();
      throw err;
    }
  }
}

module.exports = AttendanceModel;
