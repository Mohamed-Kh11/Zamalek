import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import axios from "axios";

import logo from "../images/logozsc.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      // Call backend logout to clear httpOnly cookie
      await axios.post(`${API_BASE}/api/users/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    } finally {
      dispatch(logout());
      navigate("/admin/signin");
    }
  };

  const linkStyle = ({ isActive }) =>
    `relative transition pb-1 ${
      isActive
        ? "text-red-600 font-bold after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:bg-red-600"
        : "text-gray-700 hover:text-red-600"
    }`;

  return (
    <header className="w-full">
      <div className="w-full h-[13px] bg-red-600"></div>

      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md relative rounded-b-xl">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Zamalek Logo" className="h-12 w-auto" />
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-5 lg:space-x-10">
          <NavLink to="/" className={linkStyle}>Home</NavLink>
          <NavLink to="/news" className={linkStyle}>News</NavLink>
          <NavLink to="/matches" className={linkStyle}>Matches</NavLink>
          <NavLink to="/table" className={linkStyle}>Table</NavLink>
          <NavLink to="/players" className={linkStyle}>Players</NavLink>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 font-medium"> {user.name || user.email.split("@")[0]}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 lg:px-5 py-2 font-semibold text-white rounded-lg bg-red-600 hover:bg-red-700 transition-all"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/admin/signin"
              className="relative flex items-center gap-2 px-2 lg-px-6 py-2 overflow-hidden font-semibold text-white rounded-lg bg-red-600 group"
            >
              <FiLogIn className="text-lg" />
              <span className="relative">Login</span>
              <span className="absolute inset-0 w-0 bg-white opacity-20 transition-all duration-300 ease-out group-hover:w-full"></span>
            </NavLink>
          )}
        </div>

        {/* Mobile Burger */}
        <div className="md:hidden">
          {isOpen ? (
            <FaTimes className="text-2xl text-gray-700 cursor-pointer" onClick={toggleMenu} />
          ) : (
            <FaBars className="text-2xl text-gray-700 cursor-pointer" onClick={toggleMenu} />
          )}
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-center space-y-4 py-6 md:hidden z-50">
            <NavLink to="/" onClick={toggleMenu} className={linkStyle}>Home</NavLink>
            <NavLink to="/news" onClick={toggleMenu} className={linkStyle}>News</NavLink>
            <NavLink to="/matches" onClick={toggleMenu} className={linkStyle}>Matches</NavLink>
            <NavLink to="/table" onClick={toggleMenu} className={linkStyle}>Table</NavLink>
            <NavLink to="/players" onClick={toggleMenu} className={linkStyle}>Players</NavLink>

            {user ? (
              <>
                <span className="text-gray-700 font-medium">👤 {user.name || user.email}</span>
                <button
                  onClick={() => { handleLogout(); toggleMenu(); }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/admin/signin"
                onClick={toggleMenu}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Login
              </NavLink>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
