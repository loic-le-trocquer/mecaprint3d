export const API_URL =
  import.meta.env.VITE_API_URL || "https://mecaprint3d-backend.onrender.com";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.error || "Erreur serveur");
  }

  return data;
}
