// components/Navbar.js
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-center space-x-8 p-4 bg-white bg-opacity-20 backdrop-blur-lg shadow-lg text-white font-bold">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          isActive ? "text-yellow-400 underline" : "hover:text-yellow-300"
        }
        end
      >
        Guess Name
      </NavLink>
      <NavLink 
        to="/images" 
        className={({ isActive }) => 
          isActive ? "text-yellow-400 underline" : "hover:text-yellow-300"
        }
      >
        Guess Image
      </NavLink>
    </nav>
  );
};

export default Navbar;