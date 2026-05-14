import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReminders } from "../api/maintenance";
import { getVehicles } from "../api/vehicles";
import Navbar from "../components/Navbar";
import ReminderCard from "../components/ReminderCard";
import useAuthStore from "../store/authStore";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [vRes, rRes] = await Promise.all([getVehicles(), getReminders()]);
        setVehicles(vRes.data.results ?? vRes.data);
        const all = rRes.data.results ?? rRes.data;
        setReminders(all.filter((r) => r.status !== "concluido").slice(0, 4));
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "Motorista";

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-6">
        <section>
          <p className="text-gray-500 text-sm">Olá,</p>
          <h2 className="text-2xl font-bold text-gray-900">{firstName} 👋</h2>
        </section>

        <section className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-5 text-white">
          <p className="text-primary-100 text-sm font-medium">Seus veículos</p>
          {loading ? (
            <p className="text-primary-200 text-sm mt-2">Carregando...</p>
          ) : vehicles.length === 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-white/80 text-sm">Nenhum carro cadastrado ainda.</p>
              <Link
                to="/vehicles"
                className="self-start bg-white text-primary-700 text-sm font-semibold rounded-xl px-4 py-2 hover:bg-primary-50 transition-colors"
              >
                Adicionar carro
              </Link>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {vehicles.slice(0, 2).map((v) => (
                <div key={v.id} className="flex items-center justify-between">
                  <span className="font-semibold">
                    {v.brand} {v.model} {v.year}
                  </span>
                  <span className="text-primary-200 text-sm">
                    {v.km_current?.toLocaleString("pt-BR")} km
                  </span>
                </div>
              ))}
              {vehicles.length > 2 && (
                <Link to="/vehicles" className="text-primary-200 text-xs mt-1 underline">
                  Ver todos ({vehicles.length})
                </Link>
              )}
            </div>
          )}
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Link
            to="/diagnostic"
            className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">🔍</span>
            <span className="font-semibold text-gray-800 text-sm">Diagnosticar</span>
            <span className="text-gray-400 text-xs">Tire uma foto e descubra o problema</span>
          </Link>
          <Link
            to="/maintenance"
            className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">🔧</span>
            <span className="font-semibold text-gray-800 text-sm">Manutenções</span>
            <span className="text-gray-400 text-xs">
              {reminders.length > 0
                ? `${reminders.length} lembrete${reminders.length > 1 ? "s" : ""} pendente${reminders.length > 1 ? "s" : ""}`
                : "Tudo em dia!"}
            </span>
          </Link>
          <Link
            to="/mechanics"
            className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">📍</span>
            <span className="font-semibold text-gray-800 text-sm">Mecânicos</span>
            <span className="text-gray-400 text-xs">Encontre oficinas de confiança</span>
          </Link>
          <Link
            to="/vehicles"
            className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">🚗</span>
            <span className="font-semibold text-gray-800 text-sm">Meus carros</span>
            <span className="text-gray-400 text-xs">{vehicles.length} cadastrado{vehicles.length !== 1 ? "s" : ""}</span>
          </Link>
        </section>

        {reminders.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">Próximas manutenções</h3>
              <Link to="/maintenance" className="text-primary-600 text-sm font-medium">
                Ver tudo
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {reminders.map((r) => (
                <ReminderCard key={r.id} reminder={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
