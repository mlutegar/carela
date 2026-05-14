const STATUS_STYLES = {
  pendente: "bg-yellow-50 border-yellow-200 text-yellow-800",
  concluido: "bg-green-50 border-green-200 text-green-800",
  atrasado: "bg-red-50 border-red-200 text-red-800",
};

const STATUS_LABELS = {
  pendente: "Pendente",
  concluido: "Concluído",
  atrasado: "Atrasado",
};

const TYPE_ICONS = {
  oleo: "🛢️",
  pneu: "🔄",
  revisao: "🔧",
  freio: "🛑",
  correia: "⚙️",
  ipva: "📋",
  seguro: "🛡️",
  licenciamento: "📄",
  outro: "📌",
};

export default function ReminderCard({ reminder, onComplete }) {
  const statusStyle = STATUS_STYLES[reminder.status] ?? STATUS_STYLES.pendente;

  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-2 ${statusStyle}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{TYPE_ICONS[reminder.type] ?? "📌"}</span>
          <div>
            <h4 className="font-semibold text-sm leading-tight">{reminder.title}</h4>
            {reminder.description && (
              <p className="text-xs opacity-75 mt-0.5">{reminder.description}</p>
            )}
          </div>
        </div>
        <span className="text-xs font-medium shrink-0 opacity-80">
          {STATUS_LABELS[reminder.status]}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs opacity-70">
        {reminder.due_date && (
          <span>
            Até{" "}
            {new Date(reminder.due_date).toLocaleDateString("pt-BR")}
          </span>
        )}
        {reminder.due_km && (
          <span>ou {reminder.due_km?.toLocaleString("pt-BR")} km</span>
        )}
      </div>

      {reminder.status === "pendente" && onComplete && (
        <button
          onClick={() => onComplete(reminder.id)}
          className="mt-1 text-xs font-medium underline self-start opacity-80 hover:opacity-100"
        >
          Marcar como concluído
        </button>
      )}
    </div>
  );
}
