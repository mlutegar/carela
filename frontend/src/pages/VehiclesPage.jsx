import { useEffect, useState } from "react";
import { createVehicle, deleteVehicle, getVehicles } from "../api/vehicles";
import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";
import LoadingSpinner from "../components/LoadingSpinner";

const FUEL_OPTIONS = [
  { value: "flex", label: "Flex" },
  { value: "gasolina", label: "Gasolina" },
  { value: "etanol", label: "Etanol" },
  { value: "diesel", label: "Diesel" },
  { value: "eletrico", label: "Elétrico" },
];

const EMPTY_FORM = {
  brand: "", model: "", year: new Date().getFullYear(),
  plate: "", color: "", fuel_type: "flex", km_current: 0,
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchVehicles(); }, []);

  async function fetchVehicles() {
    setLoading(true);
    try {
      const { data } = await getVehicles();
      setVehicles(data.results ?? data);
    } catch (_) {}
    setLoading(false);
  }

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createVehicle({
        ...form,
        year: Number(form.year),
        km_current: Number(form.km_current),
      });
      setShowForm(false);
      setForm(EMPTY_FORM);
      await fetchVehicles();
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === "object") {
        const msgs = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
          .join(" | ");
        setError(msgs);
      } else {
        setError("Erro ao salvar veículo.");
      }
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover este veículo?")) return;
    try {
      await deleteVehicle(id);
      setVehicles((vs) => vs.filter((v) => v.id !== id));
    } catch (_) {}
  }

  return (
    <>
      <Navbar title="Meus carros" />
      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {vehicles.length === 0 && !showForm && (
              <div className="text-center py-12">
                <p className="text-6xl mb-4">🚗</p>
                <p className="text-gray-600 font-medium">Nenhum carro cadastrado</p>
                <p className="text-gray-400 text-sm mt-1">
                  Adicione seu carro para começar
                </p>
              </div>
            )}
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onDelete={handleDelete} />
            ))}
          </>
        )}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-primary-300 text-primary-600 font-medium rounded-2xl hover:bg-primary-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar carro
          </button>
        ) : (
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4"
          >
            <h3 className="font-bold text-gray-800">Novo veículo</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Marca</label>
                <input
                  required
                  placeholder="Fiat"
                  value={form.brand}
                  onChange={setField("brand")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Modelo</label>
                <input
                  required
                  placeholder="Mobi"
                  value={form.model}
                  onChange={setField("model")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Ano</label>
                <input
                  required
                  type="number"
                  min="1990"
                  max="2100"
                  value={form.year}
                  onChange={setField("year")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Placa</label>
                <input
                  placeholder="ABC-1234"
                  value={form.plate}
                  onChange={setField("plate")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Cor</label>
                <input
                  placeholder="Branco"
                  value={form.color}
                  onChange={setField("color")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">KM atual</label>
                <input
                  type="number"
                  min="0"
                  value={form.km_current}
                  onChange={setField("km_current")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Combustível</label>
              <select
                value={form.fuel_type}
                onChange={setField("fuel_type")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
              >
                {FUEL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-600 text-xs bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(""); setForm(EMPTY_FORM); }}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
