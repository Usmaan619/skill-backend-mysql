const moment = require("moment");
const bcrypt = require("bcrypt");
const { APIError } = require("rest-api-errors");
const { connectToDatabase } = require("../../config/db");
const { hashedPassword, getToken } = require("../utils/helper");
require("dotenv").config();

class EmployeeModel {
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

  static async createEmployee(employeeData) {
    return this.withConnection(async (connection) => {
      const {
        first_name,
        last_name,
        mobile_number,
        address,
        department,
        date_of_join = moment().format("YYYY-MM-DD"),
        current_salary,
        position,
        last_hike_date = moment().format("YYYY-MM-DD"),
        last_hike_amount,
        passwd,
        email,

        isActive,
        user_name,
      } = employeeData;

      const hashPasswd = await hashedPassword(passwd);

      const [result] = await connection.execute(
        "INSERT INTO employee (first_name, last_name, mobile_number, address, department, date_of_join, current_salary, position, last_hike_date, last_hike_amount, passwd, email, isActive,user_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?)",
        [
          first_name,
          last_name,
          mobile_number,
          address,
          department,
          date_of_join,
          current_salary,
          position,
          last_hike_date,
          last_hike_amount,
          hashPasswd,
          email,
          isActive,
          user_name,
        ]
      );

      return result.insertId;
    });
  }

  static async loginEmployee(emailOrUsername, passwd) {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT * FROM employee WHERE email = ? OR user_name = ? ",
        [emailOrUsername, emailOrUsername]
      );

      if (!rows.length) {
        throw new APIError(404, "404", "Employee not found, please register");
      }

      const employee = rows[0];

      const isValidPassword = await bcrypt.compare(passwd, employee?.passwd);

      if (!isValidPassword) {
        throw new APIError(400, "400", "Invalid password");
      }

      let both;

      if (employee.email) both = employee.email;
      if (employee.user_name) both = employee.user_name;
      // Generate JWT token
      const token = getToken(employee?.id, both);

      // Return token without sensitive info
      delete employee.passwd;
      return { ...employee, token };
    });
  }

  static async getAllEmployees() {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.execute("SELECT * FROM employee");
      return rows;
    });
  }

  static async getEmployeeById(id) {
    return this.withConnection(async (connection) => {
      const [row] = await connection.execute(
        "SELECT * FROM employee WHERE id = ?",
        [id]
      );
      return row[0];
    });
  }

  static async updateEmployees(id, employeeData) {
    return this.withConnection(async (connection) => {
      const {
        first_name,
        last_name,
        mobile_number,
        address,
        department,
        date_of_join,
        current_salary,
        position,
        last_hike_date,
        last_hike_amount,
        user_name,
        passwd,
      } = employeeData;

      // Ensure all values are defined, replace undefined with null
      const params = [
        first_name ?? null,
        last_name ?? null,
        mobile_number ?? null,
        address ?? null,
        department ?? null,
        date_of_join ?? null,
        current_salary ?? null,
        position ?? null,
        last_hike_date ?? null,
        last_hike_amount ?? null,
        user_name ?? null,
        passwd ?? null,
        id,
      ];

      try {
        const [row] = await connection.execute(
          "UPDATE employee SET first_name = ?, last_name = ?, mobile_number = ?, address = ?, department = ?, date_of_join = ?, current_salary = ?, position = ?, last_hike_date = ?, last_hike_amount = ?, user_name = ?, passwd = ? WHERE id = ?",
          params
        );
        return row;
      } catch (error) {
        throw error; // Re-throw the error so it can be caught by the caller
      }
    });
  }

  static async deleteEmployee(id) {
    return this.withConnection(async (connection) => {
      await connection.execute("DELETE FROM employee WHERE id = ?", [id]);
    });
  }

  static async toggleEmployeeStatus(id) {
    return this.withConnection(async (connection) => {
      await connection.execute(
        "UPDATE employee SET isActive = !isActive WHERE id = ?",
        [id]
      );
    });
  }

  static async updateEmployeeLatest(id, employeeData) {
    return this.withConnection(async (connection) => {
      const columnsToUpdate = [];
      const params = [];

      // Fetch the existing employee record
      const [employeeRow] = await connection.execute(
        "SELECT passwd FROM employee WHERE id = ?",
        [id]
      );

      if (!employeeRow.length) {
        throw new APIError(404, "404", "Employee not found");
      }

      const employee = employeeRow[0]; // Assuming the employee exists and only one row is returned

      // Define all possible columns except password
      const allColumns = [
        "first_name",
        "last_name",
        "mobile_number",
        "address",
        "department",
        "date_of_join",
        "current_salary",
        "position",
        "last_hike_date",
        "last_hike_amount",
        "user_name",
        "email",
      ];

      // Iterate through all columns except password
      for (const column of allColumns) {
        if (column in employeeData && employeeData[column] !== undefined) {
          columnsToUpdate.push(`${column} = ?`);
          params.push(employeeData[column]);
        }
      }

      // Handle password separately
      if (employeeData.passwd) {
        const isSamePassword = await bcrypt.compare(
          employeeData.passwd,    
          employee.passwd
        );

        // Check if the new password is different from the current password in the database

        if (!isSamePassword) {
          const hashedPasswd = await hashedPassword(employeeData.passwd);
          columnsToUpdate.push(`passwd = ?`);
          params.push(hashedPasswd);
        }
      }

      // Add id as the last parameter
      params.push(id);

      try {
        const updateQuery = `
          UPDATE employee 
          SET ${columnsToUpdate.join(", ")} 
          WHERE id = ?
        `;

        const [row] = await connection.execute(updateQuery, params);
        return row;
      } catch (error) {
        throw error; // Re-throw the error so it can be caught by the caller
      }
    });
  }
}

module.exports = EmployeeModel;
