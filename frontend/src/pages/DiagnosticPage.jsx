import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { createDiagnostic, getDiagnostics } from "../api/diagnostics";
import { getVehicles } from "../api/vehicles";
import DiagnosticResult from "../components/DiagnosticResult";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

export default function DiagnosticPage() {
  const location = useLocation();
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(location.state?.vehicleId ?? "");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("new");

  useEffect(() => {
    getVehicles()
      .then(({ data }) => {
        const list = data.results ?? data;
        setVehicles(list);
        if (!selectedVehicle && list.length > 0) {
          setSelectedVehicle(list[0].id);
        }
      })
      .catch(() => {});

    getDiagnostics()
      .then(({ data }) => setHistory(data.results ?? data))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedVehicle) {
      setError("Selecione um veículo.");
      return;
    }
    if (!description.trim()) {
      setError("Descreva o problema.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("vehicle", selectedVehicle);
      fd.append("description", description);
      if (photo) fd.append("photo", photo);

      const { data } = await createDiagnostic(fd);
      setResult(data);
      setHistory((h) => [data, ...h]);
      setTab("result");
    } catch (err) {
      const msg = err.response?.data?.description?.[0]
        ?? err.response?.data?.vehicle?.[0]
        ?? "Erro ao processar diagnóstico.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setDescription("");
    setPhoto(null);
    setPhotoPreview(null);
    setResult(null);
    setError("");
    setTab("new");
  }

  const SEVERITY_LABELS = {
    baixo: "Baixo", medio: "Médio", alto: "Alto", urgente: "Urgente",
  };
  const SEVERITY_COLORS = {
    baixo: "text-green-600 bg-green-50", medio: "text-yellow-600 bg-yellow-50",
    alto: "text-orange-600 bg-orange-50", urgente: "text-red-600 bg-red-50",
  };

  return (
    <>
      <Navbar title="Diagnóstico" />
      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
          {["new", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                tab === t
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "new" ? "Novo diagnóstico" : "Histórico"}
            </button>
          ))}
        </div>

        {tab === "result" && result && (
          <div className="flex flex-col gap-4">
            <DiagnosticResult diagnostic={result} />
            <button
              onClick={resetForm}
              className="w-full py-3 border border-primary-300 text-primary-700 font-semibold rounded-xl text-sm hover:bg-primary-50 transition-colors"
            >
              Novo diagnóstico
            </button>
          </div>
        )}

        {tab === "new" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {vehicles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-3">🚗</p>
                <p className="font-medium">Cadastre um veículo primeiro</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Qual carro tem problema?
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} {v.year}{v.plate ? ` — ${v.plate}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Foto do problema (opcional)
                  </label>
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                      <button
                        type="button"
                        onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                        className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 text-gray-700 hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => cameraRef.current?.click()}
                        className="flex flex-col items-center gap-2 py-5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
                      >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-medium">Câmera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex flex-col items-center gap-2 py-5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
                      >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-medium">Galeria</span>
                      </button>
                    </div>
                  )}
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment"
                    className="hidden" onChange={handleFileChange} />
                  <input ref={fileRef} type="file" accept="image/*"
                    className="hidden" onChange={handleFileChange} />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Descreva o problema
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ex: O painel acendeu uma luz amarela com um ponto de exclamação. Quando frenei ouvi um chiado estranho..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                  />
                  <p className="text-right text-xs text-gray-400 mt-1">
                    {description.length} caracteres
                  </p>
                </div>

                {error && (
                  <p className="text-red-600 text-xs bg-red-50 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Analisando com IA...
                    </>
                  ) : (
                    "Analisar problema"
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {tab === "history" && (
          <div className="flex flex-col gap-3">
            {historyLoading ? (
              <LoadingSpinner />
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🔍</p>
                <p>Nenhum diagnóstico ainda</p>
              </div>
            ) : (
              history.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => { setResult(d); setTab("result"); }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-700 font-medium line-clamp-2">
                      {d.description}
                    </p>
                    {d.severity && (
                      <span className={`ml-2 shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${SEVERITY_COLORS[d.severity] ?? ""}`}>
                        {SEVERITY_LABELS[d.severity] ?? d.severity}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(d.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
