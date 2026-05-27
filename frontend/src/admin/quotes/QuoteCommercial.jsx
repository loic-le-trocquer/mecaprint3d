export default function QuoteCommercial({ quote, setQuotes, onUpdate }) {
  const quoteLines = quote.quoteLines || [];

  const totalTTC = quoteLines.reduce(
    (sum, line) =>
      sum +
      (Number(line.quantity) || 0) *
        (Number(line.unitPrice) || 0),
    0
  );

  const updateLine = (index, key, value) => {
    const lines = [...quoteLines];

    lines[index] = {
      ...lines[index],
      [key]: value,
    };

    lines[index].total =
      (Number(lines[index].quantity) || 0) *
      (Number(lines[index].unitPrice) || 0);

    setQuotes((current) =>
      current.map((item) =>
        item._id === quote._id
          ? {
              ...item,
              quoteLines: lines,
              quoteAmount: totalTTC,
            }
          : item
      )
    );
  };

  const addLine = () => {
    const lines = [
      ...quoteLines,
      {
        label: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ];

    setQuotes((current) =>
      current.map((item) =>
        item._id === quote._id
          ? { ...item, quoteLines: lines }
          : item
      )
    );
  };

  const removeLine = (index) => {
    const lines = quoteLines.filter((_, i) => i !== index);

    setQuotes((current) =>
      current.map((item) =>
        item._id === quote._id
          ? { ...item, quoteLines: lines }
          : item
      )
    );
  };

  const saveCommercialQuote = () => {
    onUpdate(quote._id, {
      status: quote.status,
      adminNotes: quote.adminNotes,
      archived: quote.archived,
      quoteLines,
      quoteAmount: totalTTC,
      quoteDelay: quote.quoteDelay,
      quoteComment: quote.quoteComment,
    });
  };

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
          Devis commercial
        </p>

        <button
          type="button"
          onClick={addLine}
          className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-300"
        >
          + Ligne
        </button>
      </div>

      <div className="overflow-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px]">
          <thead className="bg-zinc-900">
            <tr className="text-left text-sm text-zinc-400">
              <th className="p-4">Désignation</th>
              <th className="p-4">Qté</th>
              <th className="p-4">PU €</th>
              <th className="p-4">Total €</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          <tbody>
            {quoteLines.map((line, index) => {
              const lineTotal =
                (Number(line.quantity) || 0) *
                (Number(line.unitPrice) || 0);

              return (
                <tr key={index} className="border-t border-white/5">
                  <td className="p-3">
                    <input
                      value={line.label || ""}
                      onChange={(e) =>
                        updateLine(index, "label", e.target.value)
                      }
                      placeholder="Ex : Conception + impression pièce"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white outline-none"
                    />
                  </td>

                  <td className="p-3">
                    <input
                      type="number"
                      value={line.quantity || 1}
                      onChange={(e) =>
                        updateLine(index, "quantity", Number(e.target.value))
                      }
                      className="w-24 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white outline-none"
                    />
                  </td>

                  <td className="p-3">
                    <input
                      type="number"
                      value={line.unitPrice || 0}
                      onChange={(e) =>
                        updateLine(index, "unitPrice", Number(e.target.value))
                      }
                      className="w-28 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white outline-none"
                    />
                  </td>

                  <td className="p-4 font-bold text-orange-300">
                    {lineTotal.toFixed(2)} €
                  </td>

                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      className="rounded-lg bg-red-500/20 px-3 py-2 text-sm font-bold text-red-300"
                    >
                      X
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <input
          value={quote.quoteDelay || ""}
          onChange={(e) =>
            setQuotes((current) =>
              current.map((item) =>
                item._id === quote._id
                  ? { ...item, quoteDelay: e.target.value }
                  : item
              )
            )
          }
          placeholder="Délai estimé : ex 10 jours"
          className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
        />

        <input
          value={quote.quoteComment || ""}
          onChange={(e) =>
            setQuotes((current) =>
              current.map((item) =>
                item._id === quote._id
                  ? { ...item, quoteComment: e.target.value }
                  : item
              )
            )
          }
          placeholder="Commentaire commercial"
          className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-sm rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">Total TTC</p>
            <p className="text-3xl font-black text-orange-300">
              {totalTTC.toFixed(2)} €
            </p>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            TVA non applicable — art. 293 B du CGI
          </p>
<div className="mt-4 grid gap-3">
  {/* SAVE */}
  <button
    type="button"
    onClick={saveCommercialQuote}
    className="w-full rounded-xl bg-orange-500 px-4 py-3 font-black text-white transition hover:bg-orange-400"
  >
    Enregistrer le devis
  </button>

  {/* PDF */}
  <button
    type="button"
    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-black text-white transition hover:border-orange-500 hover:bg-orange-500/10"
  >
    Télécharger le PDF
  </button>

            {/* SEND */}
          <button
            type="button"
            className="w-full rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 font-black text-green-300 transition hover:bg-green-500 hover:text-white"
          >
            Envoyer au client
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}