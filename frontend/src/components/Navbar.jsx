import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ title }) {
  const { user, handleLogout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
        <Link to="/" className="text-primary-600 font-bold text-xl tracking-tight">
          Carela
        </Link>
        {title && (
          <span className="text-gray-800 font-semibold text-sm">{title}</span>
        )}
        <Link to="/profile" className="flex items-center gap-2">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
