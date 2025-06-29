import React from "react";
import { Link } from "react-router-dom";
import "./styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-page">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you’re looking for doesn’t exist or has been moved.</p>
      <Link to="/" className="back-home-btn">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
