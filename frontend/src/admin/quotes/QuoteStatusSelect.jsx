const statusColors = {
  Nouveau: "bg-blue-500/20 text-blue-300",
  "En analyse": "bg-yellow-500/20 text-yellow-300",
  "Devis envoyé": "bg-purple-500/20 text-purple-300",
  "En fabrication": "bg-orange-500/20 text-orange-300",
  Terminé: "bg-green-500/20 text-green-300",
  Refusé: "bg-red-500/20 text-red-300",
};

const statuses = [
  "Nouveau",
  "En analyse",
  "Devis envoyé",
  "En fabrication",
  "Terminé",
  "Refusé",
];

export default function QuoteStatusSelect({ quote, onUpdate }) {
  return (
    <select
      value={quote.status || "Nouveau"}
      onChange={(e) =>
        onUpdate(quote._id, {
          status: e.target.value,
          adminNotes: quote.adminNotes,
          archived: quote.archived,
        })
      }
      className={`
        rounded-full border border-white/10 px-4 py-2 text-sm font-bold outline-none
        ${statusColors[quote.status || "Nouveau"]}
      `}
    >
      {statuses.map((status) => (
        <option key={status} value={status} className="bg-zinc-950 text-white">
          {status}
        </option>
      ))}
    </select>
  );
}