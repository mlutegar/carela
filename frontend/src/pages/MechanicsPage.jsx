import { useEffect, useState } from "react";
import { addReview, getMechanics } from "../api/mechanics";
import LoadingSpinner from "../components/LoadingSpinner";
import MechanicCard from "../components/MechanicCard";
import Navbar from "../components/Navbar";

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [ratingMin, setRatingMin] = useState("");
  const [searching, setSearching] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => { fetchMechanics(); }, []);

  async function fetchMechanics(params = {}) {
    setSearching(true);
    try {
      const { data } = await getMechanics(params);
      setMechanics(data.results ?? data);
    } catch (_) {}
    setSearching(false);
    setLoading(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    const params = {};
    if (city.trim()) params.city = city.trim();
    if (ratingMin) params.rating = ratingMin;
    fetchMechanics(params);
  }

  function openReview(mechanic) {
    setReviewTarget(mechanic);
    setReviewForm({ rating: 5, comment: "" });
    setReviewError("");
    setReviewSuccess(false);
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewSaving(true);
    setReviewError("");
    try {
      await addReview(reviewTarget.id, reviewForm);
      setReviewSuccess(true);
      setTimeout(() => setReviewTarget(null), 1500);
    } catch (err) {
      const d = err.response?.data;
      setReviewError(
        typeof d === "object"
          ? Object.values(d).flat()[0] ?? "Erro ao enviar."
          : "Erro ao enviar."
      );
    }
    setReviewSaving(false);
  }

  return (
    <>
      <Navbar title="Mecânicos" />
      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por cidade..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <select
            value={ratingMin}
            onChange={(e) => setRatingMin(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
          >
            <option value="">Todas</option>
            <option value="4">4★+</option>
            <option value="3">3★+</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            Buscar
          </button>
        </form>

        {loading || searching ? (
          <LoadingSpinner text="Buscando mecânicos..." />
        ) : mechanics.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📍</p>
            <p className="font-medium text-gray-600">Nenhum mecânico encontrado</p>
            <p className="text-sm mt-1">Tente buscar por outra cidade</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mechanics.map((m) => (
              <MechanicCard key={m.id} mechanic={m} onReview={openReview} />
            ))}
          </div>
        )}
      </div>

      {reviewTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4">
            {reviewSuccess ? (
              <div className="text-center py-4">
                <p className="text-4xl mb-3">⭐</p>
                <p className="font-bold text-gray-800">Avaliação enviada!</p>
                <p className="text-gray-500 text-sm mt-1">Obrigada pelo feedback.</p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-bold text-gray-800">Avaliar mecânico</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{reviewTarget.name}</p>
                </div>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Nota</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            reviewForm.rating >= n
                              ? "bg-yellow-400 text-white"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {n}★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Comentário (opcional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Como foi sua experiência?"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm((f) => ({ ...f, comment: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-red-600 text-xs bg-red-50 rounded-xl px-4 py-3">
                      {reviewError}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewTarget(null)}
                      className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSaving}
                      className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-60"
                    >
                      {reviewSaving ? "Enviando..." : "Enviar"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
