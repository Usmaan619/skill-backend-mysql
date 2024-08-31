const { connectToDatabase } = require("../../config/db");
const moment = require("moment");
require("dotenv").config();

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
      isActive,
    } = employeeData;

    const [result] = await connection.execute(
      "INSERT INTO  employee (first_name, last_name, mobile_number, address, department, date_of_join, current_salary, position, last_hike_date, last_hike_amount, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        isActive,
      ]
    );

    return result.insertId;
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
