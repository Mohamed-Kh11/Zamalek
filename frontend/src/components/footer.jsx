// src/components/Footer.jsx
import { NavLink } from "react-router-dom";
import logo from "../images/logzsc.png";

const Footer = () => {
  const linkStyle =
    "text-gray-600 hover:text-red-600 transition font-medium";

  return (
    <footer className="bg-white shadow-inner border-t border-gray-200 font-josefin">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left - Logo / Branding */}
        <div className="flex flex-col items-center md:items-start space-y-3 mb-8 md:mb-0">
          <img
            src={logo}
            alt="Zamalek Logo"
            className="h-12 w-auto"
          />
          <span className="text-gray-700 font-bold text-lg">
            Zamalek SC
          </span>
        </div>

        {/* Center - Vertical Links */}
        <div className="flex flex-col items-center space-y-3 mb-8 md:mb-0">
          <NavLink to="/" className={linkStyle}>
            Home
          </NavLink>
          <NavLink to="/news" className={linkStyle}>
            News
          </NavLink>
          <NavLink to="/matches" className={linkStyle}>
            Matches
          </NavLink>
          <NavLink to="/stats" className={linkStyle}>
            Stats
          </NavLink>
          <NavLink to="/players" className={linkStyle}>
            Players
          </NavLink>
        </div>

        {/* Right - Copyright */}
        <div className="text-gray-500 text-sm text-center md:text-right max-w-xs">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-700">Zamalek SC</span>.  
          All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
