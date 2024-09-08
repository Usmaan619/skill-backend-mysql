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

  static async getMonthlyAttendanceCount() {
    try {
      return await this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          `SELECT 
             YEAR(attendance_date) AS year, 
             MONTH(attendance_date) AS month, 
             COUNT(*) AS attendance_count
           FROM attendance
           GROUP BY YEAR(attendance_date), MONTH(attendance_date)
           ORDER BY YEAR(attendance_date), MONTH(attendance_date)`
        );
        if (rows.length === 0) {
          throw new Error("No attendance records found for any month");
        }
        return rows;
      });
    } catch (error) {
      console.error("Error fetching monthly attendance count:", error.message);
      throw error;
    }
  }

  static async getMonthlyAttendanceCountFiltered(year, month) {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.execute(
        `SELECT 
           employee_id,
           YEAR(attendance_date) AS year, 
           MONTH(attendance_date) AS month, 
           COUNT(*) AS attendance_count
         FROM attendance
         WHERE YEAR(attendance_date) = ? AND MONTH(attendance_date) = ?
         GROUP BY employee_id, YEAR(attendance_date), MONTH(attendance_date)
         ORDER BY employee_id`,

        [year, month]
      );
      return rows;
    });
  }

  static async getFilteredAttendanceCount(year, month, employeeId) {
    return this.withConnection(async (connection) => {
      const query = `
      SELECT 
        employee_id,
        attendance_date,
        YEAR(attendance_date) AS year,
        MONTH(attendance_date) AS month,
        COUNT(*) AS attendance_count
      FROM 
        attendance
      WHERE 
        YEAR(attendance_date) = ? 
        AND MONTH(attendance_date) = ?
        AND employee_id = ?
      GROUP BY 
        employee_id, YEAR(attendance_date), MONTH(attendance_date)
      ORDER BY 
        employee_id;
    `;

      const [rows] = await connection.execute(query, [year, month, employeeId]);
      return rows;
    });
  }
  // this is imp
  static async getFullMonthlyAttendance(employeeId, month, year) {
    return this.withConnection(async (connection) => {
      // profile_img -- Include profile image if needed
      const query = `
        SELECT 
          employee_id,
          attendance_date,
          YEAR(attendance_date) AS year,
          MONTH(attendance_date) AS month,
          present  -- Include present status if needed
        FROM 
          attendance
        WHERE 
          YEAR(attendance_date) = ? 
          AND MONTH(attendance_date) = ?
          AND employee_id = ?
        ORDER BY 
          attendance_date ASC;
      `;

      const [rows] = await connection.execute(query, [year, month, employeeId]);
      return rows;
    });
  }

  static async getFullMonthlyAttendanceWithCount(employeeId, month, year) {
    return this.withConnection(async (connection) => {
      const query = `
        SELECT 
          employee_id,
          attendance_date,
          YEAR(attendance_date) AS year,
          MONTH(attendance_date) AS month,
          present,
          (SELECT COUNT(*) 
           FROM attendance 
           WHERE YEAR(attendance_date) = ? 
             AND MONTH(attendance_date) = ? 
             AND employee_id = ?) AS monthly_count
        FROM 
          attendance
        WHERE 
          YEAR(attendance_date) = ? 
          AND MONTH(attendance_date) = ?
          AND employee_id = ?
        ORDER BY 
          attendance_date ASC;
      `;

      const [rows] = await connection.execute(query, [
        year,
        month,
        employeeId,
        year,
        month,
        employeeId,
      ]);
      return rows;
    });
  }

  /**
   * this is using for for admin
   * */
  static async getFullMonthlyAttendanceWithCount(employeeId, month, year) {
    return this.withConnection(async (connection) => {
      const query = `
        SELECT 
          employee_id,
          attendance_date,
          YEAR(attendance_date) AS year,
          MONTH(attendance_date) AS month,
          present,  -- Include present status if needed
          (SELECT COUNT(*) 
           FROM attendance 
           WHERE YEAR(attendance_date) = ? 
             AND MONTH(attendance_date) = ? 
             AND employee_id = ?) AS total_monthly_attendance -- Subquery for total count
        FROM 
          attendance
        WHERE 
          YEAR(attendance_date) = ? 
          AND MONTH(attendance_date) = ?
          AND employee_id = ?
        ORDER BY 
          attendance_date ASC;
      `;

      const params = [year, month, employeeId, year, month, employeeId];
      const [rows] = await connection.execute(query, params);
      return rows;
    });
  }
}

module.exports = AttendanceModel;
