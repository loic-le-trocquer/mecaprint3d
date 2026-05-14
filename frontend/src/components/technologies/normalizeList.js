export default function normalizeList(value) {
  // ================= TABLEAU =================
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  // ================= TEXTE =================
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  // ================= FALLBACK =================
  return [];
}