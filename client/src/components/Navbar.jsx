import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import { toast } from "react-toastify";
import "./styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!")
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="logo">
          Employee Leave Management System
        </Link>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {!user && (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span>👋 {user?.role?.toUpperCase()}</span>

            {user.role === "employee" && (
              <>
                <Link to="/leave-request" onClick={() => setMenuOpen(false)}>
                  Request Leave
                </Link>
                <Link to="/my-leaves" onClick={() => setMenuOpen(false)}>
                  My Leaves
                </Link>
                <Link to="/leave-balance" onClick={() => setMenuOpen(false)}>
                  Leave Balance
                </Link>
              </>
            )}

            {user.role === "manager" && (
              <>
                <Link to="/pending" onClick={() => setMenuOpen(false)}>
                  Pending Requests
                </Link>
                <Link to="/reset-leave" onClick={() => setMenuOpen(false)}>
                  Reset Balances
                </Link>
                <Link to="/calendar" onClick={() => setMenuOpen(false)}>
                  Calendar
                </Link>
              </>
            )}

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
