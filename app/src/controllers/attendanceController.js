const express = require("express");
const router = express.Router();

const AttendanceModel = require("../models/attendanceModel.js");
const { APIError } = require("rest-api-errors");
router.post("/create", async (req, res, next) => {
  try {
    await AttendanceModel.createAttendance(req?.body);
    res.status(201).json({ success: true, message: "Verified successfully" });
  } catch (err) {
    next(err);
  }
});

router.get("/getATByEmployee/:id", async (req, res, next) => {
  try {
    const attendance = await AttendanceModel.getAttendancesByEmployee(
      req?.params?.id
    );
    if (!attendance) {
      throw new APIError(400, "400", "Attendance record not found");
    }
    res.json(attendance);
  } catch (err) {
    next(err);
  }
});

router.get("/getAllAttendance", async (req, res, next) => {
  try {
    const attendances = await AttendanceModel.getAllAttendances();
    res.json(attendances);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const attendance = await AttendanceModel.getAttendanceById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json(attendance);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await AttendanceModel.updateAttendance(req.params.id, req.body);
    res.json({ message: "Attendance updated successfully" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await AttendanceModel.deleteAttendance(req.params.id);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// const AttendanceModel = require("../models/AttendanceModel");

// class AttendanceController {
//   static async getAllAttendances(req, res) {
//     try {
//       const attendances = await AttendanceModel.getAllAttendances();
//       res.json(attendances);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }

//   static async getAttendanceByDate(req, res) {
//     try {
//       const attendances = await AttendanceModel.getAttendanceByDate(
//         req.params.date
//       );
//       res.json(attendances);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }

//   static async createAttendance(req, res) {
//     try {
//       const attendanceId = await AttendanceModel.createAttendance(req.body);
//       res.status(201).json({ id: attendanceId });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }

//   static async updateAttendance(req, res) {
//     try {
//       await AttendanceModel.updateAttendance(req.params.id, req.body);
//       res.json({ message: "Attendance updated successfully" });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// }

// module.exports = AttendanceController;
