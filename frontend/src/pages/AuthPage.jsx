import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleLogin, handleRegister } = useAuth();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await handleLogin(form.email, form.password);
      } else {
        await handleRegister(form.name, form.email, form.password);
      }
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === "object") {
        const msgs = Object.values(data).flat();
        setError(msgs[0] ?? "Erro ao autenticar.");
      } else {
        setError("Verifique seus dados e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Carela</h1>
          <p className="text-primary-200 mt-1 text-sm">Seu carro, seu poder.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-100">
            {["login", "cadastro"].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                  tab === t
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {tab === "cadastro" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Seu nome
                </label>
                <input
                  type="text"
                  required
                  placeholder="Maria Silva"
                  value={form.name}
                  onChange={set("name")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                placeholder="maria@email.com"
                value={form.email}
                onChange={set("email")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={set("password")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            {error && (
              <p className="text-red-600 text-xs bg-red-50 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl py-3.5 transition-colors disabled:opacity-60"
            >
              {loading ? "Aguarde..." : tab === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
