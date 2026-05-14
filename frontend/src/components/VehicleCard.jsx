import { Link } from "react-router-dom";

const FUEL_LABELS = {
  gasolina: "Gasolina",
  etanol: "Etanol",
  flex: "Flex",
  diesel: "Diesel",
  eletrico: "Elétrico",
};

const FUEL_COLORS = {
  gasolina: "bg-orange-100 text-orange-700",
  etanol: "bg-green-100 text-green-700",
  flex: "bg-blue-100 text-blue-700",
  diesel: "bg-gray-100 text-gray-700",
  eletrico: "bg-emerald-100 text-emerald-700",
};

export default function VehicleCard({ vehicle, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-gray-500 text-sm">{vehicle.year}</p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            FUEL_COLORS[vehicle.fuel_type] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {FUEL_LABELS[vehicle.fuel_type] ?? vehicle.fuel_type}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        {vehicle.plate && (
          <span className="font-mono bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs tracking-widest">
            {vehicle.plate}
          </span>
        )}
        {vehicle.color && (
          <span>{vehicle.color}</span>
        )}
        <span className="ml-auto text-gray-400 text-xs">
          {vehicle.km_current?.toLocaleString("pt-BR")} km
        </span>
      </div>

      <div className="flex gap-2 pt-1">
        <Link
          to="/diagnostic"
          state={{ vehicleId: vehicle.id }}
          className="flex-1 text-center text-sm bg-primary-600 text-white rounded-xl py-2 font-medium hover:bg-primary-700 transition-colors"
        >
          Diagnosticar
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(vehicle.id)}
            className="px-3 py-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
