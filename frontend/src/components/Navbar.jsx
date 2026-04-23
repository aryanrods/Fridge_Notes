import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out.");
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <span className="text-xl group-hover:scale-110 transition-transform duration-200">
            🥬
          </span>
          <span className="font-display font-bold text-lg text-stone-800 tracking-tight">
            FridgeNotes
          </span>
        </Link>

        {/* Nav actions */}
        {user && (
          <div className="flex items-center gap-3">
            <Link
              to="/houses/create"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-sage-600 transition-colors"
            >
              <span className="text-base">＋</span> New House
            </Link>
            <Link
              to="/houses/join"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-sage-600 transition-colors"
            >
              Join
            </Link>

            {/* Avatar dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-cream-100 transition-colors">
                <div className="w-7 h-7 rounded-full bg-sage-200 text-sage-700 flex items-center justify-center text-xs font-display font-bold">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-stone-700 max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lift border border-stone-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="text-xs text-stone-400 font-body">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-stone-700 truncate">
                    {user.email}
                  </p>
                </div>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-sm text-stone-600 hover:bg-cream-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/houses/create"
                  className="block px-3 py-2 text-sm text-stone-600 hover:bg-cream-100 transition-colors sm:hidden"
                >
                  + New House
                </Link>
                <Link
                  to="/houses/join"
                  className="block px-3 py-2 text-sm text-stone-600 hover:bg-cream-100 transition-colors sm:hidden"
                >
                  Join House
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-terracotta-500 hover:bg-terracotta-100 transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
