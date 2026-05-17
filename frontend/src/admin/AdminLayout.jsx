export default function AdminLayout({
  title,
  children,
}) {

  const logout = () => {
    localStorage.removeItem(
      "mecaprint3d_admin_token"
    );

    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside
          className="
            w-72
            border-r
            border-white/10
            bg-black/40
            p-6
          "
        >

          {/* LOGO */}
          <div className="mb-10">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
              MECAPRINT3D
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Backoffice
            </h1>

          </div>

          {/* NAV */}
          <nav className="space-y-3">

            <a
              href="/admin"
              className="
                block rounded-2xl border border-white/10
                px-5 py-4 font-bold text-zinc-300
                transition hover:border-orange-500
                hover:text-white
              "
            >
              Contenu du site
            </a>

            <a
              href="/admin/quotes"
              className="
                block rounded-2xl border border-white/10
                px-5 py-4 font-bold text-zinc-300
                transition hover:border-orange-500
                hover:text-white
              "
            >
              Demandes de devis
            </a>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="
                block rounded-2xl border border-white/10
                px-5 py-4 font-bold text-zinc-300
                transition hover:border-orange-500
                hover:text-white
              "
            >
              Voir le site
            </a>

          </nav>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="
              mt-10 w-full rounded-2xl
              border border-red-500/20
              px-5 py-4 font-bold text-red-300
              transition hover:bg-red-500/10
            "
          >
            Déconnexion
          </button>

        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-8">

          <div className="mx-auto max-w-7xl">

            {/* PAGE TITLE */}
            <div className="mb-10">

              <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
                Administration
              </p>

              <h2 className="mt-3 text-5xl font-black">
                {title}
              </h2>

            </div>

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}