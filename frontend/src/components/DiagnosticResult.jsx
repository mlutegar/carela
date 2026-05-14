const SEVERITY_CONFIG = {
  baixo:   { label: "Baixo",    bg: "bg-green-50",  border: "border-green-200",  text: "text-green-800",  badge: "bg-green-100 text-green-700" },
  medio:   { label: "Médio",    bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-700" },
  alto:    { label: "Alto",     bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", badge: "bg-orange-100 text-orange-700" },
  urgente: { label: "Urgente",  bg: "bg-red-50",    border: "border-red-200",    text: "text-red-900",    badge: "bg-red-100 text-red-700" },
};

export default function DiagnosticResult({ diagnostic }) {
  const res = diagnostic?.llm_response ?? {};
  const severity = diagnostic?.severity ?? "medio";
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.medio;

  return (
    <div className={`rounded-2xl border ${cfg.bg} ${cfg.border} p-5 flex flex-col gap-4`}>
      <div className="flex items-start justify-between">
        <div>
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
            Severidade: {cfg.label}
          </span>
          <h3 className={`mt-2 font-bold text-base ${cfg.text}`}>
            {res.problem_summary ?? "Diagnóstico concluído"}
          </h3>
        </div>
        {res.can_drive === false && (
          <span className="shrink-0 text-xs bg-red-600 text-white rounded-full px-2.5 py-1 font-semibold">
            Não dirija
          </span>
        )}
      </div>

      {res.explanation && (
        <div>
          <p className={`text-sm font-medium mb-1 ${cfg.text} opacity-80`}>O que está acontecendo</p>
          <p className={`text-sm ${cfg.text}`}>{res.explanation}</p>
        </div>
      )}

      {res.recommendations?.length > 0 && (
        <div>
          <p className={`text-sm font-medium mb-2 ${cfg.text} opacity-80`}>O que fazer</p>
          <ul className="flex flex-col gap-1.5">
            {res.recommendations.map((rec, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${cfg.text}`}>
                <span className="shrink-0 w-5 h-5 rounded-full bg-white/60 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {res.estimated_cost_range && (
        <div className={`rounded-xl bg-white/50 px-4 py-3 text-sm ${cfg.text}`}>
          <span className="font-medium">Custo estimado: </span>
          {res.estimated_cost_range}
        </div>
      )}

      {res.urgency_note && (
        <p className={`text-xs ${cfg.text} opacity-70 italic`}>{res.urgency_note}</p>
      )}
    </div>
  );
}
