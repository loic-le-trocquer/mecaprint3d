export default function QuoteAdminNotes({
  quote,
  setQuotes,
  onUpdate,
}) {
  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-400">
        Notes admin
      </p>

      <textarea
        value={quote.adminNotes || ""}

        onChange={(e) => {
          const value = e.target.value;

          setQuotes((current) =>
            current.map((item) =>
              item._id === quote._id
                ? {
                    ...item,
                    adminNotes: value,
                  }
                : item
            )
          );
        }}

        onBlur={() =>
          onUpdate(quote._id, {
            status: quote.status,
            adminNotes: quote.adminNotes,
            archived: quote.archived,
          })
        }

        rows="4"

        placeholder="Notes internes..."

        className="
          w-full rounded-2xl border border-white/10
          bg-black/30 p-4 text-zinc-200
          outline-none focus:border-orange-500
        "
      />
    </div>
  );
}