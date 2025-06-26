import User from "../models/User.js";

export const getLeaveBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ leaveBalance: user.leaveBalance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave balance', error: error.message });
  }
};

export const resetLeaveBalance = async (req, res) => {
  try {
    const { userId, vacation = 12, sick = 8, other =5 } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.leaveBalance.vacation = vacation;
    user.leaveBalance.sick = sick;
    user.leaveBalance.other = other;

    await user.save();
    res.status(200).json({ message: 'Leave balance reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting leave', error: error.message });
  }
};
