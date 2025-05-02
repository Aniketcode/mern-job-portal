import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, Menu, User2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const navLinks =
    user && user.role === "recruiter"
      ? [
          { label: "Companies", to: "/admin/companies" },
          { label: "Jobs", to: "/admin/jobs" },
        ]
      : [
          { label: "Home", to: "/" },
          { label: "Jobs", to: "/jobs" },
          { label: "Browse", to: "/browse" },
        ];
  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Career<span className="text-[#F83002]">Pilot</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-6 font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-[#F83002] transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="user" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-2 items-start">
                  <Avatar>
                    <AvatarImage src={user?.profile?.profilePhoto} alt="user" />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-gray-700">
                  {user?.role === "student" && (
                    <div className="flex items-center gap-2">
                      <User2 size={16} />
                      <Link to="/profile">
                        <Button variant="link">View Profile</Button>
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <LogOut size={16} />
                    <Button onClick={logoutHandler} variant="link">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="space-y-3 font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" variant="outline">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                    Signup
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {user?.role === "student" && (
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="outline">
                      View Profile
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() => {
                    logoutHandler();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
