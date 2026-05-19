{/* ===================================================== */}
{/* 💰 DEVIS COMMERCIAL */}
{/* ===================================================== */}
<div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">

  <div className="mb-5 flex items-center justify-between">

    <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
      Devis commercial
    </p>

    <button
      type="button"

      onClick={() => {

        const newLines = [
          ...(quote.quoteLines || []),

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
              ? {
                  ...item,
                  quoteLines: newLines,
                }
              : item
          )
        );

      }}

      className="
        rounded-xl border border-orange-500/30
        bg-orange-500/10 px-4 py-2
        text-sm font-bold text-orange-300
      "
    >
      + Ligne
    </button>

  </div>

  {/* TABLEAU */}
  <div className="overflow-auto rounded-2xl border border-white/10">

    <table className="w-full min-w-[700px]">

      <thead className="bg-zinc-900">

        <tr className="text-left text-sm text-zinc-400">

          <th className="p-4">
            Désignation
          </th>

          <th className="p-4">
            Qté
          </th>

          <th className="p-4">
            PU €
          </th>

          <th className="p-4">
            Total €
          </th>

          <th className="p-4 w-[80px]"></th>

        </tr>

      </thead>

      <tbody>

        {(quote.quoteLines || []).map(
          (line, index) => {

            const lineTotal =
              (Number(line.quantity) || 0) *
              (Number(line.unitPrice) || 0);

            return (

              <tr
                key={index}
                className="border-t border-white/5"
              >

                {/* LABEL */}
                <td className="p-3">

                  <input
                    type="text"

                    value={line.label || ""}

                    onChange={(e) => {

                      const lines = [
                        ...(quote.quoteLines || []),
                      ];

                      lines[index].label =
                        e.target.value;

                      lines[index].total =
                        lineTotal;

                      setQuotes((current) =>
                        current.map((item) =>
                          item._id === quote._id
                            ? {
                                ...item,
                                quoteLines: lines,
                              }
                            : item
                        )
                      );

                    }}

                    className="
                      w-full rounded-xl border border-white/10
                      bg-zinc-950 px-3 py-2
                      text-white outline-none
                    "
                  />

                </td>

                {/* QUANTITE */}
                <td className="p-3">

                  <input
                    type="number"

                    value={line.quantity || 1}

                    onChange={(e) => {

                      const lines = [
                        ...(quote.quoteLines || []),
                      ];

                      lines[index].quantity =
                        Number(e.target.value);

                      lines[index].total =
                        Number(e.target.value) *
                        Number(lines[index].unitPrice || 0);

                      setQuotes((current) =>
                        current.map((item) =>
                          item._id === quote._id
                            ? {
                                ...item,
                                quoteLines: lines,
                              }
                            : item
                        )
                      );

                    }}

                    className="
                      w-24 rounded-xl border border-white/10
                      bg-zinc-950 px-3 py-2
                      text-white outline-none
                    "
                  />

                </td>

                {/* PU */}
                <td className="p-3">

                  <input
                    type="number"

                    value={line.unitPrice || 0}

                    onChange={(e) => {

                      const lines = [
                        ...(quote.quoteLines || []),
                      ];

                      lines[index].unitPrice =
                        Number(e.target.value);

                      lines[index].total =
                        Number(lines[index].quantity || 0) *
                        Number(e.target.value);

                      setQuotes((current) =>
                        current.map((item) =>
                          item._id === quote._id
                            ? {
                                ...item,
                                quoteLines: lines,
                              }
                            : item
                        )
                      );

                    }}

                    className="
                      w-28 rounded-xl border border-white/10
                      bg-zinc-950 px-3 py-2
                      text-white outline-none
                    "
                  />

                </td>

                {/* TOTAL */}
                <td className="p-4 font-bold text-orange-300">

                  {lineTotal.toFixed(2)} €

                </td>

                {/* DELETE */}
                <td className="p-3">

                  <button
                    type="button"

                    onClick={() => {

                      const lines =
                        quote.quoteLines.filter(
                          (_, i) => i !== index
                        );

                      setQuotes((current) =>
                        current.map((item) =>
                          item._id === quote._id
                            ? {
                                ...item,
                                quoteLines: lines,
                              }
                            : item
                        )
                      );

                    }}

                    className="
                      rounded-lg bg-red-500/20
                      px-3 py-2 text-sm
                      font-bold text-red-300
                    "
                  >
                    X
                  </button>

                </td>

              </tr>

            );

          }
        )}

      </tbody>

    </table>

  </div>

  {/* TOTAL TTC */}
  <div className="mt-6 flex justify-end">

    <div className="w-full max-w-sm rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-zinc-400">
          Total TTC
        </p>

        <p className="text-3xl font-black text-orange-300">

          {(
            quote.quoteLines || []
          )
            .reduce(
              (sum, line) =>
                sum +
                (
                  (Number(line.quantity) || 0) *
                  (Number(line.unitPrice) || 0)
                ),
              0
            )
            .toFixed(2)} €

        </p>

      </div>

      <p className="mt-3 text-xs text-zinc-500">
        TVA non applicable — art. 293 B du CGI
      </p>

    </div>
    </div>

  </div>
