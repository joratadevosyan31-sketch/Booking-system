// import { Request, Response } from "express";
// import { DaySchedule } from "../model/day.js";
// import { Employee } from "../model/employee.js";
// import { DayScheduleAbs } from "../interface/day_abs.js";
export {};
// class DayScheduleController extends DayScheduleAbs {
//     // Get all day schedules
//     async getDaySchedules(req: Request, res: Response): Promise<void> {
//         try {
//             const schedules = await DaySchedule.find().populate("employee");
//             res.status(200).json({ success: true, schedules });
//         } catch (error: any) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     }
//     // Create a new day schedule
//     async setDaySchedule(req: Request, res: Response): Promise<void> {
//         try {
//             const { employee, date, workStart, workEnd, mainBreakStart, mainBreakEnd, defaultBreakBetweenServices } = req.body;
//             if (!employee || !date || !workStart || !workEnd) {
//                 res.status(400).json({ success: false, message: "Missing required fields" });
//                 return;
//             }
//             const employeeData = await Employee.findById(employee);
//             if (!employeeData) {
//                 res.status(404).json({ success: false, message: "Employee not found" });
//                 return;
//             }
//             const schedule = await DaySchedule.create({
//                 employee,
//                 date,
//                 workStart,
//                 workEnd,
//                 mainBreakStart: mainBreakStart || null,
//                 mainBreakEnd: mainBreakEnd || null,
//                 defaultBreakBetweenServices: defaultBreakBetweenServices || null
//             });
//             res.status(201).json({ success: true, schedule });
//         } catch (error: any) {
//             // Handle duplicate schedule error
//             if (error.code === 11000) {
//                 res.status(400).json({ success: false, message: "Schedule for this employee on this date already exists" });
//                 return;
//             }
//             res.status(500).json({ success: false, message: error.message });
//         }
//     }
//     // Update an existing day schedule
//     async updateDaySchedule(req: Request, res: Response): Promise<void> {
//         try {
//             const { scheduleId, workStart, workEnd, mainBreakStart, mainBreakEnd, defaultBreakBetweenServices } = req.body;
//             if (!scheduleId) {
//                 res.status(400).json({ success: false, message: "Schedule ID is required" });
//                 return;
//             }
//             const updateData: any = {};
//             if (workStart) updateData.workStart = workStart;
//             if (workEnd) updateData.workEnd = workEnd;
//             if (mainBreakStart) updateData.mainBreakStart = mainBreakStart;
//             if (mainBreakEnd) updateData.mainBreakEnd = mainBreakEnd;
//             if (defaultBreakBetweenServices !== undefined) updateData.defaultBreakBetweenServices = defaultBreakBetweenServices;
//             const updatedSchedule = await DaySchedule.findByIdAndUpdate(scheduleId, updateData, { new: true }).populate("employee");
//             if (!updatedSchedule) {
//                 res.status(404).json({ success: false, message: "Schedule not found" });
//                 return;
//             }
//             res.status(200).json({ success: true, schedule: updatedSchedule });
//         } catch (error: any) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     }
//     // Delete a day schedule
//     async deleteDaySchedule(req: Request, res: Response): Promise<void> {
//         try {
//             const { scheduleId } = req.body;
//             if (!scheduleId) {
//                 res.status(400).json({ success: false, message: "Schedule ID is required" });
//                 return;
//             }
//             const deletedSchedule = await DaySchedule.findByIdAndDelete(scheduleId);
//             if (!deletedSchedule) {
//                 res.status(404).json({ success: false, message: "Schedule not found" });
//                 return;
//             }
//             res.status(200).json({ success: true, message: "Schedule deleted", schedule: deletedSchedule });
//         } catch (error: any) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     }
// }
// export default new DayScheduleController();
