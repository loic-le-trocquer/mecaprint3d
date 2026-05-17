export default function QuoteFiles({ files = [] }) {
  if (!files.length) return null;

  return (
    <div className="mt-6">
      <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-400">
        Fichiers
      </p>

      <div className="flex flex-wrap gap-3">
        {files.map((file) => (
          <a
            key={file.path}
            href={file.path}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-200 hover:border-orange-500"
          >
            {file.originalName}
          </a>
        ))}
      </div>
    </div>
  );
}