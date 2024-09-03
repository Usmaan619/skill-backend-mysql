const { connectToDatabase } = require("../../config/db");
const moment = require("moment");
const { hashedPassword, getToken } = require("../utils/helper");
require("dotenv").config();

const bcrypt = require("bcrypt");
const { APIError } = require("rest-api-errors");
class EmployeeModel {
  static async createEmployee(employeeData) {
    const connection = await connectToDatabase();
    let {
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
      passwd,
      email,
      isActive,
    } = employeeData;

    const hashPasswd = await hashedPassword(passwd);

    const [result] = await connection.execute(
      "INSERT INTO  employee (first_name, last_name, mobile_number, address, department, date_of_join, current_salary, position, last_hike_date, last_hike_amount,passwd,email, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
      [
        first_name,
        last_name,
        mobile_number,
        address,
        department,
        (date_of_join = moment().format("YYYY-MM-DD")),
        current_salary,
        position,
        (last_hike_date = moment().format("YYYY-MM-DD")),
        last_hike_amount,
        (passwd = hashPasswd),
        email,
        isActive,
      ]
    );

    return result.insertId;
  }

  static async loginEmployee(email, passwd) {
    const connection = await connectToDatabase();
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM employee WHERE email = ?",
        [email]
      );
      connection.end();

      if (!rows.length)
        throw new APIError(404, "404", "Employee not found please register");

      const employee = rows[0];
      const isValidPassword = await bcrypt.compare(passwd, employee?.passwd);

      if (!isValidPassword) throw new APIError(400, "400", "Invalid password");

      // Generate JWT token
      const token = getToken(employee?.id, employee.email);

      // Return token without sensitive info
      delete employee.passwd;
      return { ...employee, token };
    } catch (err) {
      connection.end();
      throw err;
    }
  }

  static async getAllEmployees() {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute("SELECT * FROM  employee");
    return rows;
  }

  static async getEmployeeById(id) {
    const connection = await connectToDatabase();
    const [row] = await connection.execute(
      "SELECT * FROM  employee WHERE id = ?",
      [id]
    );
    return row[0];
  }

  static async updateEmployee(id, employeeData) {
    const connection = await connectToDatabase();
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
      isActive,
    } = employeeData;

    await connection.execute(
      "UPDATE  employee SET first_name = ?, last_name = ?, mobile_number = ?, address = ?, department = ?, date_of_join = ?, current_salary = ?, position = ?, last_hike_date = ?, last_hike_amount = ?, isActive = ? WHERE id = ?",
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
        isActive,
        id,
      ]
    );
  }

  static async deleteEmployee(id) {
    const connection = await connectToDatabase();
    await connection.execute("DELETE FROM users WHERE id = ?", [id]);
  }

  static async toggleEmployeeStatus(id) {
    const connection = await connectToDatabase();
    await connection.execute(
      "UPDATE  employee SET isActive = !isActive WHERE id = ?",
      [id]
    );
  }
}

module.exports = EmployeeModel;
