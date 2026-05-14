import { useEffect, useRef, useState } from "react";
import { getMe, updateMe } from "../api/auth";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import useAuthStore from "../store/authStore";

export default function ProfilePage() {
  const { handleLogout } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const storeUser = useAuthStore((s) => s.user);
  const avatarRef = useRef(null);

  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMe()
      .then(({ data }) => {
        setForm({ name: data.name, phone: data.phone ?? "" });
        setUser(data);
      })
      .catch(() => {
        if (storeUser) setForm({ name: storeUser.name, phone: storeUser.phone ?? "" });
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      const { data } = await updateMe(form);
      setUser(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
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

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const { data } = await updateMe(fd);
      setUser(data);
    } catch (_) {}
  }

  if (loading) return <><Navbar title="Perfil" /><LoadingSpinner /></>;

  const user = storeUser;
  const initials = user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() ?? "U";

  return (
    <>
      <Navbar title="Perfil" />
      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            onClick={() => avatarRef.current?.click()}
            className="relative group"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-3xl ring-4 ring-primary-50">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </button>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <div className="text-center">
            <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-800">Informações pessoais</h3>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Nome completo</label>
            <input
              required
              value={form.name}
              onChange={set("name")}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">E-mail</label>
            <input
              disabled
              value={user?.email ?? ""}
              className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Telefone</label>
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={form.phone}
              onChange={set("phone")}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}
          {success && (
            <p className="text-green-700 text-xs bg-green-50 rounded-xl px-4 py-3">
              Perfil atualizado com sucesso!
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Conta</h3>
          <button
            onClick={handleLogout}
            className="w-full py-3.5 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </>
  );
}
