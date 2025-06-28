import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import "./styles/LeaveBalance.css";

const LeaveBalance = () => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get("/leave/balance");
        setBalance(res.data);
      } catch (err) {
        toast.error("Failed to load leave balance.");
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="leave-balance-page">
      <div className="leave-balance-card">
        <h2>My Leave Balance</h2>

        {!balance ? (
          <p>Loading...</p>
        ) : (
          <div className="balance-list">
            <div className="balance-item">
              <span>Vacation Leave</span>
              <strong>{balance.vacation} Days</strong>
            </div>

            <div className="balance-item">
              <span>Sick Leave</span>
              <strong>{balance.sick} Days</strong>
            </div>

            <div className="balance-item">
              <span>Other Leave</span>
              <strong>{balance.other} Days</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveBalance;
