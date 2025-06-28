import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import "./styles/MyLeaves.css";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get("/leave/my-requests");
        setLeaves(res.data);
      } catch (err) {
        toast.error("Failed to load your leaves.");
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="my-leaves-page">
      <div className="my-leaves-card">
        <h2>My Leave Requests</h2>

        {leaves.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`status ${leave.status}`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyLeaves;
