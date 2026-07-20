import { NavLink , useNavigate} from "react-router-dom";
import {User, Settings ,LogOut} from 'lucide-react'
import { useLogoutMutation } from "../store/features/auth/authApi";

const ProfileMenu = ({ closeMenu }) => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  //  Proper logout
  const signOut = async () => {
    try {
      await logout().unwrap();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
return(
<>
  <div className="absolute right-0 mt-3 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fadeIn z-50">
    <NavLink
      to="/profile"
      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 transition"
      onClick={()=>{closeMenu
        console.log("Profile");
        
      }}
    >
      <User size={18} /> Profile
    </NavLink>
    <NavLink
      to="/settings"
      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 transition"
      onClick={closeMenu}
    >
      <Settings size={18} /> Settings
    </NavLink>
    <button
      onClick={() => {
        console.log("signOut");
        
        closeMenu();
        signOut()
      }}
      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition"
    >
      <LogOut size={18} /> Sign Out
    </button>
  </div>
</>
)
};
export default ProfileMenu;