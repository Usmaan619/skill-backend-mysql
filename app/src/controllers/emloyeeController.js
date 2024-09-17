const EmployeeModel = require("../models/employeeModal");
const express = require("express");
const { getToken } = require("../utils/helper");
const { APIError } = require("rest-api-errors");
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

router.post("/updateEmployee/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.updateEmployeeLatest(
      req?.params?.id,
      req?.body
    );
    if (!employee)
      throw new APIError(400, "400", "Something went wrong please try again!");

    res.json({
      success: true,
      message: "Employee details update successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

