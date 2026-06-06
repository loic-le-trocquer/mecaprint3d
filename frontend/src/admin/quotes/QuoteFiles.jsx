// ================= COMPONENT =================
export default function QuoteFiles({ files = [] }) {
  // Sécurise le cas où files serait undefined ou mal formé
  const safeFiles = Array.isArray(files) ? files : [];

  // Si aucun fichier, on n'affiche rien
  if (!safeFiles.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {safeFiles.map((file, index) => {
        // Compatibilité avec les différents formats possibles
        const fileUrl = file.url || file.path;

        const fileName =
          file.originalName ||
          file.name ||
          file.filename ||
          `Fichier client ${index + 1}`;

        // Si aucun lien exploitable, on ignore ce fichier
        if (!fileUrl) return null;

        return (
          <a
            key={file._id || fileUrl || index}
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-300 transition hover:bg-orange-500 hover:text-black"
          >
            Télécharger {fileName}
          </a>
        );
      })}
    </div>
  );
}