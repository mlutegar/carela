import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import DiagnosticPage from "./pages/DiagnosticPage";
import MaintenancePage from "./pages/MaintenancePage";
import MechanicsPage from "./pages/MechanicsPage";
import ProfilePage from "./pages/ProfilePage";
import VehiclesPage from "./pages/VehiclesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/mechanics" element={<MechanicsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
