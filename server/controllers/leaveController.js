import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";

export const submitLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const employee = await User.findById(req.user.userId);
    if (!employee.manager) {
      return res
        .status(400)
        .json({ message: "Manager not assigned to employee" });
    }

    const daysRequested =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

    if (
      leaveType === "vacation" &&
      employee.leaveBalance.vacation < daysRequested
    ) {
      return res
        .status(400)
        .json({ message: "Insufficient vacation leave balance" });
    }

    if (leaveType === "sick" && employee.leaveBalance.sick < daysRequested) {
      return res
        .status(400)
        .json({ message: "Insufficient sick leave balance" });
    }

    if (leaveType === "other" && employee.leaveBalance.other < daysRequested) {
      return res
        .status(400)
        .json({ message: "Insufficient other leave balance" });
    }

    const leave = new LeaveRequest({
      user: req.user.userId,
      leaveType,
      startDate,
      endDate,
      reason,
      manager: employee.manager,
    });

    const savedLeave = await leave.save();
    res.status(201).json(savedLeave);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting leave", error: error.message });
  }
};

export const getMyLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(leaves);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leaves", error: error.message });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    const pendingLeaves = await LeaveRequest.find({
      status: "pending",
      manager: req.user.userId,
    })
      .populate("user", "name email role reason")
      .sort({ createdAt: -1 });
    res.status(200).json(pendingLeaves);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch pending leaves", error: err.message });
  }
};

export const approveOrRejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, managerComment } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leave = await LeaveRequest.findById(id).populate("user");
    if (!leave)
      return res.status(404).json({ message: "Leave request not found" });

    leave.status = status;
    leave.managerComment = managerComment || "";
    await leave.save();

    // Optional: Update leave balance only if approved
    if (status === "approved") {
      const days =
        (new Date(leave.endDate) - new Date(leave.startDate)) /
          (1000 * 60 * 60 * 24) +
        1;

      if (leave.leaveType === "vacation") {
        leave.user.leaveBalance.vacation -= days;
      } else if (leave.leaveType === "sick") {
        leave.user.leaveBalance.sick -= days;
      } else if (leave.leaveType === "other") {
        leave.user.leaveBalance.other -= days;
      }
      await leave.user.save();
    }

    res.status(200).json({ message: `Leave ${status} successfully` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error processing leave request", error: err.message });
  }
};

export const getApprovedLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'approved' })
      .populate('user', 'name email')
      .sort({ startDate: 1 });

    const calendarEvents = leaves.map(leave => ({
      title: `${leave.user.name} - ${leave.leaveType}`,
      start: leave.startDate,
      end: leave.endDate,
      allDay: true
    }));

    res.status(200).json(calendarEvents);
  } catch (err) {
    res.status(500).json({ message: 'Error loading approved leaves', error: err.message });
  }
};

export const getLeaveBalance = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("leaveBalance");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      vacation: user.leaveBalance.vacation,
      sick: user.leaveBalance.sick,
      other: user.leaveBalance.other,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching leave balance" });
  }
};