import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import BottomNav from "./BottomNav";

export default function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
