import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
// import Dashboard from './pages/Dashboard'; 
import AuthProvider from './auth/authContext';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/*" element={<Dashboard />} /> */}
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
    </AuthProvider>
  );
};

export default App;
