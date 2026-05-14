function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(rating ?? 0)
              ? "text-yellow-400"
              : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {rating && (
        <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

export default function MechanicCard({ mechanic, onReview }) {
  const phoneLink = mechanic.whatsapp
    ? `https://wa.me/55${mechanic.whatsapp.replace(/\D/g, "")}`
    : mechanic.phone
    ? `tel:${mechanic.phone}`
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-gray-900">{mechanic.name}</h3>
            {mechanic.is_verified && (
              <span className="text-xs bg-primary-50 text-primary-700 border border-primary-200 rounded-full px-2 py-0.5 font-medium">
                Verificada
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {mechanic.city}/{mechanic.state}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={mechanic.average_rating} />
          <span className="text-xs text-gray-400">
            {mechanic.review_count}{" "}
            {mechanic.review_count === 1 ? "avaliação" : "avaliações"}
          </span>
        </div>
      </div>

      {mechanic.address && (
        <p className="text-xs text-gray-500 flex items-start gap-1">
          <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {mechanic.address}
        </p>
      )}

      {mechanic.specialties?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {mechanic.specialties.map((s) => (
            <span key={s} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {phoneLink && (
          <a
            href={phoneLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 text-center text-sm py-2 rounded-xl font-medium transition-colors ${
              mechanic.whatsapp
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {mechanic.whatsapp ? "WhatsApp" : "Ligar"}
          </a>
        )}
        {onReview && (
          <button
            onClick={() => onReview(mechanic)}
            className="flex-1 text-sm py-2 rounded-xl font-medium border border-primary-300 text-primary-700 hover:bg-primary-50 transition-colors"
          >
            Avaliar
          </button>
        )}
      </div>
    </div>
  );
}
