import { useEffect, useState } from "react";
import {
  createLog,
  createReminder,
  getLogs,
  getReminders,
  updateReminder,
} from "../api/maintenance";
import { getVehicles } from "../api/vehicles";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import ReminderCard from "../components/ReminderCard";

const REMINDER_TYPES = [
  { value: "oleo", label: "Troca de Óleo" },
  { value: "pneu", label: "Pneus" },
  { value: "revisao", label: "Revisão Geral" },
  { value: "freio", label: "Freios" },
  { value: "correia", label: "Correia Dentada" },
  { value: "ipva", label: "IPVA" },
  { value: "seguro", label: "Seguro" },
  { value: "licenciamento", label: "Licenciamento" },
  { value: "outro", label: "Outro" },
];

const EMPTY_REMINDER = {
  vehicle: "", type: "oleo", title: "", description: "", due_date: "", due_km: "",
};
const EMPTY_LOG = {
  vehicle: "", title: "", cost: "", workshop_name: "", notes: "",
  date: new Date().toISOString().slice(0, 10), km_at_service: "",
};

export default function MaintenancePage() {
  const [tab, setTab] = useState("reminders");
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [reminderForm, setReminderForm] = useState(EMPTY_REMINDER);
  const [logForm, setLogForm] = useState(EMPTY_LOG);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [vRes, rRes, lRes] = await Promise.all([
          getVehicles(), getReminders(), getLogs(),
        ]);
        const vList = vRes.data.results ?? vRes.data;
        setVehicles(vList);
        setReminders(rRes.data.results ?? rRes.data);
        setLogs(lRes.data.results ?? lRes.data);
        if (vList.length > 0) {
          setReminderForm((f) => ({ ...f, vehicle: vList[0].id }));
          setLogForm((f) => ({ ...f, vehicle: vList[0].id }));
        }
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  const setRF = (key) => (e) =>
    setReminderForm((f) => ({ ...f, [key]: e.target.value }));
  const setLF = (key) => (e) =>
    setLogForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleAddReminder(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...reminderForm,
        due_km: reminderForm.due_km ? Number(reminderForm.due_km) : null,
        due_date: reminderForm.due_date || null,
      };
      const { data } = await createReminder(payload);
      setReminders((rs) => [data, ...rs]);
      setShowReminderForm(false);
      setReminderForm({ ...EMPTY_REMINDER, vehicle: vehicles[0]?.id ?? "" });
    } catch (err) {
      const d = err.response?.data;
      setError(
        typeof d === "object"
          ? Object.values(d).flat()[0] ?? "Erro ao salvar."
          : "Erro ao salvar."
      );
    }
    setSaving(false);
  }

  async function handleAddLog(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...logForm,
        cost: logForm.cost ? logForm.cost : null,
        km_at_service: logForm.km_at_service ? Number(logForm.km_at_service) : null,
      };
      const { data } = await createLog(payload);
      setLogs((ls) => [data, ...ls]);
      setShowLogForm(false);
      setLogForm({ ...EMPTY_LOG, vehicle: vehicles[0]?.id ?? "" });
    } catch (err) {
      const d = err.response?.data;
      setError(
        typeof d === "object"
          ? Object.values(d).flat()[0] ?? "Erro ao salvar."
          : "Erro ao salvar."
      );
    }
    setSaving(false);
  }

  async function handleComplete(id) {
    try {
      await updateReminder(id, { status: "concluido" });
      setReminders((rs) =>
        rs.map((r) => (r.id === id ? { ...r, status: "concluido" } : r))
      );
    } catch (_) {}
  }

  if (loading) return <><Navbar title="Manutenção" /><LoadingSpinner /></>;

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white";

  return (
    <>
      <Navbar title="Manutenção" />
      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
          {[
            { key: "reminders", label: "Lembretes" },
            { key: "logs", label: "Histórico" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                tab === key
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "reminders" && (
          <>
            {reminders.length === 0 && !showReminderForm && (
              <div className="text-center py-10 text-gray-400">
                <p className="text-4xl mb-3">✅</p>
                <p className="font-medium text-gray-600">Nenhum lembrete</p>
                <p className="text-sm mt-1">Adicione lembretes de manutenção</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {reminders.map((r) => (
                <ReminderCard key={r.id} reminder={r} onComplete={handleComplete} />
              ))}
            </div>

            {!showReminderForm ? (
              <button
                onClick={() => setShowReminderForm(true)}
                className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-primary-300 text-primary-600 font-medium rounded-2xl hover:bg-primary-50 transition-colors"
              >
                + Novo lembrete
              </button>
            ) : (
              <form
                onSubmit={handleAddReminder}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4"
              >
                <h3 className="font-bold text-gray-800">Novo lembrete</h3>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Veículo</label>
                  <select value={reminderForm.vehicle} onChange={setRF("vehicle")} className={inputCls}>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} {v.year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Tipo</label>
                    <select value={reminderForm.type} onChange={setRF("type")} className={inputCls}>
                      {REMINDER_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Título</label>
                    <input required placeholder="Ex: Troca de óleo"
                      value={reminderForm.title} onChange={setRF("title")} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Vencimento (data)</label>
                    <input type="date" value={reminderForm.due_date} onChange={setRF("due_date")} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Vencimento (km)</label>
                    <input type="number" min="0" placeholder="Ex: 80000"
                      value={reminderForm.due_km} onChange={setRF("due_km")} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Observação (opcional)</label>
                  <input placeholder="Observações..."
                    value={reminderForm.description} onChange={setRF("description")} className={inputCls} />
                </div>

                {error && <p className="text-red-600 text-xs bg-red-50 rounded-xl px-4 py-3">{error}</p>}

                <div className="flex gap-2">
                  <button type="button"
                    onClick={() => { setShowReminderForm(false); setError(""); }}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-60">
                    {saving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {tab === "logs" && (
          <>
            {logs.length === 0 && !showLogForm && (
              <div className="text-center py-10 text-gray-400">
                <p className="text-4xl mb-3">🔧</p>
                <p className="font-medium text-gray-600">Nenhum registro ainda</p>
                <p className="text-sm mt-1">Registre suas visitas à oficina</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {logs.map((log) => (
                <div key={log.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-gray-800 text-sm">{log.title}</p>
                    {log.cost && (
                      <span className="text-primary-600 font-bold text-sm">
                        R$ {Number(log.cost).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  {log.workshop_name && (
                    <p className="text-xs text-gray-500">📍 {log.workshop_name}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(log.date).toLocaleDateString("pt-BR")}
                    {log.km_at_service ? ` • ${log.km_at_service?.toLocaleString("pt-BR")} km` : ""}
                  </p>
                  {log.notes && <p className="text-xs text-gray-500 italic mt-0.5">{log.notes}</p>}
                </div>
              ))}
            </div>

            {!showLogForm ? (
              <button
                onClick={() => setShowLogForm(true)}
                className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-primary-300 text-primary-600 font-medium rounded-2xl hover:bg-primary-50 transition-colors"
              >
                + Registrar serviço
              </button>
            ) : (
              <form
                onSubmit={handleAddLog}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4"
              >
                <h3 className="font-bold text-gray-800">Registrar serviço</h3>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Veículo</label>
                  <select value={logForm.vehicle} onChange={setLF("vehicle")} className={inputCls}>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} {v.year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Serviço realizado</label>
                    <input required placeholder="Ex: Troca de óleo e filtro"
                      value={logForm.title} onChange={setLF("title")} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Data</label>
                    <input type="date" required value={logForm.date} onChange={setLF("date")} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Custo (R$)</label>
                    <input type="number" min="0" step="0.01" placeholder="0,00"
                      value={logForm.cost} onChange={setLF("cost")} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Oficina</label>
                    <input placeholder="Nome da oficina"
                      value={logForm.workshop_name} onChange={setLF("workshop_name")} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">KM na revisão</label>
                    <input type="number" min="0" placeholder="Ex: 75000"
                      value={logForm.km_at_service} onChange={setLF("km_at_service")} className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Observações</label>
                    <input placeholder="Ex: Trocou pastilha de freio também..."
                      value={logForm.notes} onChange={setLF("notes")} className={inputCls} />
                  </div>
                </div>

                {error && <p className="text-red-600 text-xs bg-red-50 rounded-xl px-4 py-3">{error}</p>}

                <div className="flex gap-2">
                  <button type="button"
                    onClick={() => { setShowLogForm(false); setError(""); }}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-60">
                    {saving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
}
