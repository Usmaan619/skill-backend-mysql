const EmployeeModel = require("../models/employeeModal");
const express = require("express");
const { getToken } = require("../utils/helper");
const router = express();

router.post("/create", async (req, res, next) => {
  try {
    const employeeId = await EmployeeModel.createEmployee(req?.body);
    res.status(201).json({ id: employeeId });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.loginEmployee(
      req?.body?.email,
      req?.body?.passwd
    );
    res.json({ employee, message: "Login Successfully" });
  } catch (err) {
    next(err);
  }
});

router.get("/getAllEmployees", async (req, res, next) => {
  try {
    const employees = await EmployeeModel.getAllEmployees();
    res.json({ success: true, employees });
  } catch (err) {
    next(err);
  }
});

router.get("/getEmployeeById/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.getEmployeeById(req?.params?.id);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    } else {
      res.json(employee);
    }
  } catch (err) {
    next(err);
  }
});

class EmployeeController {
  static async createEmployee(req, res, next) {
    try {
      const employeeId = await EmployeeModel.createEmployee(req.body);
      res.status(201).json({ id: employeeId });
    } catch (err) {
      next(err);
    }
  }

  static async getAllEmployees(req, res, next) {
    try {
      const employees = await EmployeeModel.getAllEmployees();
      res.json(employees);
    } catch (err) {
      next(err);
    }
  }

  static async getEmployeeById(req, res, next) {
    try {
      const employee = await EmployeeModel.getEmployeeById(req.params.id);
      if (!employee) {
        res.status(404).json({ message: "Employee not found" });
      } else {
        res.json(employee);
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateEmployee(req, res, next) {
    try {
      await EmployeeModel.updateEmployee(req.params.id, req.body);
      res.status(200).json({ message: "Employee updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteEmployee(req, res, next) {
    try {
      await EmployeeModel.deleteEmployee(req.params.id);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  static async toggleEmployeeStatus(req, res, next) {
    try {
      await EmployeeModel.toggleEmployeeStatus(req.params.id);
      res.json({ message: "Employee status toggled successfully" });
    } catch (err) {
      next(err);
    }
  }
}

// module.exports = EmployeeController;
module.exports = router;
